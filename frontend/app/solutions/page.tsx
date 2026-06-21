import type { Metadata } from "next"
import { SolutionsPageContent } from "@/components/pages/solutions-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { getNavContent } from "@/lib/cms"
import { buildPageMetadata } from "@/lib/seo"
import { buildListPageJsonLd } from "@/lib/seo-content"

export const metadata: Metadata = buildPageMetadata({
  title: "Solutions",
  titleAr: "حلولنا",
  description:
    "LeapAI integrated customer experience solutions: omni-channel contact centers, business messaging, AI chatbots, and marketing automation.",
  descriptionAr:
    "حلول LeapAI المتكاملة لتجربة العملاء: مراكز اتصال متعددة القنوات، رسائل أعمال، شات بوت ذكاء اصطناعي، وأتمتة تسويق.",
  path: "/solutions",
  image: "/sections/omni-channel.png",
})

export default async function SolutionsPage() {
  const { solutionsGroups } = await getNavContent()
  const items = solutionsGroups.flatMap((g) => g.items)

  return (
    <>
      <JsonLd
        data={buildListPageJsonLd({
          title: "Solutions",
          description:
            "LeapAI integrated customer experience solutions: omni-channel contact centers, business messaging, AI chatbots, and marketing automation.",
          path: "/solutions",
          items,
        })}
      />
      <SolutionsPageContent solutionsGroups={solutionsGroups} />
    </>
  )
}
