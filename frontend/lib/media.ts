const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

function uploadsBase() {
  if (API_BASE.startsWith("/")) return API_BASE.replace(/\/$/, "")
  return API_BASE
}

function safeHttpUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.protocol === "https:" || parsed.protocol === "http:") return parsed.href
  } catch {
    /* invalid */
  }
  return null
}

export function resolveMediaUrl(path?: string): string {
  if (!path) return ""
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return safeHttpUrl(path) ?? ""
  }
  if (path.startsWith("/uploads/")) return `${uploadsBase()}${path}`
  if (path.startsWith("/") && !path.includes("..")) return path
  return ""
}
