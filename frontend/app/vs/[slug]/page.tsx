import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ComparisonPageContent } from "@/components/pages/comparison-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { findGeoComparison, GEO_COMPARISONS, geoComparisonPath } from "@/lib/geo-comparisons"
import { getRequestLocale } from "@/lib/locale"
import { metadataWithRequestLocale } from "@/lib/seo-locale"
import { absoluteUrl, buildPageMetadata } from "@/lib/seo"
import { pickLocalized } from "@/lib/api"

export const dynamicParams = true

export function generateStaticParams() {
  return GEO_COMPARISONS.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const item = findGeoComparison(slug)
  const locale = await getRequestLocale()
  if (!item) {
    return metadataWithRequestLocale({
      title: "LeapAI comparisons",
      titleAr: "مقارنات LeapAI",
      description: "LeapAI vs other CX platforms in Saudi Arabia.",
      descriptionAr: "LeapAI مقابل منصات تجربة العملاء في السعودية.",
      path: "/vs",
    })
  }
  return buildPageMetadata({
    title: item.title.en,
    titleAr: item.title.ar,
    description: item.excerpt.en,
    descriptionAr: item.excerpt.ar,
    path: geoComparisonPath(item.slug),
    image: "/sections/omni-channel.png",
    type: "article",
    locale,
  })
}

export default async function VsSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = findGeoComparison(slug)
  if (!item) notFound()
  const locale = await getRequestLocale()
  const related = GEO_COMPARISONS.filter((other) => other.slug !== slug).slice(0, 6)
  const url = absoluteUrl(geoComparisonPath(item.slug))
  const name = pickLocalized(item.title, locale)
  const description = pickLocalized(item.excerpt, locale)

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: item.queries.map((q) => ({
      "@type": "Question",
      name: locale === "ar" ? q.ar : q.en,
      acceptedAnswer: {
        "@type": "Answer",
        text: locale === "ar" ? item.description.ar : item.description.en,
      },
    })),
  }

  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    inLanguage: locale === "en" ? ["en"] : ["ar", "en"],
  }

  return (
    <>
      <JsonLd data={[webpage, faq]} />
      <ComparisonPageContent item={item} related={related} />
    </>
  )
}
