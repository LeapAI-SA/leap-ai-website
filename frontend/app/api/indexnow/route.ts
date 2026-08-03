/**
 * POST /api/indexnow
 * Optional deploy hook: submit sitemap URLs to IndexNow.
 *
 * Auth: Authorization: Bearer $INDEXNOW_SUBMIT_SECRET
 * (or ?secret= when INDEXNOW_SUBMIT_SECRET is set)
 */
import { NextResponse } from "next/server"
import { submitIndexNow, INDEXNOW_KEY, indexNowKeyLocation } from "@/lib/indexnow"
import { getSitemapUrls } from "@/lib/sitemap-urls"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function authorized(request: Request) {
  const secret = process.env.INDEXNOW_SUBMIT_SECRET?.trim()
  if (!secret) return false
  const header = request.headers.get("authorization")
  if (header === `Bearer ${secret}`) return true
  const url = new URL(request.url)
  return url.searchParams.get("secret") === secret
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let urls = getSitemapUrls()
  try {
    const body = (await request.json().catch(() => null)) as { urls?: string[] } | null
    if (body?.urls?.length) urls = body.urls
  } catch {
    /* use default sitemap list */
  }

  const result = await submitIndexNow(urls)
  return NextResponse.json(
    {
      ...result,
      key: INDEXNOW_KEY,
      keyLocation: indexNowKeyLocation(),
    },
    { status: result.ok ? 200 : 502 },
  )
}

export async function GET(request: Request) {
  // Health: confirm key config without submitting
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return NextResponse.json({
    key: INDEXNOW_KEY,
    keyLocation: indexNowKeyLocation(),
    urlCount: getSitemapUrls().length,
  })
}
