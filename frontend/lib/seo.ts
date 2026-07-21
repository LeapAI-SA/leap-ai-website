import type { Metadata } from "next"
import { resolveAssetPath, withBasePath } from "./media"
import type { PublicSiteSettings } from "./api"

export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL
  if (raw) return raw.replace(/\/$/, "")
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "")
  return `http://localhost:3000${basePath}`
}

export const siteConfig = {
  name: "LeapAI",
  nameFull: "Leap AI",
  taglineAr: "أول منصة سحابية محلية متقدمة لتجربة العملاء",
  taglineEn: "The first advanced local cloud platform for customer experience",
  descriptionAr:
    "LeapAI منصة سعودية لتجربة العملاء تشمل مركز اتصال متعدد القنوات، واتساب للأعمال، شات بوت ذكي، وتكاملات مع سلة وزد وOdoo — استضافة محلية ومتوافقة مع PDPL.",
  descriptionEn:
    "LeapAI is a Saudi customer experience platform for omni-channel contact centers, WhatsApp Business, AI chatbot, and integrations with Salla, Zid, and Odoo — PDPL-ready local hosting.",
  locale: "ar_SA",
  localeAlt: "en_US",
  twitterHandle: "@leapai_cx",
  defaultOgImage: "/hero-dashboard.png",
  keywords: [
    "LeapAI",
    "Leap AI",
    "customer experience",
    "CX platform",
    "contact center",
    "WhatsApp Business",
    "AI chatbot",
    "Saudi Arabia",
    "تجربة العملاء",
    "مركز اتصال",
    "ذكاء اصطناعي",
    "واتساب للأعمال",
  ],
}

export function absoluteUrl(path = "/") {
  const siteUrl = getSiteUrl().replace(/\/$/, "")
  const normalized = path.startsWith("/") ? path : `/${path}`
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "")

  if (basePath && siteUrl.endsWith(basePath)) {
    if (normalized === "/") return siteUrl
    return `${siteUrl}${normalized}`
  }

  const fullPath = withBasePath(normalized)
  return fullPath === "/" ? siteUrl : `${siteUrl}${fullPath}`
}

export function resolveOgImage(image?: string) {
  const src = image || siteConfig.defaultOgImage
  const resolved = resolveAssetPath(src)
  if (resolved.startsWith("http")) return resolved
  return absoluteUrl(resolved.startsWith("/") ? resolved : `/${resolved}`)
}

