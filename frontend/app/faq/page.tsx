import type { Metadata } from "next"
import { GeoFaqSection } from "@/components/geo/faq-section"
import { SitePageShell } from "@/components/site-page-shell"
import { JsonLd } from "@/components/seo/json-ld"
import { fetchPublicSettings } from "@/lib/api"
import { getRequestLocale } from "@/lib/locale"
import { metadataWithRequestLocale } from "@/lib/seo-locale"
import { buildFaqPageSchema, buildFaqPageSchemaAr, resolveFaqItems } from "@/lib/geo"
import { buildStaticPageJsonLd } from "@/lib/seo"

const PAGE = {
  title: "FAQ — LeapAI CX, WhatsApp, chatbots, PDPL",
  titleAr: "الأسئلة الشائعة — LeapAI تجربة العملاء وواتساب والشات بوت",
  description:
    "Answers to common questions about LeapAI: AI chatbots, Leap Space contact center, WhatsApp Business, PDPL local cloud in Riyadh, Salla, Zid, and Odoo.",
  descriptionAr:
    "إجابات عن LeapAI: شات بوت الذكاء الاصطناعي، مركز اتصال Leap Space، واتساب للأعمال، السحابة المحلية ونظام حماية البيانات الشخصية في الرياض، وتكامل سلة وزد وOdoo.",
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
          buildFaqPageSchema(faqItems),
          buildFaqPageSchemaAr(faqItems),
        ]}
      />
      <SitePageShell
        title={locale === "en" ? "Frequently asked questions" : "الأسئلة الشائعة"}
        subtitle={
          locale === "en"
            ? "Citable answers about LeapAI chatbots, Leap Space, WhatsApp, voice, PDPL, and BAB International."
            : "إجابات قابلة للاقتباس عن شات بوت LeapAI وLeap Space وواتساب والصوت ونظام حماية البيانات الشخصية وBAB International."
        }
        crumbs={[
          { label: locale === "en" ? "Home" : "الرئيسية", href: "/" },
          { label: locale === "en" ? "FAQ" : "أسئلة شائعة" },
        ]}
      >
        <GeoFaqSection items={faqItems} showIntro={false} />
      </SitePageShell>
    </>
  )
}
