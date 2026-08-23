import type { Metadata } from "next"
import type { ArticleItem } from "./articles"
import { articleCanonicalPath } from "./article-paths"
import { withLocalePrefix, type SiteLang } from "./locale-path"
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildPageMetadata,
  getSiteUrl,
  resolveOgImage,
  siteConfig,
} from "./seo"
import { pickLocalized } from "./api"

export function buildArticleMetadata(item: ArticleItem, locale: SiteLang = "ar"): Metadata {
  return buildPageMetadata({
    title: item.title.en || item.title.ar,
    titleAr: item.title.ar,
    description: item.excerpt.en || item.description.en,
    descriptionAr: item.excerpt.ar || item.description.ar,
    path: articleCanonicalPath(item),
    image: item.image,
    type: "article",
    locale,
  })
}

export function buildNewsArticleJsonLd(item: ArticleItem, locale: SiteLang = "ar") {
  const url = absoluteUrl(withLocalePrefix(articleCanonicalPath(item), locale))
  const schemaType = item.kind === "news" ? "NewsArticle" : "Article"
  const headline = pickLocalized(item.title, locale)
  const altHeadline = locale === "ar" ? item.title.en : item.title.ar
  const description = pickLocalized(item.excerpt, locale) || pickLocalized(item.description, locale)
  const articleBody = pickLocalized(item.description, locale)

  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    headline,
    alternativeHeadline: altHeadline || undefined,
    description,
    datePublished: item.publishedAt,
    dateModified: item.publishedAt,
    inLanguage: locale === "en" ? ["en"] : ["ar", "en"],
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
    about: locale === "ar"
      ? ["منصة تجربة عملاء مبنية على الذكاء الاصطناعي", "تجربة العملاء", "السعودية", siteConfig.taglineAr]
      : ["AI-native CX platform", "Customer experience", "Saudi Arabia", siteConfig.taglineEn],
    articleBody,
  }
}

export function buildResourcesListJsonLd(items: ArticleItem[], locale: SiteLang = "ar") {
  return buildCollectionPageJsonLd({
    locale,
    title: { en: "Resources", ar: "الموارد" },
    description: {
      en: siteConfig.descriptionEn,
      ar: siteConfig.descriptionAr,
    },
    path: "/resources",
    items: items.map((item) => ({
      name: item.title,
      url: absoluteUrl(articleCanonicalPath(item)),
    })),
  })
}

export function buildArticleBreadcrumbJsonLd(item: ArticleItem, locale: SiteLang = "ar") {
  return buildBreadcrumbJsonLd(locale, [
    { label: { en: "Home", ar: "الرئيسية" }, path: "/" },
    { label: { en: "Resources", ar: "الموارد" }, path: "/resources" },
    {
      label: { en: item.title.en || item.title.ar, ar: item.title.ar || item.title.en },
      path: articleCanonicalPath(item),
    },
  ])
}
