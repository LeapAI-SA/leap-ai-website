import { Router } from "express"
import { getOrCreateSettings, serializePublicSettings } from "../models/SiteSettings.js"
import { ContentItem, serializeContentItem } from "../models/ContentItem.js"
import { ContactMessage, serializeContactMessage } from "../models/ContactMessage.js"
import { requireAuth, requireAdmin } from "../middleware/auth.js"
import {
  isContentType,
  isValidSlug,
  sanitizeImagePath,
  sanitizeNavLinks,
  sanitizePartners,
  sanitizePricingPlans,
  sanitizeAddonsSection,
  sanitizeAboutPage,
  sanitizePrivacyPage,
  sanitizeCtaLabels,
  sanitizeSocialLinks,
} from "../lib/validate.js"
import { cacheDel } from "../config/redis.js"
import { uploadImage } from "../middleware/upload.js"

const router = Router()
router.use(requireAuth, requireAdmin)

function enforceBrandLock(text: unknown, brand: string): string {
  const value = typeof text === "string" ? text.trim() : ""
  if (!value) return brand
  return value.toLowerCase().includes(brand.toLowerCase()) ? value : `${brand} — ${value}`
}

router.post("/upload", (req, res) => {
  uploadImage.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err instanceof Error ? err.message : "Upload failed" })
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }
    res.json({ url: `/uploads/${req.file.filename}` })
  })
})

router.get("/settings", async (_req, res) => {
  const settings = await getOrCreateSettings()
  res.json(serializePublicSettings(settings))
})

router.put("/settings", async (req, res) => {
  const settings = await getOrCreateSettings()
  const body = req.body as Record<string, unknown>
  const plain = settings.toObject()

  if (typeof body.maintenanceMode === "boolean") settings.maintenanceMode = body.maintenanceMode
  if (body.defaultLanguage === "ar" || body.defaultLanguage === "en") {
    settings.defaultLanguage = body.defaultLanguage
  }
  if (body.contact && typeof body.contact === "object") {
    settings.set("contact", { ...plain.contact, ...(body.contact as object) })
  }
  if (body.hero && typeof body.hero === "object") {
    settings.set("hero", { ...plain.hero, ...(body.hero as object) })
  }
  if (Array.isArray(body.stats)) {
    settings.set("stats", body.stats)
  }
  if (body.images && typeof body.images === "object") {
    const incoming = body.images as Record<string, unknown>
    const images = { ...plain.images }
    for (const key of ["hero", "ticketOverview", "omniChannel", "logo"] as const) {
      if (incoming[key] !== undefined) {
        const safe = sanitizeImagePath(incoming[key])
        if (safe) images[key] = safe
      }
    }
    settings.set("images", images)
  }
  if (body.social && typeof body.social === "object") {
    settings.set("social", { ...plain.social, ...sanitizeSocialLinks(body.social as Record<string, unknown>) })
  }
  if (body.seo && typeof body.seo === "object") {
    const incoming = body.seo as Record<string, unknown>
    const brand = typeof incoming.brandLock === "string" && incoming.brandLock.trim() ? incoming.brandLock.trim() : "LeapAI"
    const nextSeo = {
      ...plain.seo,
      ...incoming,
      brandLock: brand,
      siteTitle: {
        ar: enforceBrandLock((incoming.siteTitle as { ar?: string } | undefined)?.ar ?? plain.seo?.siteTitle?.ar, brand),
        en: enforceBrandLock((incoming.siteTitle as { en?: string } | undefined)?.en ?? plain.seo?.siteTitle?.en, brand),
      },
      metaDescription: {
        ar: enforceBrandLock(
          (incoming.metaDescription as { ar?: string } | undefined)?.ar ?? plain.seo?.metaDescription?.ar,
          brand,
        ),
        en: enforceBrandLock(
          (incoming.metaDescription as { en?: string } | undefined)?.en ?? plain.seo?.metaDescription?.en,
          brand,
        ),
      },
      footerText: {
        ar: enforceBrandLock((incoming.footerText as { ar?: string } | undefined)?.ar ?? plain.seo?.footerText?.ar, brand),
        en: enforceBrandLock((incoming.footerText as { en?: string } | undefined)?.en ?? plain.seo?.footerText?.en, brand),
      },
    }
    settings.set("seo", nextSeo)
  }
  if (Array.isArray(body.faq)) {
    const cleanFaq = body.faq
      .filter((item): item is { question?: { ar?: string; en?: string }; answer?: { ar?: string; en?: string } } => !!item)
      .map((item) => ({
        question: { ar: item.question?.ar ?? "", en: item.question?.en ?? "" },
        answer: { ar: item.answer?.ar ?? "", en: item.answer?.en ?? "" },
      }))
      .filter((item) => item.question.ar || item.question.en || item.answer.ar || item.answer.en)
    settings.set("faq", cleanFaq)
  }
  if (body.navigation && typeof body.navigation === "object") {
    const incoming = body.navigation as Record<string, unknown>
    const current = plain.navigation ?? {}
    settings.set("navigation", {
      headerLeft: sanitizeNavLinks(incoming.headerLeft ?? (current as { headerLeft?: unknown }).headerLeft),
      headerRight: sanitizeNavLinks(incoming.headerRight ?? (current as { headerRight?: unknown }).headerRight),
      footerLinks: sanitizeNavLinks(incoming.footerLinks ?? (current as { footerLinks?: unknown }).footerLinks),
      footerLegal: sanitizeNavLinks(incoming.footerLegal ?? (current as { footerLegal?: unknown }).footerLegal),
    })
  }
  if (Array.isArray(body.partners)) {
    settings.set("partners", sanitizePartners(body.partners))
  }
  if (Array.isArray(body.pricingPlans)) {
    settings.set("pricingPlans", sanitizePricingPlans(body.pricingPlans))
  }
  if (body.addons && typeof body.addons === "object") {
    settings.set("addons", sanitizeAddonsSection(body.addons))
  }
  if (body.aboutPage && typeof body.aboutPage === "object") {
    settings.set("aboutPage", sanitizeAboutPage(body.aboutPage))
  }
  if (body.privacyPage && typeof body.privacyPage === "object") {
    settings.set("privacyPage", sanitizePrivacyPage(body.privacyPage))
  }
  if (body.ctaLabels && typeof body.ctaLabels === "object") {
    settings.set("ctaLabels", sanitizeCtaLabels(body.ctaLabels))
  }

  await settings.save()
  await cacheDel("public:settings")
  await cacheDel("public:maintenance")
  res.json(serializePublicSettings(settings))
})

