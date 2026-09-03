import { Router } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import rateLimit from "express-rate-limit"
import { createHmac, randomInt, randomUUID, timingSafeEqual } from "node:crypto"
import { User } from "../models/User.js"
import { MfaChallenge } from "../models/MfaChallenge.js"
import { requireAuth } from "../middleware/auth.js"
import {
  clearAuthCookie,
  clearMfaChallengeCookie,
  extractMfaChallengeId,
  setAuthCookie,
  setMfaChallengeCookie,
} from "../lib/auth-cookie.js"
import { sendAdminMfaCodeEmail } from "../lib/mail.js"

const router = Router()
const MFA_EXPIRES_MINUTES = 25
const MFA_EXPIRES_MS = MFA_EXPIRES_MINUTES * 60 * 1000
const MFA_RESEND_COOLDOWN_MS = 60 * 1000
const MFA_MAX_ATTEMPTS = 5

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again later." },
})

const mfaVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many verification attempts. Try again later." },
})

const mfaResendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many code requests. Try again later." },
})

function generateMfaCode() {
  return randomInt(0, 1_000_000).toString().padStart(6, "0")
}

function hashMfaCode(challengeId: string, code: string) {
  const secret = process.env.MFA_CODE_SECRET?.trim() || process.env.JWT_SECRET?.trim()
  if (!secret) throw new Error("Server misconfigured")
  return createHmac("sha256", secret).update(`${challengeId}:${code}`).digest("hex")
}

function codeMatches(expectedHash: string, challengeId: string, code: string) {
  const actual = Buffer.from(hashMfaCode(challengeId, code), "hex")
  const expected = Buffer.from(expectedHash, "hex")
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

function maskEmail(email: string) {
  const [local, domain] = email.split("@")
  if (!domain) return "***"
  const visible = local.slice(0, Math.min(2, local.length))
  return `${visible}${"*".repeat(Math.max(3, local.length - visible.length))}@${domain}`
}

function issueAdminSession(
  res: Parameters<typeof setAuthCookie>[0],
  user: { _id: { toString(): string }; email: string; role: string },
) {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error("Server misconfigured")
  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email, role: user.role, mfaVerified: true },
    secret,
    { expiresIn: "7d", algorithm: "HS256" },
  )
  setAuthCookie(res, token)
}

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

  const challengeId = randomUUID()
  const code = generateMfaCode()
  const now = new Date()
  await MfaChallenge.deleteMany({
    userId: user._id,
    $or: [{ consumedAt: { $ne: null } }, { expiresAt: { $lte: now } }],
  })
  const challenge = await MfaChallenge.create({
    challengeId,
    userId: user._id,
    codeHash: hashMfaCode(challengeId, code),
    sentAt: now,
    expiresAt: new Date(now.getTime() + MFA_EXPIRES_MS),
  })

  try {
    await sendAdminMfaCodeEmail({ email: user.email, code, expiresInMinutes: MFA_EXPIRES_MINUTES })
  } catch (error) {
    await MfaChallenge.deleteOne({ _id: challenge._id })
    console.error("Admin MFA email failed:", error)
    return res.status(503).json({ error: "Verification service unavailable. Try again later." })
  }

  const staleActive = await MfaChallenge.find({ userId: user._id, consumedAt: null })
    .sort({ createdAt: -1 })
    .skip(3)
    .select("_id")
  if (staleActive.length > 0) {
    await MfaChallenge.deleteMany({ _id: { $in: staleActive.map((item) => item._id) } })
  }

  setMfaChallengeCookie(res, challengeId)
  res.json({
    mfaRequired: true,
    maskedEmail: maskEmail(user.email),
    expiresIn: MFA_EXPIRES_MS / 1000,
    resendAfter: MFA_RESEND_COOLDOWN_MS / 1000,
  })
})

router.get("/mfa/status", async (req, res) => {
  const challengeId = extractMfaChallengeId(req)
  if (!challengeId) {
    return res.status(401).json({ error: "No active verification challenge" })
  }

  const challenge = await MfaChallenge.findOne({ challengeId, consumedAt: null })
  const now = Date.now()
  if (!challenge || challenge.expiresAt.getTime() <= now || challenge.attempts >= MFA_MAX_ATTEMPTS) {
    clearMfaChallengeCookie(res)
    return res.status(401).json({ error: "No active verification challenge" })
  }

  const user = await User.findById(challenge.userId).select("email")
  if (!user) {
    clearMfaChallengeCookie(res)
    return res.status(401).json({ error: "No active verification challenge" })
  }

  res.json({
    active: true,
    maskedEmail: maskEmail(user.email),
    expiresIn: Math.max(0, Math.ceil((challenge.expiresAt.getTime() - now) / 1000)),
    resendAfter: Math.max(0, Math.ceil((MFA_RESEND_COOLDOWN_MS - (now - challenge.sentAt.getTime())) / 1000)),
    attemptsRemaining: Math.max(0, MFA_MAX_ATTEMPTS - challenge.attempts),
  })
})

