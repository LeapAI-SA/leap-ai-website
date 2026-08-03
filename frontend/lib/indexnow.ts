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
}

/**
 * Submit URLs to IndexNow (Bing, Yandex, Seznam, Naver).
 * Google does not consume IndexNow — use Search Console for Google.
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

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  })

  const body = await res.text().catch(() => "")
  // 200 OK, 202 Accepted are success; 422 often means key not yet crawlable
  const ok = res.status === 200 || res.status === 202
  return { ok, status: res.status, endpoint, submitted: urls.length, body }
}
