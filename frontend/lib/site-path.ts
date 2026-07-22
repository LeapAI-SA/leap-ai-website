import { withBasePath } from "./media"
import { getBasePath } from "./site-url"

/** Normalize CMS or hardcoded internal paths for Next.js Link. */
export function sitePath(path: string): string {
  if (!path) return "/"
  if (path.startsWith("mailto:") || path.startsWith("tel:") || path.startsWith("#")) return path

  if (path.startsWith("http://") || path.startsWith("https://")) {
    try {
      const url = new URL(path)
      return sitePath(`${url.pathname}${url.search}${url.hash}`)
    } catch {
      return path
    }
  }

  const basePath = getBasePath()
  let normalized = path.startsWith("/") ? path : `/${path}`

  if (basePath && (normalized === basePath || normalized.startsWith(`${basePath}/`))) {
    normalized = normalized.slice(basePath.length) || "/"
  }

  return normalized
}

/** Full browser URL for an internal route (includes origin + base path). */
export function siteHref(path: string, origin?: string): string {
  const internal = sitePath(path)
  const resolved = withBasePath(internal)
  if (origin) return `${origin.replace(/\/$/, "")}${resolved}`
  return resolved
}
