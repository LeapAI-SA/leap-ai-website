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
  const exploreLinks = [
    { href: "/about-us", ar: "معلومات عنا", en: "About Us" },
    { href: "/solutions", ar: "حلولنا", en: "Solutions" },
    { href: "/products", ar: "منتجاتنا", en: "Products" },
    { href: "/use-cases", ar: "حالات الاستخدام", en: "Use Cases" },
    { href: "/cases", ar: "قصص النجاح", en: "Success Stories" },
    { href: "/careers", ar: "الوظائف", en: "Careers" },
    { href: "/resources", ar: "الموارد", en: "Resources" },
    { href: "/become-a-partner", ar: "كن شريكنا", en: "Become a Partner" },
    { href: "/contact-us", ar: "اتصل بنا", en: "Contact Us" },
  ] as const

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
        <section className="bg-secondary/40 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-center text-2xl font-extrabold text-foreground sm:text-3xl">
              استكشف الصفحات الأساسية في LeapAI
            </h2>
            <p className="mx-auto mt-3 max-w-3xl text-center text-sm text-muted-foreground sm:text-base">
              Explore LeapAI key sections for solutions, products, use cases, partnership, and direct contact with the team.
            </p>
            <ul className="mx-auto mt-8 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {exploreLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={withLocalePrefix(item.href, locale)}
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
