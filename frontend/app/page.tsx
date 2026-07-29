import type { Metadata } from "next"
import Link from "next/link"
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
import { buildFaqPageSchema, buildFaqPageSchemaAr, buildHomeHowToSchema } from "@/lib/geo"
import { geoFaqItems } from "@/lib/geo-faq"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchPublicSettings()
  return buildHomeMetadata(settings)
}

export default async function Page() {
  const settings = await fetchPublicSettings()
  const faqItems = settings?.faq?.length ? settings.faq : geoFaqItems
  const exploreLinks = [
    { href: "/about-us", ar: "معلومات عنا", en: "About Us" },
    { href: "/use-cases", ar: "حالات الاستخدام", en: "Use Cases" },
    { href: "/products", ar: "منتجاتنا", en: "Products" },
    { href: "/contact-us", ar: "اتصل بنا", en: "Contact Us" },
    { href: "/become-a-partner", ar: "كن شريكنا", en: "Become a Partner" },
  ] as const

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
      <JsonLd data={[homeSchema, buildFaqPageSchema(faqItems), buildFaqPageSchemaAr(faqItems), buildHomeHowToSchema()]} />
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
        <section className="bg-secondary/40 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-center text-2xl font-extrabold text-foreground sm:text-3xl">
              استكشف الصفحات الأساسية في LeapAI
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-center text-sm text-muted-foreground sm:text-base">
              Explore LeapAI key sections for products, use cases, partnership, and direct contact with the team.
            </p>
            <ul className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {exploreLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-xl border border-border bg-card px-4 py-3 text-center text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <span className="block">{item.ar}</span>
                    <span className="block text-xs font-medium text-muted-foreground">{item.en}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsappFab />
    </div>
  )
}
