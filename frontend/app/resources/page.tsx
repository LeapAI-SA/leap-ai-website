import type { Metadata } from "next"
import { ResourcesPageContent } from "@/components/pages/resources-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { getArticles } from "@/lib/cms"
import { metadataWithRequestLocale } from "@/lib/seo-locale"
import { buildResourcesListJsonLd } from "@/lib/seo-article"

export async function generateMetadata(): Promise<Metadata> {
  return metadataWithRequestLocale({
    title: "Resources",
    titleAr: "الموارد",
    description:
      "News and guides on LeapAI — Saudi Arabia's premier AI-native customer experience (CX) platform, PDPL-ready local cloud in Riyadh.",
    descriptionAr:
      "أخبار وتحليلات LeapAI — المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي، مع سحابة محلية في الرياض.",
    path: "/resources",
  })
}

export default async function ResourcesPage() {
  const articles = await getArticles()

  return (
    <>
      <JsonLd data={buildResourcesListJsonLd(articles)} />
      <ResourcesPageContent articles={articles} />
    </>
  )
}
