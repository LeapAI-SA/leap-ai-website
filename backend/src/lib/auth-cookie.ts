import type { Request, Response } from "express"

export const AUTH_COOKIE = "leap_admin_token"
export const MFA_CHALLENGE_COOKIE = "leap_mfa_challenge"
const MAX_AGE_SEC = 7 * 24 * 60 * 60
const MFA_MAX_AGE_SEC = 25 * 60

function cookieParts(name: string, value: string, maxAge: number) {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    `Max-Age=${maxAge}`,
    "HttpOnly",
    "SameSite=Lax",
  ]
  if (process.env.NODE_ENV === "production") parts.push("Secure")
  return parts.join("; ")
}

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
  res.append("Set-Cookie", cookieParts(AUTH_COOKIE, token, MAX_AGE_SEC))
}

export function clearAuthCookie(res: Response) {
  res.append("Set-Cookie", cookieParts(AUTH_COOKIE, "", 0))
}

export function extractMfaChallengeId(req: Request): string | null {
  const cookies = parseCookies(req.headers.cookie)
  return cookies[MFA_CHALLENGE_COOKIE]?.trim() || null
}

export function setMfaChallengeCookie(res: Response, challengeId: string) {
  res.append("Set-Cookie", cookieParts(MFA_CHALLENGE_COOKIE, challengeId, MFA_MAX_AGE_SEC))
}

export function clearMfaChallengeCookie(res: Response) {
  res.append("Set-Cookie", cookieParts(MFA_CHALLENGE_COOKIE, "", 0))
}