router.get("/content", async (req, res) => {
  const typeParam = req.query.type
  if (typeParam !== undefined && !isContentType(typeParam)) {
    return res.status(400).json({ error: "Invalid content type" })
  }
  const filter = typeParam ? { type: typeParam } : {}
  const items = await ContentItem.find(filter).sort({ type: 1, sortOrder: 1, createdAt: 1 })
  res.json(items.map(serializeContentItem))
})

router.get("/content/:id", async (req, res) => {
  const item = await ContentItem.findById(req.params.id)
  if (!item) return res.status(404).json({ error: "Not found" })
  res.json(serializeContentItem(item))
})

router.post("/content", async (req, res) => {
  const body = req.body as Record<string, unknown>
  if (!isContentType(body.type) || !isValidSlug(body.slug) || !body.title) {
    return res.status(400).json({ error: "type, slug, and title are required" })
  }

  const existing = await ContentItem.findOne({ slug: body.slug })
  if (existing) {
    return res.status(409).json({ error: "Slug already exists" })
  }

  const image = body.image !== undefined ? sanitizeImagePath(body.image) ?? "" : ""
  const item = await ContentItem.create({
    type: body.type,
    slug: body.slug,
    groupSlug: typeof body.groupSlug === "string" ? body.groupSlug : "",
    groupTitle: body.groupTitle,
    title: body.title,
    excerpt: body.excerpt,
    description: body.description,
    features: body.features,
    image,
    published: body.published !== false,
    sortOrder: typeof body.sortOrder === "number" ? body.sortOrder : 0,
  })
  await cacheDel(`public:content:${item.type}`)
  res.status(201).json(serializeContentItem(item))
})

router.put("/content/:id", async (req, res) => {
  const item = await ContentItem.findById(req.params.id)
  if (!item) {
    return res.status(404).json({ error: "Not found" })
  }

  const body = req.body as Record<string, unknown>
  const fields = [
    "type",
    "slug",
    "groupSlug",
    "groupTitle",
    "title",
    "excerpt",
    "description",
    "features",
    "image",
    "published",
    "sortOrder",
  ] as const

  if (body.type !== undefined && !isContentType(body.type)) {
    return res.status(400).json({ error: "Invalid content type" })
  }
  if (body.slug !== undefined && !isValidSlug(body.slug)) {
    return res.status(400).json({ error: "Invalid slug" })
  }
  if (body.image !== undefined) {
    const safe = sanitizeImagePath(body.image)
    if (body.image && !safe) {
      return res.status(400).json({ error: "Invalid image path" })
    }
    item.set("image", safe ?? "")
  }

  for (const field of fields) {
    if (field === "image" || field === "type" || field === "slug") continue
    if (body[field] !== undefined) {
      item.set(field, body[field])
    }
  }
  if (body.type !== undefined) item.set("type", body.type)
  if (body.slug !== undefined) item.set("slug", body.slug)

  await item.save()
  await cacheDel(`public:content:${item.type}`)
  res.json(serializeContentItem(item))
})

router.delete("/content/:id", async (req, res) => {
  const item = await ContentItem.findByIdAndDelete(req.params.id)
  if (!item) {
    return res.status(404).json({ error: "Not found" })
  }
  await cacheDel(`public:content:${item.type}`)
  res.json({ ok: true })
})

router.get("/contact-messages", async (_req, res) => {
  const items = await ContactMessage.find().sort({ createdAt: -1 }).limit(200)
  res.json(items.map(serializeContactMessage))
})

router.patch("/contact-messages/:id", async (req, res) => {
  const item = await ContactMessage.findById(req.params.id)
  if (!item) return res.status(404).json({ error: "Not found" })
  if (typeof req.body?.read === "boolean") item.read = req.body.read
  await item.save()
  res.json(serializeContactMessage(item))
})

router.delete("/contact-messages/:id", async (req, res) => {
  const item = await ContactMessage.findByIdAndDelete(req.params.id)
  if (!item) return res.status(404).json({ error: "Not found" })
  res.json({ ok: true })
})

export default router
