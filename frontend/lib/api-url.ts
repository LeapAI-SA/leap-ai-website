/** Server-side uses internal Docker URL; browser uses public URL. */
export function getApiUrl() {
  if (typeof window === "undefined") {
    return process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
  }
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
}

/** Skip CMS/API fetches during `next build` — backend is not running. */
export function isBuildPhase() {
  return (
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.SKIP_CMS_FETCH === "true"
  )
}
