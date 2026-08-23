"use client"

import { useEffect, useState } from "react"
import { mapAdminError } from "@/lib/admin-i18n"
import { adminTf } from "@/lib/admin-tf"
import { adminFetch, type PublicSiteSettings } from "@/lib/api"
import {
  PageHeader,
  Panel,
  Alert,
  LoadingBlock,
  LocalizedFieldGroup,
  Toggle,
  FormField,
  StickySaveBar,
  ImageUploadField,
  DashButton,
} from "@/components/dashboard/ui"

import { mergeSocialLinks, SOCIAL_PLATFORMS } from "@/lib/social-links"
import { geoFaqItems } from "@/lib/geo-faq"
import {
  DEFAULT_GEO_SETTINGS,
  mergeGeoSettings,
  geoCapabilitiesToText,
  textToGeoCapabilities,
} from "@/lib/geo-defaults"
import { notifySettingsUpdated } from "@/lib/cms-refresh"
import { DEFAULT_NAVIGATION, mergeNavigation, type SiteNavLink, type SiteNavigation } from "@/lib/site-nav"
import {
  DEFAULT_PARTNERS,
  DEFAULT_PRICING_PLANS,
  DEFAULT_ADDONS_SECTION,
  DEFAULT_ABOUT_PAGE,
  DEFAULT_PRIVACY_PAGE,
  DEFAULT_CTA_LABELS,
  DEFAULT_STORE_INTEGRATION_LINKS,
  featuresToText,
  mergePartners,
  mergePricingPlans,
  mergeAddonsSection,
  mergeAboutPage,
  mergePrivacyPage,
  mergeCtaLabels,
  mergeStoreIntegrationLinks,
  paragraphsToText,
  textToFeatures,
  textToParagraphs,
  type PartnerLogo,
  type AddonItemCms,
  type AddonsSection,
  type AboutPageSettings,
  type PrivacyPageSettings,
  type PrivacySection,
  type CtaLabels,
} from "@/lib/site-marketing"
import type { PricingPlan } from "@/lib/site-data"
import { useLanguage } from "@/lib/i18n"

const DEFAULT_IMAGES = {
  hero: "/hero-dashboard.png",
  ticketOverview: "/sections/ticket-overview.png",
  omniChannel: "/sections/omni-channel.png",
  logo: "/leapai-logo.png",
}

const DEFAULT_SEO = {
  siteTitle: {
    ar: "LeapAI — المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي",
    en: "LeapAI — Saudi Arabia's premier AI-native CX platform",
  },
  metaDescription: {
    ar: "LeapAI هي المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي: مركز اتصال متعدد القنوات، واتساب للأعمال، شات بوت ذكي، وتكاملات سلة وزد وOdoo — استضافة محلية في الرياض ومتوافقة مع نظام حماية البيانات الشخصية.",
    en: "LeapAI is Saudi Arabia's premier AI-native CX platform for omni-channel contact centers, WhatsApp Business, AI chatbots, and enterprise integrations — PDPL-ready local hosting in Riyadh.",
  },
  footerText: {
    ar: "هدفنا هو تمكين العلاقة التكافلية بين البشر والذكاء الاصطناعي — ودفع نجاح الأعمال مع إثراء الحياة.",
    en: "Our goal is to enable a symbiotic relationship between humans and AI — and to drive business success while enriching lives.",
  },
  brandLock: "LeapAI",
}

const DEFAULT_FAQ = geoFaqItems.slice(0, 4)

function normalizeSettings(data: PublicSiteSettings): PublicSiteSettings {
  return {
    ...data,
    images: { ...DEFAULT_IMAGES, ...data.images },
    social: mergeSocialLinks(data.social),
    storeIntegrationLinks: mergeStoreIntegrationLinks(data.storeIntegrationLinks),
    seo: { ...DEFAULT_SEO, ...data.seo },
    navigation: mergeNavigation(data.navigation),
    partners: mergePartners(data.partners),
    pricingPlans: mergePricingPlans(data.pricingPlans),
    addons: mergeAddonsSection(data.addons),
    aboutPage: mergeAboutPage(data.aboutPage),
    privacyPage: mergePrivacyPage(data.privacyPage),
    ctaLabels: mergeCtaLabels(data.ctaLabels),
    faq: data.faq?.length ? data.faq : DEFAULT_FAQ,
    geo: mergeGeoSettings(data.geo),
  }
}

