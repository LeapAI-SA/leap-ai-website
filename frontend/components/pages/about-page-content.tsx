"use client"

import Image from "next/image"
import { SitePageShell } from "@/components/site-page-shell"
import { PageSection, SectionHeading, ContentCard } from "@/components/section-heading"
import { Stats } from "@/components/stats"
import { useLanguage } from "@/lib/i18n"

export function AboutPageContent() {
  const { t, lang } = useLanguage()

  const story =
    lang === "ar"
      ? [
          "مع أكثر من 25 عامًا من الخبرة في مجال التكنولوجيا داخل السوق السعودية، أصبحت LeapAI واحدة من الأفضل بين نظيراتها الإقليمية الأكثر شهرة التي تقدم حلول الذكاء الاصطناعي للمؤسسات.",
          "نهدف إلى تشكيل حقبة جديدة من التحول المدعوم بالذكاء الاصطناعي بقيادة خبرة تقنية وقيادية واسعة تمتد لأكثر من عقدين.",
          "شغوفون بالعمل معًا والمساعدة في ربط الشركات بالمستقبل الناشئ.",
          "نسعى إلى تحقيق هدف أساسي في الحياة، وهو المساهمة في تحقيق أعلى معايير الرفاهية للمجتمع السعودي من خلال توفير قيمة مضافة في مجال خدمة العملاء وفق أعلى المعايير لتحقيق التميز.",
        ]
      : [
          "With more than 25 years of technology experience in the Saudi market, LeapAI has become one of the most recognized regional providers of enterprise AI solutions.",
          "We aim to shape a new era of AI-driven transformation led by deep technical and leadership expertise spanning more than two decades.",
          "We are passionate about working together and helping companies connect with the emerging future.",
          "We strive to contribute to the highest standards of wellbeing for Saudi society by delivering exceptional customer experience value.",
        ]

  const pillars = [
    {
      title: lang === "ar" ? "رؤيتنا" : "Our Vision",
      text:
        lang === "ar"
          ? "تمكين العلاقة التكافلية بين البشر والذكاء الاصطناعي - وتعزيز نجاح الأعمال بهدف إثراء الحياة."
          : "Empowering the symbiotic relationship between humans and AI — and driving business success to enrich life.",
    },
    {
      title: lang === "ar" ? "مهمتنا" : "Our Mission",
      text:
        lang === "ar"
          ? "نهدف إلى دفع التقدم المستدام من خلال جعل إمكانات الذكاء الاصطناعي المؤثرة والمفيدة عبر الأفق التجارية والمجتمعية."
          : "We aim to drive sustainable progress by making impactful and beneficial AI accessible across business and society.",
    },
    {
      title: lang === "ar" ? "قيمنا" : "Our Values",
      text:
        lang === "ar"
          ? "نؤمن بالتعاون متعدد الوظائف الذي يزيد من مشاركة أصحاب المصلحة والاحتفاظ بهم ومشاركة الموظفين لإطلاق العنان للإمكانات والابتكار."
          : "We believe in cross-functional collaboration that increases stakeholder engagement, retention, and innovation.",
    },
  ]

  return (
    <SitePageShell
      title={lang === "ar" ? "معلومات عنا" : "About Us"}
      subtitle={lang === "ar" ? "قصتنا ورؤيتنا ومهمتنا" : "Our story, vision, and mission"}
      crumbs={[
        { label: t("common.breadcrumbHome"), href: "/" },
        { label: lang === "ar" ? "معلومات عنا" : "About Us" },
      ]}
    >
      <PageSection>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-muted shadow-lg">
            <Image
              src="/pages/about-us.png"
              alt={lang === "ar" ? "معلومات عنا" : "About Us"}
              width={800}
              height={600}
              className="h-auto w-full object-cover"
              unoptimized
            />
          </div>
          <div>
            <SectionHeading title={lang === "ar" ? "قصتنا" : "Our Story"} />
            <div className="grid gap-4">
              {story.map((p) => (
                <p key={p.slice(0, 24)} className="leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {pillars.map((item) => (
            <ContentCard key={item.title}>
              <h3 className="text-lg font-bold text-primary">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{item.text}</p>
            </ContentCard>
          ))}
        </div>
      </PageSection>
      <Stats />
    </SitePageShell>
  )
}
