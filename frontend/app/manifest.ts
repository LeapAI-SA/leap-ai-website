import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/seo"
import { withBasePath } from "@/lib/media"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.nameFull,
    short_name: siteConfig.name,
    description: siteConfig.descriptionAr,
    start_url: withBasePath("/"),
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0066b2",
    lang: "ar",
    dir: "rtl",
    icons: [
      { src: withBasePath("/icon"), sizes: "64x64", type: "image/png" },
      { src: withBasePath("/apple-icon"), sizes: "180x180", type: "image/png" },
      { src: withBasePath("/leapai-logo.png"), sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  }
}
