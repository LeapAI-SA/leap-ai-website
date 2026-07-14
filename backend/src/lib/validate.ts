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

export function sanitizeSocialLinks(social: Record<string, unknown>) {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(social)) {
    const safe = sanitizeHttpUrl(value)
    if (safe) out[key] = safe
  }
  return out
}
