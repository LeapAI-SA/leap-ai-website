import type { Metadata } from "next"
import { PartnerPageContent } from "@/components/pages/partner-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { buildPageMetadata, buildStaticPageJsonLd } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Become a Partner",
  titleAr: "كن شريكنا",
  description:
    "Join the LeapAI partner network and be part of empowering the symbiotic relationship between humans and artificial intelligence.",
  descriptionAr:
    "انضم إلى شبكة شركاء منصة LeapAI وكن جزءاً من رحلة تمكين العلاقة التكافلية بين البشر والذكاء الاصطناعي.",
  path: "/become-a-partner",
  image: "/sections/omni-channel.png",
})

const pageSchema = buildStaticPageJsonLd({
  title: "Become a Partner",
  description:
    "Join the LeapAI partner network and grow with Saudi Arabia's leading customer experience platform.",
  path: "/become-a-partner",
  image: "/sections/omni-channel.png",
})

export default function BecomePartnerPage() {
  return (
    <>
      <JsonLd data={pageSchema} />
      <PartnerPageContent />
    </>
  )
}
