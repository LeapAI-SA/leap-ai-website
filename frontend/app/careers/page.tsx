import type { Metadata } from "next"
import { CareersPageContent } from "@/components/pages/careers-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { getJobs } from "@/lib/cms"
import { metadataWithRequestLocale } from "@/lib/seo-locale"
import { absoluteUrl, getSiteUrl, siteConfig } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  return metadataWithRequestLocale({
    title: "Careers — Browse all open positions",
    titleAr: "الوظائف — تصفح جميع الشواغر",
    description: "Browse open positions at LeapAI and apply with your CV. Join Saudi Arabia's premier AI-native CX platform.",
    descriptionAr: "تصفح الشواغر في LeapAI وأرسل سيرتك الذاتية. انضم إلى المنصة السعودية الرائدة لتجربة العملاء المبنية على الذكاء الاصطناعي.",
    path: "/careers",
  })
}

export default async function CareersPage() {
  const jobItems = await getJobs()
  const listUrl = absoluteUrl("/careers")

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Careers",
      alternateName: "الوظائف",
      description: "Browse all open positions at LeapAI.",
      url: listUrl,
      inLanguage: ["ar", "en"],
      isPartOf: { "@type": "WebSite", name: siteConfig.name, url: getSiteUrl() },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: jobItems.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.title.en,
          url: absoluteUrl(`/careers/${item.slug}`),
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Careers", item: listUrl },
      ],
    },
  ]

  return (
    <>
      <JsonLd data={jsonLd} />
      <CareersPageContent jobs={jobItems} />
    </>
  )
}
