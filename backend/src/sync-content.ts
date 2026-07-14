import "dotenv/config"
import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import { connectDB } from "./config/db.js"
import { ContentItem } from "./models/ContentItem.js"
import { cacheDel } from "./config/redis.js"

type Localized = { ar: string; en: string }
type SeedItem = {
  slug: string
  title: Localized
  excerpt: Localized
  description: Localized
  features: { ar: string[]; en: string[] }
  image?: string
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

export async function syncContentFromSeed() {
  const { solutionsGroups, products, useCases } = loadSeedData()
  const seedSlugs = new Set<string>()
  let order = 0

  for (const group of solutionsGroups) {
    for (const item of group.items) {
      seedSlugs.add(item.slug)
      await ContentItem.findOneAndUpdate(
        { slug: item.slug },
        {
          type: "solution",
          slug: item.slug,
          groupSlug: group.slug,
          groupTitle: group.title,
          title: item.title,
          excerpt: item.excerpt,
          description: item.description,
          features: item.features,
          image: item.image ?? "",
          published: true,
          sortOrder: order++,
        },
        { upsert: true, new: true },
      )
    }
  }

  order = 0
  for (const item of products) {
    seedSlugs.add(item.slug)
    await ContentItem.findOneAndUpdate(
      { slug: item.slug },
      {
        type: "product",
        slug: item.slug,
        groupSlug: "",
        groupTitle: { ar: "", en: "" },
        title: item.title,
        excerpt: item.excerpt,
        description: item.description,
        features: item.features,
        image: item.image ?? "",
        published: true,
        sortOrder: order++,
      },
      { upsert: true, new: true },
    )
  }

  order = 0
  for (const item of useCases) {
    seedSlugs.add(item.slug)
    await ContentItem.findOneAndUpdate(
      { slug: item.slug },
      {
        type: "use-case",
        slug: item.slug,
        groupSlug: "",
        groupTitle: { ar: "", en: "" },
        title: item.title,
        excerpt: item.excerpt,
        description: item.description,
        features: item.features,
        image: item.image ?? "",
        published: true,
        sortOrder: order++,
      },
      { upsert: true, new: true },
    )
  }

  await cacheDel("public:content:solution")
  await cacheDel("public:content:product")
  await cacheDel("public:content:use-case")

  const total = await ContentItem.countDocuments()
  return { total, seedSlugs: seedSlugs.size }
}

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error("MONGODB_URI is required")

  await connectDB(uri)
  const result = await syncContentFromSeed()
  console.log(`Content synced: ${result.total} items in database (${result.seedSlugs} from seed file)`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
