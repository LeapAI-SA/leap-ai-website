import type { MetadataRoute } from "next"
import { solutionsGroups, products, useCases } from "@/lib/site-data"
import { absoluteUrl } from "@/lib/seo"

/** Static sitemap from seed data — reliable for build & GEO crawlers. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/solutions"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/products"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/use-cases"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/contact-us"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/become-a-partner"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/about-us"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/privacy-policy"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/llms.txt"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/llms-full.txt"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
  ]

  const solutionRoutes: MetadataRoute.Sitemap = solutionsGroups.flatMap((g) =>
    g.items.map((item) => ({
      url: absoluteUrl(`/solutions/${item.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  )

  const productRoutes: MetadataRoute.Sitemap = products.map((item) => ({
    url: absoluteUrl(`/products/${item.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  const useCaseRoutes: MetadataRoute.Sitemap = useCases.map((item) => ({
    url: absoluteUrl(`/use-cases/${item.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...solutionRoutes, ...productRoutes, ...useCaseRoutes]
}
