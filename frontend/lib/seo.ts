import type { Metadata } from "next"
import { resolveAssetPath, withBasePath } from "./media"
import type { PublicSiteSettings } from "./api"
import { getPublicSiteUrl, getBasePath } from "./site-url"

export function getSiteUrl() {
  return getPublicSiteUrl()
}

export const siteConfig = {
  name: "LeapAI",
  nameFull: "Leap AI",
  taglineAr:
    "المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي — أول منصة سحابية محلية متقدمة، متوافقة مع نظام حماية البيانات الشخصية في الرياض.",
  taglineEn:
    "Saudi Arabia's premier AI-native customer experience (CX) platform — the first advanced local-cloud CX platform, PDPL-ready in Riyadh.",
  descriptionAr:
    "LeapAI هي المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي: مركز اتصال متعدد القنوات، واتساب للأعمال، شات بوت ذكي، وتكاملات سلة وزد وOdoo — استضافة محلية في الرياض ومتوافقة مع نظام حماية البيانات الشخصية.",
  descriptionEn:
    "LeapAI is Saudi Arabia's premier AI-native CX platform for omni-channel contact centers, WhatsApp Business, AI chatbots, and enterprise integrations — PDPL-ready local hosting in Riyadh.",
  locale: "ar_SA",
  localeAlt: "en_US",
  twitterHandle: "@leapai_cx",
  defaultOgImage: "/hero-dashboard.png",
  keywords: [
    "LeapAI",
    "Leap AI",
    "AI-native CX platform",
    "AI-native customer experience",
    "customer experience",
    "CX platform",
    "contact center",
    "WhatsApp Business",
    "AI chatbot",
    "Saudi Arabia",
    "PDPL",
    "تجربة العملاء",
    "منصة تجربة العملاء",
    "ذكاء اصطناعي أصيل",
    "مركز اتصال",
    "ذكاء اصطناعي",
    "واتساب للأعمال",
  ],
}

