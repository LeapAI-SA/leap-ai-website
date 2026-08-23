import type { Metadata } from "next"
import { CasesPageContent } from "@/components/pages/cases-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { getCases } from "@/lib/cms"
import { getRequestLocale } from "@/lib/locale"
import { metadataWithRequestLocale } from "@/lib/seo-locale"
import { buildCollectionPageJsonLd } from "@/lib/seo"

const LIST_META = {
  title: { en: "Success Stories", ar: "قصص النجاح" },
  description: {
    en: "Explore customer experience, data analytics, and mobile & web success stories delivered for leading organizations.",
    ar: "استكشف قصص النجاح في تجربة العملاء وتحليل البيانات وحلول التطبيقات والمواقع الإلكترونية لجهات رائدة.",
  },
} as const

export async function generateMetadata(): Promise<Metadata> {
  return metadataWithRequestLocale({
    title: "Success Stories",
    titleAr: "قصص النجاح",
    description: LIST_META.description.en,
    descriptionAr: LIST_META.description.ar,
    path: "/cases",
    image: "/pages/banking.png",
  })
}

export default async function CasesPage() {
  const [caseItems, locale] = await Promise.all([getCases(), getRequestLocale()])

  const jsonLd = buildCollectionPageJsonLd({
    locale,
    title: LIST_META.title,
    description: LIST_META.description,
    path: "/cases",
    items: caseItems.map((item) => ({
      name: item.title,
    })),
  })

  return (
    <>
      <JsonLd data={jsonLd} />
      <CasesPageContent cases={caseItems} />
    </>
  )
}
