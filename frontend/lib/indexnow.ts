import { PRODUCTION_SITE_URL } from "@/lib/site-url"
import { getSitemapUrls } from "@/lib/sitemap-urls"

/**
 * IndexNow key — must match the file at /public/{INDEXNOW_KEY}.txt
 * Override with INDEXNOW_KEY env in production if rotated (e.g. Bing Webmaster Generate).
 * Rotate with: node scripts/rotate-indexnow-key.mjs --key=<newkey>
 */
export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY?.trim() || "5711d8a3f8144f3abbb4695a82809c61"

/** Shared hub (Bing / partners) + direct Yandex — Bing can 403 while Yandex accepts. */
export const INDEXNOW_ENDPOINTS = [
  { id: "bing", label: "Bing (api.indexnow.org)", url: "https://api.indexnow.org/indexnow" },
  { id: "yandex", label: "Yandex", url: "https://yandex.com/indexnow" },
] as const

export function indexNowKeyLocation(host = PRODUCTION_SITE_URL, key = INDEXNOW_KEY) {
  const base = host.replace(/\/$/, "")
  return `${base}/${key}.txt`
}

export type IndexNowEngineResult = {
  id: string
  label: string
  endpoint: string
  ok: boolean
  status: number
  body: string
  error?: string
}

export type IndexNowResult = {
  ok: boolean
  /** Primary status: first success, else first non-network failure, else 0 */
  status: number
  endpoint: string
  submitted: number
  body: string
  error?: string
  engines: IndexNowEngineResult[]
  bingOk: boolean
  yandexOk: boolean
  bingOwnershipForbidden: boolean
}

function isOwnershipForbidden(text: string) {
  return /UserForbiddedToAccessSite|unauthorized to access the site|verify the site using the key/i.test(
    text,
  )
}

async function postIndexNowEndpoint(
  endpoint: (typeof INDEXNOW_ENDPOINTS)[number],
  payload: object,
): Promise<IndexNowEngineResult> {
  try {
    const res = await fetch(endpoint.url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    })
    const body = await res.text().catch(() => "")
    const ok = res.status === 200 || res.status === 202
    return {
      id: endpoint.id,
      label: endpoint.label,
      endpoint: endpoint.url,
      ok,
      status: res.status,
      body,
      error: ok ? undefined : body || `IndexNow provider returned HTTP ${res.status}`,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "IndexNow network error"
    return {
      id: endpoint.id,
      label: endpoint.label,
      endpoint: endpoint.url,
      ok: false,
      status: 0,
      body: message,
      error: `Could not reach IndexNow: ${message}`,
    }
  }
}

/**
 * Submit URLs to IndexNow (Bing hub + Yandex).
 * Google does not consume IndexNow — use Search Console for Google.
 * Never throws — network failures return ok:false with status 0.
 * Overall ok if any engine accepts (200/202).
 */
export async function submitIndexNow(
  urls: string[] = getSitemapUrls(),
  options?: { host?: string; key?: string },
): Promise<IndexNowResult> {
  const hostUrl = (options?.host ?? PRODUCTION_SITE_URL).replace(/\/$/, "")
  const host = new URL(hostUrl).host
  const key = options?.key ?? INDEXNOW_KEY
  const payload = {
    host,
    key,
    keyLocation: `${hostUrl}/${key}.txt`,
    urlList: urls,
  }

  const engines = await Promise.all(
    INDEXNOW_ENDPOINTS.map((endpoint) => postIndexNowEndpoint(endpoint, payload)),
  )

  const bing = engines.find((e) => e.id === "bing")
  const yandex = engines.find((e) => e.id === "yandex")
  const anyOk = engines.some((e) => e.ok)
  const allNetworkFail = engines.every((e) => e.status === 0)
  const success = engines.find((e) => e.ok)
  const failure = engines.find((e) => !e.ok && e.status !== 0) ?? engines.find((e) => !e.ok)

  const primary = success ?? failure ?? engines[0]
  const bingOwnershipForbidden = Boolean(
    bing && !bing.ok && isOwnershipForbidden(`${bing.error ?? ""} ${bing.body ?? ""}`),
  )

  let error: string | undefined
  if (!anyOk) {
    error =
      primary?.error ||
      primary?.body ||
      (allNetworkFail ? "Could not reach any IndexNow endpoint" : "IndexNow providers rejected the request")
  } else if (bingOwnershipForbidden) {
    error =
      "Partial success: Yandex accepted; Bing still returns ownership 403. " +
      "In Bing Webmaster Tools confirm the property is Verified, then URL Submission → IndexNow → Generate API key, " +
      "run `node scripts/rotate-indexnow-key.mjs --key=<bing-key>`, deploy, and retry."
  }

  return {
    ok: anyOk,
    status: allNetworkFail ? 0 : (primary?.status ?? 0),
    endpoint: primary?.endpoint ?? INDEXNOW_ENDPOINTS[0].url,
    submitted: urls.length,
    body: primary?.body ?? "",
    error,
    engines,
    bingOk: Boolean(bing?.ok),
    yandexOk: Boolean(yandex?.ok),
    bingOwnershipForbidden,
  }
}

/** Prefer same-container key check to avoid LB hairpin; fall back to public URL. */
export async function checkIndexNowKeyLive(key = INDEXNOW_KEY) {
  const publicLocation = indexNowKeyLocation(PRODUCTION_SITE_URL, key)
  const candidates = [
    `http://127.0.0.1:${process.env.PORT || "3000"}/${key}.txt`,
    publicLocation,
  ]

  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: "no-store" })
      const text = await res.text()
      // Prefer exact match (no trailing newline); accept trimmed as fallback.
      if (res.ok && (text === key || text.trim() === key)) {
        return {
          keyLocation: publicLocation,
          live: true,
          status: res.status,
          checkedVia: url,
          exact: text === key,
        }
      }
    } catch {
      /* try next candidate */
    }
  }

  return {
    keyLocation: publicLocation,
    live: false,
    status: 0,
    checkedVia: null as string | null,
    exact: false,
  }
}
