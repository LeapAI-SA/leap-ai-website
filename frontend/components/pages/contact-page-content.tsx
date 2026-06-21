"use client"

import { MapPin, Mail, Phone } from "lucide-react"
import { SitePageShell } from "@/components/site-page-shell"
import { PageSection, SectionHeading } from "@/components/section-heading"
import { ContactForm } from "@/components/contact-form"
import { useLanguage } from "@/lib/i18n"

export function ContactPageContent() {
  const { t } = useLanguage()

  const contactCards = [
    {
      icon: MapPin,
      title: t("contact.locationCity"),
      line: t("contact.locationLine"),
      actionLabel: t("contact.mapLink"),
      href: "https://maps.google.com/maps?q=leapai",
    },
    {
      icon: Mail,
      title: t("contact.emailTitle"),
      line: "info@leapai.ai",
      ltr: true,
      actionLabel: t("contact.emailAction"),
      href: "mailto:info@leapai.ai",
    },
    {
      icon: Phone,
      title: t("contact.callTitle"),
      line: "+966 53 553 3627",
      ltr: true,
      actionLabel: t("contact.callAction"),
      href: "tel:+966535533627",
    },
  ]

  return (
    <SitePageShell
      title={t("contact.title")}
      subtitle={t("contact.pageSub")}
      crumbs={[
        { label: t("common.breadcrumbHome"), href: "/" },
        { label: t("contact.title") },
      ]}
    >
      <PageSection className="pb-0">
        <SectionHeading title={t("contact.title")} subtitle={t("contact.pageSub")} />
        <div className="grid gap-6 md:grid-cols-3">
          {contactCards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-shadow hover:shadow-lg"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <card.icon className="size-7" />
              </span>
              <h3 className="text-lg font-bold text-foreground">{card.title}</h3>
              <p dir={card.ltr ? "ltr" : undefined} className="leading-relaxed text-muted-foreground">
                {card.line}
              </p>
              <a
                href={card.href}
                target="_blank"
                rel="noreferrer"
                className="mt-1 text-sm font-bold text-amber transition-colors hover:text-primary"
              >
                {card.actionLabel}
              </a>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <div className="grid items-stretch gap-10 lg:grid-cols-2">
          <ContactForm />
          <div className="overflow-hidden rounded-3xl border border-border shadow-lg">
            <iframe
              title={t("contact.mapTitle")}
              src="https://maps.google.com/maps?q=Riyadh%20King%20Abdulaziz%20Road&t=m&z=13&output=embed&iwloc=near"
              className="h-full min-h-[450px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </PageSection>
    </SitePageShell>
  )
}
