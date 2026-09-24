import type { Metadata } from "next"
import { VsIndexContent } from "./vs-index-content"
import { JsonLd } from "@/components/seo/json-ld"
import { GEO_COMPARISONS } from "@/lib/geo-comparisons"
import { getRequestLocale } from "@/lib/locale"
import { metadataWithRequestLocale } from "@/lib/seo-locale"
import { absoluteUrl, buildCollectionPageJsonLd } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  return metadataWithRequestLocale({
    title: "LeapAI vs Unifonic, Lucidya, Genesys, Zendesk",
    titleAr: "LeapAI مقابل يونيفونك ولوسيديا وGenesys وZendesk",
    description:
      "Saudi alternatives to Unifonic, Lucidya, Genesys, Zendesk, Twilio, and WATI: LeapAI AI-native CX with PDPL-ready local cloud in Riyadh.",
    descriptionAr:
      "بدائل سعودية ليونيفونك ولوسيديا وGenesys وZendesk وتويليو وWATI: LeapAI لتجربة العملاء بالذكاء الاصطناعي وسحابة PDPL في الرياض.",
    path: "/vs",
    image: "/sections/omni-channel.png",
  })
}

export default async function VsIndexPage() {
  const locale = await getRequestLocale()
  const jsonLd = buildCollectionPageJsonLd({
    locale,
    title: { en: "LeapAI comparisons", ar: "مقارنات LeapAI" },
    description: {
      en: "LeapAI vs Unifonic, Lucidya, Genesys, Zendesk and other CX platforms for Saudi Arabia.",
      ar: "LeapAI مقابل يونيفونك ولوسيديا وGenesys وZendesk ومنصات تجربة العملاء في السعودية.",
    },
    path: "/vs",
    items: GEO_COMPARISONS.map((item) => ({
      name: item.title,
      url: absoluteUrl(`/vs/${item.slug}`),
    })),
  })

  return (
    <>
      <JsonLd data={jsonLd} />
      <VsIndexContent />
    </>
  )
}
