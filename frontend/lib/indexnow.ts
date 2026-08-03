import { PRODUCTION_SITE_URL } from "@/lib/site-url"
import { getSitemapUrls } from "@/lib/sitemap-urls"

/**
 * IndexNow key — must match the file at /public/{INDEXNOW_KEY}.txt
 * Override with INDEXNOW_KEY env in production if rotated.
 */
export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY?.trim() || "a7f3c9e2b1d84f6a9c0e5b2d8f1a4c7e"

export function indexNowKeyLocation(host = PRODUCTION_SITE_URL) {
  const base = host.replace(/\/$/, "")
  return `${base}/${INDEXNOW_KEY}.txt`
}

export type IndexNowResult = {
  ok: boolean
  status: number
  endpoint: string
  submitted: number
  body: string
  error?: string
}

/**
 * Submit URLs to IndexNow (Bing, Yandex, Seznam, Naver).
 * Google does not consume IndexNow — use Search Console for Google.
 * Never throws — network failures return ok:false with status 0.
 */
export async function submitIndexNow(
  urls: string[] = getSitemapUrls(),
  options?: { host?: string; key?: string },
): Promise<IndexNowResult> {
  const hostUrl = (options?.host ?? PRODUCTION_SITE_URL).replace(/\/$/, "")
  const host = new URL(hostUrl).host
  const key = options?.key ?? INDEXNOW_KEY
  const endpoint = "https://api.indexnow.org/indexnow"
  const payload = {
    host,
    key,
    keyLocation: `${hostUrl}/${key}.txt`,
    urlList: urls,
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    })

    const body = await res.text().catch(() => "")
    const ok = res.status === 200 || res.status === 202
    return {
      ok,
      status: res.status,
      endpoint,
      submitted: urls.length,
      body,
      error: ok
        ? undefined
        : body || `IndexNow provider returned HTTP ${res.status}`,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "IndexNow network error"
    return {
      ok: false,
      status: 0,
      endpoint,
      submitted: urls.length,
      body: message,
      error: `Could not reach IndexNow: ${message}`,
    }
  }
}

/** Prefer same-container key check to avoid LB hairpin; fall back to public URL. */
export async function checkIndexNowKeyLive(key = INDEXNOW_KEY) {
  const publicLocation = indexNowKeyLocation()
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