function NavLinksEditor({
  title,
  description,
  links,
  onChange,
}: {
  title: string
  description: string
  links: SiteNavLink[]
  onChange: (links: SiteNavLink[]) => void
}) {
  const { t } = useLanguage()

  function updateLink(index: number, patch: Partial<SiteNavLink>) {
    const next = [...links]
    next[index] = { ...next[index], ...patch }
    onChange(next)
  }

  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-muted/10 p-4">
      <div>
        <h4 className="font-bold text-navy">{title}</h4>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {links.map((link, index) => (
        <div key={index} className="space-y-3 rounded-lg border border-border/50 bg-background p-4">
          <LocalizedFieldGroup
            label={adminTf(t, "admin.settings.linkLabel", { n: index + 1 })}
            value={link.label}
            onChange={(label) => updateLink(index, { label })}
            rows={1}
          />
          <FormField label={t("admin.common.pagePath")} hint={t("admin.common.pagePathHint")}>
            <input
              value={link.href}
              onChange={(e) => updateLink(index, { href: e.target.value })}
              className="form-input"
              placeholder="/about-us"
            />
          </FormField>
          <label className="flex items-center gap-2 text-sm font-semibold text-navy">
            <input
              type="checkbox"
              checked={link.enabled !== false}
              onChange={(e) => updateLink(index, { enabled: e.target.checked })}
            />
            {t("admin.common.showInMenu")}
          </label>
        </div>
      ))}
      <div className="flex gap-2">
        <DashButton
          type="button"
          variant="secondary"
          onClick={() =>
            onChange([...links, { label: { ar: "", en: "" }, href: "/", enabled: true }])
          }
        >
          {t("admin.common.addLink")}
        </DashButton>
        <DashButton
          type="button"
          variant="ghost"
          onClick={() => onChange(links.slice(0, Math.max(links.length - 1, 0)))}
          disabled={links.length === 0}
        >
          {t("admin.common.removeLast")}
        </DashButton>
      </div>
    </div>
  )
}

