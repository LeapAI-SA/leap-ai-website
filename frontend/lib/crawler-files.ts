import { withBasePath } from "./media"
import { absoluteUrl, getSiteUrl, siteConfig } from "./seo"

const aiCrawlers = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "cohere-ai",
  "Bytespider",
  "CCBot",
  "FacebookBot",
  "meta-externalagent",
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
    `LLMs-Txt: ${absoluteUrl("/llms.txt")}`,
    `LLMs-Full-Txt: ${absoluteUrl("/llms-full.txt")}`,
    `LLMs-Small-Txt: ${absoluteUrl("/llms-small.txt")}`,
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    `Host: ${getSiteUrl()}`,
  )

  return `${lines.join("\n")}\n`
}

export function buildAiTxt() {
  return [
    `# ai.txt — AI crawler guidance for ${siteConfig.name}`,
    `# ${getSiteUrl()}`,
    "",
    "Contact: mailto:info@leapai.ai",
    `Website: ${getSiteUrl()}`,
    "",
    "Preferred-summary: llms.txt",
    `LLMs-Txt: ${absoluteUrl("/llms.txt")}`,
    `LLMs-Full-Txt: ${absoluteUrl("/llms-full.txt")}`,
    `LLMs-Small-Txt: ${absoluteUrl("/llms-small.txt")}`,
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    "",
    "Policy: Public marketing content may be indexed for AI search and answers.",
    "Attribution: Cite as LeapAI (Leap AI), Riyadh, Saudi Arabia.",
    "",
    siteConfig.descriptionEn,
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
