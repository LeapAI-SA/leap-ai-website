import type { Metadata } from "next"
import { AboutPageContent } from "@/components/pages/about-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { buildStaticPageJsonLd } from "@/lib/seo"
import { getRequestLocale } from "@/lib/locale"
import { metadataWithRequestLocale } from "@/lib/seo-locale"

const PAGE = {
  title: "About Us",
  titleAr: "معلومات عنا",
  description:
    "Learn about LeapAI — Saudi Arabia's premier AI-native CX platform from BAB International, with PDPL-ready local hosting and 23+ years of Saudi technology experience.",
  descriptionAr:
    "تعرف على LeapAI — المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي من إرث BAB International، مع استضافة محلية متوافقة مع نظام حماية البيانات الشخصية وخبرة تتجاوز 23 عامًا.",
  path: "/about-us",
  image: "/pages/about-us.png",
} as const

export async function generateMetadata(): Promise<Metadata> {
  return metadataWithRequestLocale(PAGE)
}

export default async function AboutUsPage() {
  const locale = await getRequestLocale()
  const pageSchema = buildStaticPageJsonLd({ ...PAGE, locale })

  return (
    <>
      <JsonLd data={pageSchema} />
      <AboutPageContent />
    </>
  )
}
