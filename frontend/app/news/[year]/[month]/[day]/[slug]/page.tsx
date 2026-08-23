import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { ArticlePageContent } from "@/components/pages/article-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { getArticles, resolveArticle } from "@/lib/cms"
import { articleCanonicalPath } from "@/lib/article-paths"
import { buildArticleMetadata, buildNewsArticleJsonLd } from "@/lib/seo-article"
import { getRequestLocale, withLocalePrefix } from "@/lib/locale"

export const dynamicParams = true

export async function generateStaticParams() {
  const items = await getArticles()
  return items
    .filter((item) => item.kind === "news")
    .map((item) => {
      const [year, month, day] = item.publishedAt.slice(0, 10).split("-")
      return { year, month, day, slug: item.slug }
    })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string; month: string; day: string; slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const [item, locale] = await Promise.all([resolveArticle(slug), getRequestLocale()])
  if (!item || item.kind !== "news") {
    return buildArticleMetadata({
      slug: "",
      kind: "article",
      publishedAt: "2026-08-09",
      title: { ar: "الموارد", en: "Resources" },
      excerpt: { ar: "", en: "" },
      description: { ar: "", en: "" },
      features: { ar: [], en: [] },
    }, locale)
  }
  return buildArticleMetadata(item, locale)
}

export default async function DatedNewsArticlePage({
  params,
}: {
  params: Promise<{ year: string; month: string; day: string; slug: string }>
}) {
  const { year, month, day, slug } = await params
  const item = await resolveArticle(slug)
  if (!item || item.kind !== "news") notFound()

  const canonical = articleCanonicalPath(item)
  const requested = `/news/${year}/${month}/${day}/${slug}`
  if (requested !== canonical) {
    const locale = await getRequestLocale()
    redirect(withLocalePrefix(canonical, locale))
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
