import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import { ContentItem } from "../models/ContentItem.js"
import { cacheDel } from "../config/redis.js"

type Localized = { ar: string; en: string }
type SeedArticle = {
  slug: string
  sortOrder?: number
  title: Localized
  excerpt: Localized
  description: Localized
  features: { ar: string[]; en: string[] }
  image?: string
}

const __dirname = dirname(fileURLToPath(import.meta.url))

export async function upsertArticlesFromSeed() {
  const path = join(__dirname, "../data/articles-seed.json")
  const articles = JSON.parse(readFileSync(path, "utf-8")) as SeedArticle[]
  const slugs = new Set<string>()

  for (const [index, item] of articles.entries()) {
    slugs.add(item.slug)
    await ContentItem.findOneAndUpdate(
      { slug: item.slug },
      {
        type: "article",
        slug: item.slug,
        groupSlug: "",
        groupTitle: { ar: "", en: "" },
        title: item.title,
        excerpt: item.excerpt,
        description: item.description,
        features: item.features,
        image: item.image ?? "",
        published: true,
        sortOrder: item.sortOrder ?? index,
      },
      { upsert: true, new: true },
    )
  }

  await cacheDel("public:content:article")
  return slugs
}
