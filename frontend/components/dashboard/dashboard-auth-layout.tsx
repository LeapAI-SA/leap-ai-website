"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { getToken } from "@/lib/api"
import { useLanguage } from "@/lib/i18n"

export function DashboardAuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isLogin = pathname === "/dashboard/login"
  const [checked, setChecked] = useState(isLogin)
  const { t } = useLanguage()

  useEffect(() => {
    if (isLogin) {
      setChecked(true)
      return
    }
    if (!getToken()) {
      router.replace("/dashboard/login")
      return
    }
    setChecked(true)
  }, [isLogin, router])

  if (isLogin) {
    return <div className="dash-theme">{children}</div>
  }

  if (!checked) {
    return (
      <div className="dash-theme flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        {t("admin.auth.checkingAccess")}
      </div>
    )
  }

  return (
    <div className="dash-theme">
      <DashboardShell>{children}</DashboardShell>
    </div>
  )
}
