import { Router } from "express"
import { getOrCreateSettings, serializePublicSettings } from "../models/SiteSettings.js"
import { ContentItem, serializeContentItem, type ContentType } from "../models/ContentItem.js"
import { cacheGet, cacheSet } from "../config/redis.js"

const router = Router()

const CACHE_SETTINGS = "public:settings"
const cacheContentKey = (type: string) => `public:content:${type}`

router.get("/settings", async (_req, res) => {
  const cached = await cacheGet<ReturnType<typeof serializePublicSettings>>(CACHE_SETTINGS)
  if (cached) {
    return res.json(cached)
  }

  const settings = await getOrCreateSettings()
  const payload = serializePublicSettings(settings)
  await cacheSet(CACHE_SETTINGS, payload, 300)
  res.json(payload)
})

router.get("/content", async (req, res) => {
  const type = req.query.type as ContentType | undefined
  if (!type || !["solution", "product", "use-case"].includes(type)) {
    return res.status(400).json({ error: "Valid type query is required: solution, product, use-case" })
  }

  const cacheKey = cacheContentKey(type)
  const cached = await cacheGet<ReturnType<typeof serializeContentItem>[]>(cacheKey)
  if (cached) {
    return res.json(cached)
  }

  const items = await ContentItem.find({ type, published: true }).sort({ sortOrder: 1, createdAt: 1 })
  const payload = items.map(serializeContentItem)
  await cacheSet(cacheKey, payload, 300)
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

export default router
