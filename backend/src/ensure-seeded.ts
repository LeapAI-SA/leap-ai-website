import bcrypt from "bcryptjs"
import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import { User } from "./models/User.js"
import { getOrCreateSettings } from "./models/SiteSettings.js"
import { ContentItem } from "./models/ContentItem.js"

type Localized = { ar: string; en: string }
type SeedItem = {
  slug: string
  title: Localized
  excerpt: Localized
  description: Localized
  features: { ar: string[]; en: string[] }
}

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadSeedData() {
  const path = join(__dirname, "data", "content-seed.json")
  return JSON.parse(readFileSync(path, "utf-8")) as {
    solutionsGroups: { slug: string; title: Localized; items: SeedItem[] }[]
    products: SeedItem[]
    useCases: SeedItem[]
  }
}

async function importContent() {
  const count = await ContentItem.countDocuments()
  if (count > 0) return

  const { solutionsGroups, products, useCases } = loadSeedData()
  let order = 0

  for (const group of solutionsGroups) {
    for (const item of group.items) {
      await ContentItem.create({
        type: "solution",
        slug: item.slug,
        groupSlug: group.slug,
        groupTitle: group.title,
        title: item.title,
        excerpt: item.excerpt,
        description: item.description,
        features: item.features,
        published: true,
        sortOrder: order++,
      })
    }
  }

  order = 0
  for (const item of products) {
    await ContentItem.create({
      type: "product",
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      description: item.description,
      features: item.features,
      published: true,
      sortOrder: order++,
    })
  }

  order = 0
  for (const item of useCases) {
    await ContentItem.create({
      type: "use-case",
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      description: item.description,
      features: item.features,
      published: true,
      sortOrder: order++,
    })
  }

  console.log(`Content seeded: ${await ContentItem.countDocuments()} items`)
}

export async function ensureSeeded() {
  const email = process.env.ADMIN_EMAIL ?? "admin@leapai.ai"
  const password = process.env.ADMIN_PASSWORD ?? "admin123"

  const existing = await User.findOne({ email })
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 10)
    await User.create({ email, passwordHash, role: "admin" })
    console.log(`Admin user created: ${email}`)
  }

  await getOrCreateSettings()
  await importContent()
}
