"use client"

import Image from "next/image"
import { SitePageShell } from "@/components/site-page-shell"
import { PageSection, SectionHeading, ContentCard } from "@/components/section-heading"
import { useLanguage } from "@/lib/i18n"

export function PrivacyPageContent() {
  const { t, lang } = useLanguage()

  const sections =
    lang === "ar"
      ? [
          {
            title: "جمع المعلومات",
            body: "نجمع المعلومات التي تقدمها لنا مباشرة عند التسجيل أو التواصل معنا، مثل الاسم والبريد الإلكتروني ورقم الهاتف وبيانات الشركة.",
          },
          {
            title: "استخدام المعلومات",
            body: "نستخدم معلوماتك لتقديم خدماتنا، وتحسين تجربة العملاء، والرد على استفساراتك، وإرسال التحديثات المتعلقة بخدمات LeapAI.",
          },
          {
            title: "حماية البيانات",
            body: "نطبق معايير أمان عالية لحماية بياناتك وفق أفضل الممارسات واللوائح المعمول بها في المملكة العربية السعودية.",
          },
          {
            title: "حقوقك",
            body: "يمكنك طلب الوصول إلى بياناتك أو تصحيحها أو حذفها بالتواصل معنا عبر info@leapai.ai.",
          },
        ]
      : [
          {
            title: "Information We Collect",
            body: "We collect information you provide directly when registering or contacting us, such as name, email, phone number, and company details.",
          },
          {
            title: "How We Use Information",
            body: "We use your information to deliver our services, improve customer experience, respond to inquiries, and send updates related to LeapAI services.",
          },
          {
            title: "Data Protection",
            body: "We apply high security standards to protect your data in accordance with best practices and applicable regulations in Saudi Arabia.",
          },
          {
            title: "Your Rights",
            body: "You may request access, correction, or deletion of your data by contacting us at info@leapai.ai.",
          },
        ]

  return (
    <SitePageShell
      title={lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
      subtitle={lang === "ar" ? "كيف نحمي ونستخدم بياناتك" : "How we protect and use your data"}
      crumbs={[
        { label: t("common.breadcrumbHome"), href: "/" },
        { label: lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy" },
      ]}
    >
      <PageSection className="py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 overflow-hidden rounded-2xl border border-border shadow-sm">
            <Image
              src="/sections/ticket-overview.png"
              alt={lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
              width={960}
              height={320}
              className="h-48 w-full object-cover md:h-56"
              unoptimized
            />
          </div>
          <SectionHeading
            title={lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
            subtitle={
              lang === "ar"
                ? "نلتزم بحماية خصوصيتك وبياناتك الشخصية."
                : "We are committed to protecting your privacy and personal data."
            }
          />
          <div className="space-y-6">
            {sections.map((section) => (
              <ContentCard key={section.title}>
                <h2 className="text-xl font-bold text-navy">{section.title}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{section.body}</p>
              </ContentCard>
            ))}
          </div>
        </div>
      </PageSection>
    </SitePageShell>
  )
}
