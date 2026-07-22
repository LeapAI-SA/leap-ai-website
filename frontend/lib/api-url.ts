/** Server-side uses internal Docker URL; browser uses public URL or same-origin proxy. */
import { getBasePath } from "./site-url"

const LOCAL_API = "http://localhost:4000"

export function getClientApiUrl() {
  const configured = process.env.NEXT_PUBLIC_API_URL ?? LOCAL_API
  if (configured.startsWith("/")) {
    const path = configured.replace(/\/$/, "")
    const basePath = getBasePath()
    if (basePath && path === "/backend") return `${basePath}${path}`
    return path
  }
  return configured
}

export function getApiUrl() {
  if (typeof window === "undefined") {
    return (
      process.env.API_URL ??
      process.env.INTERNAL_API_URL ??
      (process.env.NEXT_PUBLIC_API_URL?.startsWith("http")
        ? process.env.NEXT_PUBLIC_API_URL
        : undefined) ??
      LOCAL_API
    )
  }
  return getClientApiUrl()
}

/** Skip CMS/API fetches during `next build` — backend is not running. */
export function isBuildPhase() {
  return (
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.SKIP_CMS_FETCH === "true"
  )
}
