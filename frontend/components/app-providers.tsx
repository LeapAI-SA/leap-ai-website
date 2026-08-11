"use client"

import { LanguageProvider } from "@/lib/i18n"
import { SiteSettingsProvider } from "@/lib/site-settings-context"
import { NavContentProvider } from "@/lib/nav-content-context"
import type { PublicSiteSettings } from "@/lib/api"
import type { NavContent } from "@/lib/cms"
import type { SiteLang } from "@/lib/locale-path"
import { MaintenanceBanner } from "@/components/maintenance-banner"

export function AppProviders({
  children,
  initialSettings,
  nav,
  locale,
}: {
  children: React.ReactNode
  initialSettings: PublicSiteSettings | null
  nav: NavContent
  locale?: SiteLang
}) {
  return (
    <SiteSettingsProvider initialSettings={initialSettings}>
      <NavContentProvider nav={nav}>
        <LanguageProvider defaultLanguage={locale ?? initialSettings?.defaultLanguage}>
          <MaintenanceBanner />
          {children}
        </LanguageProvider>
      </NavContentProvider>
    </SiteSettingsProvider>
  )
}
