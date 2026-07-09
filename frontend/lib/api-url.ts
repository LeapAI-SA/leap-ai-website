/** Server-side uses internal Docker URL; browser uses public URL or same-origin proxy. */
export function getClientApiUrl() {
  const configured = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
  if (configured.startsWith("/")) {
    return configured.replace(/\/$/, "")
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
      "http://localhost:4000"
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
