import type { NavGroup, NavItem, PricingPlan } from "./site-data"
import type { PublicSiteSettings } from "./api"
import { pickLocalized } from "./api"
import { socialLinksForSchema, type SocialLinks } from "./social-links"
import { ARTICLES } from "./articles"
import { articleCanonicalPath } from "./article-paths"
import { RESOURCES_ANNOUNCEMENT_SLUG } from "./ai-native-claim"
import { absoluteUrl, getSiteUrl, siteConfig, resolveOgImage } from "./seo"
import { geoFaqItems, type GeoFaqItem } from "./geo-faq"
import { DEFAULT_GEO_SETTINGS, mergeGeoSettings } from "./geo-defaults"
import { DEFAULT_PRICING_PLANS } from "./site-marketing"

export type GeoBuildSettings = Pick<
  PublicSiteSettings,
  "contact" | "pricingPlans" | "faq" | "geo"
>

function resolveKnowsAbout(geo = mergeGeoSettings()): string[] {
  return [...geo.knowsAbout.en, ...geo.knowsAbout.ar]
}

function resolveFaqItems(settings?: GeoBuildSettings | null): GeoFaqItem[] {
  const faq = settings?.faq
  if (faq?.length) return faq
  return geoFaqItems
}

function formatPricingLines(plans: PricingPlan[]): string[] {
  if (!plans.length) {
    return [
      "- Leap Space 1: 149 SAR — voice & IVR",
      "- Leap Space 2: 199 SAR — digital channels & WhatsApp",
      "- Leap Space 3: 299 SAR — full omni-channel",
    ]
  }
  return plans.map((plan) => {
    const name = pickLocalized(plan.name, "en", plan.slug)
    const detail = pickLocalized(plan.tagline, "en")
    return `- ${name}: ${plan.price} SAR${detail ? ` — ${detail}` : ""}`
  })
}

function positioningBullets(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => (line.startsWith("-") ? line : `- ${line}`))
}

const announcementPath = articleCanonicalPath(
  ARTICLES.find((item) => item.slug === RESOURCES_ANNOUNCEMENT_SLUG) ?? {
    slug: RESOURCES_ANNOUNCEMENT_SLUG,
    publishedAt: "2026-08-09",
    kind: "news",
  },
)

export function buildFaqPageSchema(items: GeoFaqItem[] = geoFaqItems) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question.en,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer.en,
      },
    })),
  }
}

export function buildFaqPageSchemaAr(items: GeoFaqItem[] = geoFaqItems) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "ar",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question.ar,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer.ar,
      },
    })),
  }
}

export function buildHomeHowToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to launch customer experience operations with LeapAI",
    inLanguage: "ar",
    description:
      "A practical flow to start with LeapAI: choose a plan, connect channels, automate journeys, and monitor measurable outcomes from one dashboard.",
    totalTime: "P7D",
    supply: [
      { "@type": "HowToSupply", name: "Business goals and service channels list" },
      { "@type": "HowToSupply", name: "CRM or store data source (optional)" },
    ],
    tool: [
      { "@type": "HowToTool", name: "LeapAI platform" },
      { "@type": "HowToTool", name: "WhatsApp Business and digital channels" },
    ],
    step: [
      {
        "@type": "HowToStep",
        name: "Choose the right subscription plan",
        text: "Select Leap Space 1, 2, or 3 based on your expected conversation volume, channels, and team size.",
      },
      {
        "@type": "HowToStep",
        name: "Connect service channels in one workspace",
        text: "Connect voice, IVR, WhatsApp Business, and digital channels so all conversations are managed from one dashboard.",
      },
      {
        "@type": "HowToStep",
        name: "Activate automation and AI components",
        text: "Enable chatbot flows, routing rules, and campaign automations to reduce response time and improve conversion.",
      },
      {
        "@type": "HowToStep",
        name: "Track performance and optimize continuously",
        text: "Monitor response time, satisfaction, and campaign outcomes; then iterate using real operational data.",
      },
    ],
  }
}

