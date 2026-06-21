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
} from "@/components/dashboard/ui"

const DEFAULT_IMAGES = {
  hero: "/hero-dashboard.png",
  ticketOverview: "/sections/ticket-overview.png",
  omniChannel: "/sections/omni-channel.png",
  logo: "/leapai-logo.png",
}

export default function DashboardSettingsPage() {
  const [settings, setSettings] = useState<PublicSiteSettings | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  useEffect(() => {
    adminFetch<PublicSiteSettings>("/api/admin/settings")
      .then((data) => setSettings({ ...data, images: { ...DEFAULT_IMAGES, ...data.images } }))
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
      setSettings(updated)
      setMessage({ text: "Settings saved successfully. Changes will appear on the live site.", type: "success" })
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : "Save failed", type: "error" })
    } finally {
      setSaving(false)
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
              onChange={(maintenanceMode) => setSettings({ ...settings, maintenanceMode })}
              label="Maintenance mode"
              description="Show a banner and limit public access while you make updates"
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

        <Panel title="Contact information" description="Displayed in footer and contact pages">
          <div className="space-y-4">
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

      <StickySaveBar onSave={save} saving={saving} />
    </div>
  )
}
