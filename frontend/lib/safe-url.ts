/** Allow only http(s) links — blocks javascript:, data:, etc. */
export function safeHttpUrl(url: string | undefined | null): string | null {
  if (!url?.trim()) return null
  try {
    const parsed = new URL(url.trim())
    if (parsed.protocol === "https:" || parsed.protocol === "http:") return parsed.href
  } catch {
    /* invalid */
  }
  return null
}

/** Alias used by social / CTA links. */
export const safeExternalUrl = safeHttpUrl
