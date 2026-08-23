import type { Metadata } from "next"
import { SolutionsPageContent } from "@/components/pages/solutions-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { getNavContent } from "@/lib/cms"
import { getRequestLocale } from "@/lib/locale"
import { metadataWithRequestLocale } from "@/lib/seo-locale"
import { buildListPageJsonLd } from "@/lib/seo-content"

const LIST_META = {
  title: { en: "Solutions", ar: "حلولنا" },
  description: {
    en: "LeapAI integrated customer experience solutions: omni-channel contact centers, business messaging, AI chatbots, and marketing automation.",
    ar: "حلول LeapAI المتكاملة لتجربة العملاء: مراكز اتصال متعددة القنوات، رسائل أعمال، شات بوت ذكاء اصطناعي، وأتمتة تسويق.",
  },
} as const

export async function generateMetadata(): Promise<Metadata> {
  return metadataWithRequestLocale({
    title: "Solutions",
    titleAr: "حلولنا",
    description: LIST_META.description.en,
    descriptionAr: LIST_META.description.ar,
    path: "/solutions",
    image: "/sections/omni-channel.png",
  })
}

export default async function SolutionsPage() {
  const [{ solutionsGroups }, locale] = await Promise.all([getNavContent(), getRequestLocale()])
  const items = solutionsGroups.flatMap((g) => g.items)

  return (
    <>
      <JsonLd
        data={buildListPageJsonLd({
          ...LIST_META,
          path: "/solutions",
          items,
          locale,
        })}
      />
      <SolutionsPageContent solutionsGroups={solutionsGroups} />
    </>
  )
}
