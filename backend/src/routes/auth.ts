import { Router } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import rateLimit from "express-rate-limit"
import { User } from "../models/User.js"
import { requireAuth } from "../middleware/auth.js"

const router = Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again later." },
})

router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body as { email?: unknown; password?: unknown }
  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    return res.status(400).json({ error: "Email and password are required" })
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() })
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" })
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" })
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    return res.status(500).json({ error: "Server misconfigured" })
  }

  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email, role: user.role },
    secret,
    { expiresIn: "7d", algorithm: "HS256" },
  )

  res.json({
    token,
    user: { email: user.email, role: user.role },
  })
})

router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: req.user })
})

export default router
