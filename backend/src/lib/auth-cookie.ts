import type { Request, Response } from "express"

export const AUTH_COOKIE = "leap_admin_token"
const MAX_AGE_SEC = 7 * 24 * 60 * 60

export function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {}
  const out: Record<string, string> = {}
  for (const part of header.split(";")) {
    const idx = part.indexOf("=")
    if (idx === -1) continue
    const key = part.slice(0, idx).trim()
    const value = part.slice(idx + 1).trim()
    if (key) out[key] = decodeURIComponent(value)
  }
  return out
}

export function extractAuthToken(req: Request): string | null {
  const header = req.headers.authorization
  if (header?.startsWith("Bearer ")) {
    const bearer = header.slice(7).trim()
    if (bearer) return bearer
  }
  const cookies = parseCookies(req.headers.cookie)
  return cookies[AUTH_COOKIE]?.trim() || null
}

export function setAuthCookie(res: Response, token: string) {
  const isProd = process.env.NODE_ENV === "production"
  const parts = [
    `${AUTH_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    `Max-Age=${MAX_AGE_SEC}`,
    "HttpOnly",
    "SameSite=Lax",
  ]
  if (isProd) parts.push("Secure")
  res.setHeader("Set-Cookie", parts.join("; "))
}

export function clearAuthCookie(res: Response) {
  const isProd = process.env.NODE_ENV === "production"
  const parts = [`${AUTH_COOKIE}=`, "Path=/", "Max-Age=0", "HttpOnly", "SameSite=Lax"]
  if (isProd) parts.push("Secure")
  res.setHeader("Set-Cookie", parts.join("; "))
}
