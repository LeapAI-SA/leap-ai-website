import type { Metadata } from "next"
import { PrivacyPageContent } from "@/components/pages/privacy-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { buildPageMetadata, buildStaticPageJsonLd } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  titleAr: "سياسة الخصوصية",
  description: "LeapAI privacy policy — how we collect, use, and protect your personal data.",
  descriptionAr: "سياسة خصوصية LeapAI — كيف نجمع ونستخدم ونحمي بياناتك الشخصية.",
  path: "/privacy-policy",
  image: "/sections/ticket-overview.png",
})

const pageSchema = buildStaticPageJsonLd({
  title: "Privacy Policy",
  description: "LeapAI privacy policy — how we collect, use, and protect your personal data.",
  path: "/privacy-policy",
  image: "/sections/ticket-overview.png",
})

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={pageSchema} />
      <PrivacyPageContent />
    </>
  )
}
