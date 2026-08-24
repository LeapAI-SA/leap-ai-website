import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { ArticlePageContent } from "@/components/pages/article-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { allArticleSlugs, getArticles, resolveArticle } from "@/lib/cms"
import { articleCanonicalPath } from "@/lib/article-paths"
import { buildArticleMetadata, buildNewsArticleJsonLd } from "@/lib/seo-article"
import { getRequestLocale, withLocalePrefix } from "@/lib/locale"

export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await allArticleSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const [item, locale] = await Promise.all([resolveArticle(slug), getRequestLocale()])
  if (!item) {
    return buildArticleMetadata({
      slug: "",
      kind: "article",
      publishedAt: "2026-08-09",
      title: { ar: "مقال", en: "Article" },
      excerpt: { ar: "", en: "" },
      description: { ar: "", en: "" },
      features: { ar: [], en: [] },
    }, locale)
  }
  return buildArticleMetadata(item, locale)
}

export default async function ResourceArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = await resolveArticle(slug)
  if (!item) notFound()
  if (item.kind === "news") {
    const locale = await getRequestLocale()
    permanentRedirect(withLocalePrefix(articleCanonicalPath(item), locale))
  }

  const related = (await getArticles()).filter((article) => article.slug !== slug).slice(0, 4)
  const locale = await getRequestLocale()

  return (
    <>
      <JsonLd data={buildNewsArticleJsonLd(item, locale)} />
      <ArticlePageContent item={item} related={related} />
    </>
  )
}
