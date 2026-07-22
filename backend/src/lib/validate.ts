import type { ContentType } from "../models/ContentItem.js"

const CONTENT_TYPES: ContentType[] = ["solution", "product", "use-case"]
const SLUG_RE = /^[a-z0-9-]+$/

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && value.trim().length <= 200 && EMAIL_RE.test(value.trim())
}

export function trimString(value: unknown, max: number): string {
  if (typeof value !== "string") return ""
  return value.trim().slice(0, max)
}

export function isValidSlug(value: unknown): value is string {
  return typeof value === "string" && SLUG_RE.test(value) && value.length <= 120
}

export function isContentType(value: unknown): value is ContentType {
  return typeof value === "string" && CONTENT_TYPES.includes(value as ContentType)
}

/** Allow http(s) URLs only — blocks javascript:, data:, etc. */
export function sanitizeHttpUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null
  try {
    const url = new URL(value.trim())
    if (url.protocol === "https:" || url.protocol === "http:") return url.href
  } catch {
    /* invalid */
  }
  return null
}

/** CMS image paths: site-relative or uploads from our API. */
export function sanitizeImagePath(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null
  const path = value.trim()
  if (path.startsWith("/uploads/") || path.startsWith("/")) {
    if (path.includes("..") || path.includes("\\")) return null
    return path
  }
  return sanitizeHttpUrl(path)
}

/** Site-relative nav paths (optional hash), e.g. /about-us or /#faq */
export function sanitizeNavPath(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null
  const raw = value.trim()
  if (!raw.startsWith("/") || raw.includes("..") || raw.includes("\\")) return null
  const hashIndex = raw.indexOf("#")
  if (hashIndex === -1) return raw.slice(0, 200)
  const path = raw.slice(0, hashIndex)
  const hash = raw.slice(hashIndex + 1).replace(/[^a-zA-Z0-9_-]/g, "")
  if (!path.startsWith("/")) return null
  return hash ? `${path}#${hash}`.slice(0, 200) : path.slice(0, 200)
}

export function sanitizeNavLinks(value: unknown): Array<{ label: { ar: string; en: string }; href: string; enabled: boolean }> {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => {
      const label = item.label as { ar?: string; en?: string } | undefined
      const href = sanitizeNavPath(item.href)
      if (!href) return null
      return {
        label: {
          ar: trimString(label?.ar, 120),
          en: trimString(label?.en, 120),
        },
        href,
        enabled: item.enabled !== false,
      }
    })
    .filter((item): item is NonNullable<typeof item> => !!item && !!(item.label.ar || item.label.en))
}

export function sanitizePartners(value: unknown): Array<{ name: string; logo: string; enabled: boolean }> {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => {
      const logo = sanitizeImagePath(item.logo)
      const name = trimString(item.name, 120)
      if (!logo || !name) return null
      return { name, logo, enabled: item.enabled !== false }
    })
    .filter((item): item is NonNullable<typeof item> => !!item)
}

export function sanitizePricingPlans(value: unknown): Array<{
  slug: string
  price: string
  featured: boolean
  name: { ar: string; en: string }
  tagline: { ar: string; en: string }
  features: { ar: string[]; en: string[] }
}> {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => {
      const slug = isValidSlug(item.slug) ? item.slug : null
      const price = trimString(item.price, 20)
      const name = item.name as { ar?: string; en?: string } | undefined
      const tagline = item.tagline as { ar?: string; en?: string } | undefined
      const features = item.features as { ar?: unknown; en?: unknown } | undefined
      if (!slug || !price) return null
      const cleanFeatures = (raw: unknown) =>
        Array.isArray(raw) ? raw.map((line) => trimString(line, 300)).filter(Boolean) : []
      return {
        slug,
        price,
        featured: item.featured === true,
        name: { ar: trimString(name?.ar, 200), en: trimString(name?.en, 200) },
        tagline: { ar: trimString(tagline?.ar, 300), en: trimString(tagline?.en, 300) },
        features: { ar: cleanFeatures(features?.ar), en: cleanFeatures(features?.en) },
      }
    })
    .filter(
      (item): item is NonNullable<typeof item> =>
        !!item &&
        !!(item.name.ar || item.name.en) &&
        (item.features.ar.length > 0 || item.features.en.length > 0),
    )
}

function sanitizeLocalized(value: unknown, max = 500): { ar: string; en: string } {
  const v = value as { ar?: string; en?: string } | undefined
  return { ar: trimString(v?.ar, max), en: trimString(v?.en, max) }
}

function sanitizeLocalizedArray(value: unknown, maxItem = 2000): { ar: string[]; en: string[] } {
  const v = value as { ar?: unknown; en?: unknown } | undefined
  const clean = (raw: unknown) =>
    Array.isArray(raw) ? raw.map((line) => trimString(line, maxItem)).filter(Boolean) : []
  return { ar: clean(v?.ar), en: clean(v?.en) }
}

