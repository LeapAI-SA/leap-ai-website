import { fetchPublicSettings } from "@/lib/api"
import { resolveAssetPath } from "@/lib/media"
import { getPublicSiteUrl } from "@/lib/site-url"

function toAbsoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  const siteUrl = getPublicSiteUrl().replace(/\/$/, "")
  const normalized = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`
  return `${siteUrl}${normalized}`
}

async function fetchAsDataUrl(url: string) {
  const response = await fetch(url, { cache: "no-store" })
  if (!response.ok) return null
  const contentType = response.headers.get("content-type") ?? "image/png"
  const bytes = Buffer.from(await response.arrayBuffer())
  return `data:${contentType};base64,${bytes.toString("base64")}`
}

/** Resolve dashboard logo to a data URL for ImageResponse rendering. */
export async function resolveLogoDataUrl() {
  const settings = await fetchPublicSettings()
  const configuredLogo = settings?.images?.logo ?? "/icon.svg"
  const primary = resolveAssetPath(configuredLogo)
  const fallback = resolveAssetPath("/icon.svg")

  if (primary) {
    const primaryData = await fetchAsDataUrl(toAbsoluteUrl(primary))
    if (primaryData) return primaryData
  }

  if (fallback) {
    const fallbackData = await fetchAsDataUrl(toAbsoluteUrl(fallback))
    if (fallbackData) return fallbackData
  }

  return null
}
