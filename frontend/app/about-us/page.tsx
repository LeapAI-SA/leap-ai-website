import type { Metadata } from "next"
import { AboutPageContent } from "@/components/pages/about-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { buildPageMetadata, buildStaticPageJsonLd } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "About Us",
  titleAr: "معلومات عنا",
  description:
    "Learn about LeapAI — 25+ years of technology experience in Saudi Arabia, leading AI solutions for customer experience.",
  descriptionAr:
    "تعرف على LeapAI — أكثر من 25 عامًا من الخبرة في التكنولوجيا بالسعودية، رواد حلول الذكاء الاصطناعي لتجربة العملاء.",
  path: "/about-us",
  image: "/pages/about-us.png",
})

const pageSchema = buildStaticPageJsonLd({
  title: "About Us",
  description:
    "Learn about LeapAI — 25+ years of technology experience in Saudi Arabia, leading AI solutions for customer experience.",
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
