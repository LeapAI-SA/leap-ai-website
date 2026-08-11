import { headers } from "next/headers"
import { LOCALE_HEADER, type SiteLang } from "./locale-path"

export type { SiteLang } from "./locale-path"
export { LOCALE_HEADER, stripLocalePrefix, withLocalePrefix, isEnglishPath } from "./locale-path"

export async function getRequestLocale(): Promise<SiteLang> {
  try {
    const headerList = await headers()
    return headerList.get(LOCALE_HEADER) === "en" ? "en" : "ar"
  } catch {
    return "ar"
  }
}
