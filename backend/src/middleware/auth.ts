import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

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

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const token = header.slice(7)
  const secret = process.env.JWT_SECRET
  if (!secret) {
    return res.status(500).json({ error: "Server misconfigured" })
  }

  try {
    req.user = jwt.verify(token, secret) as AuthUser
    next()
  } catch {
    return res.status(401).json({ error: "Invalid token" })
  }
}
