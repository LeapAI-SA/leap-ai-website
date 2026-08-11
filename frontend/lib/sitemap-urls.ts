import { solutionsGroups, products, useCases } from "@/lib/site-data"
import { ARTICLES } from "@/lib/articles"
import { articleCanonicalPath } from "@/lib/article-paths"
import { withLocalePrefix } from "@/lib/locale-path"
import { absoluteUrl } from "@/lib/seo"

function isGeoTextFile(path: string) {
  return path.endsWith(".txt") || path.includes("ai.txt")
}

/** Canonical public URLs included in /sitemap.xml (Arabic + English /en). */
export function getSitemapPaths(): string[] {
  const arabic = [
    "/",
    "/solutions",
    "/products",
    "/use-cases",
    "/resources",
    "/contact-us",
    "/become-a-partner",
    "/about-us",
    "/privacy-policy",
    "/llms.txt",
    "/llms-full.txt",
    "/llms-small.txt",
    "/.well-known/ai.txt",
    ...solutionsGroups.flatMap((g) => g.items.map((item) => `/solutions/${item.slug}`)),
    ...products.map((item) => `/products/${item.slug}`),
    ...useCases.map((item) => `/use-cases/${item.slug}`),
    ...ARTICLES.map((item) => `/resources/${item.slug}`),
    ...ARTICLES.filter((item) => item.kind === "news").map((item) => articleCanonicalPath(item)),
  ]
  const english = arabic.filter((path) => !isGeoTextFile(path)).map((path) => withLocalePrefix(path, "en"))
  return [...arabic, ...english]
}

export function getSitemapUrls(): string[] {
  return getSitemapPaths().map((path) => absoluteUrl(path))
}
