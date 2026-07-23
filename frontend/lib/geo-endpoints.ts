import { GEO_ROOT_PATHS } from "./geo-paths"
import { withBasePath } from "./media"
import { absoluteUrl } from "./seo"
import { getBrowserSiteUrl, getPublicSiteUrl } from "./site-url"

export type GeoEndpointCheck = {
  id: string
  path: string
  label: string
  description: string
  /** Plain string or regex source — response must include this text when set */
  expect?: string
}

export const GEO_ENDPOINT_CHECKS: GeoEndpointCheck[] = [
  {
    id: "llms",
    path: "/llms.txt",
    label: "llms.txt",
    description: "Short summary about LeapAI for AI tools",
    expect: "LeapAI",
  },
  {
    id: "llms-full",
    path: "/llms-full.txt",
    label: "llms-full.txt",
    description: "Summary plus FAQ questions",
    expect: "Frequently asked questions",
  },
  {
    id: "llms-small",
    path: "/llms-small.txt",
    label: "llms-small.txt",
    description: "Compact summary for AI crawlers",
    expect: "LeapAI",
  },
  {
    id: "robots",
    path: "/robots.txt",
    label: "robots.txt",
    description: "Crawler rules and LLMs-Txt pointers",
    expect: "GPTBot",
  },
  {
    id: "sitemap",
    path: "/sitemap.xml",
    label: "sitemap.xml",
    description: "List of all public pages",
    expect: "llms.txt",
  },
  {
    id: "ai-txt",
    path: "/.well-known/ai.txt",
    label: "ai.txt",
    description: "AI crawler guidance (.well-known)",
    expect: "LLMs-Txt",
  },
]

/** Paths AI validators check at the domain root (without /leap-ai). */
export { GEO_ROOT_PATHS } from "./geo-paths"

/** Browser URL for a GEO file on the current host (respects base path). */
export function geoBrowserUrl(path: string) {
  if (typeof window !== "undefined") {
    return `${window.location.origin}${withBasePath(path)}`
  }
  return absoluteUrl(path)
}

export function geoPublicSiteUrl() {
  if (typeof window !== "undefined") {
    return getBrowserSiteUrl()
  }
  return getPublicSiteUrl()
}
