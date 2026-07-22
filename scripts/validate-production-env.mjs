/** Fail production builds when public site URL still points at localhost. */
import { readFileSync, existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "frontend")

function loadEnvFile(relativePath) {
  const filePath = path.join(root, relativePath)
  if (!existsSync(filePath)) return
  for (const line of readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (!(key in process.env)) process.env[key] = value
  }
}

loadEnvFile(".env")
loadEnvFile(".env.production")
loadEnvFile(".env.production.local")
loadEnvFile(".env.local")

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? ""
const isProd =
  process.env.NODE_ENV === "production" ||
  process.env.VALIDATE_PROD_ENV === "true"

if (isProd) {
  if (!siteUrl) {
    console.error("NEXT_PUBLIC_SITE_URL is required for production builds.")
    console.error("Set it in frontend/.env.production.local — see deploy/env.production.example")
    process.exit(1)
  }
  if (/localhost|127\.0\.0\.1/i.test(siteUrl)) {
    console.error(
      "NEXT_PUBLIC_SITE_URL must be your live domain in production, not localhost.",
    )
    console.error("Example: https://leapai-webhook.bab.solutions/leap-ai")
    process.exit(1)
  }
  if (!process.env.NEXT_PUBLIC_BASE_PATH?.trim()) {
    console.warn("Warning: NEXT_PUBLIC_BASE_PATH is not set (site may be at domain root).")
  }
}
