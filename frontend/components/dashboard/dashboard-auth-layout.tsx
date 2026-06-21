"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { getToken } from "@/lib/api"

export function DashboardAuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isLogin = pathname === "/dashboard/login"

  useEffect(() => {
    if (isLogin) return
    if (!getToken()) {
      router.replace("/dashboard/login")
    }
  }, [isLogin, router])

  if (isLogin) {
    return <div className="dash-theme">{children}</div>
  }

  return (
    <div className="dash-theme">
      <DashboardShell>{children}</DashboardShell>
    </div>
  )
}
