"use client"

import { LanguageProvider } from "@/lib/i18n"
import { SiteSettingsProvider } from "@/lib/site-settings-context"
import { NavContentProvider } from "@/lib/nav-content-context"
import type { PublicSiteSettings } from "@/lib/api"
import type { NavContent } from "@/lib/cms"
import { MaintenanceBanner } from "@/components/maintenance-banner"

export function AppProviders({
  children,
  initialSettings,
  nav,
}: {
  children: React.ReactNode
  initialSettings: PublicSiteSettings | null
  nav: NavContent
}) {
  return (
    <SiteSettingsProvider initialSettings={initialSettings}>
      <NavContentProvider nav={nav}>
        <LanguageProvider defaultLanguage={initialSettings?.defaultLanguage}>
          <MaintenanceBanner />
          {children}
        </LanguageProvider>
      </NavContentProvider>
    </SiteSettingsProvider>
  )
}
