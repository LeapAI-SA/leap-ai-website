import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { ServicesIntro } from "@/components/services-intro"
import { OmniChannel } from "@/components/omni-channel"
import { Pricing } from "@/components/pricing"
import { Addons } from "@/components/addons"
import { StoreIntegrations } from "@/components/store-integrations"
import { AcquireCta } from "@/components/acquire-cta"
import { Partners } from "@/components/partners"
import { Stats } from "@/components/stats"
import { SiteFooter } from "@/components/site-footer"
import { WhatsappFab } from "@/components/whatsapp-fab"
import { GeoFaqSection } from "@/components/geo/faq-section"
import { JsonLd } from "@/components/seo/json-ld"
import { fetchPublicSettings } from "@/lib/api"
import { buildPageMetadata, siteConfig, absoluteUrl, resolveOgImage, getSiteUrl } from "@/lib/seo"
import { buildFaqPageSchema, buildFaqPageSchemaAr } from "@/lib/geo"

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: `${siteConfig.nameFull} — ${siteConfig.taglineAr}`,
    titleAr: `${siteConfig.nameFull} — ${siteConfig.taglineAr}`,
    description: siteConfig.descriptionAr,
    descriptionAr: siteConfig.descriptionAr,
    path: "/",
    image: siteConfig.defaultOgImage,
  })
}

export default async function Page() {
  const settings = await fetchPublicSettings()

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${getSiteUrl()}/#webpage`,
    name: `${siteConfig.nameFull} — ${siteConfig.taglineAr}`,
    description: siteConfig.descriptionAr,
    url: absoluteUrl("/"),
    inLanguage: ["ar", "en"],
    isPartOf: { "@type": "WebSite", name: siteConfig.name, url: getSiteUrl() },
    primaryImageOfPage: resolveOgImage(settings?.images?.hero),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#faq-heading", "[itemprop=name]", "[itemprop=text]"],
    },
  }

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={[homeSchema, buildFaqPageSchema(), buildFaqPageSchemaAr()]} />
      <SiteHeader />
      <main>
        <Hero />
        <ServicesIntro />
        <OmniChannel />
        <Pricing />
        <Addons />
        <StoreIntegrations />
        <AcquireCta />
        <Partners />
        <Stats />
        <GeoFaqSection />
      </main>
      <SiteFooter />
      <WhatsappFab />
    </div>
  )
}
