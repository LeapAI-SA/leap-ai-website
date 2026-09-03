import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { extractAuthToken } from "../lib/auth-cookie.js"

export type AuthUser = {
  userId: string
  email: string
  role: string
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}

const JWT_OPTIONS: jwt.VerifyOptions = { algorithms: ["HS256"] }

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = extractAuthToken(req)
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    return res.status(500).json({ error: "Server misconfigured" })
  }

  try {
    req.user = jwt.verify(token, secret, JWT_OPTIONS) as AuthUser
    next()
  } catch {
    return res.status(401).json({ error: "Invalid token" })
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" })
  }
  next()
}
