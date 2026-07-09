"use client"

import { usePathname } from "next/navigation"
import { useSiteSettings } from "@/lib/site-settings-context"

export function MaintenanceBanner() {
  const pathname = usePathname()
  const { settings } = useSiteSettings()
  if (pathname === "/maintenance" || !settings?.maintenanceMode) return null

  return (
    <div className="bg-amber px-4 py-2 text-center text-sm font-bold text-accent-foreground">
      Site is in maintenance mode. Some content may be unavailable.
    </div>
  )
}