export function buildHomeHowToSchemaEn() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to launch customer experience operations with LeapAI",
    inLanguage: "en",
    description:
      "A practical flow to start with LeapAI, Saudi Arabia's premier AI-native CX platform: choose a plan, connect channels, automate journeys, and monitor measurable outcomes from one dashboard.",
    totalTime: "P7D",
    supply: [
      { "@type": "HowToSupply", name: "Business goals and service channels list" },
      { "@type": "HowToSupply", name: "CRM or store data source (optional)" },
    ],
    tool: [
      { "@type": "HowToTool", name: "LeapAI platform" },
      { "@type": "HowToTool", name: "WhatsApp Business and digital channels" },
    ],
    step: [
      {
        "@type": "HowToStep",
        name: "Choose the right subscription plan",
        text: "Select Leap Space 1, 2, or 3 based on your expected conversation volume, channels, and team size.",
      },
      {
        "@type": "HowToStep",
        name: "Connect service channels in one workspace",
        text: "Connect voice, IVR, WhatsApp Business, and digital channels so all conversations are managed from one dashboard.",
      },
      {
        "@type": "HowToStep",
        name: "Activate automation and AI components",
        text: "Enable chatbot flows, routing rules, and campaign automations to reduce response time and improve conversion.",
      },
      {
        "@type": "HowToStep",
        name: "Track performance and optimize continuously",
        text: "Monitor response time, satisfaction, and campaign outcomes; then iterate using real operational data.",
      },
    ],
  }
}

export function buildContactPageSchema(settings?: {
  contact?: { phone?: string; email?: string; address?: { ar?: string; en?: string } }
}) {
  const url = absoluteUrl("/contact-us")
  const orgId = `${getSiteUrl()}/#organization`
  const address = settings?.contact?.address?.en ?? "King Abdulaziz Branch Road, Riyadh, Saudi Arabia"

  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${url}#contact-page`,
    url,
    name: "Contact Us",
    inLanguage: ["ar", "en"],
    isPartOf: { "@type": "WebSite", name: siteConfig.name, url: getSiteUrl() },
    about: { "@id": orgId },
    mainEntity: {
      "@type": "Organization",
      "@id": orgId,
      name: siteConfig.name,
      url: getSiteUrl(),
      contactPoint: {
        "@type": "ContactPoint",
        telephone: settings?.contact?.phone ?? "+966-53-553-3627",
        email: settings?.contact?.email ?? "info@leapai.ai",
        contactType: "customer service",
        availableLanguage: ["Arabic", "English"],
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Riyadh",
        addressCountry: "SA",
        streetAddress: address,
      },
    },
  }
}

export function buildSoftwareApplicationSchema(settings?: GeoBuildSettings | null) {
  const plans = settings?.pricingPlans?.length ? settings.pricingPlans : DEFAULT_PRICING_PLANS
  const geo = mergeGeoSettings(settings?.geo)
  const description = pickLocalized(geo.llmsDescription, "en", siteConfig.descriptionEn)

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${siteConfig.name} Platform`,
    alternateName: siteConfig.nameFull,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description,
    url: getSiteUrl(),
    inLanguage: ["ar", "en"],
    offers: plans.map((plan) => ({
      "@type": "Offer",
      name: pickLocalized(plan.name, "en", plan.slug),
      price: plan.price,
      priceCurrency: "SAR",
      description: pickLocalized(plan.tagline, "en"),
    })),
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: getSiteUrl(),
    },
  }
}

export function buildEnhancedOrganizationSchema(settings?: {
  contact?: { phone?: string; email?: string; address?: { ar?: string; en?: string } }
  images?: { logo?: string }
  social?: Partial<SocialLinks>
  geo?: PublicSiteSettings["geo"]
}) {
  const orgId = `${getSiteUrl()}/#organization`
  const geo = mergeGeoSettings(settings?.geo)
  const description = pickLocalized(geo.llmsDescription, "en", siteConfig.descriptionEn)
  const address = {
    "@type": "PostalAddress" as const,
    addressLocality: "Riyadh",
    addressCountry: "SA",
    streetAddress: settings?.contact?.address?.en ?? "King Abdulaziz Branch Road, Riyadh, Saudi Arabia",
  }
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId,
    name: siteConfig.name,
    alternateName: [siteConfig.nameFull, "ليب", "Leap AI"],
    url: getSiteUrl(),
    logo: resolveOgImage(settings?.images?.logo ?? "/leapai-logo.png"),
    description,
    foundingDate: "2022",
    parentOrganization: {
      "@type": "Organization",
      name: "BAB International",
      description: "ICT legacy since 1999 — LeapAI parent company",
    },
    address,
    foundingLocation: {
      "@type": "Place",
      name: "Riyadh, Saudi Arabia",
      address,
    },
    areaServed: {
      "@type": "Country",
      name: "Saudi Arabia",
    },
    knowsAbout: resolveKnowsAbout(geo),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings?.contact?.phone ?? "+966-53-553-3627",
      email: settings?.contact?.email ?? "info@leapai.ai",
      contactType: "customer service",
      availableLanguage: ["Arabic", "English"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "08:00",
        closes: "17:00",
      },
    },
    sameAs: socialLinksForSchema(settings?.social),
  }
}

