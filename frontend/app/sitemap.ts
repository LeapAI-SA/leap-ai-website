import type { MetadataRoute } from "next"
import { absoluteUrl } from "@/lib/seo"
import { getSitemapPaths } from "@/lib/sitemap-urls"

/** Static sitemap from seed data — reliable for build & GEO crawlers. */
export const dynamic = "force-dynamic"

const PRIORITY: Record<string, number> = {
  "/": 1,
  "/solutions": 0.9,
  "/products": 0.9,
  "/use-cases": 0.9,
  "/resources": 0.9,
  "/about-us": 0.8,
  "/contact-us": 0.7,
  "/become-a-partner": 0.7,
  "/privacy-policy": 0.5,
}

function changeFrequencyFor(path: string): MetadataRoute.Sitemap[number]["changeFrequency"] {
  if (path === "/privacy-policy") return "yearly"
  if (
    path === "/" ||
    path === "/solutions" ||
    path === "/products" ||
    path === "/use-cases" ||
    path === "/resources" ||
    path.startsWith("/resources/") ||
    path.startsWith("/news/") ||
    path.startsWith("/llms") ||
    path.includes("ai.txt")
  ) {
    return "weekly"
  }
  if (path === "/contact-us" || path === "/become-a-partner" || path === "/about-us") {
    return "monthly"
  }
  return "monthly"
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return getSitemapPaths().map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: changeFrequencyFor(path),
    priority:
      PRIORITY[path] ??
      (path.startsWith("/llms") || path.includes("ai.txt")
        ? 0.6
        : path.startsWith("/news/")
          ? 0.9
          : path.startsWith("/solutions/") ||
              path.startsWith("/products/") ||
              path.startsWith("/use-cases/")
            ? 0.8
            : 0.7),
  }))
}
