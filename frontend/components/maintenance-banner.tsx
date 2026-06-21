"use client"

import { useSiteSettings } from "@/lib/site-settings-context"

export function MaintenanceBanner() {
  const { settings } = useSiteSettings()
  if (!settings?.maintenanceMode) return null

  return (
    <div className="bg-amber px-4 py-2 text-center text-sm font-bold text-accent-foreground">
      Site is in maintenance mode. Some content may be unavailable.
    </div>
  )
}
