import { getRequestLocale } from "./locale"
import { buildPageMetadata } from "./seo"

export async function metadataWithRequestLocale(
  input: Omit<Parameters<typeof buildPageMetadata>[0], "locale">,
) {
  const locale = await getRequestLocale()
  return buildPageMetadata({ ...input, locale })
}
