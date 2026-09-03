import { Router } from "express"
import rateLimit from "express-rate-limit"
import { getOrCreateSettings, serializePublicSettings } from "../models/SiteSettings.js"
import { ContentItem, serializeContentItem, type ContentType } from "../models/ContentItem.js"
import { ContactMessage } from "../models/ContactMessage.js"
import { JobApplication } from "../models/JobApplication.js"
import { isNonEmptyString, isValidEmail, trimString } from "../lib/validate.js"
import { isBusinessEmail } from "../lib/business-email.js"
import { sendDemoLeadEmail, sendCareersApplicationEmail, sendContactInquiryEmail } from "../lib/mail.js"
import { uploadCv, matchesCvMagic, removeUploadedFile } from "../middleware/upload.js"
import { cacheGet, cacheSet } from "../config/redis.js"
import { rewritePricingPlansCopy } from "../lib/whatsapp-tick.js"

const router = Router()

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many contact requests. Please try again later." },
})

const CACHE_SETTINGS = "public:settings"
const CACHE_MAINTENANCE = "public:maintenance"
const cacheContentKey = (type: string) => `public:content:${type}`

router.get("/maintenance", async (_req, res) => {
  const cached = await cacheGet<{ maintenanceMode: boolean }>(CACHE_MAINTENANCE)
  if (cached) {
    return res.json(cached)
  }

  const settings = await getOrCreateSettings()
  const payload = { maintenanceMode: Boolean(settings.maintenanceMode) }
  await cacheSet(CACHE_MAINTENANCE, payload, 30)
  res.json(payload)
})

router.get("/settings", async (_req, res) => {
  res.set("Cache-Control", "no-store")
  const cached = await cacheGet<ReturnType<typeof serializePublicSettings>>(CACHE_SETTINGS)
  if (cached) {
    cached.pricingPlans = rewritePricingPlansCopy(cached.pricingPlans)
    return res.json(cached)
  }

  const settings = await getOrCreateSettings()
  const payload = serializePublicSettings(settings)
  await cacheSet(CACHE_SETTINGS, payload, 30)
  res.json(payload)
})

router.get("/content", async (req, res) => {
  const type = req.query.type as ContentType | undefined
  if (!type || !["solution", "product", "use-case", "article", "case", "job", "campaign"].includes(type)) {
    return res.status(400).json({
      error: "Valid type query is required: solution, product, use-case, article, case, job, campaign",
    })
  }

  const cacheKey = cacheContentKey(type)
  res.set("Cache-Control", "no-store")
  const cached = await cacheGet<ReturnType<typeof serializeContentItem>[]>(cacheKey)
  if (cached) {
    return res.json(cached)
  }

  const items = await ContentItem.find({ type, published: true }).sort({ sortOrder: 1, createdAt: 1 })
  const payload = items.map(serializeContentItem)
  await cacheSet(cacheKey, payload, 30)
  res.json(payload)
})

router.get("/content/:slug", async (req, res) => {
  const item = await ContentItem.findOne({ slug: req.params.slug, published: true })
  if (!item) {
    return res.status(404).json({ error: "Not found" })
  }
  res.json(serializeContentItem(item))
})

router.get("/health", async (_req, res) => {
  res.json({ status: "ok", service: "leap-backend", mongo: true, redis: true })
})

router.post("/demo", contactLimiter, async (req, res) => {
  const body = req.body as Record<string, unknown>
  const name = trimString(body.name, 120)
  const email = trimString(body.email, 200).toLowerCase()
  const phone = trimString(body.phone, 40)
  const phoneDigits = phone.replace(/\D/g, "")

  if (!isNonEmptyString(name) || !isValidEmail(email) || phoneDigits.length < 8) {
    return res.status(400).json({ error: "Full name, valid business email, and phone are required" })
  }
  if (!isBusinessEmail(email)) {
    return res.status(400).json({
      error: "Please use a business email. Gmail, Hotmail, Outlook, and similar providers are not accepted.",
    })
  }

  const item = await ContactMessage.create({
    source: "demo",
    name,
    email,
    company: "",
    address: "",
    phone,
    message: "Book a demo request",
  })

  try {
    const mail = await sendDemoLeadEmail({ name, email, phone })
    console.log(`Demo lead saved: ${item._id.toString()} emailed=${mail.emailed}`)
    res.status(201).json({ ok: true, id: item._id.toString(), emailed: mail.emailed })
  } catch (err) {
    console.error("Demo lead email failed:", err)
    res.status(201).json({
      ok: true,
      id: item._id.toString(),
      emailed: false,
      warning: "Saved but email to info@leapai.ai failed. Check SMTP settings.",
    })
  }
})

router.post("/contact", contactLimiter, async (req, res) => {
  const body = req.body as Record<string, unknown>
  const source = body.source === "partner" ? "partner" : "contact"
  const name = trimString(body.name, 120)
  const email = trimString(body.email, 200)
  const company = trimString(body.company, 200)
  const address = trimString(body.address, 300)
  const phone = trimString(body.phone, 40)
  const message = trimString(body.message, 500)

  if (!isNonEmptyString(name) || !isValidEmail(email) || !isNonEmptyString(phone) || !isNonEmptyString(message)) {
    return res.status(400).json({ error: "Name, valid email, phone, and message are required" })
  }

  const item = await ContactMessage.create({ source, name, email, company, address, phone, message })

  try {
    const mail = await sendContactInquiryEmail({ source, name, email, phone, company, address, message })
    console.log(`Contact message saved (${source}): ${item._id.toString()} emailed=${mail.emailed}`)
    res.status(201).json({ ok: true, id: item._id.toString(), emailed: mail.emailed })
  } catch (err) {
    console.error("Contact inquiry email failed:", err)
    res.status(201).json({
      ok: true,
      id: item._id.toString(),
      emailed: false,
      warning: "Saved but email to info@leapai.ai failed. Check SMTP settings.",
    })
  }
})

