#!/usr/bin/env node
/**
 * Submit all sitemap URLs to IndexNow (Bing / Yandex / Seznam / Naver).
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs
 *   node scripts/submit-indexnow.mjs --host https://leapai.ai
 *
 * Google does not use IndexNow — submit the sitemap in Google Search Console:
 *   https://search.google.com/search-console → Sitemaps → https://leapai.ai/sitemap.xml
 *
 * Bing Webmaster (also receives IndexNow):
 *   https://www.bing.com/webmasters → Sitemaps → submit same URL
 */

import { writeFileSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const INDEXNOW_KEY = process.env.INDEXNOW_KEY?.trim() || "a7f3c9e2b1d84f6a9c0e5b2d8f1a4c7e"
const hostArg = process.argv.find((a) => a.startsWith("--host="))?.slice("--host=".length)
const HOST = (hostArg || process.env.NEXT_PUBLIC_SITE_URL || "https://leapai.ai").replace(/\/$/, "")

async function fetchSitemapUrls(host) {
  const res = await fetch(`${host}/sitemap.xml`, {
    headers: { Accept: "application/xml,text/xml,*/*" },
  })
  if (!res.ok) throw new Error(`Failed to fetch sitemap: HTTP ${res.status}`)
  const xml = await res.text()
  const urls = [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map((m) => m[1].trim())
  if (!urls.length) throw new Error("No <loc> entries found in sitemap.xml")
  return urls
}

async function ensureKeyLive(host, key) {
  const keyUrl = `${host}/${key}.txt`
  const res = await fetch(keyUrl)
  const text = (await res.text()).trim()
  return { keyUrl, ok: res.ok && text === key, status: res.status, text: text.slice(0, 80) }
}

async function submitToEndpoint(url, payload) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    })
    const body = await res.text().catch(() => "")
    return { endpoint: url, status: res.status, ok: res.status === 200 || res.status === 202, body }
  } catch (err) {
    return {
      endpoint: url,
      status: 0,
      ok: false,
      body: err instanceof Error ? err.message : "network error",
    }
  }
}

async function submitIndexNow(host, key, urlList) {
  const payload = {
    host: new URL(host).host,
    key,
    keyLocation: `${host}/${key}.txt`,
    urlList,
  }
  const engines = await Promise.all([
    submitToEndpoint("https://api.indexnow.org/indexnow", payload),
    submitToEndpoint("https://yandex.com/indexnow", payload),
  ])
  const ok = engines.some((e) => e.ok)
  const primary = engines.find((e) => e.ok) ?? engines[0]
  return { status: primary.status, ok, body: primary.body, payload, engines }
}

async function main() {
  console.log(`Host: ${HOST}`)
  console.log(`Key:  ${INDEXNOW_KEY}`)

  const keyCheck = await ensureKeyLive(HOST, INDEXNOW_KEY)
  console.log(`Key file: ${keyCheck.keyUrl} → HTTP ${keyCheck.status} live=${keyCheck.ok}`)
  if (!keyCheck.ok) {
    console.warn(
      "IndexNow key file is not live on the host yet. Deploy public/" +
        INDEXNOW_KEY +
        ".txt first, then re-run this script.",
    )
  }

  const urls = await fetchSitemapUrls(HOST)
  console.log(`Sitemap URLs: ${urls.length}`)

  const result = await submitIndexNow(HOST, INDEXNOW_KEY, urls)
  for (const e of result.engines) {
    console.log(`  ${e.endpoint} → HTTP ${e.status} ok=${e.ok}${e.body ? ` ${e.body.slice(0, 120)}` : ""}`)
  }
  console.log(`IndexNow overall: status=${result.status} ok=${result.ok}`)
  const bing = result.engines.find((e) => e.endpoint.includes("indexnow.org"))
  if (bing && !bing.ok && /UserForbiddedToAccessSite|unauthorized to access the site/i.test(bing.body || "")) {
    console.warn(
      "\nBing rejected ownership (UserForbiddedToAccessSite). Yandex may still accept.\n" +
        "1) https://www.bing.com/webmasters → confirm https://leapai.ai is Verified\n" +
        "2) URL Submission → IndexNow → Generate API key\n" +
        "3) node scripts/rotate-indexnow-key.mjs --key=<bing-key>\n" +
        "4) Deploy → re-run this script / GEO Submit\n",
    )
  }

  const outDir = join(__dirname, "output")
  mkdirSync(outDir, { recursive: true })
  const report = {
    generatedAt: new Date().toISOString(),
    host: HOST,
    keyLive: keyCheck.ok,
    indexNow: {
      status: result.status,
      ok: result.ok,
      body: result.body,
      submitted: urls.length,
      engines: result.engines,
    },
    googleSearchConsole: {
      action: "manual",
      sitemapUrl: `${HOST}/sitemap.xml`,
      consoleUrl: "https://search.google.com/search-console",
      steps: [
        "Open Google Search Console property for https://leapai.ai",
        "Sitemaps → Add new sitemap → sitemap.xml",
        "URL Inspection → request indexing for priority pages after redirects deploy",
      ],
    },
    bingWebmaster: {
      action: "indexnow+manual",
      sitemapUrl: `${HOST}/sitemap.xml`,
      consoleUrl: "https://www.bing.com/webmasters",
      steps: [
        "Confirm property Verified (XML method)",
        "URL Submission → IndexNow → Generate key if Bing returns 403",
        "Also submit sitemap.xml under Bing Webmaster → Sitemaps",
      ],
    },
    urls,
  }
  const outPath = join(outDir, "indexnow-submit-report.json")
  writeFileSync(outPath, JSON.stringify(report, null, 2))
  console.log(`Wrote ${outPath}`)

  console.log("\n--- Google Search Console (required; IndexNow does not cover Google) ---")
  for (const step of report.googleSearchConsole.steps) console.log(`  • ${step}`)
  console.log("\n--- Bing Webmaster ---")
  for (const step of report.bingWebmaster.steps) console.log(`  • ${step}`)

  if (!result.ok && !keyCheck.ok) process.exitCode = 2
  else if (!result.ok) process.exitCode = 1
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
