export type SiteLang = "ar" | "en"

export const LOCALE_HEADER = "x-leap-locale"

export function stripLocalePrefix(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`
  if (normalized === "/en") return "/"
  if (normalized.startsWith("/en/")) return normalized.slice(3) || "/"
  return normalized
}

export function withLocalePrefix(path: string, lang: SiteLang): string {
  const bare = stripLocalePrefix(path)
  if (lang !== "en") return bare
  if (bare.startsWith("/dashboard") || bare.startsWith("/api")) return bare
  return bare === "/" ? "/en" : `/en${bare}`
}

export function isEnglishPath(path: string): boolean {
  return path === "/en" || path.startsWith("/en/")
}
