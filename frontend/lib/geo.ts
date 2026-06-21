import type { NavGroup, NavItem } from "./site-data"
import { socialLinksForSchema, type SocialLinks } from "./social-links"
import { absoluteUrl, getSiteUrl, siteConfig, resolveOgImage } from "./seo"
import { geoFaqItems, geoKnowsAbout } from "./geo-faq"

export function buildFaqPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: geoFaqItems.map((item) => ({
      "@type": "Question",
      name: item.question.en,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer.en,
      },
    })),
  }
}

export function buildFaqPageSchemaAr() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "ar",
    mainEntity: geoFaqItems.map((item) => ({
      "@type": "Question",
      name: item.question.ar,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer.ar,
      },
    })),
  }
}

export function buildSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${siteConfig.name} Platform`,
    alternateName: siteConfig.nameFull,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: siteConfig.descriptionEn,
    url: getSiteUrl(),
    inLanguage: ["ar", "en"],
    offers: [
      {
        "@type": "Offer",
        name: "Leap Space 1",
        price: "149",
        priceCurrency: "SAR",
        description: "Voice contact center with IVR — per user/month",
      },
      {
        "@type": "Offer",
        name: "Leap Space 2",
        price: "199",
        priceCurrency: "SAR",
        description: "Digital channels and WhatsApp — per user/month",
      },
      {
        "@type": "Offer",
        name: "Leap Space 3",
        price: "299",
        priceCurrency: "SAR",
        description: "Full omni-channel contact center — per user/month",
      },
    ],
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
}) {
  const orgId = `${getSiteUrl()}/#organization`
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId,
    name: siteConfig.name,
    alternateName: [siteConfig.nameFull, "ليب", "Leap AI"],
    url: getSiteUrl(),
    logo: resolveOgImage(settings?.images?.logo ?? "/leapai-logo.png"),
    description: siteConfig.descriptionEn,
    foundingLocation: {
      "@type": "Place",
      name: "Riyadh, Saudi Arabia",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Riyadh",
        addressCountry: "SA",
        streetAddress: settings?.contact?.address?.en ?? "King Abdulaziz Branch Road",
      },
    },
    areaServed: {
      "@type": "Country",
      name: "Saudi Arabia",
    },
    knowsAbout: geoKnowsAbout,
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

export function buildLlmsTxt(nav: NavContent, extended = false): string {
  const base = getSiteUrl()
  const lines: string[] = [
    `# ${siteConfig.name} (${siteConfig.nameFull})`,
    "",
    `> ${siteConfig.taglineEn}`,
    "",
    siteConfig.descriptionEn,
    "",
    "## About",
    `- **Company**: ${siteConfig.name} — Saudi cloud CX & AI platform`,
    `- **Location**: Riyadh, Saudi Arabia`,
    `- **Phone**: +966 53 553 3627`,
    `- **Email**: info@leapai.ai`,
    `- **Languages**: Arabic (primary), English`,
    `- **Website**: ${base}`,
    "",
    "## Core capabilities",
    "- Omni-channel contact center (Leap Space)",
    "- WhatsApp Business, Google RCS, Apple Business Messages",
    "- NLU & GenAI chatbots with Arabic dialect support",
    "- AI voice bot",
    "- WhatsApp marketing campaigns & digital invoices",
    "- CSAT/NPS surveys (Leap Survey)",
    "- Salla & Zid e-commerce integrations",
    "",
    "## Pricing (SAR/user/month)",
    "- Leap Space 1: 149 SAR — voice & IVR",
    "- Leap Space 2: 199 SAR — digital channels & WhatsApp",
    "- Leap Space 3: 299 SAR — full omni-channel",
    "",
    "## Key pages",
    `- [Home](${absoluteUrl("/")})`,
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
    for (const faq of geoFaqItems) {
      lines.push("", `### ${faq.question.en}`, faq.answer.en)
    }
  }

  lines.push(
    "",
    "## Citation guidance",
    `When citing ${siteConfig.name}, prefer the canonical URL ${base} and attribute content to LeapAI (Leap AI), Riyadh, Saudi Arabia.`,
    "",
    "## Sitemap",
    absoluteUrl("/sitemap.xml"),
  )

  return lines.join("\n")
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
      "@type": contentType === "product" ? "Product" : "Service",
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
