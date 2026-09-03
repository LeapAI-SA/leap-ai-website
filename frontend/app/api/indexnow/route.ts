/**
 * POST /api/indexnow — submit sitemap URLs to IndexNow (Bing / Yandex / Seznam / Naver).
 *
 * Auth (either):
 * - Admin session cookie (same-origin dashboard) verified via backend /api/auth/me
 * - Deploy secret: Authorization: Bearer $INDEXNOW_SUBMIT_SECRET or header X-IndexNow-Secret
 */
import { NextResponse } from "next/server"
import { getApiUrl } from "@/lib/api-url"
import {
  submitIndexNow,
  INDEXNOW_KEY,
  indexNowKeyLocation,
  checkIndexNowKeyLive,
} from "@/lib/indexnow"
import { getGscPriorityUrls, getRedirectOnlyUrls, getSitemapUrls } from "@/lib/sitemap-urls"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function looksLikeJwt(token: string) {
  return token.split(".").length === 3
}

async function isAdminRequest(request: Request) {
  const cookie = request.headers.get("cookie")?.trim() ?? ""
  const header = request.headers.get("authorization")
  const bearer = header?.startsWith("Bearer ") ? header.slice(7).trim() : ""
  const headers: Record<string, string> = { Accept: "application/json" }
  if (cookie) headers.Cookie = cookie
  if (bearer && looksLikeJwt(bearer)) headers.Authorization = `Bearer ${bearer}`
  if (!headers.Cookie && !headers.Authorization) return false

  try {
    const res = await fetch(`${getApiUrl()}/api/auth/me`, {
      headers,
      cache: "no-store",
    })
    if (!res.ok) return false
    const json = (await res.json()) as { user?: { role?: string } }
    return json.user?.role === "admin"
  } catch {
    return false
  }
}

async function authorized(request: Request) {
  const header = request.headers.get("authorization")
  const bearer = header?.startsWith("Bearer ") ? header.slice(7).trim() : ""
  const deployHeader = request.headers.get("x-indexnow-secret")?.trim() ?? ""
  const deploySecret = process.env.INDEXNOW_SUBMIT_SECRET?.trim()

  if (deploySecret && (bearer === deploySecret || deployHeader === deploySecret)) {
    return true
  }

  return isAdminRequest(request)
}

function httpStatusForIndexNow(result: {
  ok: boolean
  status: number
  engines?: { status: number }[]
}) {
  if (result.ok) return 200
  const engines = result.engines ?? []
  if (engines.length > 0 && engines.every((e) => e.status === 0)) return 503
  if (result.status === 0) return 503
  return 422
}

export async function POST(request: Request) {
  if (!(await authorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let urls = getSitemapUrls()
  try {
    const body = (await request.json().catch(() => null)) as { urls?: string[] } | null
    if (body?.urls?.length) urls = body.urls
  } catch {
    /* use default sitemap list */
  }

  const key = await checkIndexNowKeyLive()
  const result = await submitIndexNow(urls)
  const status = httpStatusForIndexNow(result)

  return NextResponse.json(
    {
      ...result,
      key: INDEXNOW_KEY,
      keyLocation: key.keyLocation,
      keyLive: key.live,
      keyHttpStatus: key.status,
      error:
        result.error ||
        (result.ok
          ? undefined
          : result.body || `IndexNow provider returned HTTP ${result.status}`),
      googleNote:
        "IndexNow notifies Bing/Yandex/Seznam/Naver. Google requires Search Console sitemap submit / URL Inspection.",
    },
    { status },
  )
}

export async function GET(request: Request) {
  if (!(await authorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const key = await checkIndexNowKeyLive()
  const urls = getSitemapUrls()
  const priorityUrls = getGscPriorityUrls()
  return NextResponse.json({
    key: INDEXNOW_KEY,
    keyLocation: key.keyLocation,
    keyLive: key.live,
    keyHttpStatus: key.status,
    urlCount: urls.length,
    sitemapUrl: `${indexNowKeyLocation().replace(`/${INDEXNOW_KEY}.txt`, "")}/sitemap.xml`,
    priorityUrls,
    skipUrls: getRedirectOnlyUrls(),
    urls,
  })
}
