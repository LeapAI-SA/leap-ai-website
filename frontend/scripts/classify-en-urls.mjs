#!/usr/bin/env node
/**
 * Classify known legacy /en URLs: mapped_ok | soft_404 | wp_html | home_redirect
 *
 * Usage:
 *   node scripts/classify-en-urls.mjs
 *   node scripts/classify-en-urls.mjs --host https://leapai.ai
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import {
  LEGACY_SLUG_TO_PATH,
  SOLUTION_GROUP_PATH_REDIRECTS,
  resolveLegacyPath,
} from "../lib/legacy-redirects.mjs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const hostArg = process.argv.find((a) => a.startsWith("--host="))?.slice("--host=".length)
const HOST = (hostArg || process.env.NEXT_PUBLIC_SITE_URL || "https://leapai.ai").replace(/\/$/, "")
const live = process.argv.includes("--live")

const EXTRA_BING_SLUGS = [
  "growth-hacking",
  "r24",
  "whatsapp-business",
  "leap-ticketing",
  "quality-management-qm-solutions",
  "customer-relationship-management-crm-system",
  "multichannel-contact-centers",
  "omni-channel-contact-center",
  "about-us",
  "contact-us",
  "become-a-partner",
  "business-messaging",
  "ai-chatbot",
  "ai-marketing",
  "rich-business-messaging",
]

/** Bing sitelink paths to verify (hub pages + solution group paths). */
const EXTRA_BING_PATHS = [
  "/en/about-us/",
  "/en/use-cases",
  "/en/use-cases/",
  ...Object.keys(SOLUTION_GROUP_PATH_REDIRECTS),
  ...Object.keys(SOLUTION_GROUP_PATH_REDIRECTS).map((p) => `${p}/`),
  ...Object.keys(SOLUTION_GROUP_PATH_REDIRECTS).map((p) => `/en${p}`),
  ...Object.keys(SOLUTION_GROUP_PATH_REDIRECTS).map((p) => `/en${p}/`),
]

function seedPaths() {
  const paths = new Set()
  for (const slug of Object.keys(LEGACY_SLUG_TO_PATH)) {
    paths.add(`/en/${slug}`)
    paths.add(`/en/${slug}/`)
  }
  for (const slug of EXTRA_BING_SLUGS) {
    paths.add(`/en/${slug}`)
    paths.add(`/en/${slug}/`)
  }
  for (const path of EXTRA_BING_PATHS) {
    paths.add(path)
  }
  try {
    const mapPath = join(__dirname, "../../scripts/page-image-map.json")
    const map = JSON.parse(readFileSync(mapPath, "utf8"))
    for (const url of Object.values(map)) {
      try {
        const u = new URL(String(url))
        if (u.pathname.includes("/en/") || u.pathname === "/en") {
          paths.add(u.pathname.replace(/\/+$/, "") || "/en")
          paths.add((u.pathname.replace(/\/+$/, "") || "/en") + "/")
        }
      } catch {
        /* skip */
      }
    }
  } catch {
    /* optional */
  }
  return [...paths].sort()
}

async function followLive(startUrl, maxHops = 8) {
  let url = startUrl
  const chain = []
  for (let i = 0; i < maxHops; i++) {
    const res = await fetch(url, { method: "GET", redirect: "manual" })
    const loc = res.headers.get("location")
    chain.push({ url, status: res.status, location: loc })
    if (res.status >= 300 && res.status < 400 && loc) {
      url = new URL(loc, url).href
      continue
    }
    const body = res.status === 200 ? (await res.text()).slice(0, 4000) : ""
    const wp = /wp-content|wp-includes|generator" content="WordPress/i.test(body)
    return { finalUrl: url, finalStatus: res.status, chain, wp }
  }
  return { finalUrl: url, finalStatus: chain.at(-1)?.status ?? 0, chain, wp: false }
}

function classifyLocal(path) {
  const resolved = resolveLegacyPath(path)
  const expect = resolved || path
  if (resolved === "/") {
    return { class: "home_redirect", expectPath: "/" }
  }
  if (resolved && resolved !== path.replace(/\/+$/, "")) {
    const isMappedSlug = Boolean(LEGACY_SLUG_TO_PATH[path.replace(/^\/en\/?/, "").replace(/\/$/, "")])
    return {
      class: isMappedSlug || expect.startsWith("/solutions") || expect.startsWith("/products") || expect.startsWith("/use-cases") || expect !== "/"
        ? "mapped_ok"
        : "home_redirect",
      expectPath: expect,
    }
  }
  return { class: "soft_404", expectPath: expect }
}

async function main() {
  const paths = seedPaths()
  console.log(`Classifying ${paths.length} /en paths (host=${HOST}, live=${live})`)

  const rows = []
  for (const path of paths) {
    const local = classifyLocal(path)
    let liveInfo = null
    if (live) {
      liveInfo = await followLive(`${HOST}${path}`)
      await new Promise((r) => setTimeout(r, 150))
    }

    let cls = local.class
    if (liveInfo?.wp) cls = "wp_html"
    else if (liveInfo && liveInfo.finalStatus === 404) cls = "soft_404"
    else if (liveInfo && liveInfo.finalStatus === 200) cls = "mapped_ok"

    rows.push({
      path,
      class: cls,
      expectPath: local.expectPath,
      resolved: resolveLegacyPath(path),
      live: liveInfo
        ? {
            finalStatus: liveInfo.finalStatus,
            finalUrl: liveInfo.finalUrl,
            hops: liveInfo.chain.length,
            wp: liveInfo.wp,
          }
        : null,
    })
    console.log(`${cls.padEnd(14)} ${path} → ${local.expectPath}`)
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    host: HOST,
    live,
    total: rows.length,
    mapped_ok: rows.filter((r) => r.class === "mapped_ok").length,
    home_redirect: rows.filter((r) => r.class === "home_redirect").length,
    soft_404: rows.filter((r) => r.class === "soft_404").length,
    wp_html: rows.filter((r) => r.class === "wp_html").length,
  }

  const outDir = join(__dirname, "output")
  mkdirSync(outDir, { recursive: true })
  const outPath = join(outDir, "en-url-classification.json")
  writeFileSync(outPath, JSON.stringify({ summary, rows }, null, 2))
  console.log(`\nWrote ${outPath}`)
  console.log(JSON.stringify(summary, null, 2))

  if (summary.soft_404 > 0 || summary.wp_html > 0) {
    console.warn("\nFix soft_404 via LEGACY_SLUG_TO_PATH; kill wp_html with deploy/kill-wordpress-en.sh")
    if (live) process.exitCode = 1
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
