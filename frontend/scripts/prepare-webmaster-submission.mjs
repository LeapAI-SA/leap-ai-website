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
import {
  filterIndexableUrls,
  getFallbackSitemapUrls,
  getGscPriorityUrls,
} from "./indexable-urls.mjs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const HOST = (process.env.NEXT_PUBLIC_SITE_URL || "https://leapai.ai").replace(/\/$/, "")

async function loadUrls(host) {
  try {
    const res = await fetch(`${host}/sitemap.xml`)
    if (!res.ok) throw new Error(`sitemap HTTP ${res.status}`)
    const xml = await res.text()
    const urls = [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map((m) => m[1].trim())
    if (!urls.length) throw new Error("empty sitemap")
    return { urls: filterIndexableUrls(host, urls), source: "live" }
  } catch (err) {
    console.warn(`Live sitemap unavailable (${err instanceof Error ? err.message : err}). Using fallback list.`)
    return { urls: getFallbackSitemapUrls(host), source: "fallback" }
  }
}

async function main() {
  const { urls, source } = await loadUrls(HOST)
  const priority = getGscPriorityUrls(HOST)

  const outDir = join(__dirname, "output")
  mkdirSync(outDir, { recursive: true })

  const urlListPath = join(outDir, "sitemap-urls.txt")
  const priorityPath = join(outDir, "gsc-priority-urls.txt")
  writeFileSync(urlListPath, urls.join("\n") + "\n")
  writeFileSync(priorityPath, priority.join("\n") + "\n")

  const checklist = {
    generatedAt: new Date().toISOString(),
    host: HOST,
    sitemapUrl: `${HOST}/sitemap.xml`,
    sitemapSource: source,
    urlCount: urls.length,
    skipped308: [
      `${HOST}/resources/leap-ai-saudi-ai-native-cx-platform`,
      `${HOST}/en/resources/leap-ai-saudi-ai-native-cx-platform`,
    ],
    google: {
      property: HOST,
      verificationFile: `${HOST}/googled43fdb9897d9f8a7.html`,
      console: "https://search.google.com/search-console",
      priorityUrls: priority,
      steps: [
        "Confirm property https://leapai.ai is verified (HTML file already in /public)",
        `Sitemaps → submit (or re-submit): ${HOST}/sitemap.xml (when HTTP 200)`,
        "URL Inspection → Request indexing for each URL in gsc-priority-urls.txt first",
        "Do not request indexing for 308 /resources/leap-ai-saudi-ai-native-cx-platform — use dated /news/ URL",
        "Then paste remaining URLs from sitemap-urls.txt → Request indexing",
        "Do not use Removals for /en or /en/about-us",
      ],
    },
    bing: {
      property: HOST,
      verificationFile: `${HOST}/BingSiteAuth.xml`,
      verificationDropIn: "frontend/public/BingSiteAuth.xml",
      verificationExample: "frontend/public/BingSiteAuth.xml.example",
      console: "https://www.bing.com/webmasters",
      indexNowKey: "a0d1d00c073c48c2b85694d1a36ccfbf",
      indexNowKeyUrl: `${HOST}/a0d1d00c073c48c2b85694d1a36ccfbf.txt`,
      steps: [
        "Confirm property Verified (XML method)",
        "If IndexNow returns Bing 403: URL Submission → IndexNow → Generate key → npm run seo:rotate-indexnow-key -- --key=<key>",
        `Confirm IndexNow key is live: ${HOST}/a0d1d00c073c48c2b85694d1a36ccfbf.txt (exact key, no trailing newline)`,
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

  console.log(`Prepared ${urls.length} URLs (${source}) → ${urlListPath}`)
  console.log(`GSC priority (${priority.length}) → ${priorityPath}`)
  console.log(`Checklist → ${join(outDir, "webmaster-submission-checklist.json")}`)
  console.log("\nGSC priority URLs:")
  for (const url of priority) console.log(`  ${url}`)
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
