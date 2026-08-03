#!/usr/bin/env node
/**
 * Merge live HTTP checks with known organic-search evidence into a final coverage table.
 * Run after verify-sitemap-index.mjs (or alone — will fetch live health).
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const HOST = "https://leapai.ai"
const outDir = join(__dirname, "output")

/** Paths confirmed appearing in Google organic results during audit (2026-08-03). */
const GOOGLE_OBSERVED = new Set(["/"])

/** Legacy URLs still appearing in Google SERPs (old WordPress forms). */
const GOOGLE_LEGACY_STILL_SHOWING = [
  "/en/",
  "/en/about-us/",
  "/en/contact-us/",
  "/en/become-a-partner/",
  "/en/healthcare-use-case/",
  "/en/insurance-use-case/",
  "/en/telecom-use-case/",
  "/en/banking-use-case/",
  "/en/retail-use-case/",
  "/en/nlu-ai-chatbot/",
  "/en/ai-voice-bot/",
  "/en/whatsapp-business-registration/",
  "/en/omni-channel-contact-center/",
  "/en/leap-space-2/",
  "/retail-use-case/",
  "/banking-use-case-ar/",
]

async function liveStatus(path) {
  const url = path === "/" ? HOST : `${HOST}${path}`
  const res = await fetch(url, { redirect: "follow", method: "GET" })
  return { url, status: res.status, ok: res.status === 200 }
}

async function main() {
  mkdirSync(outDir, { recursive: true })

  let urls = []
  const verifyPath = join(outDir, "sitemap-index-coverage.json")
  if (existsSync(verifyPath)) {
    const prev = JSON.parse(readFileSync(verifyPath, "utf8"))
    urls = prev.sitemap.map((r) => r.path)
  } else {
    const xml = await (await fetch(`${HOST}/sitemap.xml`)).text()
    urls = [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map((m) => {
      const u = new URL(m[1].trim())
      return u.pathname || "/"
    })
  }

  const rows = []
  for (const path of urls) {
    const health = await liveStatus(path === "" ? "/" : path)
    const normalized = path === "" ? "/" : path
    const google =
      GOOGLE_OBSERVED.has(normalized)
        ? "indexed_observed"
        : "not_observed_as_new_url"
    rows.push({
      path: normalized,
      url: health.url,
      liveHttp: health.status,
      googleOrganic: google,
      bingOrganic: "unknown_captcha_blocked_confirm_in_webmaster",
      notes:
        google === "indexed_observed"
          ? "Appears in Google brand/organic results"
          : "New canonical path not seen as a Google result URL; may still be crawled. Confirm in GSC.",
    })
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    sitemapCount: rows.length,
    liveOk: rows.filter((r) => r.liveHttp === 200).length,
    googleObservedAsNewUrl: rows.filter((r) => r.googleOrganic === "indexed_observed").length,
    googleLegacyStillShowing: GOOGLE_LEGACY_STILL_SHOWING.length,
    bingNote: "Public Bing SERP blocked by captcha; IndexNow submitted (202 Accepted). Confirm coverage in Bing Webmaster after key file is deployed.",
    actionRequired: [
      "Deploy redirect + IndexNow key changes",
      "Re-run: npm run seo:submit-indexnow",
      "Submit sitemap in Google Search Console and Bing Webmaster",
      "Request indexing for hub pages in GSC URL Inspection",
    ],
  }

  const report = { summary, urls: rows, googleLegacyStillShowing: GOOGLE_LEGACY_STILL_SHOWING }
  writeFileSync(join(outDir, "sitemap-index-final.json"), JSON.stringify(report, null, 2))

  const md = [
    `# LeapAI sitemap index — final coverage table`,
    ``,
    `Generated: ${summary.generatedAt}`,
    ``,
    `## Verdict`,
    ``,
    `- Live sitemap pages: **${summary.liveOk}/${summary.sitemapCount}** HTTP 200`,
    `- New canonical URLs observed in Google organic: **${summary.googleObservedAsNewUrl}/${summary.sitemapCount}** (homepage only)`,
    `- Legacy WordPress URLs still showing in Google: **${summary.googleLegacyStillShowing}**`,
    `- Bing: IndexNow accepted (202); key file not live until deploy; confirm in Webmaster Tools`,
    ``,
    `## All sitemap URLs`,
    ``,
    `| Path | Live | Google (new URL) | Bing |`,
    `|---|---|---|---|`,
    ...rows.map(
      (r) =>
        `| \`${r.path}\` | ${r.liveHttp} | ${r.googleOrganic} | ${r.bingOrganic} |`,
    ),
    ``,
    `## Legacy URLs still in Google SERPs`,
    ``,
    ...GOOGLE_LEGACY_STILL_SHOWING.map((p) => `- \`${p}\``),
    ``,
    `These should 301 to new destinations after deploy of \`legacy-redirects\` / middleware map.`,
    ``,
    `## Next steps`,
    ``,
    ...summary.actionRequired.map((s) => `1. ${s}`),
    ``,
  ].join("\n")

  writeFileSync(join(outDir, "sitemap-index-final.md"), md)
  console.log(md)
  console.log(`\nWrote ${join(outDir, "sitemap-index-final.md")}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
