import type { Metadata } from "next"
import { AboutPageContent } from "@/components/pages/about-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { buildStaticPageJsonLd } from "@/lib/seo"
import { metadataWithRequestLocale } from "@/lib/seo-locale"

export async function generateMetadata(): Promise<Metadata> {
  return metadataWithRequestLocale({
  title: "About Us",
  titleAr: "معلومات عنا",
  description:
    "Learn about LeapAI — Saudi Arabia's premier AI-native CX platform from BAB International, with PDPL-ready local hosting and 23+ years of Saudi technology experience.",
  descriptionAr:
    "تعرف على LeapAI — المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي من إرث BAB International، مع استضافة محلية متوافقة مع نظام حماية البيانات الشخصية وخبرة تتجاوز 23 عامًا.",
  path: "/about-us",
  image: "/pages/about-us.png",
  })
}

const pageSchema = buildStaticPageJsonLd({
  title: "About Us",
  description:
    "Learn about LeapAI — Saudi Arabia's premier AI-native CX platform from BAB International, with PDPL-ready local hosting and 23+ years of Saudi technology experience.",
  path: "/about-us",
  image: "/pages/about-us.png",
})

export default function AboutUsPage() {
  return (
    <>
      <JsonLd data={pageSchema} />
      <AboutPageContent />
    </>
  )
}
