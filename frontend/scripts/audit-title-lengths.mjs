#!/usr/bin/env node
/**
 * Audit rendered <title> lengths for sitemap URLs.
 *
 * Usage:
 *   node scripts/audit-title-lengths.mjs
 *   node scripts/audit-title-lengths.mjs --host=https://leapai.ai
 *
 * Exits 0 always; prints pages shorter than 50 chars.
 */

const hostArg = process.argv.find((a) => a.startsWith('--host='))?.slice('--host='.length)
const HOST = (hostArg || process.env.NEXT_PUBLIC_SITE_URL || 'https://leapai.ai').replace(/\/$/, '')
const MIN = Number(process.env.SEO_TITLE_MIN || 50)
const MAX = Number(process.env.SEO_TITLE_MAX || 60)

function clean(s) {
  return s.replace(/\s+/g, ' ').trim()
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  return match ? clean(match[1]) : ''
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { Accept: 'text/html,application/xml;q=0.9,*/*;q=0.8' },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return await res.text()
}

async function main() {
  const sitemapUrl = `${HOST}/sitemap.xml`
  const sitemap = await fetchText(sitemapUrl)
  const urls = [...sitemap.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map((m) => m[1].trim())

  if (!urls.length) {
    console.error(`No URLs found in ${sitemapUrl}`)
    process.exit(1)
  }

  console.log(`Host: ${HOST}`)
  console.log(`Sitemap URLs: ${urls.length}`)
  console.log(`Title target: ${MIN}-${MAX} chars\n`)

  const rows = []
  for (const url of urls) {
    try {
      const html = await fetchText(url)
      const title = extractTitle(html)
      rows.push({ url, title, len: title.length, ok: title.length >= MIN && title.length <= MAX, missing: !title })
    } catch (err) {
      rows.push({ url, title: '', len: 0, ok: false, missing: true, error: err instanceof Error ? err.message : String(err) })
    }
  }

  const short = rows.filter((r) => !r.missing && r.len < MIN)
  const long = rows.filter((r) => r.len > MAX)
  const missing = rows.filter((r) => r.missing)

  console.log(`Within target: ${rows.filter((r) => r.ok).length}/${rows.length}`)
  console.log(`Short (<${MIN}): ${short.length}`)
  console.log(`Long (>${MAX}): ${long.length}`)
  console.log(`Missing title/error: ${missing.length}\n`)

  if (short.length) {
    console.log('--- Short titles ---')
    for (const r of short) console.log(`${r.len} | ${r.url} | ${r.title}`)
    console.log('')
  }

  if (long.length) {
    console.log('--- Long titles ---')
    for (const r of long) console.log(`${r.len} | ${r.url} | ${r.title}`)
    console.log('')
  }

  if (missing.length) {
    console.log('--- Missing / fetch errors ---')
    for (const r of missing) console.log(`${r.url} | ${r.error ?? 'No <title> found'}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
