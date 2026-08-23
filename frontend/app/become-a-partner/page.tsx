import type { Metadata } from "next"
import { PartnerPageContent } from "@/components/pages/partner-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { buildStaticPageJsonLd } from "@/lib/seo"
import { getRequestLocale } from "@/lib/locale"
import { metadataWithRequestLocale } from "@/lib/seo-locale"

const PAGE = {
  title: "Become a Partner",
  titleAr: "كن شريكنا",
  description:
    "Join the LeapAI partner network and be part of empowering the symbiotic relationship between humans and artificial intelligence.",
  descriptionAr:
    "انضم إلى شبكة شركاء منصة LeapAI وكن جزءاً من رحلة تمكين العلاقة التكافلية بين البشر والذكاء الاصطناعي.",
  path: "/become-a-partner",
  image: "/sections/omni-channel.png",
} as const

export async function generateMetadata(): Promise<Metadata> {
  return metadataWithRequestLocale(PAGE)
}

export default async function BecomePartnerPage() {
  const locale = await getRequestLocale()
  const pageSchema = buildStaticPageJsonLd({
    ...PAGE,
    description:
      "Join the LeapAI partner network and grow with Saudi Arabia's leading customer experience platform.",
    descriptionAr:
      "انضم إلى شبكة شركاء LeapAI ونمِّ أعمالك مع المنصة السعودية الرائدة لتجربة العملاء.",
    locale,
  })

  return (
    <>
      <JsonLd data={pageSchema} />
      <PartnerPageContent />
    </>
  )
}
