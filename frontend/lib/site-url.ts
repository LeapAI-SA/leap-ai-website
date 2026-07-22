/** Public site URL helpers — local dev vs production. */

export function getBasePath() {
  return (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "")
}

export function isProduction() {
  return process.env.NODE_ENV === "production"
}

function localDevSiteUrl() {
  const basePath = getBasePath()
  return `http://localhost:3000${basePath}`
}

/** Canonical public site URL (SEO, GEO, sitemap, metadata). */
export function getPublicSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "")
  if (fromEnv) {
    if (isProduction() && isLocalhostUrl(fromEnv)) {
      console.error(
        "[site-url] NEXT_PUBLIC_SITE_URL must be your live domain in production, not localhost.",
      )
    }
    return fromEnv
  }

  if (isProduction()) {
    console.error(
      "[site-url] NEXT_PUBLIC_SITE_URL is missing in production. Set it to e.g. https://leapai-webhook.bab.solutions/leap-ai",
    )
  }

  return localDevSiteUrl()
}

/** @deprecated alias — use getPublicSiteUrl */
export function getSiteUrl() {
  return getPublicSiteUrl()
}

export function isLocalhostUrl(url: string) {
  return /localhost|127\.0\.0\.1/i.test(url)
}

/** Browser origin + base path when env is unset (client-only). */
export function getBrowserSiteUrl() {
  if (typeof window !== "undefined") {
    return `${window.location.origin}${getBasePath()}`
  }
  return getPublicSiteUrl()
}

export const PRODUCTION_SITE_URL = "https://leapai-webhook.bab.solutions/leap-ai"
