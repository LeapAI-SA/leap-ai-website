"use client"

import Image from "next/image"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { socialIcons, socialLabels } from "@/components/social-icons"
import { useLanguage } from "@/lib/i18n"
import { useSiteSettings } from "@/lib/site-settings-context"
import { resolveMediaUrl } from "@/lib/media"
import { safeSocialLinks, type SocialPlatform } from "@/lib/social-links"
import type { TranslationKey } from "@/lib/translations"

const quickLinks: { key: TranslationKey; href: string }[] = [
  { key: "nav.home", href: "/" },
  { key: "nav.about", href: "/about-us" },
  { key: "nav.partner", href: "/become-a-partner" },
  { key: "nav.contact", href: "/contact-us" },
]

const legalLinks = [
  { href: "/privacy-policy", ar: "سياسة الخصوصية", en: "Privacy Policy" },
  { href: "/#faq", ar: "أسئلة شائعة", en: "FAQ" },
]

export function SiteFooter() {
  const { t, lang } = useLanguage()
  const { settings } = useSiteSettings()
  const social = safeSocialLinks(settings?.social)
  const email = settings?.contact.email ?? "info@leapai.ai"
  const phone = settings?.contact.phone ?? "+966 53 553 3627"
  const phoneHref = phone.replace(/\s/g, "")
  const mission = settings?.seo?.footerText?.[lang] ?? t("footer.mission")

  return (
    <footer id="contact" className="bg-navy text-navy-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="mx-auto max-w-3xl text-balance text-center text-xl font-bold leading-relaxed text-navy-foreground md:text-2xl">
          {mission}
        </h2>

        <div className="mt-14 grid gap-10 border-t border-navy-foreground/15 pt-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image src={resolveMediaUrl("/leapai-logo-white.png")} alt="LeapAI" width={150} height={48} className="h-11 w-auto" />
            <ul className="mt-5 flex flex-col gap-2.5">
              {quickLinks.map((l) => (
                <li key={l.key}>
                  <a href={l.href} className="text-navy-foreground/75 transition-colors hover:text-amber">
                    {t(l.key)}
                  </a>
                </li>
              ))}
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-navy-foreground/75 transition-colors hover:text-amber">
                    {lang === "ar" ? l.ar : l.en}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold">{t("footer.contactTitle")}</h3>
            <ul className="mt-5 flex flex-col gap-3 text-navy-foreground/75">
              <li>
                <a href={`tel:${phoneHref}`} className="flex items-center gap-2 transition-colors hover:text-amber">
                  <Phone className="size-4 text-amber" />
                  <span dir="ltr">{phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-center gap-2 transition-colors hover:text-amber">
                  <Mail className="size-4 text-amber" />
                  {email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold">{t("contact.locationTitle")}</h3>
            <p className="mt-5 flex items-start gap-2 leading-relaxed text-navy-foreground/75">
              <MapPin className="mt-1 size-4 shrink-0 text-amber" />
              {settings?.contact.address?.[lang] ?? t("footer.locationDetail")}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold">{t("footer.hoursTitle")}</h3>
            <p className="mt-5 flex items-center gap-2 text-navy-foreground/75">
              <Clock className="size-4 text-amber" />
              {t("footer.hoursDetail")}
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-navy-foreground/15 pt-8 sm:flex-row">
          <p className="text-sm text-navy-foreground/60">{t("footer.copyright")}</p>
          <div className="flex items-center gap-3">
            {(Object.keys(socialIcons) as SocialPlatform[]).map((key) => {
              const url = social[key]
              if (!url) return null
              const Icon = socialIcons[key]
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={socialLabels[key]}
                  className="flex size-9 items-center justify-center rounded-full border border-navy-foreground/20 text-navy-foreground/70 transition-colors hover:border-amber hover:bg-amber hover:text-accent-foreground"
                >
                  <Icon className="size-4" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
