import type { Metadata } from "next"
import { CasesPageContent } from "@/components/pages/cases-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { getCases } from "@/lib/cms"
import { metadataWithRequestLocale } from "@/lib/seo-locale"
import { absoluteUrl, getSiteUrl, siteConfig } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  return metadataWithRequestLocale({
    title: "Success Stories",
    titleAr: "قصص النجاح",
    description:
      "Explore customer experience, data analytics, and mobile & web success stories delivered for leading organizations.",
    descriptionAr:
      "استكشف قصص النجاح في تجربة العملاء وتحليل البيانات وحلول التطبيقات والمواقع الإلكترونية لجهات رائدة.",
    path: "/cases",
    image: "/pages/banking.png",
  })
}

export default async function CasesPage() {
  const caseItems = await getCases()
  const listUrl = absoluteUrl("/cases")

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Success Stories",
      alternateName: "قصص النجاح",
      description:
        "Explore customer experience, data analytics, and mobile & web success stories delivered for leading organizations.",
      url: listUrl,
      inLanguage: ["ar", "en"],
      isPartOf: { "@type": "WebSite", name: siteConfig.name, url: getSiteUrl() },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: caseItems.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.title.en,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Success Stories", item: listUrl },
      ],
    },
  ]

  return (
    <>
      <JsonLd data={jsonLd} />
      <CasesPageContent cases={caseItems} />
    </>
  )
}
