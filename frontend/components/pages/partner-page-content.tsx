"use client"

import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { SitePageShell } from "@/components/site-page-shell"
import { PageSection, SectionHeading } from "@/components/section-heading"
import { PartnerForm } from "@/components/partner-form"
import { useLanguage } from "@/lib/i18n"

export function PartnerPageContent() {
  const { t } = useLanguage()

  const contactInfo = [
    {
      icon: Phone,
      title: t("partner.callUs"),
      lines: ["+966 53 553 3627"],
      ltr: true,
    },
    {
      icon: Mail,
      title: t("partner.ourEmail"),
      lines: ["info@leapai.ai"],
      ltr: true,
    },
    {
      icon: MapPin,
      title: t("partner.ourLocation"),
      lines: [t("footer.locationDetail")],
    },
    {
      icon: Clock,
      title: t("partner.workingHours"),
      lines: [t("partner.hoursLine1"), t("partner.hoursLine2")],
    },
  ]

  return (
    <SitePageShell
      title={t("partner.title")}
      subtitle={t("partner.pageSub")}
      crumbs={[
        { label: t("common.breadcrumbHome"), href: "/" },
        { label: t("partner.title") },
      ]}
    >
      <PageSection>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div className="flex flex-col gap-6">
            <SectionHeading title={t("partner.sideTitle")} subtitle={t("partner.sideText")} />

            <ul className="flex flex-col gap-4">
              {contactInfo.map((item) => (
                <li key={item.title} className="flex items-start gap-4 rounded-xl border border-border bg-card p-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-foreground">{item.title}</h3>
                    {item.lines.map((line) => (
                      <p
                        key={line}
                        dir={item.ltr ? "ltr" : undefined}
                        className="text-sm leading-relaxed text-muted-foreground"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <PartnerForm />
        </div>
      </PageSection>
    </SitePageShell>
  )
}
