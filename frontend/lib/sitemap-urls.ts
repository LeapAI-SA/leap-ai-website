import { solutionsGroups, products, useCases } from "@/lib/site-data"
import { absoluteUrl } from "@/lib/seo"

/** Canonical public URLs included in /sitemap.xml (39 total). */
export function getSitemapPaths(): string[] {
  return [
    "/",
    "/solutions",
    "/products",
    "/use-cases",
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
  ]
}

export function getSitemapUrls(): string[] {
  return getSitemapPaths().map((path) => absoluteUrl(path))
}
