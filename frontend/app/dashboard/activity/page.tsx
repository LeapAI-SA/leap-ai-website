"use client"

import { useEffect, useState } from "react"
import { Activity, RefreshCw } from "lucide-react"
import { mapAdminError, adminLocale } from "@/lib/admin-i18n"
import { adminFetch } from "@/lib/api"
import { Alert, DashButton, EmptyState, LoadingBlock, PageHeader, Panel } from "@/components/dashboard/ui"
import { useLanguage } from "@/lib/i18n"

type LoginActivity = {
  id: string
  email: string
  ip: string
  location: string
  device: string
  time: string | null
}

export default function DashboardActivityPage() {
  const { t, lang } = useLanguage()
  const [activity, setActivity] = useState<LoginActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      setActivity(await adminFetch<LoginActivity[]>("/api/admin/activity"))
    } catch (err) {
      setError(mapAdminError(lang, err instanceof Error ? err.message : "", t("admin.activity.loadFailed")))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function formatTime(value: string | null) {
    if (!value) return "-"
    try {
      return new Intl.DateTimeFormat(adminLocale(lang), {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    } catch {
      return value
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={t("admin.activity.title")}
        description={t("admin.activity.desc")}
        actions={
          <DashButton type="button" variant="secondary" onClick={load} disabled={loading}>
            <RefreshCw className="size-4" />
            {t("admin.activity.refresh")}
          </DashButton>
        }
      />

      {error && <Alert variant="error">{error}</Alert>}

      <Panel title={t("admin.activity.title")}>
        {loading ? (
          <LoadingBlock label={t("admin.activity.loading")} />
        ) : activity.length === 0 ? (
          <EmptyState
            title={t("admin.activity.empty")}
            description={t("admin.activity.desc")}
            action={
              <DashButton type="button" variant="secondary" onClick={load}>
                <RefreshCw className="size-4" />
                {t("admin.activity.refresh")}
              </DashButton>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-start text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider">{t("admin.common.email")}</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider">{t("admin.activity.ip")}</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider">{t("admin.activity.location")}</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider">{t("admin.activity.device")}</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider">{t("admin.activity.time")}</th>
                </tr>
              </thead>
              <tbody>
                {activity.map((item) => (
                  <tr key={item.id} className="border-b border-border/70 last:border-0">
                    <td className="px-3 py-3 font-semibold text-navy" dir="ltr">{item.email}</td>
                    <td className="px-3 py-3 font-mono text-xs text-muted-foreground" dir="ltr">{item.ip}</td>
                    <td className="px-3 py-3 text-muted-foreground">{item.location}</td>
                    <td className="px-3 py-3 text-muted-foreground">{item.device}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-muted-foreground">{formatTime(item.time)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  )
}
