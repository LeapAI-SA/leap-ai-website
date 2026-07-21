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
    .filter((item): item is NonNullable<typeof item> => !!item && (item.label.ar || item.label.en))
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
        !!item && (item.name.ar || item.name.en) && (item.features.ar.length > 0 || item.features.en.length > 0),
    )
}

export function sanitizeSocialLinks(social: Record<string, unknown>) {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(social)) {
    const safe = sanitizeHttpUrl(value)
    if (safe) out[key] = safe
  }
  return out
}
