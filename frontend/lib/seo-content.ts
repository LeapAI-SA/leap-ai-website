import type { Metadata } from "next"
import type { NavItem } from "./site-data"
import { buildPageMetadata, absoluteUrl, siteConfig, resolveOgImage, getSiteUrl } from "./seo"
import { resolveContentImage } from "./page-images"
import { buildContentGeoSchema } from "./geo"

function pickDescription(item: NavItem) {
  const en = item.description.en || item.excerpt.en
  const ar = item.description.ar || item.excerpt.ar
  return { en, ar }
}

export function buildContentMetadata(
  item: NavItem,
  path: string,
  listLabel: { en: string; ar: string },
): Metadata {
  const { en, ar } = pickDescription(item)
  const image = item.image || resolveContentImage(item.slug)

  return buildPageMetadata({
    title: item.title.en || item.title.ar,
    titleAr: item.title.ar,
    description: en,
    descriptionAr: ar,
    path,
    image,
    type: "article",
  })
}

function buildFeatureFaqSchema(item: NavItem) {
  const features = item.features.en?.length ? item.features.en : item.features.ar
  if (!features?.length) return null

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: features.map((feature) => ({
      "@type": "Question",
      name: `Does ${item.title.en} include ${feature}?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `Yes. ${item.title.en} by LeapAI includes: ${feature}. ${item.excerpt.en}`,
      },
    })),
  }
}

export function buildContentJsonLd(
  item: NavItem,
  path: string,
  listLabel: { en: string; ar: string },
  contentType: "solution" | "product" | "use-case" = "solution",
) {
  const url = absoluteUrl(path)
  const listUrl = absoluteUrl(path.split("/").slice(0, 2).join("/"))
  const { en, ar } = pickDescription(item)
  const image = resolveOgImage(item.image || resolveContentImage(item.slug))

  const schemaType =
    contentType === "product" ? "Product" : contentType === "use-case" ? "WebPage" : "Service"

  const mainEntity: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: item.title.en || item.title.ar,
    alternateName: item.title.ar,
    description: en,
    url,
    image,
    inLanguage: ["ar", "en"],
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: getSiteUrl(),
    },
  }

  if (schemaType === "Product") {
    mainEntity.brand = { "@type": "Brand", name: siteConfig.name }
  }

  const featureFaq = buildFeatureFaqSchema(item)

  return [
    mainEntity,
    buildContentGeoSchema(item, path, contentType),
    ...(featureFaq ? [featureFaq] : []),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: item.title.en || item.title.ar,
      description: ar,
      url,
      inLanguage: ["ar", "en"],
      isPartOf: { "@type": "WebSite", name: siteConfig.name, url: getSiteUrl() },
      primaryImageOfPage: image,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: listLabel.en, item: listUrl },
        { "@type": "ListItem", position: 3, name: item.title.en || item.title.ar, item: url },
      ],
    },
  ]
}

export function buildListPageJsonLd(input: {
  title: string
  description: string
  path: string
  items: NavItem[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: ["ar", "en"],
    isPartOf: { "@type": "WebSite", name: siteConfig.name, url: getSiteUrl() },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: input.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title.en || item.title.ar,
        url: absoluteUrl(`${input.path}/${item.slug}`),
      })),
    },
  }
}
