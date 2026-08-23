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
import { HomeExploreSection } from "@/components/home-explore-section"
import { JsonLd } from "@/components/seo/json-ld"
import { fetchPublicSettings } from "@/lib/api"
import { buildHomeMetadata, absoluteUrl, resolveOgImage, getSiteUrl, siteConfig, buildSiteNavigationSchema } from "@/lib/seo"
import { getRequestLocale, withLocalePrefix } from "@/lib/locale"
import { buildFaqPageSchema, buildFaqPageSchemaAr, buildHomeHowToSchema, buildHomeHowToSchemaEn } from "@/lib/geo"
import { geoFaqItems } from "@/lib/geo-faq"

export async function generateMetadata(): Promise<Metadata> {
  const [settings, locale] = await Promise.all([fetchPublicSettings(), getRequestLocale()])
  return buildHomeMetadata(settings, locale)
}

export default async function Page() {
  const [settings, locale] = await Promise.all([fetchPublicSettings(), getRequestLocale()])
  const faqItems = settings?.faq?.length ? settings.faq : geoFaqItems

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${getSiteUrl()}/#webpage`,
    name: `${siteConfig.name} — ${siteConfig.taglineEn}`,
    description: siteConfig.descriptionEn,
    url: absoluteUrl(withLocalePrefix("/", locale)),
    inLanguage: locale === "en" ? ["en"] : ["ar", "en"],
    isPartOf: { "@type": "WebSite", name: siteConfig.name, url: getSiteUrl() },
    primaryImageOfPage: resolveOgImage(settings?.images?.hero),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#faq-heading", "[itemprop=name]", "[itemprop=text]"],
    },
  }

  const siteNavigationSchema = buildSiteNavigationSchema()

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={[
          homeSchema,
          siteNavigationSchema,
          buildFaqPageSchema(faqItems),
          buildFaqPageSchemaAr(faqItems),
          buildHomeHowToSchema(),
          buildHomeHowToSchemaEn(),
        ]}
      />
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
        <HomeExploreSection />
      </main>
      <SiteFooter />
      <WhatsappFab />
    </div>
  )
}
