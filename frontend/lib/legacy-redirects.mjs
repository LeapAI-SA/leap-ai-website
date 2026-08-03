/**
 * Legacy WordPress / old-site URL → new App Router destinations.
 * Single source of truth for next.config redirects + middleware.
 *
 * Keep specific rules BEFORE the /en catch-all in next.config.mjs.
 */

/** @type {Record<string, string>} */
export const LEGACY_SLUG_TO_PATH = {
  "healthcare-use-case": "/use-cases/healthcare",
  "complaints-automation-use-case": "/use-cases/complaints-automation",
  "retail-use-case": "/use-cases/retail",
  "telecom-use-case": "/use-cases/telecom",
  "banking-use-case": "/use-cases/banking",
  "banking-use-case-ar": "/use-cases/banking",
  "insurance-use-case": "/use-cases/insurance",
  "travel-hospitality-use-case": "/use-cases/travel-hospitality",
  "nlu-ai-chatbot": "/solutions/nlu-chatbot",
  "ai-voice-bot": "/solutions/voice-bot",
  "genai-generative-ai-chatbot": "/solutions/genai-chatbot",
  "connecting-digital-chat-channels-and-social-media-messages": "/solutions/digital-channels",
  "omni-channel-contact-center": "/solutions",
  "multichannel-contact-centers": "/solutions",
  "whatsapp-business-registration": "/solutions/whatsapp-business",
  "ai-flow-builder": "/products/chatbot-tree",
  "customer-data-platform": "/solutions/cdp",
  "customer-journey-orchestration": "/solutions/customer-journey",
  "quality-management-qm": "/solutions/quality-management",
  "real-time-dashboard": "/solutions/realtime-dashboard",
  "google-rcs-messaging": "/solutions/google-rcs",
  "apple-messages-for-business": "/solutions/apple-messages",
  "leap-space-1": "/",
  "leap-space-2": "/",
  "leap-space-3": "/",
}

/**
 * Resolve a request pathname (with or without /en prefix) to a canonical path.
 * Returns null when no special mapping applies.
 * @param {string} pathname
 * @returns {string | null}
 */
export function resolveLegacyPath(pathname) {
  const raw = pathname.replace(/\/+$/, "") || "/"
  const withoutEn = raw === "/en" ? "/" : raw.startsWith("/en/") ? raw.slice(3) : raw
  const slug = withoutEn.replace(/^\//, "")

  if (!slug) return raw.startsWith("/en") ? "/" : null

  const mapped = LEGACY_SLUG_TO_PATH[slug]
  if (mapped) return mapped

  if (raw.startsWith("/en/") || raw === "/en") {
    return withoutEn.startsWith("/") ? withoutEn : `/${withoutEn}`
  }

  return null
}

/**
 * Build Next.js redirect objects (permanent).
 * Expands each slug to /{slug}, /{slug}/, /en/{slug}, /en/{slug}/.
 * @returns {Array<{ source: string, destination: string, permanent: boolean }>}
 */
export function buildLegacyRedirects() {
  /** @type {Array<{ source: string, destination: string, permanent: boolean }>} */
  const out = []

  for (const [slug, destination] of Object.entries(LEGACY_SLUG_TO_PATH)) {
    for (const src of [`/${slug}`, `/${slug}/`, `/en/${slug}`, `/en/${slug}/`]) {
      if (src.replace(/\/$/, "") === destination.replace(/\/$/, "")) continue
      out.push({ source: src, destination, permanent: true })
    }
  }

  // Identity /en static pages (fewer hops than catch-all alone)
  for (const page of ["about-us", "contact-us", "become-a-partner", "privacy-policy", "solutions", "products", "use-cases"]) {
    out.push(
      { source: `/en/${page}`, destination: `/${page}`, permanent: true },
      { source: `/en/${page}/`, destination: `/${page}`, permanent: true },
    )
  }

  out.push(
    { source: "/en", destination: "/", permanent: true },
    { source: "/en/", destination: "/", permanent: true },
    { source: "/en/:path*", destination: "/:path*", permanent: true },
  )

  return out
}
