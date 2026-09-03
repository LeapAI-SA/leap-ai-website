"use client"

import { useEffect, useState, Suspense } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { fetchAuthMe, logoutAdmin, setAuthSession } from "@/lib/api"
import { useLanguage } from "@/lib/i18n"

function DashboardAuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isLogin = pathname === "/dashboard/login"
  const isMfaVerify = pathname === "/dashboard/login/verify"
  const isAuthPage = isLogin || isMfaVerify
  const sessionExpired = searchParams.get("sessionExpired") === "1"
  const [checked, setChecked] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    let cancelled = false

    async function run() {
      if (isAuthPage) {
        if (sessionExpired) {
          await logoutAdmin()
          if (!cancelled) setChecked(true)
          return
        }
        const me = await fetchAuthMe()
        if (cancelled) return
        if (me) {
          router.replace("/dashboard")
          return
        }
        setChecked(true)
        return
      }

      const me = await fetchAuthMe()
      if (cancelled) return
      if (!me) {
        setAuthSession(false)
        router.replace("/dashboard/login?sessionExpired=1")
        return
      }
      setChecked(true)
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [isAuthPage, router, sessionExpired])

  if (isAuthPage) {
    if (!checked) {
      return (
        <div className="dash-theme flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          {t("admin.auth.checkingAccess")}
        </div>
      )
    }
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

export function DashboardAuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage()
  return (
    <Suspense
      fallback={
        <div className="dash-theme flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          {t("admin.auth.checkingAccess")}
        </div>
      }
    >
      <DashboardAuthGate>{children}</DashboardAuthGate>
    </Suspense>
  )
}
