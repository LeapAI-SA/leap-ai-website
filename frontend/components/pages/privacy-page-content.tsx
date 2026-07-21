"use client"

import Image from "next/image"
import { SitePageShell } from "@/components/site-page-shell"
import { PageSection, SectionHeading, ContentCard } from "@/components/section-heading"
import { useLanguage } from "@/lib/i18n"
import { pickLocalized } from "@/lib/api"
import { resolveMediaUrl } from "@/lib/media"
import { useSiteSettings } from "@/lib/site-settings-context"
import { mergePrivacyPage } from "@/lib/site-marketing"

export function PrivacyPageContent() {
  const { t, lang, tr } = useLanguage()
  const { settings } = useSiteSettings()
  const page = mergePrivacyPage(settings?.privacyPage)

  const title = pickLocalized(page.title, lang, lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy")
  const subtitle = pickLocalized(page.subtitle, lang, lang === "ar" ? "كيف نحمي ونستخدم بياناتك" : "How we protect and use your data")
  const introTitle = pickLocalized(page.introTitle, lang, title)
  const introSubtitle = pickLocalized(
    page.introSubtitle,
    lang,
    lang === "ar" ? "نلتزم بحماية خصوصيتك وبياناتك الشخصية." : "We are committed to protecting your privacy and personal data.",
  )

  return (
    <SitePageShell
      title={title}
      subtitle={subtitle}
      crumbs={[
        { label: t("common.breadcrumbHome"), href: "/" },
        { label: title },
      ]}
    >
      <PageSection className="py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 overflow-hidden rounded-2xl border border-border shadow-sm">
            <Image
              src={resolveMediaUrl(page.image)}
              alt={pickLocalized(page.imageAlt, lang, title)}
              width={960}
              height={320}
              className="h-48 w-full object-cover md:h-56"
              unoptimized
            />
          </div>
          <SectionHeading title={introTitle} subtitle={introSubtitle} />
          <div className="space-y-6">
            {page.sections.map((section, index) => (
              <ContentCard key={`${index}-${pickLocalized(section.title, lang)}`}>
                <h2 className="text-xl font-bold text-navy">{tr(section.title)}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{tr(section.body)}</p>
              </ContentCard>
            ))}
          </div>
        </div>
      </PageSection>
    </SitePageShell>
  )
}
