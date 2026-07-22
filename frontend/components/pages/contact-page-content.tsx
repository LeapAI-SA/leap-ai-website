"use client"

import { MapPin, Mail, Phone } from "lucide-react"
import { SitePageShell } from "@/components/site-page-shell"
import { PageSection, SectionHeading } from "@/components/section-heading"
import { ContactForm } from "@/components/contact-form"
import { useLanguage } from "@/lib/i18n"
import { useSiteSettings } from "@/lib/site-settings-context"

export function ContactPageContent() {
  const { t, lang } = useLanguage()
  const { settings } = useSiteSettings()

  const email = settings?.contact.email ?? "info@leapai.ai"
  const phone = settings?.contact.phone ?? "+966 53 553 3627"
  const phoneHref = phone.replace(/\s/g, "")
  const address = settings?.contact.address?.[lang] ?? t("contact.locationLine")
  const mapQuery = encodeURIComponent(address)

  const contactCards = [
    {
      icon: MapPin,
      title: t("contact.locationTitle"),
      line: address,
      actionLabel: t("contact.mapLink"),
      href: `https://maps.google.com/maps?q=${mapQuery}`,
    },
    {
      icon: Mail,
      title: t("contact.emailTitle"),
      line: email,
      ltr: true,
      actionLabel: t("contact.emailAction"),
      href: `mailto:${email}`,
    },
    {
      icon: Phone,
      title: t("contact.callTitle"),
      line: phone,
      ltr: true,
      actionLabel: t("contact.callAction"),
      href: `tel:${phoneHref}`,
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
              src={`https://maps.google.com/maps?q=${mapQuery}&t=m&z=13&output=embed&iwloc=near`}
              className="h-full min-h-[240px] w-full sm:min-h-[360px] lg:min-h-[450px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </PageSection>
    </SitePageShell>
  )
}
