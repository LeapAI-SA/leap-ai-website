import type { Metadata } from "next"
import { UseCasesPageContent } from "@/components/pages/use-cases-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { getNavContent } from "@/lib/cms"
import { getRequestLocale } from "@/lib/locale"
import { metadataWithRequestLocale } from "@/lib/seo-locale"
import { buildListPageJsonLd } from "@/lib/seo-content"

const LIST_META = {
  title: { en: "Use Cases", ar: "حالات الاستخدام" },
  description: {
    en: "Discover how companies use LeapAI across retail, telecom, banking, healthcare, and customer service automation.",
    ar: "اكتشف كيف تستخدم الشركات LeapAI في التجزئة، الاتصالات، البنوك، الرعاية الصحية، وأتمتة خدمة العملاء.",
  },
} as const

export async function generateMetadata(): Promise<Metadata> {
  return metadataWithRequestLocale({
    title: "Use Cases",
    titleAr: "حالات الاستخدام",
    description: LIST_META.description.en,
    descriptionAr: LIST_META.description.ar,
    path: "/use-cases",
    image: "/pages/banking.png",
  })
}

export default async function UseCasesPage() {
  const [{ useCases }, locale] = await Promise.all([getNavContent(), getRequestLocale()])

  return (
    <>
      <JsonLd
        data={buildListPageJsonLd({
          ...LIST_META,
          path: "/use-cases",
          items: useCases,
          locale,
        })}
      />
      <UseCasesPageContent useCases={useCases} />
    </>
  )
}
