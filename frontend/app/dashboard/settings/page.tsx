"use client"

import { useEffect, useState } from "react"
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
import { DEFAULT_NAVIGATION, mergeNavigation, type SiteNavLink, type SiteNavigation } from "@/lib/site-nav"

const DEFAULT_IMAGES = {
  hero: "/hero-dashboard.png",
  ticketOverview: "/sections/ticket-overview.png",
  omniChannel: "/sections/omni-channel.png",
  logo: "/leapai-logo.png",
}

const DEFAULT_SEO = {
  siteTitle: {
    ar: "Leap AI — أول منصة سحابية محلية متقدمة لتجربة العملاء",
    en: "Leap AI — The first advanced local cloud platform for customer experience",
  },
  metaDescription: {
    ar: "LeapAI هي منصة سعودية لتجربة العملاء تشمل مركز اتصال متعدد القنوات، واتساب للأعمال، شات بوت ذكي، وتكاملات أعمال.",
    en: "LeapAI is a Saudi customer experience platform for omni-channel contact center, WhatsApp Business, AI chatbot, and enterprise integrations.",
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
    seo: { ...DEFAULT_SEO, ...data.seo },
    navigation: mergeNavigation(data.navigation),
    faq: data.faq?.length ? data.faq : DEFAULT_FAQ,
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
            label={`Link #${index + 1} label`}
            value={link.label}
            onChange={(label) => updateLink(index, { label })}
            rows={1}
          />
          <FormField label="Page path" hint="Internal path only, e.g. /about-us or /#faq">
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
            Show in menu
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
          Add link
        </DashButton>
        <DashButton
          type="button"
          variant="ghost"
          onClick={() => onChange(links.slice(0, Math.max(links.length - 1, 0)))}
          disabled={links.length === 0}
        >
          Remove last
        </DashButton>
      </div>
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
  const [settings, setSettings] = useState<PublicSiteSettings | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [savingMaintenance, setSavingMaintenance] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  useEffect(() => {
    adminFetch<PublicSiteSettings>("/api/admin/settings")
      .then((data) => setSettings(normalizeSettings(data)))
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load settings"))
  }, [])

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
      setMessage({ text: "Settings saved successfully. Changes will appear on the live site.", type: "success" })
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : "Save failed", type: "error" })
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
      setMessage({
        text: maintenanceMode
          ? "Maintenance mode enabled. Public visitors will see the maintenance page."
          : "Maintenance mode disabled. The public site is live again.",
        type: "success",
      })
    } catch (err) {
      setSettings({ ...settings, maintenanceMode: previous })
      setMessage({ text: err instanceof Error ? err.message : "Failed to update maintenance mode", type: "error" })
    } finally {
      setSavingMaintenance(false)
    }
  }

  if (!settings) {
    return (
      <div className="space-y-6">
        <PageHeader title="Site Settings" description="Control homepage hero, stats, contact info, and maintenance mode." />
        {loadError ? (
          <Alert variant="error">{loadError}</Alert>
        ) : (
          <LoadingBlock label="Loading settings..." />
        )}
      </div>
    )
  }

  const heroLabels: Record<keyof PublicSiteSettings["hero"], string> = {
    line1: "Hero line 1",
    line2: "Hero line 2",
    sub1: "Subtitle 1",
    sub2: "Subtitle 2",
    cta: "Call-to-action button",
  }

  return (
    <div className="space-y-8 pb-24">
      <PageHeader
        title="Site Settings"
        description="Control homepage hero, stats, contact info, and maintenance mode — in both Arabic and English."
      />

      {message && <Alert variant={message.type === "success" ? "success" : "error"}>{message.text}</Alert>}

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="General" description="Site-wide preferences">
          <div className="space-y-4">
            <Toggle
              checked={settings.maintenanceMode}
              onChange={setMaintenanceMode}
              label="Maintenance mode"
              description={
                savingMaintenance
                  ? "Applying maintenance mode..."
                  : "Redirect all public pages to the maintenance screen (dashboard stays accessible)"
              }
            />
            <FormField label="Default language">
              <select
                value={settings.defaultLanguage}
                onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value as "ar" | "en" })}
                className="form-input max-w-xs"
              >
                <option value="ar">Arabic (العربية)</option>
                <option value="en">English</option>
              </select>
            </FormField>
          </div>
        </Panel>

        <Panel title="Contact information" description="Shown on the Contact Us page and site footer. Form messages appear in Contact Us inbox.">
          <div className="space-y-4">
            <div>
              <DashButton href="/dashboard/contact" variant="secondary">
                Open Contact Us inbox
              </DashButton>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Email">
                <input
                  type="email"
                  dir="ltr"
                  value={settings.contact.email}
                  onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })}
                  className="form-input"
                />
              </FormField>
              <FormField label="Phone">
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
              label="Address"
              value={settings.contact.address}
              onChange={(address) => setSettings({ ...settings, contact: { ...settings.contact, address } })}
            />
          </div>
        </Panel>
      </div>

      <Panel title="Social media" description="Footer social links (from leapai.ai)">
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

      <Panel title="Brand / SEO" description='Site title, meta description, and footer text with locked brand "LeapAI"'>
        <div className="space-y-4">
          <FormField label="Locked brand string">
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
            label="Site title"
            value={settings.seo?.siteTitle ?? DEFAULT_SEO.siteTitle}
            onChange={(siteTitle) =>
              setSettings({ ...settings, seo: { ...DEFAULT_SEO, ...settings.seo, siteTitle } })
            }
            rows={2}
          />
          <LocalizedFieldGroup
            label="Meta description"
            value={settings.seo?.metaDescription ?? DEFAULT_SEO.metaDescription}
            onChange={(metaDescription) =>
              setSettings({ ...settings, seo: { ...DEFAULT_SEO, ...settings.seo, metaDescription } })
            }
            rows={3}
          />
          <LocalizedFieldGroup
            label="Footer mission text"
            value={settings.seo?.footerText ?? DEFAULT_SEO.footerText}
            onChange={(footerText) =>
              setSettings({ ...settings, seo: { ...DEFAULT_SEO, ...settings.seo, footerText } })
            }
            rows={3}
          />
        </div>
      </Panel>

      <Panel title="Homepage hero" description="Main headline section on the landing page">
        <div className="space-y-4">
          <ImageUploadField
            label="Hero image"
            hint="Right-side dashboard screenshot on the homepage"
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

      <Panel title="Section images" description="Images used across homepage sections">
        <div className="grid gap-6 md:grid-cols-2">
          <ImageUploadField
            label="Services / ticket overview"
            value={settings.images?.ticketOverview ?? DEFAULT_IMAGES.ticketOverview}
            onChange={(ticketOverview) =>
              setSettings({ ...settings, images: { ...DEFAULT_IMAGES, ...settings.images, ticketOverview } })
            }
          />
          <ImageUploadField
            label="Omni-channel section"
            value={settings.images?.omniChannel ?? DEFAULT_IMAGES.omniChannel}
            onChange={(omniChannel) =>
              setSettings({ ...settings, images: { ...DEFAULT_IMAGES, ...settings.images, omniChannel } })
            }
          />
          <ImageUploadField
            label="Site logo"
            value={settings.images?.logo ?? DEFAULT_IMAGES.logo}
            onChange={(logo) =>
              setSettings({ ...settings, images: { ...DEFAULT_IMAGES, ...settings.images, logo } })
            }
          />
        </div>
      </Panel>

      <Panel title="Statistics counters" description="Animated numbers shown on the homepage">
        <div className="space-y-4">
          {settings.stats.map((stat, index) => (
            <div key={index} className="grid gap-4 rounded-xl border border-border/60 bg-muted/10 p-4 lg:grid-cols-[140px_1fr]">
              <FormField label={`Stat #${index + 1} value`}>
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
                label="Label"
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
        title="Header & footer navigation"
        description="Control the page links shown in the site header and footer. Mega menus (Solutions, Products, Use cases) still come from Content pages."
      >
        <div className="space-y-6">
          <NavLinksEditor
            title="Header — left links"
            description="Links shown before Solutions in the top menu."
            links={settings.navigation?.headerLeft ?? DEFAULT_NAVIGATION.headerLeft}
            onChange={(headerLeft) => setSettings(updateNavigationSection(settings, "headerLeft", headerLeft))}
          />
          <NavLinksEditor
            title="Header — right links"
            description="Links shown after Use cases in the top menu."
            links={settings.navigation?.headerRight ?? DEFAULT_NAVIGATION.headerRight}
            onChange={(headerRight) => setSettings(updateNavigationSection(settings, "headerRight", headerRight))}
          />
          <NavLinksEditor
            title="Footer — main links"
            description="Primary footer links under the LeapAI logo."
            links={settings.navigation?.footerLinks ?? DEFAULT_NAVIGATION.footerLinks}
            onChange={(footerLinks) => setSettings(updateNavigationSection(settings, "footerLinks", footerLinks))}
          />
          <NavLinksEditor
            title="Footer — legal links"
            description="Privacy policy, FAQ, and similar links."
            links={settings.navigation?.footerLegal ?? DEFAULT_NAVIGATION.footerLegal}
            onChange={(footerLegal) => setSettings(updateNavigationSection(settings, "footerLegal", footerLegal))}
          />
        </div>
      </Panel>

      <Panel title="Homepage FAQ" description="On-page FAQ section content (pricing, dialects, PDPL/hosting, integrations)">
        <div className="space-y-4">
          {(settings.faq ?? []).map((item, index) => (
            <div key={index} className="rounded-xl border border-border/60 bg-muted/10 p-4">
              <LocalizedFieldGroup
                label={`FAQ #${index + 1} question`}
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
                  label={`FAQ #${index + 1} answer`}
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
              Add FAQ item
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
              Remove last item
            </DashButton>
          </div>
        </div>
      </Panel>

      <StickySaveBar onSave={save} saving={saving} />
    </div>
  )
}
