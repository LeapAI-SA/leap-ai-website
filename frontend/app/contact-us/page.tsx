import type { Metadata } from "next"
import { ContactPageContent } from "@/components/pages/contact-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { buildPageMetadata, buildStaticPageJsonLd } from "@/lib/seo"
import { buildContactPageSchema } from "@/lib/geo"
import { fetchPublicSettings } from "@/lib/api"

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Us",
  titleAr: "اتصل بنا",
  description:
    "Contact the LeapAI team. We empower the symbiotic relationship between humans and AI to drive business success.",
  descriptionAr:
    "تواصل مع فريق LeapAI. هدفنا تمكين العلاقة التكافلية بين البشر والذكاء الاصطناعي وتعزيز نجاح الأعمال.",
  path: "/contact-us",
  image: "/hero-dashboard.png",
})

const pageSchema = buildStaticPageJsonLd({
  title: "Contact Us",
  description:
    "Contact the LeapAI team. Phone +966 53 553 3627, email info@leapai.ai, Riyadh Saudi Arabia.",
  path: "/contact-us",
  image: "/hero-dashboard.png",
})

export default async function ContactUsPage() {
  const settings = await fetchPublicSettings()
  return (
    <>
      <JsonLd data={[...pageSchema, buildContactPageSchema(settings ?? undefined)]} />
      <ContactPageContent />
    </>
  )
}
