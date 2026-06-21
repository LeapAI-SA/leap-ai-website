"use client"

import { createContext, useContext } from "react"
import type { PublicSiteSettings } from "./api"

type SiteSettingsContextValue = {
  settings: PublicSiteSettings | null
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({ settings: null })

export function SiteSettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode
  initialSettings: PublicSiteSettings | null
}) {
  return (
    <SiteSettingsContext.Provider value={{ settings: initialSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
