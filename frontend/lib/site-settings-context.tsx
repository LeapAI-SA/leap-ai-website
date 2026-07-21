"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import type { PublicSiteSettings } from "./api"
import { getClientApiUrl } from "./api-url"
import { SETTINGS_UPDATED_EVENT, subscribeCmsUpdates } from "./cms-refresh"

type SiteSettingsContextValue = {
  settings: PublicSiteSettings | null
  refreshSettings: () => Promise<void>
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: null,
  refreshSettings: async () => {},
})

export function SiteSettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode
  initialSettings: PublicSiteSettings | null
}) {
  const [settings, setSettings] = useState<PublicSiteSettings | null>(initialSettings)

  useEffect(() => {
    setSettings(initialSettings)
  }, [initialSettings])

  const refreshSettings = useCallback(async () => {
    try {
      const res = await fetch(`${getClientApiUrl()}/api/public/settings`, { cache: "no-store" })
      if (!res.ok) return
      const data = (await res.json()) as PublicSiteSettings
      setSettings(data)
    } catch {
      /* keep current settings */
    }
  }, [])

  useEffect(() => {
    refreshSettings()
    return subscribeCmsUpdates(SETTINGS_UPDATED_EVENT, () => {
      void refreshSettings()
    })
  }, [refreshSettings])

  return (
    <SiteSettingsContext.Provider value={{ settings, refreshSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
