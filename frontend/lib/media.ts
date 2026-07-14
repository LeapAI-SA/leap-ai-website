import { getClientApiUrl } from "./api-url"

function getBasePath() {
  return (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "")
}

function safeHttpUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.protocol === "https:" || parsed.protocol === "http:") return parsed.href
  } catch {
    /* invalid */
  }
  return null
}

/** Prefix a site-relative path with NEXT_PUBLIC_BASE_PATH when configured. */
export function withBasePath(path: string): string {
  if (!path.startsWith("/") || path.includes("..")) return path
  const basePath = getBasePath()
  return basePath ? `${basePath}${path}` : path
}

/** Resolve CMS / public asset paths for use in img src (includes basePath + upload proxy). */
export function resolveMediaUrl(path?: string): string {
  if (!path) return ""
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return safeHttpUrl(path) ?? ""
  }
  if (path.startsWith("/uploads/")) return `${getClientApiUrl()}${path}`
  if (path.startsWith("/") && !path.includes("..")) return withBasePath(path)
  return ""
}

/** Site-relative path for absolute URLs in meta tags (getSiteUrl already includes basePath). */
export function resolveAssetPath(path?: string): string {
  if (!path) return ""
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return safeHttpUrl(path) ?? ""
  }
  if (path.startsWith("/uploads/")) {
    const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
    if (api.startsWith("/")) return `${api.replace(/\/$/, "")}${path}`
    return `${api.replace(/\/$/, "")}${path}`
  }
  if (path.startsWith("/") && !path.includes("..")) return path
  return ""
}
