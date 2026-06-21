import { Router } from "express"
import { getOrCreateSettings, serializePublicSettings } from "../models/SiteSettings.js"
import { ContentItem, serializeContentItem, type ContentType } from "../models/ContentItem.js"
import { requireAuth } from "../middleware/auth.js"
import { cacheDel } from "../config/redis.js"
import { uploadImage } from "../middleware/upload.js"

const router = Router()
router.use(requireAuth)

router.post("/upload", uploadImage.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" })
  }
  res.json({ url: `/uploads/${req.file.filename}` })
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
    settings.set("images", { ...plain.images, ...(body.images as object) })
  }

  await settings.save()
  await cacheDel("public:settings")
  res.json(serializePublicSettings(settings))
})

router.get("/content", async (req, res) => {
  const type = req.query.type as ContentType | undefined
  const filter = type ? { type } : {}
  const items = await ContentItem.find(filter).sort({ type: 1, sortOrder: 1, createdAt: 1 })
  res.json(items.map(serializeContentItem))
})

router.get("/content/:id", async (req, res) => {
  const item = await ContentItem.findById(req.params.id)
  if (!item) return res.status(404).json({ error: "Not found" })
  res.json(serializeContentItem(item))
})

router.post("/content", async (req, res) => {
  const body = req.body
  if (!body?.type || !body?.slug || !body?.title) {
    return res.status(400).json({ error: "type, slug, and title are required" })
  }

  const existing = await ContentItem.findOne({ slug: body.slug })
  if (existing) {
    return res.status(409).json({ error: "Slug already exists" })
  }

  const item = await ContentItem.create(body)
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

  for (const field of fields) {
    if (body[field] !== undefined) {
      item.set(field, body[field])
    }
  }

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

export default router
