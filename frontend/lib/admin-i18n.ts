import type { Lang } from "./i18n"

export function mapAdminError(lang: Lang, raw: string, fallbackText: string): string {
  const message = (raw || "").toLowerCase()
  if (message.includes("unauthorized") || message.includes("token")) {
    return lang === "ar" ? "انتهت الجلسة. سجل الدخول مرة أخرى." : "Session expired. Sign in again."
  }
  if (message.includes("network") || message.includes("failed to fetch")) {
    return lang === "ar" ? "تعذر الاتصال بالخادم. تحقق من الشبكة." : "Could not reach the server. Check your network."
  }
  return raw || fallbackText
}

export function adminLocale(lang: Lang): string {
  return lang === "ar" ? "ar-SA" : "en-US"
}
