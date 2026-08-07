#!/usr/bin/env node
/**
 * Print webmaster-tool submission checklist + URL batch files for GSC / Bing.
 * Does not require API credentials; prepares files operators paste into consoles.
 *
 * Usage: node scripts/prepare-webmaster-submission.mjs
 */
import { writeFileSync, mkdirSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const HOST = (process.env.NEXT_PUBLIC_SITE_URL || "https://leapai.ai").replace(/\/$/, "")

async function main() {
  const res = await fetch(`${HOST}/sitemap.xml`)
  if (!res.ok) throw new Error(`sitemap HTTP ${res.status}`)
  const xml = await res.text()
  const urls = [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map((m) => m[1].trim())

  const outDir = join(__dirname, "output")
  mkdirSync(outDir, { recursive: true })

  const urlListPath = join(outDir, "sitemap-urls.txt")
  writeFileSync(urlListPath, urls.join("\n") + "\n")

  const checklist = {
    generatedAt: new Date().toISOString(),
    host: HOST,
    sitemapUrl: `${HOST}/sitemap.xml`,
    urlCount: urls.length,
    google: {
      property: HOST,
      verificationFile: `${HOST}/googled43fdb9897d9f8a7.html`,
      console: "https://search.google.com/search-console",
      steps: [
        "Confirm property https://leapai.ai is verified (HTML file already in /public)",
        `Sitemaps → submit (or re-submit): ${HOST}/sitemap.xml`,
        "URL Inspection → paste each priority URL from sitemap-urls.txt → Request indexing",
        "Do not use Removals for /en URLs that 301 to a canonical page — let redirects + sitemap clear them",
        "Use Removals only if a URL still hard-404s after deploy of legacy-redirects",
      ],
    },
    bing: {
      property: HOST,
      verificationFile: `${HOST}/BingSiteAuth.xml`,
      verificationDropIn: "frontend/public/BingSiteAuth.xml",
      verificationExample: "frontend/public/BingSiteAuth.xml.example",
      console: "https://www.bing.com/webmasters",
      indexNowKey: "a7f3c9e2b1d84f6a9c0e5b2d8f1a4c7e",
      indexNowKeyUrl: `${HOST}/a7f3c9e2b1d84f6a9c0e5b2d8f1a4c7e.txt`,
      steps: [
        "Confirm property Verified (XML method)",
        "If IndexNow returns Bing 403: URL Submission → IndexNow → Generate key → npm run seo:rotate-indexnow-key -- --key=<key>",
        `Confirm IndexNow key is live: ${HOST}/a7f3c9e2b1d84f6a9c0e5b2d8f1a4c7e.txt (exact key, no trailing newline)`,
        `Sitemaps → submit: ${HOST}/sitemap.xml`,
        "After ownership/key binding: npm run seo:submit-indexnow (or GEO → Submit sitemap)",
        "URL Submission / IndexNow dashboard → confirm accepted URL count",
      ],
    },
    urls,
  }

  writeFileSync(join(outDir, "webmaster-submission-checklist.json"), JSON.stringify(checklist, null, 2))

  // Merge IndexNow report if present
  let indexNow = null
  try {
    indexNow = JSON.parse(readFileSync(join(outDir, "indexnow-submit-report.json"), "utf8"))
  } catch {
    /* optional */
  }

  console.log(`Prepared ${urls.length} URLs → ${urlListPath}`)
  console.log(`Checklist → ${join(outDir, "webmaster-submission-checklist.json")}`)
  if (indexNow) {
    console.log(
      `IndexNow last run: status=${indexNow.indexNow?.status} ok=${indexNow.indexNow?.ok} keyLive=${indexNow.keyLive}`,
    )
  }
  console.log("\nGoogle Search Console steps:")
  for (const s of checklist.google.steps) console.log(`  • ${s}`)
  console.log("\nBing Webmaster steps:")
  for (const s of checklist.bing.steps) console.log(`  • ${s}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
