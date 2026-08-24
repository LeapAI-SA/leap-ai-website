/**
 * Legacy WordPress / old-site URL → new App Router destinations.
 * Single source of truth for next.config redirects + middleware.
 *
 * Keep specific rules BEFORE the /en catch-all in next.config.mjs.
 */

/** @type {Record<string, string>} */
export const LEGACY_SLUG_TO_PATH = {
  // Use cases
  "healthcare-use-case": "/use-cases/healthcare",
  "complaints-automation-use-case": "/use-cases/complaints-automation",
  "retail-use-case": "/use-cases/retail",
  "telecom-use-case": "/use-cases/telecom",
  "banking-use-case": "/use-cases/banking",
  "banking-use-case-ar": "/use-cases/banking",
  "insurance-use-case": "/use-cases/insurance",
  "travel-hospitality-use-case": "/use-cases/travel-hospitality",

  // Solutions (WordPress + short slugs)
  "nlu-ai-chatbot": "/solutions/nlu-chatbot",
  "ai-voice-bot": "/solutions/voice-bot",
  "genai-generative-ai-chatbot": "/solutions/genai-chatbot",
  "connecting-digital-chat-channels-and-social-media-messages": "/solutions/digital-channels",
  "omni-channel-contact-center": "/solutions",
  "multichannel-contact-centers": "/solutions",
  "whatsapp-business-registration": "/solutions/whatsapp-business",
  "whatsapp-business": "/solutions/whatsapp-business",
  "customer-data-platform": "/solutions/cdp",
  "customer-journey-orchestration": "/solutions/customer-journey",
  "growth-hacking-journey": "/solutions/customer-journey",
  "growth-hacking": "/solutions/customer-journey",
  "quality-management-qm": "/solutions/quality-management",
  "quality-management-qm-solutions": "/solutions/quality-management",
  "real-time-dashboard": "/solutions/realtime-dashboard",
  "business-intelligence-and-analytics-bi-solutions": "/solutions/realtime-dashboard",
  "google-rcs-messaging": "/solutions/google-rcs",
  "google-rcs": "/solutions/google-rcs",
  "rich-business-messaging": "/solutions/google-rcs",

  // Solution nav group slugs (no detail page — Bing / old WP links)
  "business-messaging": "/solutions/whatsapp-business",
  "ai-chatbot": "/solutions/nlu-chatbot",
  "ai-marketing": "/solutions/customer-journey",
  "apple-messages-for-business": "/solutions/apple-messages",
  "apple-business-messaging-abc": "/solutions/apple-messages",
  "customer-relationship-management-crm-system": "/solutions/crm",
  "building-a-cpd-customer-database": "/solutions/cdp",
  "building-a-cdp-customer-database": "/solutions/cdp",

  // Products
  "ai-flow-builder": "/products/chatbot-tree",
  "campgain-management-platform": "/products/whatsapp-campaigns",
  "campaign-management-platform": "/products/whatsapp-campaigns",
  "leap-survey": "/products/leap-survey",
  "leap-digital-invoice": "/products/digital-invoices",
  "digital-invitation-system-via-whatsapp": "/products/whatsapp-invitations",
  "whatsapp-agent": "/products/whatsapp-officer",
  "leap-rec-engine": "/products/recommendation-engine",
  r24: "/products/ai-recruiter",
  "whatsapp-parking-check-in": "/products/ai-parking",
  "leap-ticketing": "/products/leap-ticketing",

  // Marketing / space pages
  "leap-space-1": "/",
  "leap-space-2": "/",
  "leap-space-3": "/",
}

/** /solutions/{group-slug} paths that 404 — map to a live detail page. */
export const SOLUTION_GROUP_PATH_REDIRECTS = {
  "/solutions/business-messaging": "/solutions/whatsapp-business",
  "/solutions/ai-chatbot": "/solutions/nlu-chatbot",
  "/solutions/ai-marketing": "/solutions/customer-journey",
  "/solutions/ai-voice-bot": "/solutions/voice-bot",
}

/** Static pages that exist on the new site (served under /en as English HTML). */
const CANONICAL_STATIC_PAGES = new Set([
  "about-us",
  "careers",
  "cases",
  "contact-us",
  "become-a-partner",
  "maintenance",
  "privacy-policy",
  "solutions",
  "products",
  "use-cases",
  "resources",
])

/**
 * True when stripped /en path is a real App Router path (not a dead WP slug).
 * @param {string} path pathname starting with /
 */
export function isLikelyCanonicalPath(path) {
  const p = path.replace(/\/+$/, "") || "/"
  if (p === "/") return true
  const slug = p.replace(/^\//, "")
  if (CANONICAL_STATIC_PAGES.has(slug)) return true
  if (
    p.startsWith("/solutions/") ||
    p.startsWith("/products/") ||
    p.startsWith("/use-cases/") ||
    p.startsWith("/resources/") ||
    p.startsWith("/news/")
  ) {
    return true
  }
  return false
}

/**
 * Resolve a request pathname (with or without /en prefix) to a redirect target.
 * Returns null when the URL should be served (Arabic page or English /en rewrite).
 * WordPress leftovers under /en map to /en/… (not Arabic /).
 * @param {string} pathname
 * @returns {string | null}
 */
export function resolveLegacyPath(pathname) {
  const raw = pathname.replace(/\/+$/, "") || "/"
  const isEn = raw === "/en" || raw.startsWith("/en/")
  const withoutEn = raw === "/en" ? "/" : raw.startsWith("/en/") ? raw.slice(3) : raw
  const slug = withoutEn.replace(/^\//, "")

  const withLocale = (dest) => {
    if (!isEn) return dest
    if (dest === "/") return "/en"
    return `/en${dest}`
  }

  if (!slug) return null

  const normalizedWithoutEn = (withoutEn.startsWith("/") ? withoutEn : `/${withoutEn}`).replace(/\/+$/, "") || "/"
  const groupPath = SOLUTION_GROUP_PATH_REDIRECTS[normalizedWithoutEn]
  if (groupPath) return withLocale(groupPath)

  const mapped = LEGACY_SLUG_TO_PATH[slug]
  if (mapped) return withLocale(mapped)

  if (isEn) {
    const candidate = withoutEn.startsWith("/") ? withoutEn : `/${withoutEn}`
    if (isLikelyCanonicalPath(candidate)) return null
    return "/en"
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
    const enDest = destination === "/" ? "/en" : `/en${destination}`
    for (const [src, dest] of [
      [`/${slug}`, destination],
      [`/${slug}/`, destination],
      [`/en/${slug}`, enDest],
      [`/en/${slug}/`, enDest],
    ]) {
      if (src.replace(/\/$/, "") === dest.replace(/\/$/, "")) continue
      out.push({ source: src, destination: dest, permanent: true })
    }
  }

  for (const [src, dest] of Object.entries(SOLUTION_GROUP_PATH_REDIRECTS)) {
    const enDest = `/en${dest}`
    for (const [from, to] of [
      [src, dest],
      [`${src}/`, dest],
      [`/en${src}`, enDest],
      [`/en${src}/`, enDest],
    ]) {
      if (from.replace(/\/$/, "") === to.replace(/\/$/, "")) continue
      out.push({ source: from, destination: to, permanent: true })
    }
  }

  return out
}
