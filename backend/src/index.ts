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
const MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://leap:leapsecret@localhost:27017/leapai?authSource=admin"
const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379"
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:3000"

async function start() {
  await connectDB(MONGODB_URI)
  if (process.env.USE_MEMORY_DB === "true") {
    const { ensureSeeded } = await import("./ensure-seeded.js")
    await ensureSeeded()
    console.log("In-memory database seeded (admin@leapai.ai / admin123)")
  }
  try {
    await connectRedis(REDIS_URL)
  } catch (err) {
    console.warn("Redis unavailable, running without cache:", err)
  }

  const app = express()
  app.use(helmet({ contentSecurityPolicy: false }))
  app.use(
    cors({
      origin: [CORS_ORIGIN, "http://localhost:3000", "http://127.0.0.1:3000"],
      credentials: true,
    }),
  )
  app.use(express.json({ limit: "2mb" }))
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 500,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  )

  app.use("/api/auth", authRoutes)
  app.use("/api/public", publicRoutes)
  app.use("/api/admin", adminRoutes)
  app.use("/uploads", express.static(UPLOAD_DIR))

  app.get("/", (_req, res) => {
    res.json({
      service: "LeapAI CMS Backend",
      stack: ["Node.js", "Express", "MongoDB", "Redis"],
      docs: {
        health: "/api/public/health",
        settings: "/api/public/settings",
        content: "/api/public/content?type=solution",
        dashboard: "http://localhost:3000/dashboard",
      },
    })
  })

  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`)
    console.log(`Admin dashboard: http://localhost:3000/dashboard`)
  })
}

start().catch((err) => {
  console.error("Failed to start server:", err)
  process.exit(1)
})