router.post("/campaign-lead", contactLimiter, async (req, res) => {
  const body = req.body as Record<string, unknown>
  const campaignSlug = trimString(body.campaignSlug, 120)
  const name = trimString(body.name, 120)
  const email = trimString(body.email, 200).toLowerCase()
  const phone = trimString(body.phone, 40)
  const phoneDigits = phone.replace(/\D/g, "")

  if (!isNonEmptyString(campaignSlug) || !isNonEmptyString(name) || !isValidEmail(email) || phoneDigits.length < 8) {
    return res.status(400).json({ error: "Campaign, full name, valid email, and phone are required" })
  }

  const campaign = await ContentItem.findOne({ type: "campaign", slug: campaignSlug, published: true })
  if (!campaign) {
    return res.status(404).json({ error: "Campaign not found" })
  }
  if (campaign.groupSlug !== "lead") {
    return res.status(400).json({ error: "This campaign does not accept form leads" })
  }

  const duplicate = await ContactMessage.findOne({
    source: "campaign",
    campaignSlug,
    $or: [{ email }, { phoneDigits }],
  })
  if (duplicate) {
    return res.status(409).json({ error: "duplicate_lead" })
  }

  const titleEn = campaign.title?.en || campaignSlug
  const message = `Campaign lead: ${titleEn} (/lp/${campaignSlug})`

  const item = await ContactMessage.create({
    source: "campaign",
    name,
    email,
    company: "",
    address: "",
    phone,
    phoneDigits,
    message,
    campaignSlug,
  })

  try {
    const mail = await sendContactInquiryEmail({
      source: "campaign",
      name,
      email,
      phone,
      message,
    })
    console.log(`Campaign lead saved: ${item._id.toString()} slug=${campaignSlug} emailed=${mail.emailed}`)
    res.status(201).json({ ok: true, id: item._id.toString(), emailed: mail.emailed })
  } catch (err) {
    console.error("Campaign lead email failed:", err)
    res.status(201).json({
      ok: true,
      id: item._id.toString(),
      emailed: false,
      warning: "Saved but email to info@leapai.ai failed. Check SMTP settings.",
    })
  }
})

router.post("/careers/apply", contactLimiter, (req, res) => {
  uploadCv.single("cv")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err instanceof Error ? err.message : "Upload failed" })
    }
    if (!req.file) {
      return res.status(400).json({ error: "CV file is required (PDF, DOC, or DOCX)" })
    }
    if (!matchesCvMagic(req.file.path, req.file.mimetype)) {
      removeUploadedFile(req.file.path)
      return res.status(400).json({ error: "CV file content does not match PDF, DOC, or DOCX" })
    }

    const body = req.body as Record<string, string>
    const positionSlug = trimString(body.positionSlug, 120)
    const name = trimString(body.name, 120)
    const email = trimString(body.email, 200)
    const phone = trimString(body.phone, 40)
    const message = trimString(body.message, 2000)
    const positionTitleAr = trimString(body.positionTitleAr, 200)
    const positionTitleEn = trimString(body.positionTitleEn, 200)

    if (!isNonEmptyString(positionSlug) || !isNonEmptyString(name) || !isValidEmail(email) || !isNonEmptyString(phone)) {
      return res.status(400).json({ error: "Position, name, valid email, and phone are required" })
    }

    const isGeneral = positionSlug === "general-application"
    let titleAr = positionTitleAr
    let titleEn = positionTitleEn

    if (isGeneral) {
      titleAr = titleAr || "طلب عام"
      titleEn = titleEn || "General application"
    } else {
      const job = await ContentItem.findOne({ type: "job", slug: positionSlug, published: true })
      if (!job) {
        return res.status(404).json({ error: "This position is no longer open" })
      }
      titleAr = titleAr || job.title?.ar || ""
      titleEn = titleEn || job.title?.en || ""
    }

    const cvFile = `/uploads/cv/${req.file.filename}`
    const item = await JobApplication.create({
      positionSlug,
      positionTitle: {
        ar: titleAr,
        en: titleEn,
      },
      name,
      email,
      phone,
      message,
      cvFile,
    })

    try {
      const mail = await sendCareersApplicationEmail({
        name,
        email,
        phone,
        message,
        positionSlug,
        positionTitle: titleEn || positionSlug,
      })
      console.log(`Job application saved: ${item._id.toString()} emailed=${mail.emailed}`)
      res.status(201).json({ ok: true, id: item._id.toString(), emailed: mail.emailed })
    } catch (mailErr) {
      console.error("Job application email failed:", mailErr)
      res.status(201).json({
        ok: true,
        id: item._id.toString(),
        emailed: false,
        warning: "Saved but email notification failed. Check SMTP settings.",
      })
    }
  })
})

export default router
