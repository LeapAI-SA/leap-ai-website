/**
 * Indexable URL list for GSC / IndexNow scripts.
 * Keep skip + priority in sync with frontend/lib/sitemap-urls.ts
 */
export const HOST = (process.env.NEXT_PUBLIC_SITE_URL || "https://leapai.ai").replace(/\/$/, "")

export const SKIP_PATHS = [
  "/resources/leap-ai-saudi-ai-native-cx-platform",
  "/en/resources/leap-ai-saudi-ai-native-cx-platform",
]

const CORE = [
  "/",
  "/solutions",
  "/products",
  "/use-cases",
  "/resources",
  "/contact-us",
  "/become-a-partner",
  "/about-us",
  "/privacy-policy",
]

const GEO_TEXT = ["/llms.txt", "/llms-full.txt", "/llms-small.txt", "/.well-known/ai.txt"]

const SOLUTIONS = [
  "digital-channels",
  "crm",
  "quality-management",
  "realtime-dashboard",
  "whatsapp-business",
  "google-rcs",
  "apple-messages",
  "nlu-chatbot",
  "genai-chatbot",
  "voice-bot",
  "customer-journey",
  "cdp",
].map((slug) => `/solutions/${slug}`)

const PRODUCTS = [
  "whatsapp-campaigns",
  "leap-survey",
  "digital-invoices",
  "whatsapp-invitations",
  "chatbot-tree",
  "whatsapp-officer",
  "recommendation-engine",
  "ai-recruiter",
  "ai-parking",
  "leap-ticketing",
  "complaints-automation",
].map((slug) => `/products/${slug}`)

const USE_CASES = ["retail", "telecom", "banking", "healthcare", "insurance", "travel-hospitality"].map(
  (slug) => `/use-cases/${slug}`,
)

const ARTICLES = ["/resources/ai-native-cx-vs-cpaas-local-cloud", "/resources/pdpl-vision-2030-saudi-cx"]

const NEWS = ["/news/2026/08/09/leap-ai-saudi-ai-native-cx-platform"]

function isGeoTextFile(path) {
  return path.endsWith(".txt") || path.includes("ai.txt")
}

function withEn(path) {
  return path === "/" ? "/en" : `/en${path}`
}

export function getFallbackSitemapPaths() {
  const arabic = [...CORE, ...GEO_TEXT, ...SOLUTIONS, ...PRODUCTS, ...USE_CASES, ...ARTICLES, ...NEWS]
  const english = arabic.filter((path) => !isGeoTextFile(path)).map(withEn)
  return [...arabic, ...english]
}

export const GSC_PRIORITY_PATHS = ["/", "/en", "/llms.txt", ...NEWS, ...NEWS.map(withEn)]

export function toAbs(host, path) {
  const base = host.replace(/\/$/, "")
  if (path === "/") return `${base}/`
  return `${base}${path}`
}

export function isSkipUrl(host, url) {
  const base = host.replace(/\/$/, "")
  return SKIP_PATHS.some((path) => url === toAbs(base, path) || url.replace(/\/$/, "") === `${base}${path}`)
}

export function filterIndexableUrls(host, urls) {
  return urls.filter((url) => !isSkipUrl(host, url))
}

export function getFallbackSitemapUrls(host = HOST) {
  return getFallbackSitemapPaths().map((path) => toAbs(host, path))
}

export function getGscPriorityUrls(host = HOST) {
  return GSC_PRIORITY_PATHS.map((path) => toAbs(host, path))
}
