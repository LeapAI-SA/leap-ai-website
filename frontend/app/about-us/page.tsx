import type { Metadata } from "next"
import { AboutPageContent } from "@/components/pages/about-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { buildPageMetadata, buildStaticPageJsonLd } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "About Us",
  titleAr: "معلومات عنا",
  description:
    "Learn about LeapAI — 23+ years of technology experience in Saudi Arabia, born from BAB International, leading enterprise AI and customer experience solutions.",
  descriptionAr:
    "تعرف على LeapAI — أكثر من 23 عامًا من الخبرة في التكنولوجيا بالسعودية، من إرث BAB International، رواد حلول الذكاء الاصطناعي للمؤسسات وتجربة العملاء.",
  path: "/about-us",
  image: "/pages/about-us.png",
})

const pageSchema = buildStaticPageJsonLd({
  title: "About Us",
  description:
    "Learn about LeapAI — 23+ years of technology experience in Saudi Arabia, born from BAB International, leading enterprise AI and customer experience solutions.",
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
