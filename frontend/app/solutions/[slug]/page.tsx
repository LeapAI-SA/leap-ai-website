import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DetailPageContent } from "@/components/pages/detail-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { allSolutionSlugs, resolveSolution, getSolutionsFromCms } from "@/lib/cms"
import { buildContentJsonLd, buildContentMetadata } from "@/lib/seo-content"
import { solutionsFlat } from "@/lib/site-data"

export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await allSolutionSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const item = await resolveSolution(slug)
  if (!item) {
    return buildContentMetadata(
      { slug: "", title: { ar: "حلولنا", en: "Solutions" }, excerpt: { ar: "", en: "" }, description: { ar: "", en: "" }, features: { ar: [], en: [] } },
      "/solutions",
      { en: "Solutions", ar: "حلولنا" },
    )
  }
  return buildContentMetadata(item, `/solutions/${slug}`, { en: "Solutions", ar: "حلولنا" })
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = await resolveSolution(slug)
  if (!item) notFound()

  const all = (await getSolutionsFromCms()) ?? solutionsFlat
  const related = all.filter((i) => i.slug !== slug).slice(0, 6)

  return (
    <>
      <JsonLd data={buildContentJsonLd(item, `/solutions/${slug}`, { en: "Solutions", ar: "حلولنا" }, "solution")} />
      <DetailPageContent
        item={item}
        related={related}
        basePath="/solutions"
        listLabelKey="list.solutionsTitle"
        listHref="/solutions"
      />
    </>
  )
}
