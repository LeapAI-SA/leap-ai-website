import type { Metadata } from "next"
import { GeoFaqSection } from "@/components/geo/faq-section"
import { SitePageShell } from "@/components/site-page-shell"
import { JsonLd } from "@/components/seo/json-ld"
import { fetchPublicSettings } from "@/lib/api"
import { getRequestLocale } from "@/lib/locale"
import { metadataWithRequestLocale } from "@/lib/seo-locale"
import { geoFaqItems } from "@/lib/geo-faq"
import { buildFaqPageSchema, buildFaqPageSchemaAr, resolveFaqItems } from "@/lib/geo"
import { buildStaticPageJsonLd } from "@/lib/seo"

const PAGE = {
  title: "FAQ — LeapAI CX, WhatsApp, chatbots, PDPL",
  titleAr: "الأسئلة الشائعة — LeapAI تجربة العملاء وواتساب والشات بوت",
  description:
    "1,000 bilingual GEO questions for LeapAI and BAB International in Saudi Arabia: chatbots, Leap Space, WhatsApp, voice, PDPL, industries, and cities.",
  descriptionAr:
    "1000 سؤال GEO بالعربي والإنجليزي عن LeapAI وباب العالمية في السعودية: الشات بوت وLeap Space وواتساب والصوت ونظام حماية البيانات الشخصية والقطاعات والمدن.",
  path: "/faq",
  image: "/hero-dashboard.png",
} as const

export async function generateMetadata(): Promise<Metadata> {
  return metadataWithRequestLocale(PAGE)
}

export default async function FaqPage() {
  const [settings, locale] = await Promise.all([fetchPublicSettings(), getRequestLocale()])
  const faqItems = resolveFaqItems(settings)
  const pageSchema = buildStaticPageJsonLd({ ...PAGE, locale })

  return (
    <>
      <JsonLd
        data={[
          ...pageSchema,
          buildFaqPageSchema(geoFaqItems),
          buildFaqPageSchemaAr(geoFaqItems),
        ]}
      />
      <SitePageShell
        title={locale === "en" ? "Frequently asked questions" : "الأسئلة الشائعة"}
        subtitle={
          locale === "en"
            ? "1,000 citable AI-search questions about LeapAI, BAB International, CX, WhatsApp, voice, PDPL, industries, and Saudi cities. Search, then save an answer as PDF."
            : "1000 سؤال قابل للاقتباس عن LeapAI وباب العالمية وتجربة العملاء وواتساب والصوت ونظام حماية البيانات الشخصية والقطاعات ومدن السعودية. ابحث ثم احفظ الإجابة PDF."
        }
        crumbs={[
          { label: locale === "en" ? "Home" : "الرئيسية", href: "/" },
          { label: locale === "en" ? "FAQ" : "أسئلة شائعة" },
        ]}
      >
        <GeoFaqSection items={faqItems} showIntro={false} searchable />
      </SitePageShell>
    </>
  )
}