export function absoluteUrl(path = "/") {
  const siteUrl = getSiteUrl().replace(/\/$/, "")
  const normalized = path.startsWith("/") ? path : `/${path}`
  const basePath = getBasePath()

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

const SEO_TITLE_MIN_LENGTH = 50
const SEO_TITLE_MAX_LENGTH = 60

const TITLE_SUFFIX_BY_PATH: Record<string, string> = {
  "/": "AI-Native CX Platform in Saudi Arabia",
  "/solutions": "Omnichannel CX, Bots, and Customer Journey Automation",
  "/products": "WhatsApp, Survey, Ticketing, and AI CX Tools",
  "/use-cases": "Retail, Telecom, Banking, and Healthcare Scenarios",
  "/contact-us": "Book a Demo, Get Pricing, and Talk to Experts",
  "/become-a-partner": "Reseller and Integration Partner Program in KSA",
  "/about-us": "Saudi AI-Native CX Company for PDPL Hosting",
  "/resources": "AI-Native CX Insights, News, and Guides",
  "/privacy-policy": "Data Handling, Security, and PDPL Compliance Terms",
}

function titleFromSlug(path: string) {
  const last = path.split("/").filter(Boolean).at(-1) ?? ""
  if (!last) return ""
  return last
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function getTitleSuffix(path: string) {
  if (TITLE_SUFFIX_BY_PATH[path]) return TITLE_SUFFIX_BY_PATH[path]
  if (path.startsWith("/solutions/")) return "AI and Omnichannel Customer Experience Solution"
  if (path.startsWith("/products/")) return "Customer Engagement Product for Growth and Service"
  if (path.startsWith("/use-cases/")) return "Industry Use Case for Automation and Customer Experience"
  if (path.startsWith("/resources/") || path.startsWith("/news/")) {
    return "AI-Native CX Resource for Saudi Enterprises"
  }
  if (path.startsWith("/")) {
    const label = titleFromSlug(path)
    if (label) return `${label} Insights, Features, and Deployment Guide`
  }
  return "Customer Experience, Contact Center, and AI Platform"
}

/** Remove duplicate "LeapAI — Leap AI —" style prefixes. */
export function normalizeSeoTitle(title: string, brand = siteConfig.name, path = "/") {
  let value = title.replace(/\s+/g, " ").trim()
  value = value.replace(/^LeapAI\s*[—–-]\s*Leap AI\s*[—–-]\s*/i, "Leap AI — ")
  value = value.replace(/^LeapAI\s*[—–-]\s*LeapAI\s*[—–-]\s*/i, "LeapAI — ")
  if (!containsBrand(value, brand)) {
    value = `${brand} — ${value}`
  }

  if (value.length < SEO_TITLE_MIN_LENGTH) {
    const suffix = getTitleSuffix(path)
    if (suffix && !value.toLowerCase().includes(suffix.toLowerCase())) {
      value = `${value} — ${suffix}`
    }
  }

  if (value.length < SEO_TITLE_MIN_LENGTH) {
    value = `${value} — Enterprise-Ready CX Solutions`
  }

  return truncateMeta(value, SEO_TITLE_MAX_LENGTH)
}

const DESCRIPTION_CLOSER_AR =
  "تكاملات مع سلة وزد وOdoo — استضافة محلية ومتوافقة مع PDPL."
const DESCRIPTION_CLOSER_EN =
  "Integrations with Salla, Zid, and Odoo — PDPL-ready local hosting."

function looksArabic(text: string) {
  return /[\u0600-\u06FF]/.test(text)
}

/** Prefer 120–160 chars for meta description; pad short CMS copy with a branded closer. */
export function normalizeSeoDescription(description: string, brand = siteConfig.name) {
  let value = description.replace(/\s+/g, " ").trim()
  if (!containsBrand(value, brand)) {
    value = `${brand} — ${value}`
  }

  if (value.length < 120) {
    const closer = looksArabic(value) ? DESCRIPTION_CLOSER_AR : DESCRIPTION_CLOSER_EN
    if (!value.includes(closer.slice(0, 20))) {
      value = `${value} ${closer}`.replace(/\s+/g, " ").trim()
    }
  }

  return truncateMeta(value, 160)
}

/** Keep social titles compact for cleaner Open Graph cards. */
export function normalizeOgTitle(title: string, brand = siteConfig.name) {
  let value = title.replace(/\s+/g, " ").trim()
  value = value.replace(/\s*\|\s*LeapAI\s*$/i, "").trim()
  value = value.replace(/^LeapAI\s*[—–-]\s*Leap AI\s*[—–-]\s*/i, "Leap AI — ")
  value = value.replace(/^LeapAI\s*[—–-]\s*LeapAI\s*[—–-]\s*/i, "LeapAI — ")
  if (!containsBrand(value, brand)) {
    value = `${brand} — ${value}`
  }
  return truncateMeta(value, 35)
}

/** Keep social descriptions concise without changing SEO meta descriptions. */
export function normalizeOgDescription(description: string, brand = siteConfig.name) {
  let value = description.replace(/\s+/g, " ").trim()
  if (!containsBrand(value, brand)) {
    value = `${brand} — ${value}`
  }

  return truncateMeta(value, 65)
}

const TWITTER_DESC_MIN = 150
const TWITTER_DESC_MAX = 200

/** Twitter card description — 150–200 chars for social and AI crawlers. */
export function normalizeTwitterDescription(description: string, brand = siteConfig.name) {
  let value = description.replace(/\s+/g, " ").trim()
  if (!containsBrand(value, brand)) {
    value = `${brand} — ${value}`
  }

  if (value.length < TWITTER_DESC_MIN) {
    const closer = looksArabic(value) ? DESCRIPTION_CLOSER_AR : DESCRIPTION_CLOSER_EN
    if (!value.includes(closer.slice(0, 20))) {
      value = `${value} ${closer}`.replace(/\s+/g, " ").trim()
    }
  }

  return truncateMeta(value, TWITTER_DESC_MAX)
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
  const pageTitle = normalizeSeoTitle(title, siteConfig.name, path)
  const metaDescription = normalizeSeoDescription(description)
  const metaDescriptionAr = normalizeSeoDescription(descriptionAr ?? description)
  const ogTitleSource = titleAr ?? title
  const ogTitle = normalizeOgTitle(ogTitleSource)
  const ogDescription = normalizeOgDescription(descriptionAr ?? description)
  const twitterDescription = normalizeTwitterDescription(description)

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
          "max-image-preview": "large" as const,
          "max-snippet": -1,
          "max-video-preview": -1,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
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
  const titleEn = settings?.seo?.siteTitle?.en || `${siteConfig.name} — ${siteConfig.taglineEn}`
  const titleAr = settings?.seo?.siteTitle?.ar || `${siteConfig.nameFull} — ${siteConfig.taglineAr}`
  const descEn = settings?.seo?.metaDescription?.en || siteConfig.descriptionEn
  const descAr = settings?.seo?.metaDescription?.ar || siteConfig.descriptionAr

  return buildPageMetadata({
    title: titleEn,
    titleAr,
    description: descEn,
    descriptionAr: descAr,
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
      : normalizeSeoTitle(
          settings?.seo?.siteTitle?.en || `${siteConfig.name} — ${siteConfig.taglineEn}`,
          brand,
          "/",
        )

  return {
    ...home,
    title: {
      default: titleDefault,
      template: `%s | ${brand}`,
    },
    verification: {
      ...(typeof home.verification === "object" && home.verification ? home.verification : {}),
      other: {
        ...((typeof home.verification === "object" &&
        home.verification &&
        "other" in home.verification &&
        typeof home.verification.other === "object" &&
        home.verification.other
          ? home.verification.other
          : {}) as Record<string, string | number | (string | number)[]>),
        "msvalidate.01": "877C499DA34F5945E4D93D5E4A752DA4",
      },
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
        { url: withBasePath("/icon"), type: "image/png" },
        { url: withBasePath("/icon"), sizes: "32x32", type: "image/png" },
      ],
      apple: withBasePath("/apple-icon"),
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
    description: siteConfig.descriptionEn,
    inLanguage: ["ar", "en"],
    publisher: { "@type": "Organization", name: siteConfig.name },
  }
}

/** Primary hub destinations to strengthen brand sitelinks signals. */
export function buildSiteNavigationSchema() {
  const destinations = [
    { name: "About Us", nameAr: "معلومات عنا", path: "/about-us" },
    { name: "Solutions", nameAr: "حلولنا", path: "/solutions" },
    { name: "Products", nameAr: "منتجاتنا", path: "/products" },
    { name: "Use Cases", nameAr: "حالات الاستخدام", path: "/use-cases" },
    { name: "Resources", nameAr: "الموارد", path: "/resources" },
    { name: "Become a Partner", nameAr: "كن شريكنا", path: "/become-a-partner" },
    { name: "Contact Us", nameAr: "اتصل بنا", path: "/contact-us" },
    {
      name: "Connect Digital Chat & Social Messaging Channels",
      nameAr: "ربط قنوات الدردشة الرقمية ورسائل التواصل الاجتماعي",
      path: "/solutions/digital-channels",
    },
    {
      name: "WhatsApp Business",
      nameAr: "واتساب أعمال",
      path: "/solutions/whatsapp-business",
    },
    {
      name: "Generative AI Chatbot (GenAI)",
      nameAr: "شات بوت الذكاء الاصطناعي التوليدي GenAI",
      path: "/solutions/genai-chatbot",
    },
  ]

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${siteConfig.name} primary navigation`,
    itemListElement: destinations.map((item, index) => ({
      "@type": "SiteNavigationElement",
      position: index + 1,
      name: item.name,
      alternateName: item.nameAr,
      url: absoluteUrl(item.path),
    })),
  }
}

export function buildStaticPageJsonLd(input: {
  title: string
  description: string
  path: string
  image?: string
}) {
  const pageUrl = absoluteUrl(input.path)
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: input.title,
      description: input.description,
      url: pageUrl,
      inLanguage: ["ar", "en"],
      isPartOf: { "@type": "WebSite", name: siteConfig.name, url: getSiteUrl() },
      ...(input.image ? { primaryImageOfPage: resolveOgImage(input.image) } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: input.title, item: pageUrl },
      ],
    },
  ]
}
