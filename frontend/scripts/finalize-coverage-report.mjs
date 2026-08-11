#!/usr/bin/env node
/**
 * Merge live HTTP checks with known organic-search evidence into a final coverage table.
 * Run after verify-sitemap-index.mjs (or alone — will fetch live health).
 *
 * Legacy /en paths are redirect checks only (not content pages).
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const HOST = "https://leapai.ai"
const outDir = join(__dirname, "output")

/** Paths confirmed appearing in Google organic results during audit (2026-08-03). */
const GOOGLE_OBSERVED = new Set(["/"])

/**
 * Legacy WordPress /en URLs that may still appear in SERPs.
 * After deploy they must 301/308 to canonical destinations (see legacy-redirects.mjs).
 */
const LEGACY_REDIRECT_CHECKS = [
  { path: "/en/", expect: "/en" },
  { path: "/en/about-us/", expect: "/en/about-us" },
  { path: "/en/contact-us/", expect: "/en/contact-us" },
  { path: "/en/become-a-partner/", expect: "/en/become-a-partner" },
  { path: "/en/healthcare-use-case/", expect: "/en/use-cases/healthcare" },
  { path: "/en/insurance-use-case/", expect: "/en/use-cases/insurance" },
  { path: "/en/telecom-use-case/", expect: "/en/use-cases/telecom" },
  { path: "/en/banking-use-case/", expect: "/en/use-cases/banking" },
  { path: "/en/retail-use-case/", expect: "/en/use-cases/retail" },
  { path: "/en/nlu-ai-chatbot/", expect: "/en/solutions/nlu-chatbot" },
  { path: "/en/ai-voice-bot/", expect: "/en/solutions/voice-bot" },
  { path: "/en/whatsapp-business-registration/", expect: "/en/solutions/whatsapp-business" },
  { path: "/en/whatsapp-business/", expect: "/en/solutions/whatsapp-business" },
  { path: "/en/omni-channel-contact-center/", expect: "/en/solutions" },
  { path: "/en/leap-space-2/", expect: "/en" },
  { path: "/en/r24/", expect: "/en/products/ai-recruiter" },
  { path: "/en/leap-ticketing/", expect: "/en/products/leap-ticketing" },
  { path: "/en/growth-hacking/", expect: "/en/solutions/customer-journey" },
  { path: "/retail-use-case/", expect: "/use-cases/retail" },
  { path: "/banking-use-case-ar/", expect: "/use-cases/banking" },
]

async function liveStatus(path) {
  const url = path === "/" ? HOST : `${HOST}${path}`
  const res = await fetch(url, { redirect: "follow", method: "GET" })
  return { url, status: res.status, ok: res.status === 200, finalUrl: res.url }
}

async function followLegacy(path) {
  let url = `${HOST}${path}`
  const chain = []
  for (let i = 0; i < 8; i++) {
    const res = await fetch(url, { redirect: "manual", method: "GET" })
    const loc = res.headers.get("location")
    chain.push({ url, status: res.status, location: loc })
    if (res.status >= 300 && res.status < 400 && loc) {
      url = new URL(loc, url).href
      continue
    }
    return { finalUrl: url, finalStatus: res.status, chain }
  }
  return { finalUrl: url, finalStatus: chain.at(-1)?.status ?? 0, chain }
}

function pathFromUrl(url) {
  try {
    return new URL(url).pathname.replace(/\/$/, "") || "/"
  } catch {
    return url
  }
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

  const enInSitemap = urls.filter((p) => p === "/en" || p.startsWith("/en/"))
  if (!enInSitemap.length) {
    console.error("FAIL: sitemap must include English /en URLs")
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

  console.log("\nLegacy /en redirect checks (not sitemap content):")
  const legacyRows = []
  for (const { path, expect } of LEGACY_REDIRECT_CHECKS) {
    const result = await followLegacy(path)
    const finalPath = pathFromUrl(result.finalUrl)
    const expectNorm = expect.replace(/\/$/, "") || "/"
    const ok = result.finalStatus === 200 && finalPath === expectNorm
    legacyRows.push({ path, expect: expectNorm, finalPath, finalStatus: result.finalStatus, ok })
    console.log(`${ok ? "OK" : "FAIL"} ${path} → ${finalPath} (expect ${expectNorm}) [${result.finalStatus}]`)
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    sitemapCount: rows.length,
    enInSitemap: enInSitemap.length,
    liveOk: rows.filter((r) => r.liveHttp === 200).length,
    googleObservedAsNewUrl: rows.filter((r) => r.googleOrganic === "indexed_observed").length,
    legacyRedirectOk: legacyRows.filter((r) => r.ok).length,
    legacyRedirectTotal: legacyRows.length,
    bingNote:
      "Public Bing SERP blocked by captcha. After deploy: npm run seo:submit-indexnow + resubmit sitemap in Bing Webmaster. Use URL removal only for residual 404s.",
    actionRequired: [
      "On host: sudo bash deploy/kill-wordpress-en.sh (ensure no PHP/WP under /en)",
      "Deploy Next legacy-redirects + skipTrailingSlashRedirect",
      "npm run seo:classify-en && npm run seo:verify-index",
      "npm run seo:submit-indexnow && npm run seo:prepare-webmaster",
      "Resubmit https://leapai.ai/sitemap.xml in Google Search Console and Bing Webmaster",
      "Bing/GSC Removals only for URLs that still 404 after redirects",
    ],
  }

  const report = {
    summary,
    urls: rows,
    legacyRedirectChecks: legacyRows,
  }
  writeFileSync(join(outDir, "sitemap-index-final.json"), JSON.stringify(report, null, 2))

  const md = [
    `# LeapAI sitemap index — final coverage table`,
    ``,
    `Generated: ${summary.generatedAt}`,
    ``,
    `## Verdict`,
    ``,
    `- Live sitemap pages: **${summary.liveOk}/${summary.sitemapCount}** HTTP 200`,
    `- Sitemap /en URLs: **${summary.enInSitemap}** (required for English GEO)`,
    `- New canonical URLs observed in Google organic: **${summary.googleObservedAsNewUrl}/${summary.sitemapCount}**`,
    `- Legacy /en redirect checks OK: **${summary.legacyRedirectOk}/${summary.legacyRedirectTotal}**`,
    `- Bing: confirm coverage in Webmaster Tools after IndexNow + sitemap resubmit`,
    ``,
    `## All sitemap URLs (Arabic + English /en)`,
    ``,
    `| Path | Live | Google (new URL) | Bing |`,
    `|---|---|---|---|`,
    ...rows.map(
      (r) =>
        `| \`${r.path}\` | ${r.liveHttp} | ${r.googleOrganic} | ${r.bingOrganic} |`,
    ),
    ``,
    `## Legacy /en redirect checks`,
    ``,
    `| From | Expect | Final | Status | OK |`,
    `|---|---|---|---|---|`,
    ...legacyRows.map(
      (r) =>
        `| \`${r.path}\` | \`${r.expect}\` | \`${r.finalPath}\` | ${r.finalStatus} | ${r.ok} |`,
    ),
    ``,
    `These are redirects, not indexable content. Soft-404 strip behavior is retired.`,
    ``,
    `## Next steps`,
    ``,
    ...summary.actionRequired.map((s) => `1. ${s}`),
    ``,
  ].join("\n")

  writeFileSync(join(outDir, "sitemap-index-final.md"), md)
  console.log(md)
  console.log(`\nWrote ${join(outDir, "sitemap-index-final.md")}`)

  if (enInSitemap.length || legacyRows.some((r) => !r.ok)) process.exitCode = 1
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
