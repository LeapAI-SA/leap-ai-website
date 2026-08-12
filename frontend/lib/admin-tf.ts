import type { TranslationKey } from "./translations"

/** Replace `{name}` placeholders in translated strings. */
export function tf(template: string, vars: Record<string, string | number>) {
  let out = template
  for (const [key, value] of Object.entries(vars)) {
    out = out.replaceAll(`{${key}}`, String(value))
  }
  return out
}

export type AdminT = (key: TranslationKey) => string

export function adminTf(t: AdminT, key: TranslationKey, vars: Record<string, string | number>) {
  return tf(t(key), vars)
}
