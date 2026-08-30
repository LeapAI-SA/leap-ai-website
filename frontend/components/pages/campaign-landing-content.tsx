"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { CheckCircle2, MessageCircle, Send } from "lucide-react"
import type { CampaignLanding } from "@/lib/cms"
import { submitCampaignLead } from "@/lib/api"
import { isBusinessEmail, isValidEmailFormat } from "@/lib/business-email"
import { useLanguage } from "@/lib/i18n"
import { resolveMediaUrl } from "@/lib/media"
import { sitePath } from "@/lib/site-path"
import { useSiteSettings } from "@/lib/site-settings-context"
import { PRODUCTION_SITE_URL } from "@/lib/site-url"

function toWaDigits(phone: string) {
  const digits = phone.replace(/\D/g, "")
  if (digits.startsWith("0") && digits.length >= 9) return `966${digits.slice(1)}`
  return digits || "966535533627"
}

function websiteHref(url: string) {
  const trimmed = url.trim()
  if (!trimmed) return PRODUCTION_SITE_URL
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

function websiteLabel(url: string) {
  return websiteHref(url).replace(/^https:\/\//i, "").replace(/\/$/, "")
}

export function CampaignLandingContent({ campaign }: { campaign: CampaignLanding }) {
  const { t, tr, lang } = useLanguage()
  const { settings } = useSiteSettings()
  const phone = campaign.contactPhone.trim() || settings?.contact?.phone || "+966 53 553 3627"
  const officialEmail = campaign.officialEmail.trim() || settings?.contact?.email || "info@leapai.ai"
  const website = campaign.officialWebsite.trim() || PRODUCTION_SITE_URL
  const displayName = tr(campaign.title).trim() || "LeapAI"
  const profileDescription =
    tr(campaign.profileDescription).trim() ||
    tr(campaign.excerpt).trim() ||
    (lang === "ar" ? settings?.geo?.llmsTagline?.ar : settings?.geo?.llmsTagline?.en)?.trim() ||
    t("campaign.profileDefaultDescription")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneValue, setPhoneValue] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const benefits = useMemo(() => {
    const list = lang === "ar" ? campaign.features.ar : campaign.features.en
    return list.map((line) => line.trim()).filter(Boolean)
  }, [campaign.features, lang])

  const whatsappHref = useMemo(() => {
    const prefill = tr(campaign.whatsappPrefill).trim() || t("campaign.defaultPrefill")
    return `https://wa.me/${toWaDigits(phone)}?text=${encodeURIComponent(prefill)}`
  }, [campaign.whatsappPrefill, phone, t, tr])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fullName = name.trim()
    const businessEmail = email.trim()
    const phoneDigits = phoneValue.replace(/\D/g, "")

    if (!fullName) {
      setError(t("demo.nameRequired"))
      return
    }
    if (!isValidEmailFormat(businessEmail)) {
      setError(t("demo.emailInvalid"))
      return
    }
    if (!isBusinessEmail(businessEmail)) {
      setError(t("demo.emailBusinessOnly"))
      return
    }
    if (phoneDigits.length < 8) {
      setError(t("demo.phoneRequired"))
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      await submitCampaignLead({
        campaignSlug: campaign.slug,
        name: fullName,
        email: businessEmail,
        phone: phoneValue.trim(),
      })
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("demo.error"))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute -left-24 top-24 size-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-24 size-72 rounded-full bg-amber/15 blur-3xl" />

      <header className="relative border-b border-white/10 bg-navy text-navy-foreground">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href={sitePath("/", lang)} className="inline-flex items-center">
            <Image
              src={resolveMediaUrl("/leapai-logo-white.png")}
              alt="LeapAI"
              width={140}
              height={44}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <Link
            href={sitePath("/", lang)}
            className="text-sm font-bold text-navy-foreground/80 transition-colors hover:text-amber"
          >
            {t("campaign.backHome")}
          </Link>
        </div>
      </header>

      <section className="relative mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-start lg:py-16">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">LeapAI</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">{tr(campaign.title)}</h1>
          {tr(campaign.excerpt) ? (
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{tr(campaign.excerpt)}</p>
          ) : null}
          {tr(campaign.description) ? (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{tr(campaign.description)}</p>
          ) : null}

          {benefits.length > 0 ? (
            <div className="mt-8 rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-primary">{t("campaign.benefits")}</h2>
              <ul className="mt-4 space-y-3">
                {benefits.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {campaign.image ? (
            <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <Image
                src={resolveMediaUrl(campaign.image)}
                alt={tr(campaign.title)}
                width={960}
                height={640}
                className="h-auto w-full object-cover"
              />
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-lg shadow-navy/5 sm:p-8">
          {campaign.variant === "whatsapp" ? (
            <div className="flex flex-col items-center text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageCircle className="size-8" />
              </span>
              <h2 className="mt-5 text-2xl font-bold text-navy">{t("campaign.whatsappCta")}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("campaign.whatsappHint")}</p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-bold text-primary-foreground shadow-md shadow-primary/25 transition-colors hover:bg-primary/90"
              >
                <MessageCircle className="size-5" />
                {t("campaign.whatsappCta")}
              </a>
              <dl className="mt-8 w-full space-y-3 rounded-2xl border border-border/80 bg-muted/40 p-4 text-start">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {t("campaign.profileDisplayName")}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-navy">{displayName}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {t("campaign.profilePhone")}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-navy" dir="ltr">
                    {phone}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {t("campaign.profileWebsite")}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold">
                    <a
                      href={websiteHref(website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline-offset-2 hover:underline"
                      dir="ltr"
                    >
                      {websiteLabel(website)}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {t("campaign.profileEmail")}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold">
                    <a href={`mailto:${officialEmail}`} className="text-primary underline-offset-2 hover:underline" dir="ltr">
                      {officialEmail}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    {t("campaign.profileDescription")}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{profileDescription}</dd>
                </div>
              </dl>
            </div>
          ) : sent ? (
            <div className="flex flex-col items-center py-6 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="size-9" />
              </span>
              <h2 className="mt-5 text-2xl font-bold text-navy">{t("campaign.success")}</h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {t("campaign.successText")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded-2xl bg-navy px-4 py-3 text-start text-navy-foreground">
                <h2 className="text-lg font-bold">{t("campaign.submit")}</h2>
              </div>
              {error ? (
                <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
              <label className="block space-y-1.5">
                <span className="text-sm font-bold text-navy">{t("demo.fullName")}</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  autoComplete="name"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-bold text-navy">{t("demo.businessEmail")}</span>
                <input
                  required
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder={t("demo.emailPlaceholder")}
                  autoComplete="email"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-bold text-navy">{t("demo.phone")}</span>
                <input
                  required
                  type="tel"
                  dir="ltr"
                  value={phoneValue}
                  onChange={(e) => setPhoneValue(e.target.value)}
                  className="form-input"
                  placeholder={t("demo.phonePlaceholder")}
                  autoComplete="tel"
                />
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/25 transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                <Send className="size-4" />
                {submitting ? t("campaign.submitting") : t("campaign.submit")}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}
