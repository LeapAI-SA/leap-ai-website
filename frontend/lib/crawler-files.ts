import { withBasePath } from "./media"
import { absoluteUrl, getSiteUrl, siteConfig } from "./seo"
import { pickLocalized } from "./api"
import { mergeGeoSettings } from "./geo-defaults"
import type { GeoBuildSettings } from "./geo"

const aiCrawlers = [
  // OpenAI
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  // Anthropic
  "ClaudeBot",
  "Claude-Web",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // DeepSeek
  "DeepSeekBot",
  // Google / Gemini
  "Google-Extended",
  "Google-CloudVertexBot",
  "Gemini-Deep-Research",
  "GoogleOther",
  // Microsoft
  "Bingbot",
  "MicrosoftPreview",
  // Apple
  "Applebot",
  "Applebot-Extended",
  // Amazon
  "Amazonbot",
  // Meta
  "FacebookBot",
  "meta-externalagent",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  // Others
  "cohere-ai",
  "Bytespider",
  "CCBot",
  "MistralAI-User",
  "YouBot",
  "DuckAssistBot",
  "AI2Bot",
  "Diffbot",
  "GrokBot",
]

export function buildRobotsTxt() {
  const allow = withBasePath("/")
  const disallow = [withBasePath("/dashboard"), withBasePath("/api/")]
  const lines: string[] = []

  for (const userAgent of ["*", ...aiCrawlers]) {
    lines.push(`User-agent: ${userAgent}`, `Allow: ${allow}`)
    for (const path of disallow) {
      lines.push(`Disallow: ${path}`)
    }
    lines.push("")
  }

  lines.push(
    `# AI / LLM crawler guidance`,
    `# See also: /llms.txt, /llms-full.txt, /llms-small.txt, /.well-known/ai.txt`,
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
  )

  return `${lines.join("\n")}\n`
}

export function buildAiTxt(settings?: GeoBuildSettings | null) {
  const geo = mergeGeoSettings(settings?.geo)
  const email = settings?.contact?.email ?? "info@leapai.ai"
  const description = pickLocalized(geo.llmsDescription, "en", siteConfig.descriptionEn)
  const policy = pickLocalized(geo.aiPolicy, "en")
  const attribution = pickLocalized(geo.citationGuidance, "en")
  const category = pickLocalized(geo.categoryAnswer, "en")
  const positioningLines = pickLocalized(geo.categoryPositioning, "en")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
  const notSameLine =
    positioningLines
      .find((line) => /not the same/i.test(line))
      ?.replace(/^\*\*Not the same as\*\*:\s*/i, "")
      ?.replace(/^-\s*/, "") ??
    "Unifonic (CPaaS/communications), Lucidya (social listening/CXM analytics), LEAP conference, leapaiautomation.com."

  return [
    `# ai.txt — AI crawler guidance for ${siteConfig.name}`,
    `# ${getSiteUrl()}`,
    "",
    `Contact: mailto:${email}`,
    `Website: ${getSiteUrl()}`,
    "",
    "Preferred-summary: llms.txt",
    `LLMs-Txt: ${absoluteUrl("/llms.txt")}`,
    `LLMs-Full-Txt: ${absoluteUrl("/llms-full.txt")}`,
    `LLMs-Small-Txt: ${absoluteUrl("/llms-small.txt")}`,
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    "",
    `Policy: ${policy}`,
    `Attribution: ${attribution}`,
    "",
    `Category: ${category}`,
    `Not-the-same-as: ${notSameLine}`,
    `Compare: ${absoluteUrl("/resources/leapai-vs-unifonic-saudi-cx")} | ${absoluteUrl("/resources/leapai-vs-lucidya-contact-center-vs-analytics")}`,
    "",
    description,
  ].join("\n")
}

export function plainTextResponse(body: string, maxAge = 3600) {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": `public, max-age=${maxAge}, s-maxage=${maxAge}`,
    },
  })
}
