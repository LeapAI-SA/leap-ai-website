import type { Metadata } from "next"
import { PrivacyPageContent } from "@/components/pages/privacy-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { buildStaticPageJsonLd } from "@/lib/seo"
import { getRequestLocale } from "@/lib/locale"
import { metadataWithRequestLocale } from "@/lib/seo-locale"

const PAGE = {
  title: "Privacy Policy",
  titleAr: "سياسة الخصوصية",
  description: "LeapAI privacy policy — how we collect, use, and protect your personal data.",
  descriptionAr: "سياسة خصوصية LeapAI — كيف نجمع ونستخدم ونحمي بياناتك الشخصية.",
  path: "/privacy-policy",
  image: "/sections/ticket-overview.png",
} as const

export async function generateMetadata(): Promise<Metadata> {
  return metadataWithRequestLocale(PAGE)
}

export default async function PrivacyPolicyPage() {
  const locale = await getRequestLocale()
  const pageSchema = buildStaticPageJsonLd({ ...PAGE, locale })

  return (
    <>
      <JsonLd data={pageSchema} />
      <PrivacyPageContent />
    </>
  )
}
