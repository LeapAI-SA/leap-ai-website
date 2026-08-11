import type { Metadata } from "next"
import { UseCasesPageContent } from "@/components/pages/use-cases-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { getNavContent } from "@/lib/cms"
import { metadataWithRequestLocale } from "@/lib/seo"
import { buildListPageJsonLd } from "@/lib/seo-content"

export async function generateMetadata(): Promise<Metadata> {
  return metadataWithRequestLocale({
    title: "Use Cases",
    titleAr: "حالات الاستخدام",
    description:
      "Discover how companies use LeapAI across retail, telecom, banking, healthcare, and customer service automation.",
    descriptionAr:
      "اكتشف كيف تستخدم الشركات LeapAI في التجزئة، الاتصالات، البنوك، الرعاية الصحية، وأتمتة خدمة العملاء.",
    path: "/use-cases",
    image: "/pages/banking.png",
  })
}

export default async function UseCasesPage() {
  const { useCases } = await getNavContent()

  return (
    <>
      <JsonLd
        data={buildListPageJsonLd({
          title: "Use Cases",
          description:
            "Discover how companies use LeapAI across retail, telecom, banking, healthcare, and customer service automation.",
          path: "/use-cases",
          items: useCases,
        })}
      />
      <UseCasesPageContent useCases={useCases} />
    </>
  )
}
