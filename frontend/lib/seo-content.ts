import type { Metadata } from "next"
import type { NavItem } from "./site-data"
import {
  buildPageMetadata,
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  absoluteUrl,
  siteConfig,
  resolveOgImage,
  getSiteUrl,
} from "./seo"
import type { SiteLang } from "./locale-path"
import { pickLocalized } from "./api"
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
  locale: SiteLang = "ar",
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
    locale,
  })
}

function buildFeatureFaqSchema(item: NavItem, locale: SiteLang = "ar") {
  const features = locale === "en"
    ? (item.features.en?.length ? item.features.en : item.features.ar)
    : (item.features.ar?.length ? item.features.ar : item.features.en)
  const title = pickLocalized(item.title, locale)
  const excerpt = pickLocalized(item.excerpt, locale)
  if (!features?.length) return null

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: features.map((feature) => ({
      "@type": "Question",
      name: locale === "ar"
        ? `هل يتضمن ${title} ${feature}؟`
        : `Does ${title} include ${feature}?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: locale === "ar"
          ? `نعم. ${title} من LeapAI يتضمن: ${feature}. ${excerpt}`
          : `Yes. ${title} by LeapAI includes: ${feature}. ${excerpt}`,
      },
    })),
  }
}

export function buildContentJsonLd(
  item: NavItem,
  path: string,
  listLabel: { en: string; ar: string },
  contentType: "solution" | "product" | "use-case" = "solution",
  locale: SiteLang = "ar",
) {
  const url = absoluteUrl(path)
  const { en, ar } = pickDescription(item)
  const image = resolveOgImage(item.image || resolveContentImage(item.slug))
  const title = pickLocalized(item.title, locale)
  const altTitle = locale === "ar" ? item.title.en : item.title.ar
  const description = pickLocalized({ en, ar }, locale)

  const schemaType =
    contentType === "product" ? "Product" : contentType === "use-case" ? "WebPage" : "Service"

  const mainEntity: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: title,
    alternateName: altTitle || undefined,
    description,
    url,
    image,
    inLanguage: locale === "en" ? ["en"] : ["ar", "en"],
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: getSiteUrl(),
    },
  }

  if (schemaType === "Product") {
    mainEntity.brand = { "@type": "Brand", name: siteConfig.name }
    mainEntity.offers = {
      "@type": "Offer",
      url: absoluteUrl("/contact-us"),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      priceCurrency: "SAR",
      price: "0",
      description: locale === "ar" ? "تواصل مع LeapAI للتسعير" : "Contact LeapAI for pricing",
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
        url: getSiteUrl(),
      },
    }
  }

  const featureFaq = buildFeatureFaqSchema(item, locale)

  return [
    mainEntity,
    buildContentGeoSchema(item, path, contentType),
    ...(featureFaq ? [featureFaq] : []),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url,
      inLanguage: locale === "en" ? ["en"] : ["ar", "en"],
      isPartOf: { "@type": "WebSite", name: siteConfig.name, url: getSiteUrl() },
      primaryImageOfPage: image,
    },
    buildBreadcrumbJsonLd(locale, [
      { label: { en: "Home", ar: "الرئيسية" }, path: "/" },
      { label: listLabel, path: path.split("/").slice(0, 2).join("/") || "/" },
      { label: { en: item.title.en || item.title.ar, ar: item.title.ar || item.title.en }, path },
    ]),
  ]
}

export function buildListPageJsonLd(input: {
  title: { en: string; ar: string }
  description: { en: string; ar: string }
  path: string
  items: NavItem[]
  locale?: SiteLang
}) {
  const locale = input.locale ?? "ar"
  return buildCollectionPageJsonLd({
    locale,
    title: input.title,
    description: input.description,
    path: input.path,
    items: input.items.map((item) => ({
      name: item.title,
      url: absoluteUrl(`${input.path}/${item.slug}`),
    })),
  })
}
