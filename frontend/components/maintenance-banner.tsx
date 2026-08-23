"use client"

import { usePathname } from "next/navigation"
import { useLanguage } from "@/lib/i18n"
import { useSiteSettings } from "@/lib/site-settings-context"

export function MaintenanceBanner() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const { settings } = useSiteSettings()
  if (pathname === "/maintenance" || !settings?.maintenanceMode) return null

  return (
    <div className="bg-amber px-4 py-2 text-center text-sm font-bold text-accent-foreground">
      {t("maintenance.banner")}
    </div>
  )
}