function PartnersEditor({
  partners,
  onChange,
}: {
  partners: PartnerLogo[]
  onChange: (partners: PartnerLogo[]) => void
}) {
  const { t } = useLanguage()

  function updatePartner(index: number, patch: Partial<PartnerLogo>) {
    const next = [...partners]
    next[index] = { ...next[index], ...patch }
    onChange(next)
  }

  return (
    <div className="space-y-4">
      {partners.map((partner, index) => (
        <div key={index} className="space-y-3 rounded-lg border border-border/50 bg-background p-4">
          <FormField label={adminTf(t, "admin.settings.partnerName", { n: index + 1 })}>
            <input
              value={partner.name}
              onChange={(e) => updatePartner(index, { name: e.target.value })}
              className="form-input"
            />
          </FormField>
          <ImageUploadField
            label={t("admin.common.logo")}
            value={partner.logo}
            onChange={(logo) => updatePartner(index, { logo })}
          />
          <label className="flex items-center gap-2 text-sm font-semibold text-navy">
            <input
              type="checkbox"
              checked={partner.enabled !== false}
              onChange={(e) => updatePartner(index, { enabled: e.target.checked })}
            />
            {t("admin.common.showOnHomepage")}
          </label>
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        <DashButton
          type="button"
          variant="secondary"
          onClick={() => onChange([...partners, { name: "", logo: "/logos/meta.png", enabled: true }])}
        >
          {t("admin.settings.addPartner")}
        </DashButton>
        <DashButton
          type="button"
          variant="ghost"
          onClick={() => onChange(partners.slice(0, Math.max(partners.length - 1, 0)))}
          disabled={partners.length === 0}
        >
          {t("admin.common.removeLast")}
        </DashButton>
        <DashButton type="button" variant="ghost" onClick={() => onChange([...DEFAULT_PARTNERS])}>
          {t("admin.common.resetDefaults")}
        </DashButton>
      </div>
    </div>
  )
}

function PricingPlansEditor({
  plans,
  onChange,
}: {
  plans: PricingPlan[]
  onChange: (plans: PricingPlan[]) => void
}) {
  const { t } = useLanguage()

  function updatePlan(index: number, patch: Partial<PricingPlan>) {
    const next = [...plans]
    next[index] = { ...next[index], ...patch }
    onChange(next)
  }

  return (
    <div className="space-y-6">
      {plans.map((plan, index) => (
        <div key={plan.slug || index} className="space-y-4 rounded-xl border border-border/60 bg-muted/10 p-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label={t("admin.settings.planSlug")} hint={t("admin.settings.planSlugHint")}>
              <input
                value={plan.slug}
                onChange={(e) => updatePlan(index, { slug: e.target.value })}
                className="form-input font-mono text-sm"
              />
            </FormField>
            <FormField label={t("admin.settings.planPrice")}>
              <input
                value={plan.price}
                onChange={(e) => updatePlan(index, { price: e.target.value })}
                className="form-input"
              />
            </FormField>
            <label className="flex items-center gap-2 self-end pb-2 text-sm font-semibold text-navy">
              <input
                type="checkbox"
                checked={plan.featured}
                onChange={(e) => updatePlan(index, { featured: e.target.checked })}
              />
              {t("admin.settings.planFeatured")}
            </label>
          </div>
          <LocalizedFieldGroup
            label={t("admin.settings.planName")}
            value={plan.name}
            onChange={(name) => updatePlan(index, { name })}
            rows={1}
          />
          <LocalizedFieldGroup
            label={t("admin.settings.planTagline")}
            value={plan.tagline}
            onChange={(tagline) => updatePlan(index, { tagline })}
            rows={2}
          />
          <LocalizedFieldGroup
            label={t("admin.settings.planFeatures")}
            value={{ ar: featuresToText(plan.features.ar), en: featuresToText(plan.features.en) }}
            onChange={(value) =>
              updatePlan(index, {
                features: { ar: textToFeatures(value.ar), en: textToFeatures(value.en) },
              })
            }
            rows={6}
          />
        </div>
      ))}
      <DashButton type="button" variant="ghost" onClick={() => onChange([...DEFAULT_PRICING_PLANS])}>
        {t("admin.settings.resetPricing")}
      </DashButton>
    </div>
  )
}

function AddonsEditor({ section, onChange }: { section: AddonsSection; onChange: (section: AddonsSection) => void }) {
  const { t } = useLanguage()

  function updateItem(index: number, patch: Partial<AddonItemCms>) {
    const items = [...section.items]
    items[index] = { ...items[index], ...patch }
    onChange({ ...section, items })
  }

  return (
    <div className="space-y-6">
      <LocalizedFieldGroup label={t("admin.settings.sectionBadge")} value={section.badge} onChange={(badge) => onChange({ ...section, badge })} rows={1} />
      <LocalizedFieldGroup label={t("admin.settings.sectionTitle")} value={section.title} onChange={(title) => onChange({ ...section, title })} rows={2} />
      <LocalizedFieldGroup label={t("admin.settings.sectionIntro")} value={section.lead} onChange={(lead) => onChange({ ...section, lead })} rows={2} />
      {section.items.map((item, index) => (
        <div key={index} className="space-y-3 rounded-lg border border-border/50 bg-background p-4">
          <LocalizedFieldGroup label={adminTf(t, "admin.settings.addonTitle", { n: index + 1 })} value={item.title} onChange={(title) => updateItem(index, { title })} rows={1} />
          <LocalizedFieldGroup label={t("admin.common.description")} value={item.desc} onChange={(desc) => updateItem(index, { desc })} rows={3} />
          <ImageUploadField label={t("admin.common.icon")} value={item.icon} onChange={(icon) => updateItem(index, { icon })} />
          <label className="flex items-center gap-2 text-sm font-semibold text-navy">
            <input type="checkbox" checked={item.enabled !== false} onChange={(e) => updateItem(index, { enabled: e.target.checked })} />
            {t("admin.common.showOnHomepage")}
          </label>
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        <DashButton
          type="button"
          variant="secondary"
          onClick={() =>
            onChange({
              ...section,
              items: [...section.items, { icon: "/icons/1.png", title: { ar: "", en: "" }, desc: { ar: "", en: "" }, enabled: true }],
            })
          }
        >
          {t("admin.common.addItem")}
        </DashButton>
        <DashButton type="button" variant="ghost" onClick={() => onChange({ ...section, items: section.items.slice(0, -1) })} disabled={!section.items.length}>
          {t("admin.common.removeLast")}
        </DashButton>
        <DashButton type="button" variant="ghost" onClick={() => onChange({ ...DEFAULT_ADDONS_SECTION })}>
          {t("admin.common.resetDefaults")}
        </DashButton>
      </div>
    </div>
  )
}

function AboutPageEditor({ about, onChange }: { about: AboutPageSettings; onChange: (about: AboutPageSettings) => void }) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <LocalizedFieldGroup label={t("admin.settings.pageTitle")} value={about.title} onChange={(title) => onChange({ ...about, title })} rows={1} />
      <LocalizedFieldGroup label={t("admin.settings.pageSubtitle")} value={about.subtitle} onChange={(subtitle) => onChange({ ...about, subtitle })} rows={1} />
      <ImageUploadField label={t("admin.settings.heroImage")} value={about.image} onChange={(image) => onChange({ ...about, image })} />
      <LocalizedFieldGroup label={t("admin.settings.imageAlt")} value={about.imageAlt} onChange={(imageAlt) => onChange({ ...about, imageAlt })} rows={1} />
      <LocalizedFieldGroup label={t("admin.settings.storyHeading")} value={about.storyHeading} onChange={(storyHeading) => onChange({ ...about, storyHeading })} rows={1} />
      <LocalizedFieldGroup
        label={t("admin.settings.storyParagraphs")}
        value={{ ar: paragraphsToText(about.story.ar), en: paragraphsToText(about.story.en) }}
        onChange={(value) => onChange({ ...about, story: { ar: textToParagraphs(value.ar), en: textToParagraphs(value.en) } })}
        rows={8}
      />
      <LocalizedFieldGroup label={t("admin.settings.visionTagline")} value={about.visionTagline} onChange={(visionTagline) => onChange({ ...about, visionTagline })} rows={1} />
      <LocalizedFieldGroup label={t("admin.settings.visionTitle")} value={about.visionTitle} onChange={(visionTitle) => onChange({ ...about, visionTitle })} rows={1} />
      <LocalizedFieldGroup label={t("admin.settings.visionText")} value={about.visionText} onChange={(visionText) => onChange({ ...about, visionText })} rows={3} />
      <LocalizedFieldGroup label={t("admin.settings.missionTitle")} value={about.missionTitle} onChange={(missionTitle) => onChange({ ...about, missionTitle })} rows={1} />
      <LocalizedFieldGroup label={t("admin.settings.missionText")} value={about.missionText} onChange={(missionText) => onChange({ ...about, missionText })} rows={3} />
      <LocalizedFieldGroup label={t("admin.settings.valuesTitle")} value={about.valuesTitle} onChange={(valuesTitle) => onChange({ ...about, valuesTitle })} rows={1} />
      <LocalizedFieldGroup label={t("admin.settings.valuesText")} value={about.valuesText} onChange={(valuesText) => onChange({ ...about, valuesText })} rows={3} />
      <LocalizedFieldGroup label={t("admin.settings.closingQuote")} value={about.quote} onChange={(quote) => onChange({ ...about, quote })} rows={3} />
      <FormField label={t("admin.settings.quoteAttribution")}>
        <input value={about.quoteAttribution} onChange={(e) => onChange({ ...about, quoteAttribution: e.target.value })} className="form-input max-w-xs" />
      </FormField>
      <div className="space-y-4">
        <h4 className="font-bold text-navy">{t("admin.settings.aboutStats")}</h4>
        {about.stats.map((stat, index) => (
          <div key={index} className="grid gap-4 rounded-xl border border-border/60 bg-muted/10 p-4 lg:grid-cols-[140px_1fr]">
            <FormField label={adminTf(t, "admin.settings.statValue", { n: index + 1 })}>
              <input
                type="number"
                value={stat.value}
                onChange={(e) => {
                  const stats = [...about.stats]
                  stats[index] = { ...stat, value: Number(e.target.value) }
                  onChange({ ...about, stats })
                }}
                className="form-input"
              />
            </FormField>
            <LocalizedFieldGroup
              label={t("admin.common.label")}
              value={stat.label}
              onChange={(label) => {
                const stats = [...about.stats]
                stats[index] = { ...stat, label }
                onChange({ ...about, stats })
              }}
              rows={1}
            />
          </div>
        ))}
      </div>
      <DashButton type="button" variant="ghost" onClick={() => onChange({ ...DEFAULT_ABOUT_PAGE })}>
        {t("admin.settings.resetAbout")}
      </DashButton>
    </div>
  )
}

function PrivacyPageEditor({ page, onChange }: { page: PrivacyPageSettings; onChange: (page: PrivacyPageSettings) => void }) {
  const { t } = useLanguage()

  function updateSection(index: number, patch: Partial<PrivacySection>) {
    const sections = [...page.sections]
    sections[index] = { ...sections[index], ...patch }
    onChange({ ...page, sections })
  }

  return (
    <div className="space-y-6">
      <LocalizedFieldGroup label={t("admin.settings.pageTitle")} value={page.title} onChange={(title) => onChange({ ...page, title })} rows={1} />
      <LocalizedFieldGroup label={t("admin.settings.pageSubtitle")} value={page.subtitle} onChange={(subtitle) => onChange({ ...page, subtitle })} rows={1} />
      <ImageUploadField label={t("admin.settings.headerImage")} value={page.image} onChange={(image) => onChange({ ...page, image })} />
      <LocalizedFieldGroup label={t("admin.settings.imageAlt")} value={page.imageAlt} onChange={(imageAlt) => onChange({ ...page, imageAlt })} rows={1} />
      <LocalizedFieldGroup label={t("admin.settings.introTitle")} value={page.introTitle} onChange={(introTitle) => onChange({ ...page, introTitle })} rows={1} />
      <LocalizedFieldGroup label={t("admin.settings.introSubtitle")} value={page.introSubtitle} onChange={(introSubtitle) => onChange({ ...page, introSubtitle })} rows={2} />
      {page.sections.map((section, index) => (
        <div key={index} className="space-y-3 rounded-lg border border-border/50 bg-background p-4">
          <LocalizedFieldGroup label={adminTf(t, "admin.settings.sectionTitleN", { n: index + 1 })} value={section.title} onChange={(title) => updateSection(index, { title })} rows={1} />
          <LocalizedFieldGroup label={t("admin.settings.sectionBody")} value={section.body} onChange={(body) => updateSection(index, { body })} rows={5} />
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        <DashButton
          type="button"
          variant="secondary"
          onClick={() => onChange({ ...page, sections: [...page.sections, { title: { ar: "", en: "" }, body: { ar: "", en: "" } }] })}
        >
          {t("admin.settings.addSection")}
        </DashButton>
        <DashButton type="button" variant="ghost" onClick={() => onChange({ ...page, sections: page.sections.slice(0, -1) })} disabled={!page.sections.length}>
          {t("admin.settings.removeLastSection")}
        </DashButton>
        <DashButton type="button" variant="ghost" onClick={() => onChange({ ...DEFAULT_PRIVACY_PAGE })}>
          {t("admin.settings.resetPrivacy")}
        </DashButton>
      </div>
    </div>
  )
}

function CtaLabelsEditor({ labels, onChange }: { labels: CtaLabels; onChange: (labels: CtaLabels) => void }) {
  const { t } = useLanguage()

  const fields: { key: keyof CtaLabels; labelKey: "admin.settings.ctaPricing" | "admin.settings.ctaStores" | "admin.settings.ctaAcquire" | "admin.settings.ctaLearnMore" }[] = [
    { key: "pricing", labelKey: "admin.settings.ctaPricing" },
    { key: "stores", labelKey: "admin.settings.ctaStores" },
    { key: "acquire", labelKey: "admin.settings.ctaAcquire" },
    { key: "learnMore", labelKey: "admin.settings.ctaLearnMore" },
  ]

  return (
    <div className="space-y-4">
      {fields.map(({ key, labelKey }) => (
        <LocalizedFieldGroup
          key={key}
          label={t(labelKey)}
          value={labels[key]}
          onChange={(value) => onChange({ ...labels, [key]: value })}
          rows={1}
        />
      ))}
      <DashButton type="button" variant="ghost" onClick={() => onChange({ ...DEFAULT_CTA_LABELS })}>
        {t("admin.settings.resetCta")}
      </DashButton>
    </div>
  )
}

function updateNavigationSection(
  settings: PublicSiteSettings,
  key: keyof SiteNavigation,
  links: SiteNavLink[],
): PublicSiteSettings {
  return {
    ...settings,
    navigation: {
      ...mergeNavigation(settings.navigation),
      [key]: links,
    },
  }
}

export default function DashboardSettingsPage() {
  const { t, lang } = useLanguage()
  const [settings, setSettings] = useState<PublicSiteSettings | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [savingMaintenance, setSavingMaintenance] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  useEffect(() => {
    adminFetch<PublicSiteSettings>("/api/admin/settings")
      .then((data) => setSettings(normalizeSettings(data)))
      .catch((err) =>
        setLoadError(mapAdminError(lang, err instanceof Error ? err.message : "", t("admin.settings.loadFailed"))),
      )
  }, [lang, t])

  async function save() {
    if (!settings) return
    setSaving(true)
    setMessage(null)
    try {
      const updated = await adminFetch<PublicSiteSettings>("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      })
      setSettings(normalizeSettings(updated))
      notifySettingsUpdated()
      setMessage({
        text: t("admin.settings.saved"),
        type: "success",
      })
    } catch (err) {
      setMessage({
        text: mapAdminError(lang, err instanceof Error ? err.message : "", t("admin.settings.saveFailed")),
        type: "error",
      })
    } finally {
      setSaving(false)
    }
  }

  async function setMaintenanceMode(maintenanceMode: boolean) {
    if (!settings) return
    const previous = settings.maintenanceMode
    setSettings({ ...settings, maintenanceMode })
    setSavingMaintenance(true)
    setMessage(null)
    try {
      const updated = await adminFetch<PublicSiteSettings>("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify({ ...settings, maintenanceMode }),
      })
      setSettings(normalizeSettings(updated))
      notifySettingsUpdated()
      setMessage({
        text: maintenanceMode ? t("admin.settings.maintenanceOn") : t("admin.settings.maintenanceOff"),
        type: "success",
      })
    } catch (err) {
      setSettings({ ...settings, maintenanceMode: previous })
      setMessage({
        text: mapAdminError(
          lang,
          err instanceof Error ? err.message : "",
          t("admin.settings.maintenanceFailed"),
        ),
        type: "error",
      })
    } finally {
      setSavingMaintenance(false)
    }
  }

  if (!settings) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={t("admin.settings.title")}
          description={t("admin.settings.desc")}
        />
        {loadError ? (
          <Alert variant="error">{loadError}</Alert>
        ) : (
          <LoadingBlock label={t("admin.settings.loading")} />
        )}
      </div>
    )
  }

  const heroLabels: Record<keyof PublicSiteSettings["hero"], string> = {
    line1: t("admin.settings.heroLine1"),
    line2: t("admin.settings.heroLine2"),
    sub1: t("admin.settings.heroSub1"),
    sub2: t("admin.settings.heroSub2"),
    cta: t("admin.settings.heroCta"),
  }

  return (
    <div className="space-y-8 pb-24">
      <PageHeader
        title={t("admin.settings.title")}
        description={t("admin.settings.desc")}
      />

      {message && <Alert variant={message.type === "success" ? "success" : "error"}>{message.text}</Alert>}

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title={t("admin.settings.panel.general")} description={t("admin.settings.panel.generalDesc")}>
          <div className="space-y-4">
            <Toggle
              checked={settings.maintenanceMode}
              onChange={setMaintenanceMode}
              label={t("admin.settings.maintenanceMode")}
              description={
                savingMaintenance
                  ? t("admin.settings.maintenanceApplying")
                  : t("admin.settings.maintenanceDesc")
              }
            />
            <FormField label={t("admin.settings.defaultLanguage")}>
              <select
                value={settings.defaultLanguage}
                onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value as "ar" | "en" })}
                className="form-input max-w-xs"
              >
                <option value="ar">{t("admin.settings.langArabic")}</option>
                <option value="en">{t("admin.settings.langEnglish")}</option>
              </select>
            </FormField>
          </div>
        </Panel>

        <Panel title={t("admin.settings.panel.contact")} description={t("admin.settings.panel.contactDesc")}>
          <div className="space-y-4">
            <div>
              <DashButton href="/dashboard/contact" variant="secondary">
                {t("admin.settings.openInbox")}
              </DashButton>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label={t("admin.common.email")}>
                <input
                  type="email"
                  dir="ltr"
                  value={settings.contact.email}
                  onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })}
                  className="form-input"
                />
              </FormField>
              <FormField label={t("admin.common.phone")}>
                <input
                  type="text"
                  dir="ltr"
                  value={settings.contact.phone}
                  onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, phone: e.target.value } })}
                  className="form-input"
                />
              </FormField>
            </div>
            <LocalizedFieldGroup
              label={t("admin.settings.businessHours")}
              value={
                settings.contact.businessHours ?? {
                  ar: "الأحد - الخميس 8:00 - 17:00",
                  en: "Sun - Thu 8:00 AM - 5:00 PM",
                }
              }
              onChange={(businessHours) => setSettings({ ...settings, contact: { ...settings.contact, businessHours } })}
              rows={1}
            />
            <LocalizedFieldGroup
              label={t("admin.common.address")}
              value={settings.contact.address}
              onChange={(address) => setSettings({ ...settings, contact: { ...settings.contact, address } })}
            />
          </div>
        </Panel>
      </div>

      <Panel title={t("admin.settings.panel.social")} description={t("admin.settings.panel.socialDesc")}>
        <div className="grid gap-4 md:grid-cols-2">
          {SOCIAL_PLATFORMS.map(({ key, label, placeholder }) => (
            <FormField key={key} label={label}>
              <input
                type="url"
                dir="ltr"
                value={settings.social?.[key] ?? ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social: { ...mergeSocialLinks(settings.social), [key]: e.target.value },
                  })
                }
                placeholder={placeholder}
                className="form-input font-mono text-sm"
              />
            </FormField>
          ))}
        </div>
      </Panel>

      <Panel
        title={t("admin.settings.panel.storeLinks")}
        description={t("admin.settings.panel.storeLinksDesc")}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label={t("admin.settings.sallaLink")}>
            <input
              type="url"
              dir="ltr"
              value={settings.storeIntegrationLinks?.salla ?? DEFAULT_STORE_INTEGRATION_LINKS.salla}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  storeIntegrationLinks: {
                    ...mergeStoreIntegrationLinks(settings.storeIntegrationLinks),
                    salla: e.target.value,
                  },
                })
              }
              placeholder={DEFAULT_STORE_INTEGRATION_LINKS.salla}
              className="form-input font-mono text-sm"
            />
          </FormField>
          <FormField label={t("admin.settings.zidLink")}>
            <input
              type="url"
              dir="ltr"
              value={settings.storeIntegrationLinks?.zid ?? DEFAULT_STORE_INTEGRATION_LINKS.zid}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  storeIntegrationLinks: {
                    ...mergeStoreIntegrationLinks(settings.storeIntegrationLinks),
                    zid: e.target.value,
                  },
                })
              }
              placeholder={DEFAULT_STORE_INTEGRATION_LINKS.zid}
              className="form-input font-mono text-sm"
            />
          </FormField>
        </div>
      </Panel>

      <Panel title={t("admin.settings.panel.seo")} description={t("admin.settings.panel.seoDesc")}>
        <div className="space-y-4">
          <FormField label={t("admin.settings.brandLock")}>
            <input
              type="text"
              value={settings.seo?.brandLock ?? "LeapAI"}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  seo: { ...DEFAULT_SEO, ...settings.seo, brandLock: e.target.value || "LeapAI" },
                })
              }
              className="form-input max-w-xs font-semibold"
            />
          </FormField>
          <LocalizedFieldGroup
            label={t("admin.settings.siteTitle")}
            value={settings.seo?.siteTitle ?? DEFAULT_SEO.siteTitle}
            onChange={(siteTitle) =>
              setSettings({ ...settings, seo: { ...DEFAULT_SEO, ...settings.seo, siteTitle } })
            }
            rows={2}
          />
          <LocalizedFieldGroup
            label={t("admin.settings.metaDescription")}
            value={settings.seo?.metaDescription ?? DEFAULT_SEO.metaDescription}
            onChange={(metaDescription) =>
              setSettings({ ...settings, seo: { ...DEFAULT_SEO, ...settings.seo, metaDescription } })
            }
            rows={3}
          />
          <LocalizedFieldGroup
            label={t("admin.settings.footerText")}
            value={settings.seo?.footerText ?? DEFAULT_SEO.footerText}
            onChange={(footerText) =>
              setSettings({ ...settings, seo: { ...DEFAULT_SEO, ...settings.seo, footerText } })
            }
            rows={3}
          />
        </div>
      </Panel>

      <Panel title={t("admin.settings.panel.hero")} description={t("admin.settings.panel.heroDesc")}>
        <div className="space-y-4">
          <ImageUploadField
            label={t("admin.settings.heroImage")}
            hint={t("admin.settings.heroImageHint")}
            value={settings.images?.hero ?? DEFAULT_IMAGES.hero}
            onChange={(hero) =>
              setSettings({ ...settings, images: { ...DEFAULT_IMAGES, ...settings.images, hero } })
            }
          />
          {(Object.keys(heroLabels) as (keyof typeof heroLabels)[]).map((key) => (
            <LocalizedFieldGroup
              key={key}
              label={heroLabels[key]}
              value={settings.hero[key]}
              onChange={(value) => setSettings({ ...settings, hero: { ...settings.hero, [key]: value } })}
            />
          ))}
        </div>
      </Panel>

      <Panel title={t("admin.settings.panel.images")} description={t("admin.settings.panel.imagesDesc")}>
        <div className="grid gap-6 md:grid-cols-2">
          <ImageUploadField
            label={t("admin.settings.ticketOverview")}
            value={settings.images?.ticketOverview ?? DEFAULT_IMAGES.ticketOverview}
            onChange={(ticketOverview) =>
              setSettings({ ...settings, images: { ...DEFAULT_IMAGES, ...settings.images, ticketOverview } })
            }
          />
          <ImageUploadField
            label={t("admin.settings.omniChannel")}
            value={settings.images?.omniChannel ?? DEFAULT_IMAGES.omniChannel}
            onChange={(omniChannel) =>
              setSettings({ ...settings, images: { ...DEFAULT_IMAGES, ...settings.images, omniChannel } })
            }
          />
          <ImageUploadField
            label={t("admin.settings.siteLogo")}
            value={settings.images?.logo ?? DEFAULT_IMAGES.logo}
            onChange={(logo) =>
              setSettings({ ...settings, images: { ...DEFAULT_IMAGES, ...settings.images, logo } })
            }
          />
        </div>
      </Panel>

      <Panel title={t("admin.settings.panel.stats")} description={t("admin.settings.panel.statsDesc")}>
        <div className="space-y-4">
          {settings.stats.map((stat, index) => (
            <div key={index} className="grid gap-4 rounded-xl border border-border/60 bg-muted/10 p-4 lg:grid-cols-[140px_1fr]">
              <FormField label={adminTf(t, "admin.settings.statValue", { n: index + 1 })}>
                <input
                  type="number"
                  value={stat.value}
                  onChange={(e) => {
                    const stats = [...settings.stats]
                    stats[index] = { ...stat, value: Number(e.target.value) }
                    setSettings({ ...settings, stats })
                  }}
                  className="form-input"
                />
              </FormField>
              <LocalizedFieldGroup
                label={t("admin.common.label")}
                value={stat.label}
                onChange={(label) => {
                  const stats = [...settings.stats]
                  stats[index] = { ...stat, label }
                  setSettings({ ...settings, stats })
                }}
                rows={1}
              />
            </div>
          ))}
        </div>
      </Panel>

      <Panel
        title={t("admin.settings.panel.nav")}
        description={t("admin.settings.panel.navDesc")}
      >
        <div className="space-y-6">
          <NavLinksEditor
            title={t("admin.settings.navHeaderLeft")}
            description={t("admin.settings.navHeaderLeftDesc")}
            links={settings.navigation?.headerLeft ?? DEFAULT_NAVIGATION.headerLeft}
            onChange={(headerLeft) => setSettings(updateNavigationSection(settings, "headerLeft", headerLeft))}
          />
          <NavLinksEditor
            title={t("admin.settings.navHeaderRight")}
            description={t("admin.settings.navHeaderRightDesc")}
            links={settings.navigation?.headerRight ?? DEFAULT_NAVIGATION.headerRight}
            onChange={(headerRight) => setSettings(updateNavigationSection(settings, "headerRight", headerRight))}
          />
          <NavLinksEditor
            title={t("admin.settings.navFooterMain")}
            description={t("admin.settings.navFooterMainDesc")}
            links={settings.navigation?.footerLinks ?? DEFAULT_NAVIGATION.footerLinks}
            onChange={(footerLinks) => setSettings(updateNavigationSection(settings, "footerLinks", footerLinks))}
          />
          <NavLinksEditor
            title={t("admin.settings.navFooterLegal")}
            description={t("admin.settings.navFooterLegalDesc")}
            links={settings.navigation?.footerLegal ?? DEFAULT_NAVIGATION.footerLegal}
            onChange={(footerLegal) => setSettings(updateNavigationSection(settings, "footerLegal", footerLegal))}
          />
        </div>
      </Panel>

      <Panel
        title={t("admin.settings.panel.partners")}
        description={t("admin.settings.panel.partnersDesc")}
      >
        <PartnersEditor
          partners={settings.partners ?? DEFAULT_PARTNERS}
          onChange={(partners) => setSettings({ ...settings, partners })}
        />
      </Panel>

      <Panel
        title={t("admin.settings.panel.pricing")}
        description={t("admin.settings.panel.pricingDesc")}
      >
        <PricingPlansEditor
          plans={settings.pricingPlans ?? DEFAULT_PRICING_PLANS}
          onChange={(pricingPlans) => setSettings({ ...settings, pricingPlans })}
        />
      </Panel>

      <Panel title={t("admin.settings.panel.addons")} description={t("admin.settings.panel.addonsDesc")}>
        <AddonsEditor
          section={settings.addons ?? DEFAULT_ADDONS_SECTION}
          onChange={(addons) => setSettings({ ...settings, addons })}
        />
      </Panel>

      <Panel title={t("admin.settings.panel.about")} description={t("admin.settings.panel.aboutDesc")}>
        <AboutPageEditor
          about={settings.aboutPage ?? DEFAULT_ABOUT_PAGE}
          onChange={(aboutPage) => setSettings({ ...settings, aboutPage })}
        />
      </Panel>

      <Panel title={t("admin.settings.panel.privacy")} description={t("admin.settings.panel.privacyDesc")}>
        <PrivacyPageEditor
          page={settings.privacyPage ?? DEFAULT_PRIVACY_PAGE}
          onChange={(privacyPage) => setSettings({ ...settings, privacyPage })}
        />
      </Panel>

      <Panel title={t("admin.settings.panel.cta")} description={t("admin.settings.panel.ctaDesc")}>
        <CtaLabelsEditor
          labels={settings.ctaLabels ?? DEFAULT_CTA_LABELS}
          onChange={(ctaLabels) => setSettings({ ...settings, ctaLabels })}
        />
      </Panel>

      <Panel title={t("admin.settings.panel.faq")} description={t("admin.settings.panel.faqDesc")}>
        <div className="space-y-4">
          {(settings.faq ?? []).map((item, index) => (
            <div key={index} className="rounded-xl border border-border/60 bg-muted/10 p-4">
              <LocalizedFieldGroup
                label={adminTf(t, "admin.settings.faqQuestion", { n: index + 1 })}
                value={item.question}
                onChange={(question) => {
                  const faq = [...(settings.faq ?? [])]
                  faq[index] = { ...faq[index], question }
                  setSettings({ ...settings, faq })
                }}
                rows={2}
              />
              <div className="mt-3">
                <LocalizedFieldGroup
                  label={adminTf(t, "admin.settings.faqAnswer", { n: index + 1 })}
                  value={item.answer}
                  onChange={(answer) => {
                    const faq = [...(settings.faq ?? [])]
                    faq[index] = { ...faq[index], answer }
                    setSettings({ ...settings, faq })
                  }}
                  rows={3}
                />
              </div>
            </div>
          ))}
          <div className="flex gap-2">
            <DashButton
              type="button"
              variant="secondary"
              onClick={() =>
                setSettings({
                  ...settings,
                  faq: [...(settings.faq ?? []), { question: { ar: "", en: "" }, answer: { ar: "", en: "" } }],
                })
              }
            >
              {t("admin.settings.addFaq")}
            </DashButton>
            <DashButton
              type="button"
              variant="ghost"
              onClick={() =>
                setSettings({
                  ...settings,
                  faq: (settings.faq ?? []).slice(0, Math.max((settings.faq ?? []).length - 1, 0)),
                })
              }
              disabled={(settings.faq ?? []).length === 0}
            >
              {t("admin.settings.removeLastFaq")}
            </DashButton>
          </div>
        </div>
      </Panel>

      <Panel
        id="geo"
        title={t("admin.settings.panel.geo")}
        description={t("admin.settings.panel.geoDesc")}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{t("admin.settings.geoPreviewHint")}</p>
          <LocalizedFieldGroup
            label={t("admin.settings.geoTagline")}
            value={settings.geo?.llmsTagline ?? DEFAULT_GEO_SETTINGS.llmsTagline}
            onChange={(llmsTagline) =>
              setSettings({ ...settings, geo: { ...mergeGeoSettings(settings.geo), llmsTagline } })
            }
            rows={2}
          />
          <LocalizedFieldGroup
            label={t("admin.settings.geoDescription")}
            value={settings.geo?.llmsDescription ?? DEFAULT_GEO_SETTINGS.llmsDescription}
            onChange={(llmsDescription) =>
              setSettings({ ...settings, geo: { ...mergeGeoSettings(settings.geo), llmsDescription } })
            }
            rows={3}
          />
          <LocalizedFieldGroup
            label={t("admin.settings.geoCategoryAnswer")}
            value={settings.geo?.categoryAnswer ?? DEFAULT_GEO_SETTINGS.categoryAnswer}
            onChange={(categoryAnswer) =>
              setSettings({ ...settings, geo: { ...mergeGeoSettings(settings.geo), categoryAnswer } })
            }
            rows={2}
          />
          <LocalizedFieldGroup
            label={t("admin.settings.geoCapabilities")}
            value={{
              ar: geoCapabilitiesToText(settings.geo?.capabilities?.ar ?? DEFAULT_GEO_SETTINGS.capabilities.ar),
              en: geoCapabilitiesToText(settings.geo?.capabilities?.en ?? DEFAULT_GEO_SETTINGS.capabilities.en),
            }}
            onChange={(value) =>
              setSettings({
                ...settings,
                geo: {
                  ...mergeGeoSettings(settings.geo),
                  capabilities: {
                    ar: textToGeoCapabilities(value.ar),
                    en: textToGeoCapabilities(value.en),
                  },
                },
              })
            }
            rows={6}
          />
          <LocalizedFieldGroup
            label={t("admin.settings.geoPositioning")}
            value={settings.geo?.categoryPositioning ?? DEFAULT_GEO_SETTINGS.categoryPositioning}
            onChange={(categoryPositioning) =>
              setSettings({ ...settings, geo: { ...mergeGeoSettings(settings.geo), categoryPositioning } })
            }
            rows={4}
          />
          <LocalizedFieldGroup
            label={t("admin.settings.geoCitation")}
            value={settings.geo?.citationGuidance ?? DEFAULT_GEO_SETTINGS.citationGuidance}
            onChange={(citationGuidance) =>
              setSettings({ ...settings, geo: { ...mergeGeoSettings(settings.geo), citationGuidance } })
            }
            rows={2}
          />
          <LocalizedFieldGroup
            label={t("admin.settings.geoKnowsAbout")}
            value={{
              ar: geoCapabilitiesToText(settings.geo?.knowsAbout?.ar ?? DEFAULT_GEO_SETTINGS.knowsAbout.ar),
              en: geoCapabilitiesToText(settings.geo?.knowsAbout?.en ?? DEFAULT_GEO_SETTINGS.knowsAbout.en),
            }}
            onChange={(value) =>
              setSettings({
                ...settings,
                geo: {
                  ...mergeGeoSettings(settings.geo),
                  knowsAbout: {
                    ar: textToGeoCapabilities(value.ar),
                    en: textToGeoCapabilities(value.en),
                  },
                },
              })
            }
            rows={6}
          />
          <LocalizedFieldGroup
            label={t("admin.settings.geoAiPolicy")}
            value={settings.geo?.aiPolicy ?? DEFAULT_GEO_SETTINGS.aiPolicy}
            onChange={(aiPolicy) =>
              setSettings({ ...settings, geo: { ...mergeGeoSettings(settings.geo), aiPolicy } })
            }
            rows={3}
          />
        </div>
      </Panel>

      <StickySaveBar onSave={save} saving={saving} />
    </div>
  )
}
