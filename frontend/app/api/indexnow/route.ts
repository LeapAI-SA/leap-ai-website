/**
 * POST /api/indexnow — submit sitemap URLs to IndexNow (Bing / Yandex / Seznam / Naver).
 *
 * Auth (either):
 * - Admin JWT: Authorization: Bearer <dashboard token> (verified via backend /api/auth/me)
 * - Deploy secret: Authorization: Bearer $INDEXNOW_SUBMIT_SECRET or ?secret=
 */
import { NextResponse } from "next/server"
import { getApiUrl } from "@/lib/api-url"
import {
  submitIndexNow,
  INDEXNOW_KEY,
  indexNowKeyLocation,
  checkIndexNowKeyLive,
} from "@/lib/indexnow"
import { getSitemapUrls } from "@/lib/sitemap-urls"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

async function isAdminToken(token: string) {
  try {
    const res = await fetch(`${getApiUrl()}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
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
  const url = new URL(request.url)
  const querySecret = url.searchParams.get("secret")?.trim() ?? ""
  const deploySecret = process.env.INDEXNOW_SUBMIT_SECRET?.trim()

  if (deploySecret && (bearer === deploySecret || querySecret === deploySecret)) {
    return true
  }

  if (bearer && (await isAdminToken(bearer))) {
    return true
  }

  return false
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
  // Provider rejections (422, 403, etc.) — not a reverse-proxy failure
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
  return NextResponse.json({
    key: INDEXNOW_KEY,
    keyLocation: key.keyLocation,
    keyLive: key.live,
    keyHttpStatus: key.status,
    urlCount: getSitemapUrls().length,
    sitemapUrl: `${indexNowKeyLocation().replace(`/${INDEXNOW_KEY}.txt`, "")}/sitemap.xml`,
  })
}
