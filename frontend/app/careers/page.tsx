import type { Metadata } from "next"
import { CareersPageContent } from "@/components/pages/careers-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { getJobs } from "@/lib/cms"
import { getRequestLocale } from "@/lib/locale"
import { metadataWithRequestLocale } from "@/lib/seo-locale"
import { absoluteUrl, buildCollectionPageJsonLd } from "@/lib/seo"

const LIST_META = {
  title: { en: "Careers", ar: "الوظائف" },
  description: {
    en: "Browse all open positions at LeapAI.",
    ar: "تصفح جميع الشواغر في LeapAI.",
  },
} as const

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
  const [jobItems, locale] = await Promise.all([getJobs(), getRequestLocale()])

  const jsonLd = buildCollectionPageJsonLd({
    locale,
    title: LIST_META.title,
    description: LIST_META.description,
    path: "/careers",
    items: jobItems.map((item) => ({
      name: item.title,
      url: absoluteUrl(`/careers/${item.slug}`),
    })),
  })

  return (
    <>
      <JsonLd data={jsonLd} />
      <CareersPageContent jobs={jobItems} />
    </>
  )
}
