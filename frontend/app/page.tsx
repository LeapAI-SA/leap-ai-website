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
import { buildHomeMetadata, absoluteUrl, resolveOgImage, getSiteUrl, siteConfig } from "@/lib/seo"
import { buildFaqPageSchema, buildFaqPageSchemaAr } from "@/lib/geo"
import { geoFaqItems } from "@/lib/geo-faq"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchPublicSettings()
  return buildHomeMetadata(settings)
}

export default async function Page() {
  const settings = await fetchPublicSettings()
  const faqItems = settings?.faq?.length ? settings.faq : geoFaqItems

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
      <JsonLd data={[homeSchema, buildFaqPageSchema(faqItems), buildFaqPageSchemaAr(faqItems)]} />
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
