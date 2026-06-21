const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

export function resolveMediaUrl(path?: string): string {
  if (!path) return ""
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  if (path.startsWith("/uploads/")) return `${API_URL}${path}`
  return path
}