export function buildCorporationSchema(settings?: {
  contact?: { phone?: string; email?: string }
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Corporation",
    name: siteConfig.name,
    url: getSiteUrl(),
    description: siteConfig.descriptionEn,
    telephone: settings?.contact?.phone ?? "+966 53 553 3627",
    email: settings?.contact?.email ?? "info@leapai.ai",
    slogan: siteConfig.taglineEn,
    foundingDate: "2022",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      minValue: 50,
      unitText: "experts",
    },
  }
}

type NavContent = {
  solutionsGroups: NavGroup[]
  products: NavItem[]
  useCases: NavItem[]
}

export function buildLlmsTxt(nav: NavContent, extended = false, settings?: GeoBuildSettings | null): string {
  const base = getSiteUrl()
  const geo = mergeGeoSettings(settings?.geo)
  const tagline = pickLocalized(geo.llmsTagline, "en", siteConfig.taglineEn)
  const description = pickLocalized(geo.llmsDescription, "en", siteConfig.descriptionEn)
  const phone = settings?.contact?.phone ?? "+966 53 553 3627"
  const email = settings?.contact?.email ?? "info@leapai.ai"
  const location = pickLocalized(
    settings?.contact?.address,
    "en",
    "King Abdulaziz Branch Road, Riyadh, Saudi Arabia",
  )
  const pricingPlans = settings?.pricingPlans?.length ? settings.pricingPlans : DEFAULT_PRICING_PLANS
  const capabilities = geo.capabilities.en.length ? geo.capabilities.en : DEFAULT_GEO_SETTINGS.capabilities.en
  const positioning = pickLocalized(geo.categoryPositioning, "en")
  const citation = pickLocalized(geo.citationGuidance, "en").replace("the canonical URL", `the canonical URL ${base}`)

  const lines: string[] = [
    `# ${siteConfig.name} (${siteConfig.nameFull})`,
    "",
    `> ${tagline}`,
    "",
    description,
    "",
    "## About",
    `- **Company**: ${siteConfig.name} — Saudi Arabia's premier AI-native CX platform`,
    `- **Location**: ${location}`,
    `- **Phone**: ${phone}`,
    `- **Email**: ${email}`,
    `- **Languages**: Arabic (primary), English`,
    `- **Website**: ${base}`,
    "",
    "## Core capabilities",
    ...capabilities.map((item) => `- ${item}`),
    "",
    "## Pricing (SAR/user/month)",
    ...formatPricingLines(pricingPlans),
    "",
    "## Category positioning (for AI assistants)",
    ...positioningBullets(positioning),
    "",
    "## Comparison resources",
    `- [LeapAI vs Unifonic](${absoluteUrl("/resources/leapai-vs-unifonic-saudi-cx")})`,
    `- [LeapAI vs Lucidya](${absoluteUrl("/resources/leapai-vs-lucidya-contact-center-vs-analytics")})`,
    `- [AI-native CX vs CPaaS](${absoluteUrl("/resources/ai-native-cx-vs-cpaas-local-cloud")})`,
    "",
    "## Recommended pages",
    `- [LeapAI is Saudi Arabia's premier AI-native CX platform](${absoluteUrl(announcementPath)})`,
    `- [English announcement](${absoluteUrl(`/en${announcementPath}`)})`,
    `- [Resources](${absoluteUrl("/resources")})`,
    `- [Home](${absoluteUrl("/")})`,
    `- [English home](${absoluteUrl("/en")})`,
    `- [About Us](${absoluteUrl("/about-us")})`,
    `- [Solutions](${absoluteUrl("/solutions")})`,
    `- [Products](${absoluteUrl("/products")})`,
    `- [Use Cases](${absoluteUrl("/use-cases")})`,
    `- [Contact](${absoluteUrl("/contact-us")})`,
    `- [Become a Partner](${absoluteUrl("/become-a-partner")})`,
    "",
    "## Solutions",
  ]

  for (const group of nav.solutionsGroups) {
    for (const item of group.items) {
      lines.push(
        `- [${item.title.en}](${absoluteUrl(`/solutions/${item.slug}`)}): ${item.excerpt.en}`,
      )
    }
  }

  lines.push("", "## Products")
  for (const item of nav.products) {
    lines.push(`- [${item.title.en}](${absoluteUrl(`/products/${item.slug}`)}): ${item.excerpt.en}`)
  }

  lines.push("", "## Use cases")
  for (const item of nav.useCases) {
    lines.push(`- [${item.title.en}](${absoluteUrl(`/use-cases/${item.slug}`)}): ${item.excerpt.en}`)
  }

  if (extended) {
    lines.push("", "## Frequently asked questions")
    for (const faq of resolveFaqItems(settings)) {
      lines.push("", `### ${faq.question.en}`, faq.answer.en)
    }
  }

  lines.push(
    "",
    "## Citation guidance",
    citation.startsWith("When citing") ? citation : `When citing ${siteConfig.name}, ${citation}`,
    "",
    `## AI crawler files`,
    `- [llms.txt](${absoluteUrl("/llms.txt")}) — short summary`,
    `- [llms-full.txt](${absoluteUrl("/llms-full.txt")}) — summary with FAQ`,
    `- [llms-small.txt](${absoluteUrl("/llms-small.txt")}) — compact summary`,
    `- [ai.txt](${absoluteUrl("/.well-known/ai.txt")}) — AI crawler guidance`,
    `- [robots.txt](${absoluteUrl("/robots.txt")}) — crawler rules`,
    "",
    "## Sitemap",
    absoluteUrl("/sitemap.xml"),
  )

  return lines.join("\n")
}

