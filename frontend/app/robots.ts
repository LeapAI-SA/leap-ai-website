import type { MetadataRoute } from "next"
import { getSiteUrl, absoluteUrl } from "@/lib/seo"

/** Public pages — open to all crawlers including AI / generative engines. */
const publicAllow = ["/"]

/** Admin & API — blocked from indexing. */
const blocked = ["/dashboard", "/dashboard/", "/api/"]

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

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: publicAllow,
        disallow: blocked,
      },
      ...aiCrawlers.map((userAgent) => ({
        userAgent,
        allow: publicAllow,
        disallow: blocked,
      })),
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: getSiteUrl(),
  }
}
