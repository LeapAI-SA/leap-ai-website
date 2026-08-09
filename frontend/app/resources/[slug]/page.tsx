import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArticlePageContent } from "@/components/pages/article-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { allArticleSlugs, getArticles, resolveArticle } from "@/lib/cms"
import { buildArticleMetadata, buildNewsArticleJsonLd } from "@/lib/seo-article"

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
  const item = await resolveArticle(slug)
  if (!item) {
    return buildArticleMetadata({
      slug: "",
      kind: "article",
      publishedAt: "2026-08-09",
      title: { ar: "الموارد", en: "Resources" },
      excerpt: { ar: "", en: "" },
      description: { ar: "", en: "" },
      features: { ar: [], en: [] },
    })
  }
  return buildArticleMetadata(item)
}

export default async function ResourceArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = await resolveArticle(slug)
  if (!item) notFound()

  const related = (await getArticles()).filter((article) => article.slug !== slug).slice(0, 4)

  return (
    <>
      <JsonLd data={buildNewsArticleJsonLd(item)} />
      <ArticlePageContent item={item} related={related} />
    </>
  )
}
