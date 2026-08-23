import type { Metadata } from "next"
import { ContactPageContent } from "@/components/pages/contact-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { buildStaticPageJsonLd } from "@/lib/seo"
import { getRequestLocale } from "@/lib/locale"
import { metadataWithRequestLocale } from "@/lib/seo-locale"
import { buildContactPageSchema } from "@/lib/geo"
import { fetchPublicSettings } from "@/lib/api"

const PAGE = {
  title: "Contact Us",
  titleAr: "اتصل بنا",
  description:
    "Contact the LeapAI team. We empower the symbiotic relationship between humans and AI to drive business success.",
  descriptionAr:
    "تواصل مع فريق LeapAI. هدفنا تمكين العلاقة التكافلية بين البشر والذكاء الاصطناعي وتعزيز نجاح الأعمال.",
  path: "/contact-us",
  image: "/hero-dashboard.png",
} as const

export async function generateMetadata(): Promise<Metadata> {
  return metadataWithRequestLocale(PAGE)
}

export default async function ContactUsPage() {
  const [settings, locale] = await Promise.all([fetchPublicSettings(), getRequestLocale()])
  const pageSchema = buildStaticPageJsonLd({
    ...PAGE,
    description:
      "Contact the LeapAI team. Phone +966 53 553 3627, email info@leapai.ai, Riyadh Saudi Arabia.",
    descriptionAr:
      "تواصل مع فريق LeapAI. الهاتف +966 53 553 3627، البريد info@leapai.ai، الرياض المملكة العربية السعودية.",
    locale,
  })

  return (
    <>
      <JsonLd data={[...pageSchema, buildContactPageSchema(settings ?? undefined)]} />
      <ContactPageContent />
    </>
  )
}
