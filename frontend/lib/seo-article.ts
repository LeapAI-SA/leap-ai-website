import type { Metadata } from "next"
import type { ArticleItem } from "./articles"
import { articleCanonicalPath } from "./article-paths"
import { absoluteUrl, buildPageMetadata, getSiteUrl, resolveOgImage, siteConfig } from "./seo"

export function buildArticleMetadata(item: ArticleItem): Metadata {
  return buildPageMetadata({
    title: item.title.en || item.title.ar,
    titleAr: item.title.ar,
    description: item.excerpt.en || item.description.en,
    descriptionAr: item.excerpt.ar || item.description.ar,
    path: articleCanonicalPath(item),
    image: item.image,
    type: "article",
  })
}

export function buildNewsArticleJsonLd(item: ArticleItem) {
  const url = absoluteUrl(articleCanonicalPath(item))
  const schemaType = item.kind === "news" ? "NewsArticle" : "Article"
  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    headline: item.title.en,
    alternativeHeadline: item.title.ar,
    description: item.excerpt.en,
    datePublished: item.publishedAt,
    dateModified: item.publishedAt,
    inLanguage: ["en", "ar"],
    image: resolveOgImage(item.image),
    url,
    mainEntityOfPage: url,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: getSiteUrl(),
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: getSiteUrl(),
      logo: {
        "@type": "ImageObject",
        url: resolveOgImage("/leapai-logo.png"),
      },
    },
    about: [
      "AI-native CX platform",
      "Customer experience",
      "Saudi Arabia",
      siteConfig.taglineEn,
    ],
    articleBody: item.description.en,
  }
}

export function buildResourcesListJsonLd(items: ArticleItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "LeapAI Resources",
    description: siteConfig.descriptionEn,
    url: absoluteUrl("/resources"),
    inLanguage: ["ar", "en"],
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title.en,
        url: absoluteUrl(articleCanonicalPath(item)),
      })),
    },
  }
}