function sanitizeStats(value: unknown): Array<{ value: number; label: { ar: string; en: string } }> {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => {
      const num = typeof item.value === "number" ? item.value : Number(item.value)
      if (!Number.isFinite(num) || num < 0) return null
      const label = sanitizeLocalized(item.label, 120)
      if (!label.ar && !label.en) return null
      return { value: Math.floor(num), label }
    })
    .filter((item): item is NonNullable<typeof item> => !!item)
    .slice(0, 6)
}

export function sanitizeAddonItems(value: unknown): Array<{
  icon: string
  title: { ar: string; en: string }
  desc: { ar: string; en: string }
  enabled: boolean
}> {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => {
      const icon = sanitizeImagePath(item.icon)
      const title = sanitizeLocalized(item.title, 200)
      const desc = sanitizeLocalized(item.desc, 1000)
      if (!icon || (!title.ar && !title.en)) return null
      return { icon, title, desc, enabled: item.enabled !== false }
    })
    .filter((item): item is NonNullable<typeof item> => !!item)
}

export function sanitizeAddonsSection(value: unknown): {
  badge: { ar: string; en: string }
  title: { ar: string; en: string }
  lead: { ar: string; en: string }
  items: ReturnType<typeof sanitizeAddonItems>
} {
  const v = value as Record<string, unknown> | undefined
  return {
    badge: sanitizeLocalized(v?.badge, 120),
    title: sanitizeLocalized(v?.title, 300),
    lead: sanitizeLocalized(v?.lead, 500),
    items: sanitizeAddonItems(v?.items),
  }
}

export function sanitizeAboutPage(value: unknown): Record<string, unknown> {
  const v = value as Record<string, unknown> | undefined
  const image = sanitizeImagePath(v?.image)
  return {
    title: sanitizeLocalized(v?.title, 200),
    subtitle: sanitizeLocalized(v?.subtitle, 300),
    storyHeading: sanitizeLocalized(v?.storyHeading, 200),
    story: sanitizeLocalizedArray(v?.story, 3000),
    visionTagline: sanitizeLocalized(v?.visionTagline, 200),
    visionTitle: sanitizeLocalized(v?.visionTitle, 200),
    visionText: sanitizeLocalized(v?.visionText, 2000),
    missionTitle: sanitizeLocalized(v?.missionTitle, 200),
    missionText: sanitizeLocalized(v?.missionText, 2000),
    valuesTitle: sanitizeLocalized(v?.valuesTitle, 200),
    valuesText: sanitizeLocalized(v?.valuesText, 2000),
    quote: sanitizeLocalized(v?.quote, 1000),
    quoteAttribution: trimString(v?.quoteAttribution, 120) || "Leap AI",
    imageAlt: sanitizeLocalized(v?.imageAlt, 200),
    image: image || "/pages/about-us.png",
    stats: sanitizeStats(v?.stats),
  }
}

export function sanitizePrivacySections(value: unknown): Array<{
  title: { ar: string; en: string }
  body: { ar: string; en: string }
}> {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => {
      const title = sanitizeLocalized(item.title, 300)
      const body = sanitizeLocalized(item.body, 5000)
      if (!title.ar && !title.en) return null
      if (!body.ar && !body.en) return null
      return { title, body }
    })
    .filter((item): item is NonNullable<typeof item> => !!item)
    .slice(0, 20)
}

export function sanitizePrivacyPage(value: unknown): Record<string, unknown> {
  const v = value as Record<string, unknown> | undefined
  const image = sanitizeImagePath(v?.image)
  return {
    title: sanitizeLocalized(v?.title, 200),
    subtitle: sanitizeLocalized(v?.subtitle, 300),
    introTitle: sanitizeLocalized(v?.introTitle, 200),
    introSubtitle: sanitizeLocalized(v?.introSubtitle, 500),
    image: image || "/sections/ticket-overview.png",
    imageAlt: sanitizeLocalized(v?.imageAlt, 200),
    sections: sanitizePrivacySections(v?.sections),
  }
}

export function sanitizeCtaLabels(value: unknown): Record<string, { ar: string; en: string }> {
  const v = value as Record<string, unknown> | undefined
  return {
    pricing: sanitizeLocalized(v?.pricing, 120),
    stores: sanitizeLocalized(v?.stores, 120),
    acquire: sanitizeLocalized(v?.acquire, 120),
    headerSignup: sanitizeLocalized(v?.headerSignup, 120),
    learnMore: sanitizeLocalized(v?.learnMore, 120),
  }
}

export function sanitizeSocialLinks(social: Record<string, unknown>) {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(social)) {
    const safe = sanitizeHttpUrl(value)
    if (safe) out[key] = safe
  }
  return out
}
