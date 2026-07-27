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
  try {
    const response = await fetch(url, { cache: "no-store" })
    if (!response.ok) return null
    const contentType = response.headers.get("content-type") ?? "image/png"
    const bytes = Buffer.from(await response.arrayBuffer())
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