function truncateMeta(text: string, max = 160) {
  const clean = text.replace(/\s+/g, " ").trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).trimEnd()}…`
}

function normalizeBrandText(text: string) {
  return text.toLowerCase().replace(/\s+/g, "")
}

export function containsBrand(text: string, brand = siteConfig.name) {
  const haystack = normalizeBrandText(text)
  const needle = normalizeBrandText(brand)
  return haystack.includes(needle) || haystack.includes("leapai")
}

/** Remove duplicate "LeapAI — Leap AI —" style prefixes. */
export function normalizeSeoTitle(title: string, brand = siteConfig.name) {
  let value = title.replace(/\s+/g, " ").trim()
  value = value.replace(/^LeapAI\s*[—–-]\s*Leap AI\s*[—–-]\s*/i, "Leap AI — ")
  value = value.replace(/^LeapAI\s*[—–-]\s*LeapAI\s*[—–-]\s*/i, "LeapAI — ")
  if (!containsBrand(value, brand)) {
    value = `${brand} — ${value}`
  }
  return truncateMeta(value, 60)
}

export function normalizeSeoDescription(description: string, brand = siteConfig.name) {
  let value = description.replace(/\s+/g, " ").trim()
  if (!containsBrand(value, brand)) {
    value = `${brand} — ${value}`
  }
  return truncateMeta(value, 160)
}

function buildHreflangAlternates(path: string) {
  const url = absoluteUrl(path)
  return {
    canonical: url,
    languages: {
      "ar-SA": url,
      "en-US": url,
      "x-default": url,
    },
    types: {
      "text/plain": absoluteUrl("/llms.txt"),
    },
  }
}

type PageMetaInput = {
  title: string
  titleAr?: string
  description: string
  descriptionAr?: string
  path: string
  image?: string
  noIndex?: boolean
  type?: "website" | "article"
}

export function buildPageMetadata(input: PageMetaInput): Metadata {
  const {
    title,
    titleAr,
    description,
    descriptionAr,
    path,
    image,
    noIndex = false,
    type = "website",
  } = input

  const url = absoluteUrl(path)
  const ogImage = resolveOgImage(image)
  const pageTitle = normalizeSeoTitle(title)
  const metaDescription = normalizeSeoDescription(description)
  const metaDescriptionAr = normalizeSeoDescription(descriptionAr ?? description)
  const ogTitleSource = titleAr ?? pageTitle
  const ogTitle = truncateMeta(
    containsBrand(ogTitleSource) ? ogTitleSource.replace(/\s*\|\s*LeapAI\s*$/i, "").trim() : ogTitleSource,
    35,
  )
  const ogDescription = truncateMeta(metaDescriptionAr, 65)
  const twitterDescription = truncateMeta(metaDescription, 200)

  return {
    title: { absolute: pageTitle },
    description: metaDescription,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.name, url: getSiteUrl() }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    metadataBase: new URL(getSiteUrl()),
    alternates: buildHreflangAlternates(path),
    formatDetection: { email: false, address: false, telephone: false },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
        },
    openGraph: {
      type,
      locale: siteConfig.locale,
      alternateLocale: [siteConfig.localeAlt],
      url,
      siteName: siteConfig.name,
      title: ogTitle,
      description: ogDescription,
      images: [{ url: ogImage, width: 1200, height: 630, alt: pageTitle }],
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: truncateMeta(pageTitle, 70),
      description: twitterDescription,
      images: [ogImage],
    },
    other: {
      author: siteConfig.name,
    },
  }
}

export function buildHomeMetadata(settings?: PublicSiteSettings | null): Metadata {
  const brand = settings?.seo?.brandLock || siteConfig.name
  const titleAr = settings?.seo?.siteTitle?.ar || `${siteConfig.nameFull} — ${siteConfig.taglineAr}`
  const descAr = settings?.seo?.metaDescription?.ar || siteConfig.descriptionAr

  return buildPageMetadata({
    title: normalizeSeoTitle(titleAr, brand),
    titleAr: normalizeSeoTitle(titleAr, brand),
    description: normalizeSeoDescription(descAr, brand),
    descriptionAr: normalizeSeoDescription(descAr, brand),
    path: "/",
    image: settings?.images?.hero || siteConfig.defaultOgImage,
  })
}

export function buildRootMetadata(settings?: PublicSiteSettings | null): Metadata {
  const brand = settings?.seo?.brandLock || siteConfig.name
  const home = buildHomeMetadata(settings)
  const titleDefault =
    typeof home.title === "object" && home.title && "absolute" in home.title
      ? String(home.title.absolute)
      : normalizeSeoTitle(settings?.seo?.siteTitle?.ar || `${siteConfig.nameFull} — ${siteConfig.taglineAr}`, brand)

  return {
    ...home,
    title: {
      default: titleDefault,
      template: `%s | ${brand}`,
    },
    applicationName: brand,
    category: "technology",
    other: {
      ...(typeof home.other === "object" ? home.other : {}),
      "geo:region": "SA",
      "geo:placename": "Riyadh",
      "ai-content-declaration": "human-authored",
    },
    icons: {
      icon: [
        { url: withBasePath("/icon.svg"), type: "image/svg+xml" },
        { url: withBasePath("/icon-light-32x32.png"), sizes: "32x32" },
      ],
      apple: withBasePath("/apple-icon.png"),
    },
  }
}

export function buildOrganizationSchema(settings?: {
  contact?: { phone?: string; email?: string }
  images?: { logo?: string }
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: getSiteUrl(),
    logo: resolveOgImage(settings?.images?.logo ?? "/leapai-logo.png"),
    description: siteConfig.descriptionEn,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings?.contact?.phone ?? "+966-53-553-3627",
      email: settings?.contact?.email ?? "info@leapai.ai",
      contactType: "customer service",
      availableLanguage: ["Arabic", "English"],
    },
    sameAs: [getSiteUrl()],
  }
}

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: getSiteUrl(),
    description: siteConfig.descriptionAr,
    inLanguage: ["ar", "en"],
    publisher: { "@type": "Organization", name: siteConfig.name },
  }
}

export function buildStaticPageJsonLd(input: {
  title: string
  description: string
  path: string
  image?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: ["ar", "en"],
    isPartOf: { "@type": "WebSite", name: siteConfig.name, url: getSiteUrl() },
    ...(input.image ? { primaryImageOfPage: resolveOgImage(input.image) } : {}),
  }
}
