import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DetailPageContent } from "@/components/pages/detail-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { allUseCaseSlugs, resolveUseCase, getUseCasesFromCms } from "@/lib/cms"
import { buildContentJsonLd, buildContentMetadata } from "@/lib/seo-content"
import { useCases } from "@/lib/site-data"

export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await allUseCaseSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const item = await resolveUseCase(slug)
  if (!item) {
    return buildContentMetadata(
      { slug: "", title: { ar: "حالات الاستخدام", en: "Use Cases" }, excerpt: { ar: "", en: "" }, description: { ar: "", en: "" }, features: { ar: [], en: [] } },
      "/use-cases",
      { en: "Use Cases", ar: "حالات الاستخدام" },
    )
  }
  return buildContentMetadata(item, `/use-cases/${slug}`, { en: "Use Cases", ar: "حالات الاستخدام" })
}

export default async function UseCaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = await resolveUseCase(slug)
  if (!item) notFound()

  const all = (await getUseCasesFromCms()) ?? useCases
  const related = all.filter((i) => i.slug !== slug).slice(0, 6)

  return (
    <>
      <JsonLd data={buildContentJsonLd(item, `/use-cases/${slug}`, { en: "Use Cases", ar: "حالات الاستخدام" }, "use-case")} />
      <DetailPageContent
        item={item}
        related={related}
        basePath="/use-cases"
        listLabelKey="list.useCasesTitle"
        listHref="/use-cases"
      />
    </>
  )
}
