"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  MessageCircle,
  Phone,
  Star,
  User,
} from "lucide-react"
import type { CampaignLanding } from "@/lib/cms"
import { submitCampaignLead } from "@/lib/api"
import { isValidEmailFormat } from "@/lib/business-email"
import { useLanguage } from "@/lib/i18n"
import { resolveMediaUrl } from "@/lib/media"
import { activePartners, mergePartners } from "@/lib/site-marketing"
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

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
}

export function CampaignLandingContent({ campaign }: { campaign: CampaignLanding }) {
  const { t, tr, lang } = useLanguage()
  const { settings } = useSiteSettings()
  const logoSrc = resolveMediaUrl(settings?.images?.logo ?? "/leapai-logo.png")
  const phone = campaign.contactPhone.trim() || settings?.contact?.phone || "+966 53 553 3627"
  const officialEmail = campaign.officialEmail.trim() || settings?.contact?.email || "info@leapai.ai"
  const website = campaign.officialWebsite.trim() || PRODUCTION_SITE_URL
  const displayName = tr(campaign.title).trim() || "LeapAI"
  const profileDescription =
    tr(campaign.profileDescription).trim() ||
    tr(campaign.excerpt).trim() ||
    (lang === "ar" ? settings?.geo?.llmsTagline?.ar : settings?.geo?.llmsTagline?.en)?.trim() ||
    t("campaign.profileDefaultDescription")
  const partners = activePartners(mergePartners(settings?.partners))
  const statHighlight = settings?.stats?.[0]

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
    const leadEmail = email.trim()
    const phoneDigits = phoneValue.replace(/\D/g, "")

    if (!fullName) {
      setError(t("demo.nameRequired"))
      return
    }
    if (!isValidEmailFormat(leadEmail)) {
      setError(t("demo.emailInvalid"))
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
        email: leadEmail,
        phone: phoneValue.trim(),
      })
      setSent(true)
    } catch (err) {
      const code = err instanceof Error ? err.message : ""
      setError(code === "duplicate_lead" ? t("campaign.duplicateLead") : code || t("demo.error"))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f7fb]">
      <div className="pointer-events-none fixed -left-32 top-20 size-96 rounded-full bg-primary/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none fixed -right-32 top-1/3 size-80 rounded-full bg-amber/10 blur-3xl" aria-hidden />

      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href={sitePath("/", lang)} className="inline-flex shrink-0 items-center">
            <Image src={logoSrc} alt="LeapAI" width={140} height={44} className="h-9 w-auto sm:h-10" priority />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {benefits.length > 0 ? (
              <button
                type="button"
                onClick={() => scrollTo("benefits")}
                className="text-sm font-semibold text-muted-foreground transition-colors hover:text-navy"
              >
                {t("campaign.navBenefits")}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => scrollTo("contact")}
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-navy"
            >
              {t("campaign.navContact")}
            </button>
          </nav>

          <button
            type="button"
            onClick={() => scrollTo("form")}
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-colors hover:bg-primary/90 sm:px-5"
          >
            {t("campaign.getStarted")}
          </button>
        </div>
      </header>

      <main className="relative flex-1">
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="lg:pt-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{t("campaign.eyebrow")}</p>
              <h1 className="mt-4 text-balance text-3xl font-extrabold leading-tight tracking-tight text-navy sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
                {tr(campaign.title)}
              </h1>
              {tr(campaign.excerpt) ? (
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">{tr(campaign.excerpt)}</p>
              ) : null}
              {tr(campaign.description) ? (
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground/90">{tr(campaign.description)}</p>
              ) : null}

              <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-border/60 bg-background/80 px-4 py-3 shadow-sm">
                <div className="flex -space-x-2 rtl:space-x-reverse">
                  {[1, 2, 3].map((n) => (
                    <span
                      key={n}
                      className="flex size-9 items-center justify-center rounded-full border-2 border-background bg-navy text-xs font-bold text-navy-foreground"
                    >
                      {n === 1 ? "CX" : n === 2 ? "AI" : "SA"}
                    </span>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5 text-amber">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-0.5 text-sm font-semibold text-navy">{t("campaign.socialProof")}</p>
                  {statHighlight ? (
                    <p className="text-xs text-muted-foreground">
                      {statHighlight.value.toLocaleString(lang === "ar" ? "ar-SA" : "en-US")}+{" "}
                      {lang === "ar" ? statHighlight.label.ar : statHighlight.label.en}
                    </p>
                  ) : null}
                </div>
              </div>

              {benefits.length > 0 ? (
                <ul className="mt-8 space-y-3">
                  {benefits.slice(0, 4).map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {campaign.image ? (
                <div className="mt-10 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-lg shadow-navy/5 lg:hidden">
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

            <div id="form" className="scroll-mt-24 lg:sticky lg:top-24">
              <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-xl shadow-navy/10 sm:p-8">
                {campaign.variant === "whatsapp" ? (
                  <WhatsAppPanel
                    t={t}
                    displayName={displayName}
                    phone={phone}
                    officialEmail={officialEmail}
                    website={website}
                    profileDescription={profileDescription}
                    whatsappHref={whatsappHref}
                    websiteHref={websiteHref}
                    websiteLabel={websiteLabel}
                  />
                ) : sent ? (
                  <SuccessPanel t={t} />
                ) : (
                  <LeadFormPanel
                    t={t}
                    error={error}
                    name={name}
                    email={email}
                    phoneValue={phoneValue}
                    submitting={submitting}
                    onNameChange={setName}
                    onEmailChange={setEmail}
                    onPhoneChange={setPhoneValue}
                    onSubmit={handleSubmit}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {benefits.length > 4 ? (
          <section id="benefits" className="scroll-mt-24 border-y border-border/60 bg-background py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <h2 className="text-center text-2xl font-extrabold text-navy">{t("campaign.benefits")}</h2>
              <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {benefits.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 rounded-2xl border border-border/60 bg-[#f4f7fb] p-5 text-sm leading-relaxed text-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {campaign.image ? (
          <section className="mx-auto hidden max-w-7xl px-4 py-12 sm:px-6 lg:block">
            <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-lg shadow-navy/5">
              <Image
                src={resolveMediaUrl(campaign.image)}
                alt={tr(campaign.title)}
                width={1200}
                height={640}
                className="h-auto w-full object-cover"
              />
            </div>
          </section>
        ) : null}

        {partners.length > 0 ? (
          <section className="border-t border-border/60 bg-background py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {t("campaign.trustedBy")}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
                {partners.slice(0, 6).map((p) => (
                  <div
                    key={p.name}
                    className="flex h-12 w-28 items-center justify-center opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                  >
                    <Image
                      src={resolveMediaUrl(p.logo || "/placeholder.svg")}
                      alt={p.name}
                      width={112}
                      height={48}
                      className="h-full w-auto max-w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <footer id="contact" className="scroll-mt-24 border-t border-navy/20 bg-navy text-navy-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Link href={sitePath("/", lang)} className="inline-flex items-center">
            <Image
              src={resolveMediaUrl("/leapai-logo-white.png")}
              alt="LeapAI"
              width={120}
              height={40}
              className="h-9 w-auto"
            />
          </Link>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy-foreground/75">
            <Link href={sitePath("/privacy-policy", lang)} className="transition-colors hover:text-amber">
              {lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
            </Link>
            <Link href={sitePath("/contact-us", lang)} className="transition-colors hover:text-amber">
              {t("campaign.navContact")}
            </Link>
            <Link href={sitePath("/", lang)} className="transition-colors hover:text-amber">
              {t("campaign.backHome")}
            </Link>
          </nav>
          <p className="text-xs text-navy-foreground/50" dir="ltr">
            © {new Date().getFullYear()} LeapAI
          </p>
        </div>
      </footer>
    </div>
  )
}

function LeadFormPanel({
  t,
  error,
  name,
  email,
  phoneValue,
  submitting,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onSubmit,
}: {
  t: ReturnType<typeof useLanguage>["t"]
  error: string | null
  name: string
  email: string
  phoneValue: string
  submitting: boolean
  onNameChange: (v: string) => void
  onEmailChange: (v: string) => void
  onPhoneChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
}) {
  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        {error ? (
          <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}
        <label className="block">
          <span className="sr-only">{t("demo.fullName")}</span>
          <span className="relative flex items-center">
            <User className="pointer-events-none absolute start-3.5 size-4 text-muted-foreground" />
            <input
              required
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="form-input ps-10"
              placeholder={t("demo.fullName")}
              autoComplete="name"
            />
          </span>
        </label>
        <label className="block">
          <span className="sr-only">{t("campaign.email")}</span>
          <span className="relative flex items-center">
            <Mail className="pointer-events-none absolute start-3.5 size-4 text-muted-foreground" />
            <input
              required
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="form-input ps-10"
              placeholder={t("campaign.emailPlaceholder")}
              autoComplete="email"
            />
          </span>
        </label>
        <label className="block">
          <span className="sr-only">{t("demo.phone")}</span>
          <span className="relative flex items-center">
            <Phone className="pointer-events-none absolute start-3.5 size-4 text-muted-foreground" />
            <input
              required
              type="tel"
              dir="ltr"
              value={phoneValue}
              onChange={(e) => onPhoneChange(e.target.value)}
              className="form-input ps-10"
              placeholder={t("demo.phonePlaceholder")}
              autoComplete="tel"
            />
          </span>
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/25 transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {submitting ? t("campaign.submitting") : t("campaign.submit")}
          {!submitting ? <ArrowRight className="size-4 rtl:rotate-180" /> : null}
        </button>
        <p className="text-center text-xs leading-relaxed text-muted-foreground">{t("campaign.formNote")}</p>
      </form>
    </>
  )
}

function SuccessPanel({ t }: { t: ReturnType<typeof useLanguage>["t"] }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="size-9" />
      </span>
      <h2 className="mt-5 text-2xl font-bold text-navy">{t("campaign.success")}</h2>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">{t("campaign.successText")}</p>
    </div>
  )
}

function WhatsAppPanel({
  t,
  displayName,
  phone,
  officialEmail,
  website,
  profileDescription,
  whatsappHref,
  websiteHref,
  websiteLabel,
}: {
  t: ReturnType<typeof useLanguage>["t"]
  displayName: string
  phone: string
  officialEmail: string
  website: string
  profileDescription: string
  whatsappHref: string
  websiteHref: (url: string) => string
  websiteLabel: (url: string) => string
}) {
  return (
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
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-bold text-primary-foreground shadow-md shadow-primary/25 transition-colors hover:bg-primary/90"
      >
        <MessageCircle className="size-5" />
        {t("campaign.whatsappCta")}
      </a>
      <dl className="mt-8 w-full space-y-3 rounded-2xl border border-border/80 bg-muted/30 p-4 text-start">
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
  )
}
