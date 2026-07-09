import type { Metadata } from "next"
import { resolveMediaUrl } from "./media"
import type { PublicSiteSettings } from "./api"

export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  return raw.replace(/\/$/, "")
}

export const siteConfig = {
  name: "LeapAI",
  nameFull: "Leap AI",
  taglineAr: "أول منصة سحابية محلية متقدمة لتجربة العملاء",
  taglineEn: "The first advanced local cloud platform for customer experience",
  descriptionAr:
    "منصة LeapAI هي الاختيار الأمثل لخدمة العملاء والاحتفاظ بهم على الأمد البعيد. حلول ذكاء اصطناعي، مراكز اتصال متعددة القنوات، واتساب للأعمال، وأتمتة تسويق.",
  descriptionEn:
    "LeapAI is the ideal choice for customer service and retention. AI solutions, omni-channel contact centers, WhatsApp Business, and marketing automation.",
  locale: "ar_SA",
  localeAlt: "en_US",
  twitterHandle: "@LeapAI",
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
  const base = getSiteUrl()
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}${p}`
}

export function resolveOgImage(image?: string) {
  const src = image || siteConfig.defaultOgImage
  const resolved = resolveMediaUrl(src)
  if (resolved.startsWith("http")) return resolved
  return absoluteUrl(resolved)
}

function truncateMeta(text: string, max = 160) {
  const clean = text.replace(/\s+/g, " ").trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).trimEnd()}…`
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
  const metaDescription = truncateMeta(description)
  const metaDescriptionAr = truncateMeta(descriptionAr ?? description)
  const fullTitle = title.includes("LeapAI") ? title : `${title} | ${siteConfig.name}`
  const ogTitle = titleAr ? `${titleAr} | ${siteConfig.name}` : fullTitle

  return {
    title: { absolute: fullTitle },
    description: metaDescription,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.name, url: getSiteUrl() }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    metadataBase: new URL(getSiteUrl()),
    alternates: {
      canonical: url,
      types: {
        "text/plain": absoluteUrl("/llms.txt"),
      },
    },
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
      description: metaDescriptionAr,
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: fullTitle,
      description: metaDescription,
      images: [ogImage],
    },
  }
}

export function buildRootMetadata(settings?: PublicSiteSettings | null): Metadata {
  const brand = settings?.seo?.brandLock || siteConfig.name
  const titleAr = settings?.seo?.siteTitle?.ar || `${siteConfig.nameFull} — ${siteConfig.taglineAr}`
  const descAr = settings?.seo?.metaDescription?.ar || siteConfig.descriptionAr
  return {
    ...buildPageMetadata({
      title: titleAr.includes(brand) ? titleAr : `${brand} — ${titleAr}`,
      titleAr: titleAr.includes(brand) ? titleAr : `${brand} — ${titleAr}`,
      description: descAr.includes(brand) ? descAr : `${brand} — ${descAr}`,
      descriptionAr: descAr.includes(brand) ? descAr : `${brand} — ${descAr}`,
      path: "/",
      image: siteConfig.defaultOgImage,
    }),
    title: {
      default: titleAr.includes(brand) ? titleAr : `${brand} — ${titleAr}`,
      template: `%s | ${brand}`,
    },
    applicationName: brand,
    category: "technology",
    formatDetection: { email: false, address: false, telephone: false },
    other: {
      "geo:region": "SA",
      "geo:placename": "Riyadh",
      "ai-content-declaration": "human-authored",
    },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/icon-light-32x32.png", sizes: "32x32" }],
      apple: "/apple-icon.png",
    },
    alternates: {
      types: {
        "text/plain": absoluteUrl("/llms.txt"),
      },
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