router.post("/mfa/verify", mfaVerifyLimiter, async (req, res) => {
  const challengeId = extractMfaChallengeId(req)
  const { code } = req.body as { code?: unknown }
  if (!challengeId || typeof code !== "string" || !/^\d{6}$/.test(code)) {
    return res.status(400).json({ error: "Invalid or expired verification code" })
  }

  const challenge = await MfaChallenge.findOne({ challengeId, consumedAt: null })
  const invalid =
    !challenge ||
    challenge.expiresAt.getTime() <= Date.now() ||
    challenge.attempts >= MFA_MAX_ATTEMPTS
  if (invalid) {
    clearMfaChallengeCookie(res)
    return res.status(401).json({ error: "Invalid or expired verification code" })
  }

  if (!codeMatches(challenge.codeHash, challengeId, code)) {
    challenge.attempts += 1
    if (challenge.attempts >= MFA_MAX_ATTEMPTS) {
      challenge.consumedAt = new Date()
      clearMfaChallengeCookie(res)
    }
    await challenge.save()
    return res.status(401).json({
      error: "Invalid or expired verification code",
      attemptsRemaining: Math.max(0, MFA_MAX_ATTEMPTS - challenge.attempts),
    })
  }

  const consumed = await MfaChallenge.findOneAndUpdate(
    { _id: challenge._id, consumedAt: null, attempts: { $lt: MFA_MAX_ATTEMPTS }, expiresAt: { $gt: new Date() } },
    { $set: { consumedAt: new Date() } },
    { new: true },
  )
  if (!consumed) {
    return res.status(401).json({ error: "Invalid or expired verification code" })
  }

  const user = await User.findById(consumed.userId)
  if (!user) {
    return res.status(401).json({ error: "Invalid or expired verification code" })
  }
  user.lastMfaAt = new Date()
  await user.save()
  await MfaChallenge.deleteMany({ userId: user._id })
  clearMfaChallengeCookie(res)
  issueAdminSession(res, user)
  res.json({ user: { email: user.email, role: user.role } })
})

router.post("/mfa/resend", mfaResendLimiter, async (req, res) => {
  const challengeId = extractMfaChallengeId(req)
  if (!challengeId) {
    return res.status(400).json({ error: "Invalid or expired verification challenge" })
  }

  const challenge = await MfaChallenge.findOne({ challengeId, consumedAt: null })
  if (!challenge || challenge.expiresAt.getTime() <= Date.now() || challenge.attempts >= MFA_MAX_ATTEMPTS) {
    clearMfaChallengeCookie(res)
    return res.status(401).json({ error: "Invalid or expired verification challenge" })
  }

  const elapsed = Date.now() - challenge.sentAt.getTime()
  if (elapsed < MFA_RESEND_COOLDOWN_MS) {
    return res.status(429).json({
      error: "Please wait before requesting another code",
      retryAfter: Math.ceil((MFA_RESEND_COOLDOWN_MS - elapsed) / 1000),
    })
  }

  const user = await User.findById(challenge.userId)
  if (!user) {
    return res.status(401).json({ error: "Invalid or expired verification challenge" })
  }

  const code = generateMfaCode()
  const now = new Date()
  try {
    await sendAdminMfaCodeEmail({ email: user.email, code, expiresInMinutes: MFA_EXPIRES_MINUTES })
  } catch (error) {
    console.error("Admin MFA resend failed:", error)
    return res.status(503).json({ error: "Verification service unavailable. Try again later." })
  }

  challenge.codeHash = hashMfaCode(challengeId, code)
  challenge.attempts = 0
  challenge.sentAt = now
  challenge.expiresAt = new Date(now.getTime() + MFA_EXPIRES_MS)
  await challenge.save()

  res.json({
    ok: true,
    maskedEmail: maskEmail(user.email),
    expiresIn: MFA_EXPIRES_MS / 1000,
    resendAfter: MFA_RESEND_COOLDOWN_MS / 1000,
  })
})

router.post("/mfa/cancel", async (req, res) => {
  const challengeId = extractMfaChallengeId(req)
  if (challengeId) {
    await MfaChallenge.deleteOne({ challengeId })
  }
  clearMfaChallengeCookie(res)
  res.json({ ok: true })
})

router.post("/logout", (_req, res) => {
  clearAuthCookie(res)
  clearMfaChallengeCookie(res)
  res.json({ ok: true })
})

router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: req.user })
})

export default router
