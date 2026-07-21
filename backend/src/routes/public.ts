import { Router } from "express"
import rateLimit from "express-rate-limit"
import { getOrCreateSettings, serializePublicSettings } from "../models/SiteSettings.js"
import { ContentItem, serializeContentItem, type ContentType } from "../models/ContentItem.js"
import { ContactMessage } from "../models/ContactMessage.js"
import { isNonEmptyString, isValidEmail, trimString } from "../lib/validate.js"
import { cacheGet, cacheSet } from "../config/redis.js"

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
    return res.json(cached)
  }

  const settings = await getOrCreateSettings()
  const payload = serializePublicSettings(settings)
  await cacheSet(CACHE_SETTINGS, payload, 30)
  res.json(payload)
})

router.get("/content", async (req, res) => {
  const type = req.query.type as ContentType | undefined
  if (!type || !["solution", "product", "use-case"].includes(type)) {
    return res.status(400).json({ error: "Valid type query is required: solution, product, use-case" })
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
  console.log(`Contact message saved (${source}):`, item._id.toString())
  res.status(201).json({ ok: true, id: item._id.toString() })
})

export default router
