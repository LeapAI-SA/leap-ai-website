import { NextResponse, type NextRequest } from "next/server"
import { getApiUrl } from "@/lib/api-url"

const BYPASS_PREFIXES = ["/_next", "/dashboard", "/api", "/uploads"]
const BYPASS_EXACT = ["/favicon.ico", "/icon.svg", "/apple-icon.png", "/manifest.webmanifest", "/maintenance"]

function shouldBypass(pathname: string) {
  if (BYPASS_EXACT.includes(pathname)) return true
  return BYPASS_PREFIXES.some((prefix) => pathname.startsWith(prefix))
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
  const { pathname } = request.nextUrl
  const maintenance = await isMaintenanceModeEnabled()

  if (!maintenance && pathname === "/maintenance") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (!maintenance || shouldBypass(pathname)) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL("/maintenance", request.url))
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"],
}

