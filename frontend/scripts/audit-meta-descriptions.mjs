#!/usr/bin/env node
/**
 * Audit rendered meta descriptions for sitemap HTML URLs.
 *
 * Usage:
 *   node scripts/audit-meta-descriptions.mjs
 *   node scripts/audit-meta-descriptions.mjs --host=https://leapai.ai
 *
 * Exits 1 if any HTML page is missing a description, is outside 150–160 chars,
 * or shares a description with another URL.
 */

const hostArg = process.argv.find((a) => a.startsWith("--host="))?.slice("--host=".length)
const HOST = (hostArg || process.env.NEXT_PUBLIC_SITE_URL || "https://leapai.ai").replace(/\/$/, "")
const MIN = Number(process.env.SEO_DESC_MIN || 150)
const MAX = Number(process.env.SEO_DESC_MAX || 160)

function clean(s) {
  return s.replace(/\s+/g, " ").trim()
}

function decode(s) {
  return clean(
    s
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">"),
  )
}

function extractDescription(html) {
  const match =
    html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
    html.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i)
  return match ? decode(match[1]) : ""
}

function isHtmlUrl(url) {
  try {
    const path = new URL(url).pathname
    return !path.endsWith(".txt") && !path.endsWith(".xml")
  } catch {
    return !url.endsWith(".txt") && !url.endsWith(".xml")
  }
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { Accept: "text/html,application/xml;q=0.9,*/*;q=0.8" },
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.text()
}

async function main() {
  const sitemapUrl = `${HOST}/sitemap.xml`
  const sitemap = await fetchText(sitemapUrl)
  const urls = [...sitemap.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)]
    .map((m) => m[1].trim())
    .filter(isHtmlUrl)

  if (!urls.length) {
    console.error(`No HTML URLs found in ${sitemapUrl}`)
    process.exit(1)
  }

  console.log(`Host: ${HOST}`)
  console.log(`HTML sitemap URLs: ${urls.length}`)
  console.log(`Description target: ${MIN}-${MAX} chars\n`)

  const rows = []
  for (const url of urls) {
    try {
      const html = await fetchText(url)
      const description = extractDescription(html)
      rows.push({
        url,
        description,
        len: description.length,
        ok: description.length >= MIN && description.length <= MAX,
        missing: !description,
      })
    } catch (err) {
      rows.push({
        url,
        description: "",
        len: 0,
        ok: false,
        missing: true,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  const short = rows.filter((r) => !r.missing && r.len < MIN)
  const long = rows.filter((r) => r.len > MAX)
  const missing = rows.filter((r) => r.missing)
  const groups = new Map()
  for (const r of rows) {
    if (!r.description) continue
    const list = groups.get(r.description) ?? []
    list.push(r.url)
    groups.set(r.description, list)
  }
  const duplicates = [...groups.entries()].filter(([, list]) => list.length > 1)

  console.log(`Within target: ${rows.filter((r) => r.ok).length}/${rows.length}`)
  console.log(`Short (<${MIN}): ${short.length}`)
  console.log(`Long (>${MAX}): ${long.length}`)
  console.log(`Missing description/error: ${missing.length}`)
  console.log(`Duplicate description groups: ${duplicates.length}\n`)

  if (short.length) {
    console.log("--- Short descriptions ---")
    for (const r of short) console.log(`${r.len} | ${r.url} | ${r.description}`)
    console.log("")
  }

  if (long.length) {
    console.log("--- Long descriptions ---")
    for (const r of long) console.log(`${r.len} | ${r.url} | ${r.description}`)
    console.log("")
  }

  if (missing.length) {
    console.log("--- Missing / fetch errors ---")
    for (const r of missing) console.log(`${r.url} | ${r.error ?? "No meta description found"}`)
    console.log("")
  }

  if (duplicates.length) {
    console.log("--- Duplicate description groups ---")
    for (const [description, list] of duplicates) {
      console.log(`${list.length} URLs share: ${description}`)
      for (const url of list) console.log(`  ${url}`)
      console.log("")
    }
  }

  if (short.length || long.length || missing.length || duplicates.length) {
    process.exit(1)
  }

  console.log("All HTML pages have unique meta descriptions in the 150–160 character band.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
