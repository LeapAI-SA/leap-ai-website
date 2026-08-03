import { NextResponse, type NextRequest } from "next/server"
import { getApiUrl } from "@/lib/api-url"
import { GEO_ROOT_PATHS } from "@/lib/geo-paths"
import { resolveLegacyPath } from "@/lib/legacy-path-map"
import {
  getBasePath,
  isCanonicalSiteHost,
  isLocalDevHost,
  isProduction,
  PRODUCTION_SITE_URL,
} from "@/lib/site-url"

const BYPASS_PREFIXES = ["/_next", "/dashboard", "/api", "/uploads", "/backend", "/llms", "/ai-txt"]
const BYPASS_EXACT = [
  "/favicon.ico",
  "/icon.svg",
  "/apple-icon.png",
  "/manifest.webmanifest",
  "/maintenance",
  "/llms",
  "/llms-full",
  "/llms-small",
  "/ai-txt",
  "/robots.txt",
  "/sitemap.xml",
]

/** Paths that may stay on a non-canonical deploy host (CMS / assets). */
const NON_CANONICAL_STAY_PREFIXES = ["/_next", "/dashboard", "/api", "/uploads", "/backend"]

function redirectBarePathToBasePath(request: NextRequest) {
  const basePath = getBasePath()
  if (!basePath) return null

  const { pathname, search, basePath: requestBasePath } = request.nextUrl

  // Next.js strips basePath from pathname in middleware — do not redirect again.
  if (requestBasePath) return null

  if (pathname === basePath || pathname.startsWith(`${basePath}/`)) return null

  const skipPrefixes = ["/_next", "/backend", "/api"]
  if (skipPrefixes.some((prefix) => pathname.startsWith(prefix))) return null
  if (pathname.includes(".") && !(GEO_ROOT_PATHS as readonly string[]).includes(pathname)) return null

  const target = pathname === "/" ? basePath : `${basePath}${pathname}`
  return NextResponse.redirect(new URL(`${target}${search}`, request.url), 308)
}

function stripBasePath(pathname: string) {
  const basePath = getBasePath()
  if (basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`))) {
    return pathname.slice(basePath.length) || "/"
  }
  return pathname
}

function shouldBypass(pathname: string) {
  const path = stripBasePath(pathname)
  if (BYPASS_EXACT.includes(path)) return true
  if (path.endsWith("/robots.txt") || path.endsWith("/sitemap.xml")) return true
  if (path.includes(".well-known")) return true
  if (path.endsWith(".txt") && path.includes("llms")) return true
  return BYPASS_PREFIXES.some((prefix) => path.startsWith(prefix))
}

function shouldStayOnNonCanonicalHost(pathname: string) {
  const path = stripBasePath(pathname)
  return NON_CANONICAL_STAY_PREFIXES.some((prefix) => path.startsWith(prefix))
}

/** Send public + GEO traffic from deploy aliases (e.g. webhook) to leapai.ai. */
function redirectNonCanonicalHost(request: NextRequest) {
  if (!isProduction()) return null

  const host = request.headers.get("host")
  if (isLocalDevHost(host) || isCanonicalSiteHost(host)) return null
  if (shouldStayOnNonCanonicalHost(request.nextUrl.pathname)) return null

  const { pathname, search } = request.nextUrl
  const target = new URL(`${pathname}${search}`, PRODUCTION_SITE_URL)
  return NextResponse.redirect(target, 301)
}

function withNoIndexIfNonCanonical(request: NextRequest, response: NextResponse) {
  if (!isProduction()) return response

  const host = request.headers.get("host")
  if (isLocalDevHost(host) || isCanonicalSiteHost(host)) return response

  response.headers.set("X-Robots-Tag", "noindex, nofollow")
  return response
}

async function isMaintenanceModeEnabled() {
  try {
    const res = await fetch(`${getApiUrl()}/api/public/maintenance`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    })
    if (!res.ok) return false
    const json = (await res.json()) as { maintenanceMode?: boolean }
    return Boolean(json.maintenanceMode)
  } catch {
    // Fail open if API is temporarily unavailable.
    return false
  }
}

export async function middleware(request: NextRequest) {
  const canonicalRedirect = redirectNonCanonicalHost(request)
  if (canonicalRedirect) return canonicalRedirect

  const { pathname, searchParams } = request.nextUrl
  if (searchParams.has("s")) {
    const url = request.nextUrl.clone()
    const legacy = resolveLegacyPath(pathname)
    if (legacy) {
      url.pathname = legacy
    } else if (pathname === "/en" || pathname.startsWith("/en/")) {
      url.pathname = pathname === "/en" ? "/" : pathname.slice(3) || "/"
    }
    url.search = ""
    return withNoIndexIfNonCanonical(request, NextResponse.redirect(url, 308))
  }

  // Map legacy WordPress /en/* and old slugs to canonical destinations in one hop.
  const legacyTarget = resolveLegacyPath(pathname)
  const normalizedPath = pathname.replace(/\/+$/, "") || "/"
  if (legacyTarget && legacyTarget !== normalizedPath) {
    const url = request.nextUrl.clone()
    url.pathname = legacyTarget
    return withNoIndexIfNonCanonical(request, NextResponse.redirect(url, 308))
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone()
    url.pathname = pathname === "/en" ? "/" : pathname.slice(3) || "/"
    return withNoIndexIfNonCanonical(request, NextResponse.redirect(url, 308))
  }

  const basePathRedirect = redirectBarePathToBasePath(request)
  if (basePathRedirect) return withNoIndexIfNonCanonical(request, basePathRedirect)

  const { basePath } = request.nextUrl
  const maintenance = await isMaintenanceModeEnabled()
  const maintenancePath = `${basePath}/maintenance`
  const homePath = `${basePath}/` || "/"

  if (!maintenance && pathname === "/maintenance") {
    return withNoIndexIfNonCanonical(
      request,
      NextResponse.redirect(new URL(homePath, request.url)),
    )
  }

  if (!maintenance || shouldBypass(pathname)) {
    return withNoIndexIfNonCanonical(request, NextResponse.next())
  }

  return withNoIndexIfNonCanonical(
    request,
    NextResponse.redirect(new URL(maintenancePath, request.url)),
  )
}

export const config = {
  matcher: [
    "/((?!.*\\..*).*)",
    "/llms.txt",
    "/llms-full.txt",
    "/llms-small.txt",
    "/robots.txt",
    "/sitemap.xml",
    "/.well-known/ai.txt",
  ],
}
