import { NextResponse, type NextRequest } from "next/server"
import { getApiUrl } from "@/lib/api-url"
import { getBasePath } from "@/lib/site-url"

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

function redirectBarePathToBasePath(request: NextRequest) {
  const basePath = getBasePath()
  if (!basePath) return null

  const { pathname, search, basePath: requestBasePath } = request.nextUrl

  // Next.js strips basePath from pathname in middleware — do not redirect again.
  if (requestBasePath) return null

  if (pathname === basePath || pathname.startsWith(`${basePath}/`)) return null

  const skipPrefixes = ["/_next", "/backend", "/api"]
  if (skipPrefixes.some((prefix) => pathname.startsWith(prefix))) return null
  if (pathname.includes(".")) return null

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
  const basePathRedirect = redirectBarePathToBasePath(request)
  if (basePathRedirect) return basePathRedirect

  const { pathname, basePath } = request.nextUrl
  const maintenance = await isMaintenanceModeEnabled()
  const maintenancePath = `${basePath}/maintenance`
  const homePath = `${basePath}/` || "/"

  if (!maintenance && pathname === "/maintenance") {
    return NextResponse.redirect(new URL(homePath, request.url))
  }

  if (!maintenance || shouldBypass(pathname)) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL(maintenancePath, request.url))
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"],
}

