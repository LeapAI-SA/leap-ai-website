import "dotenv/config"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import { connectDB } from "./config/db.js"
import { connectRedis } from "./config/redis.js"
import authRoutes from "./routes/auth.js"
import publicRoutes from "./routes/public.js"
import adminRoutes from "./routes/admin.js"
import { UPLOAD_DIR } from "./middleware/upload.js"

const PORT = Number(process.env.PORT ?? 4000)
const isProd = process.env.NODE_ENV === "production"
const strictSecrets = process.env.ENFORCE_PROD_SECRETS === "true"

function rejectInsecureDefault(name: string, value: string, insecure: string[]) {
  if (strictSecrets && insecure.includes(value)) {
    throw new Error(`${name} must be set to a secure value (ENFORCE_PROD_SECRETS is enabled)`)
  }
}

const MONGODB_URI =
  process.env.MONGODB_URI ??
  (isProd ? undefined : "mongodb://leap:leapsecret@localhost:27017/leapai?authSource=admin")
if (!MONGODB_URI) throw new Error("MONGODB_URI is required")
const mongoUri = MONGODB_URI

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379"
const corsOriginRaw = process.env.CORS_ORIGIN ?? (isProd ? undefined : "http://localhost:3000")
if (!corsOriginRaw) throw new Error("CORS_ORIGIN is required")
const corsOrigin: string = corsOriginRaw

function parseCorsOrigins(raw: string): string[] {
  return raw.split(",").map((value) => value.trim()).filter(Boolean)
}

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-jwt-secret-change-in-production"
rejectInsecureDefault("JWT_SECRET", JWT_SECRET, ["dev-jwt-secret-change-in-production"])

async function start() {
  process.env.JWT_SECRET = JWT_SECRET

  await connectDB(mongoUri)
  if (process.env.USE_MEMORY_DB === "true") {
    const { ensureSeeded } = await import("./ensure-seeded.js")
    await ensureSeeded()
    console.log("In-memory database seeded")
  }
  try {
    await connectRedis(REDIS_URL)
  } catch (err) {
    console.warn("Redis unavailable, running without cache:", err)
  }

  const app = express()
  app.set("trust proxy", 1)
  app.use(helmet({ contentSecurityPolicy: false }))

  const corsOrigins = [
    ...new Set([
      ...parseCorsOrigins(corsOrigin),
      ...(isProd
        ? []
        : [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:3000/leap-ai",
            "http://127.0.0.1:3000/leap-ai",
          ]),
    ]),
  ]

  app.use(
    cors({
      origin: corsOrigins,
      credentials: true,
    }),
  )
  app.use(express.json({ limit: "2mb" }))

  const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
  })

  app.use("/api/auth", authRoutes)
  app.use("/api/public", publicRoutes)
  app.use("/api/admin", adminLimiter, adminRoutes)

  app.use(
    "/uploads",
    (_req, res, next) => {
      res.setHeader("X-Content-Type-Options", "nosniff")
      next()
    },
    express.static(UPLOAD_DIR, {
      setHeaders(res, filePath) {
        if (/\.(jpe?g|png|gif|webp)$/i.test(filePath)) {
          res.setHeader("Content-Disposition", "inline")
        }
      },
    }),
  )

  if (!isProd) {
    app.get("/", (_req, res) => {
      res.json({
        service: "LeapAI CMS Backend",
        health: "/api/public/health",
      })
    })
  }

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err)
    const message = err instanceof Error ? err.message : "Internal server error"
    const status =
      err && typeof err === "object" && "status" in err && typeof err.status === "number"
        ? err.status
        : message.includes("allowed") || message.includes("upload")
          ? 400
          : 500
    res.status(status).json({ error: isProd && status === 500 ? "Internal server error" : message })
  })

  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`)
  })
}

start().catch((err) => {
  console.error("Failed to start server:", err)
  process.exit(1)
})
