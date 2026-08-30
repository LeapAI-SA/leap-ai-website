import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CampaignLandingContent } from "@/components/pages/campaign-landing-content"
import { allCampaignSlugs, resolveCampaign } from "@/lib/cms"
import { getRequestLocale } from "@/lib/locale"
import { metadataWithRequestLocale } from "@/lib/seo-locale"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await allCampaignSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const campaign = await resolveCampaign(slug)
  if (!campaign) {
    return metadataWithRequestLocale({
      title: "Campaign",
      titleAr: "حملة",
      description: "LeapAI campaign landing page",
      descriptionAr: "صفحة حملة LeapAI",
      path: `/lp/${slug}`,
      noIndex: true,
    })
  }

  const locale = await getRequestLocale()
  const title = locale === "en" ? campaign.title.en || campaign.title.ar : campaign.title.ar || campaign.title.en
  const description =
    locale === "en"
      ? campaign.excerpt.en || campaign.excerpt.ar || campaign.description.en || campaign.description.ar
      : campaign.excerpt.ar || campaign.excerpt.en || campaign.description.ar || campaign.description.en

  return metadataWithRequestLocale({
    title: title || "Campaign",
    titleAr: campaign.title.ar || campaign.title.en || "حملة",
    description: description || "LeapAI campaign landing page",
    descriptionAr: campaign.excerpt.ar || campaign.description.ar || "صفحة حملة LeapAI",
    path: `/lp/${slug}`,
    noIndex: true,
  })
}

export default async function CampaignLandingPage({ params }: Props) {
  const { slug } = await params
  const campaign = await resolveCampaign(slug)
  if (!campaign) notFound()
  return <CampaignLandingContent campaign={campaign} />
}
