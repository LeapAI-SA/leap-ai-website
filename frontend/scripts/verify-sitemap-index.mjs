#!/usr/bin/env node
/**
 * Verify sitemap URL health + public search visibility signals.
 *
 * Usage:
 *   node scripts/verify-sitemap-index.mjs
 *   node scripts/verify-sitemap-index.mjs --host https://leapai.ai
 *
 * Writes scripts/output/sitemap-index-coverage.json
 */

import { writeFileSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const hostArg = process.argv.find((a) => a.startsWith("--host="))?.slice("--host=".length)
const HOST = (hostArg || process.env.NEXT_PUBLIC_SITE_URL || "https://leapai.ai").replace(/\/$/, "")
const UA =
  "Mozilla/5.0 (compatible; LeapAI-SitemapAudit/1.0; +https://leapai.ai)"

/** Legacy URLs that must 301/308 to new destinations (not 404). */
const LEGACY_CHECKS = [
  { from: "/en/nlu-ai-chatbot", expectPath: "/solutions/nlu-chatbot" },
  { from: "/en/ai-voice-bot", expectPath: "/solutions/voice-bot" },
  { from: "/en/genai-generative-ai-chatbot", expectPath: "/solutions/genai-chatbot" },
  { from: "/en/omni-channel-contact-center", expectPath: "/solutions" },
  { from: "/en/multichannel-contact-centers", expectPath: "/solutions" },
  {
    from: "/en/connecting-digital-chat-channels-and-social-media-messages",
    expectPath: "/solutions/digital-channels",
  },
  { from: "/en/whatsapp-business-registration", expectPath: "/solutions/whatsapp-business" },
  { from: "/en/whatsapp-business", expectPath: "/solutions/whatsapp-business" },
  { from: "/en/leap-space-2", expectPath: "/" },
  { from: "/en/healthcare-use-case", expectPath: "/use-cases/healthcare" },
  { from: "/en/r24", expectPath: "/products/ai-recruiter" },
  { from: "/en/r24/", expectPath: "/products/ai-recruiter" },
  { from: "/en/leap-ticketing", expectPath: "/products/leap-ticketing" },
  { from: "/en/growth-hacking", expectPath: "/solutions/customer-journey" },
  { from: "/en/quality-management-qm-solutions", expectPath: "/solutions/quality-management" },
  { from: "/en/customer-relationship-management-crm-system", expectPath: "/solutions/crm" },
  { from: "/en/unknown-wordpress-slug-xyz", expectPath: "/" },
  { from: "/nlu-ai-chatbot", expectPath: "/solutions/nlu-chatbot" },
  { from: "/whatsapp-business-registration", expectPath: "/solutions/whatsapp-business" },
  { from: "/retail-use-case", expectPath: "/use-cases/retail" },
  { from: "/r24", expectPath: "/products/ai-recruiter" },
]

async function fetchSitemapUrls(host) {
  const res = await fetch(`${host}/sitemap.xml`)
  if (!res.ok) throw new Error(`sitemap.xml HTTP ${res.status}`)
  const xml = await res.text()
  return [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map((m) => m[1].trim())
}

async function checkUrl(url) {
  const res = await fetch(url, {
    method: "GET",
    redirect: "manual",
    headers: { "User-Agent": UA },
  })
  return {
    url,
    status: res.status,
    location: res.headers.get("location"),
    robots: res.headers.get("x-robots-tag"),
  }
}

async function followToFinal(startUrl, maxHops = 8) {
  let url = startUrl
  const chain = []
  for (let i = 0; i < maxHops; i++) {
    const res = await fetch(url, {
      method: "GET",
      redirect: "manual",
      headers: { "User-Agent": UA },
    })
    chain.push({ url, status: res.status, location: res.headers.get("location") })
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      url = new URL(res.headers.get("location"), url).href
      continue
    }
    return { finalUrl: url, finalStatus: res.status, chain }
  }
  return { finalUrl: url, finalStatus: chain.at(-1)?.status ?? 0, chain }
}

async function duckDuckGoMentions(urlPath) {
  const q = `site:leapai.ai${urlPath === "/" ? "" : urlPath}`
  const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`
  try {
    const res = await fetch(searchUrl, { headers: { "User-Agent": UA } })
    const html = await res.text()
    const links = [...html.matchAll(/uddg=([^&"]+)/g)]
      .map((m) => {
        try {
          return decodeURIComponent(m[1])
        } catch {
          return m[1]
        }
      })
      .filter((u) => u.includes("leapai.ai"))
    const pathNeedle = urlPath === "/" ? "leapai.ai/" : `leapai.ai${urlPath}`
    const hit = links.some(
      (u) =>
        u.includes(pathNeedle) ||
        u.replace(/\/$/, "").endsWith(urlPath.replace(/\/$/, "")),
    )
    return { engine: "duckduckgo", hit, sampleLinks: [...new Set(links)].slice(0, 5) }
  } catch (err) {
    return { engine: "duckduckgo", hit: false, error: String(err) }
  }
}

function pathFromUrl(url) {
  try {
    const u = new URL(url)
    return u.pathname || "/"
  } catch {
    return url
  }
}

async function main() {
  console.log(`Verifying sitemap coverage for ${HOST}`)
  const urls = await fetchSitemapUrls(HOST)
  console.log(`Found ${urls.length} sitemap URLs`)

  const enInSitemap = urls.filter((u) => {
    try {
      return new URL(u).pathname.includes("/en/") || new URL(u).pathname === "/en"
    } catch {
      return u.includes("/en/")
    }
  })
  if (enInSitemap.length > 0) {
    console.error(`FAIL: sitemap must not include /en URLs (${enInSitemap.length} found):`)
    for (const u of enInSitemap.slice(0, 20)) console.error(`  ${u}`)
    process.exitCode = 1
  } else {
    console.log("OK: sitemap has 0 /en URLs")
  }

  const sitemapRows = []
  for (const url of urls) {
    const health = await checkUrl(url)
    // For 200 pages, also follow in case of odd redirects
    let final = { finalUrl: url, finalStatus: health.status, chain: [health] }
    if (health.status >= 300 && health.status < 400) {
      final = await followToFinal(url)
    }
    const path = pathFromUrl(url)
    const search = await duckDuckGoMentions(path)
    const row = {
      url,
      path,
      httpStatus: health.status,
      finalStatus: final.finalStatus,
      finalUrl: final.finalUrl,
      xRobotsTag: health.robots,
      liveOk: final.finalStatus === 200,
      publicSearchSignal: search.hit ? "found" : "not_found",
      searchEngine: search,
      indexVerdict: search.hit
        ? "likely_indexed_or_discovered"
        : "not_observed_in_public_search",
    }
    sitemapRows.push(row)
    console.log(
      `${row.liveOk ? "OK" : "FAIL"} ${path} http=${row.finalStatus} search=${row.publicSearchSignal}`,
    )
    await new Promise((r) => setTimeout(r, 400))
  }

  console.log("\nLegacy redirect checks:")
  const legacyRows = []
  for (const { from, expectPath } of LEGACY_CHECKS) {
    const result = await followToFinal(`${HOST}${from}`)
    const finalPath = pathFromUrl(result.finalUrl).replace(/\/$/, "") || "/"
    const expect = expectPath.replace(/\/$/, "") || "/"
    const ok = result.finalStatus === 200 && finalPath === expect
    const row = {
      from,
      expectPath,
      finalUrl: result.finalUrl,
      finalPath,
      finalStatus: result.finalStatus,
      ok,
      chain: result.chain,
    }
    legacyRows.push(row)
    console.log(`${ok ? "OK" : "FAIL"} ${from} → ${finalPath} (expect ${expect}) [${result.finalStatus}]`)
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    host: HOST,
    sitemapCount: urls.length,
    enUrlCount: enInSitemap.length,
    liveOkCount: sitemapRows.filter((r) => r.liveOk).length,
    publicSearchFoundCount: sitemapRows.filter((r) => r.publicSearchSignal === "found").length,
    legacyRedirectOkCount: legacyRows.filter((r) => r.ok).length,
    legacyRedirectTotal: legacyRows.length,
    note:
      "publicSearchSignal uses DuckDuckGo HTML results as a public proxy. Authoritative Google/Bing coverage requires Search Console / Webmaster Tools exports. IndexNow covers Bing ecosystem only. Sitemap must never list /en URLs.",
  }

  const report = { summary, sitemap: sitemapRows, legacyRedirects: legacyRows }
  const outDir = join(__dirname, "output")
  mkdirSync(outDir, { recursive: true })
  const outPath = join(outDir, "sitemap-index-coverage.json")
  writeFileSync(outPath, JSON.stringify(report, null, 2))

  // Also write a compact markdown table for humans
  const md = [
    `# LeapAI sitemap index coverage`,
    ``,
    `Generated: ${summary.generatedAt}`,
    ``,
    `## Summary`,
    ``,
    `- Sitemap URLs: **${summary.sitemapCount}**`,
    `- Live HTTP 200: **${summary.liveOkCount}/${summary.sitemapCount}**`,
    `- Observed in public search (DDG): **${summary.publicSearchFoundCount}/${summary.sitemapCount}**`,
    `- Legacy redirects OK: **${summary.legacyRedirectOkCount}/${summary.legacyRedirectTotal}** (requires deploy of redirect fix)`,
    ``,
    `## Sitemap URLs`,
    ``,
    `| Path | HTTP | Public search | Verdict |`,
    `|---|---|---|---|`,
    ...sitemapRows.map(
      (r) =>
        `| \`${r.path}\` | ${r.finalStatus} | ${r.publicSearchSignal} | ${r.indexVerdict} |`,
    ),
    ``,
    `## Legacy redirects`,
    ``,
    `| From | Expect | Final | Status | OK |`,
    `|---|---|---|---|---|`,
    ...legacyRows.map(
      (r) =>
        `| \`${r.from}\` | \`${r.expectPath}\` | \`${r.finalPath}\` | ${r.finalStatus} | ${r.ok} |`,
    ),
    ``,
    summary.note,
    ``,
  ].join("\n")
  const mdPath = join(outDir, "sitemap-index-coverage.md")
  writeFileSync(mdPath, md)

  console.log(`\nWrote ${outPath}`)
  console.log(`Wrote ${mdPath}`)
  console.log(
    `Summary: live ${summary.liveOkCount}/${summary.sitemapCount}, search-found ${summary.publicSearchFoundCount}/${summary.sitemapCount}, legacy ${summary.legacyRedirectOkCount}/${summary.legacyRedirectTotal}, en-in-sitemap ${summary.enUrlCount}`,
  )

  if (enInSitemap.length > 0) process.exitCode = 1
  if (legacyRows.some((r) => !r.ok)) process.exitCode = 1
  if (sitemapRows.some((r) => !r.liveOk)) process.exitCode = 1
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