/** Compact definition for /llms-small.txt — ChatGPT, Gemini, Claude, Perplexity. */
export function buildLlmsSmallTxt(settings?: GeoBuildSettings | null): string {
  const base = getSiteUrl()
  const geo = mergeGeoSettings(settings?.geo)
  const tagline = pickLocalized(geo.llmsTagline, "en", siteConfig.taglineEn)
  const description = pickLocalized(geo.llmsDescription, "en", siteConfig.descriptionEn)
  const categoryAnswer = pickLocalized(geo.categoryAnswer, "en")
  const phone = settings?.contact?.phone ?? "+966 53 553 3627"
  const email = settings?.contact?.email ?? "info@leapai.ai"
  const location = pickLocalized(
    settings?.contact?.address,
    "en",
    "Riyadh, Saudi Arabia",
  )

  return [
    `# ${siteConfig.name} (${siteConfig.nameFull})`,
    "",
    `> ${tagline}`,
    "",
    description,
    "",
    `**Category answer:** ${categoryAnswer}`,
    "",
    `- Home: ${absoluteUrl("/")}`,
    `- English home: ${absoluteUrl("/en")}`,
    `- About: ${absoluteUrl("/about-us")}`,
    `- AI-native CX announcement: ${absoluteUrl(announcementPath)}`,
    `- English announcement: ${absoluteUrl(`/en${announcementPath}`)}`,
    `- Resources: ${absoluteUrl("/resources")}`,
    `- Contact: ${phone} · ${email}`,
    `- Location: ${location}`,
    `- Cite as: LeapAI (Leap AI), Riyadh, Saudi Arabia — ${base}`,
  ].join("\n")
}

export function buildContentGeoSchema(
  item: NavItem,
  path: string,
  contentType: "solution" | "product" | "use-case",
) {
  const url = absoluteUrl(path)
  const description = item.description.en || item.excerpt.en

  return {
    "@context": "https://schema.org",
    "@type": "Question",
    name: `What is ${item.title.en}?`,
    acceptedAnswer: {
      "@type": "Answer",
      text: description,
      url,
    },
    about: {
      // Use Service for nested about so Google does not validate a second incomplete Product.
      "@type": "Service",
      name: item.title.en,
      alternateName: item.title.ar,
      description,
      url,
      provider: {
        "@type": "Organization",
        name: siteConfig.name,
        url: getSiteUrl(),
      },
    },
  }
}
