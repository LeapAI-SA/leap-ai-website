import { readFile } from "fs/promises"
import path from "path"
import { fetchPublicSettings } from "@/lib/api"
import { getApiUrl } from "@/lib/api-url"
import { resolveAssetPath } from "@/lib/media"
import { getPublicSiteUrl } from "@/lib/site-url"

const DEFAULT_LOGO = "/leapai-logo.png"

function mimeForExt(ext: string) {
  switch (ext.toLowerCase()) {
    case ".svg":
      return "image/svg+xml"
    case ".jpg":
    case ".jpeg":
      return "image/jpeg"
    case ".webp":
      return "image/webp"
    default:
      return "image/png"
  }
}

async function loadLocalPublicAsset(assetPath: string) {
  if (!assetPath.startsWith("/") || assetPath.includes("..") || assetPath.startsWith("/uploads/")) {
    return null
  }

  const filePath = path.join(process.cwd(), "public", assetPath.slice(1))
  try {
    const bytes = await readFile(filePath)
    return `data:${mimeForExt(path.extname(filePath))};base64,${bytes.toString("base64")}`
  } catch {
    return null
  }
}

function hostnameOf(url: string) {
  try {
    return new URL(url).hostname.toLowerCase()
  } catch {
    return ""
  }
}

function isPrivateOrLocalHost(hostname: string) {
  if (!hostname) return true
  if (hostname === "localhost" || hostname.endsWith(".localhost")) return true
  if (hostname === "0.0.0.0" || hostname === "::" || hostname === "::1") return true
  // IPv4 private / link-local / loopback
  if (/^(127\.|10\.|192\.168\.|169\.254\.)/.test(hostname)) return true
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)) return true
  // IPv6 unique local / link-local
  if (hostname.startsWith("fc") || hostname.startsWith("fd") || hostname.startsWith("fe80")) return true
  return false
}

/** Only fetch logos from our public site host or the internal API host (for /uploads). */
function isAllowedFetchUrl(url: string) {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return false
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false

  const host = parsed.hostname.toLowerCase()
  const siteHost = hostnameOf(getPublicSiteUrl())
  const apiHost = hostnameOf(getApiUrl())

  // Loopback only for Next serving its own public assets during icon generation.
  if (host === "127.0.0.1" || host === "localhost") {
    return parsed.pathname.startsWith("/") && !parsed.pathname.includes("..")
  }

  if (siteHost && host === siteHost) return true
  if (apiHost && host === apiHost && parsed.pathname.startsWith("/uploads/")) return true

  // Block everything else (including private IPs on unexpected hosts).
  if (isPrivateOrLocalHost(host)) return false
  return false
}

function toFetchableUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl

  const normalized = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`

  // Uploads are served by the API, not Next public assets.
  if (normalized.startsWith("/uploads/")) {
    return `${getApiUrl().replace(/\/$/, "")}${normalized}`
  }

  // Prefer loopback for same-process icon generation (avoids public-URL / CORS issues).
  const port = process.env.PORT ?? "3000"
  return `http://127.0.0.1:${port}${normalized}`
}

async function fetchAsDataUrl(url: string) {
  if (!isAllowedFetchUrl(url)) return null
  try {
    const response = await fetch(url, { cache: "no-store", redirect: "error" })
    if (!response.ok) return null
    const contentType = response.headers.get("content-type") ?? "image/png"
    if (!contentType.startsWith("image/")) return null
    const bytes = Buffer.from(await response.arrayBuffer())
    // Cap logo payload used for OG/icon generation (~2 MB).
    if (bytes.byteLength > 2 * 1024 * 1024) return null
    return `data:${contentType};base64,${bytes.toString("base64")}`
  } catch {
    return null
  }
}

/** Resolve dashboard logo to a data URL for ImageResponse rendering. */
export async function resolveLogoDataUrl() {
  const settings = await fetchPublicSettings()
  const configuredLogo = settings?.images?.logo?.trim() || DEFAULT_LOGO
  const candidates = Array.from(
    new Set([configuredLogo, DEFAULT_LOGO].map((value) => resolveAssetPath(value)).filter(Boolean)),
  )

  for (const candidate of candidates) {
    if (candidate.startsWith("http://") || candidate.startsWith("https://")) {
      const remote = await fetchAsDataUrl(candidate)
      if (remote) return remote
      continue
    }

    const local = await loadLocalPublicAsset(candidate)
    if (local) return local

    const fetched = await fetchAsDataUrl(toFetchableUrl(candidate))
    if (fetched) return fetched

    // Last resort: absolute public site URL (useful when assets live only on CDN).
    const publicUrl = `${getPublicSiteUrl().replace(/\/$/, "")}${candidate}`
    const publicFetched = await fetchAsDataUrl(publicUrl)
    if (publicFetched) return publicFetched
  }

  return null
}
