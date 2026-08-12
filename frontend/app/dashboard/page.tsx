"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, Settings, Globe, Server, Shield, ArrowUpRight, Mail, Sparkles } from "lucide-react"
import { adminFetch } from "@/lib/api"
import { useLanguage } from "@/lib/i18n"
import { PageHeader, StatCard, Panel, DashButton, Badge } from "@/components/dashboard/ui"

export default function DashboardHomePage() {
  const { t } = useLanguage()
  const [stats, setStats] = useState<{
    content: number
    solutions: number
    products: number
    useCases: number
    maintenance: boolean
    defaultLanguage: string
  } | null>(null)

  useEffect(() => {
    Promise.all([
      adminFetch<{ maintenanceMode: boolean; defaultLanguage: string }>("/api/admin/settings"),
      adminFetch<{ type: string }[]>("/api/admin/content"),
    ])
      .then(([settings, content]) => {
        setStats({
          content: content.length,
          solutions: content.filter((c) => c.type === "solution").length,
          products: content.filter((c) => c.type === "product").length,
          useCases: content.filter((c) => c.type === "use-case").length,
          maintenance: settings.maintenanceMode,
          defaultLanguage: settings.defaultLanguage,
        })
      })
      .catch(() => setStats(null))
  }, [])

  const quickActions = [
    {
      href: "/dashboard/settings",
      title: t("admin.home.qaSettings"),
      desc: t("admin.home.qaSettingsDesc"),
      icon: Settings,
      color: "bg-primary/10 text-primary",
    },
    {
      href: "/dashboard/content",
      title: t("admin.home.qaContent"),
      desc: t("admin.home.qaContentDesc"),
      icon: FileText,
      color: "bg-amber/15 text-amber-foreground",
    },
    {
      href: "/dashboard/geo",
      title: t("admin.home.qaGeo"),
      desc: t("admin.home.qaGeoDesc"),
      icon: Sparkles,
      color: "bg-violet-500/10 text-violet-700",
    },
    {
      href: "/dashboard/contact",
      title: t("admin.home.qaContact"),
      desc: t("admin.home.qaContactDesc"),
      icon: Mail,
      color: "bg-sky-500/10 text-sky-700",
    },
    {
      href: "/dashboard/content/new",
      title: t("admin.home.qaNew"),
      desc: t("admin.home.qaNewDesc"),
      icon: ArrowUpRight,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      href: "/",
      title: t("admin.home.qaLive"),
      desc: t("admin.home.qaLiveDesc"),
      icon: Globe,
      color: "bg-navy/10 text-navy",
    },
  ]

  const stackRows = [
    { name: t("admin.home.stackFrontend"), value: "Next.js 16", status: t("admin.home.running") },
    { name: t("admin.home.stackBackend"), value: "Node.js + Express", status: t("admin.home.running") },
    { name: t("admin.home.stackDatabase"), value: "MongoDB", status: t("admin.home.connected") },
    { name: t("admin.home.stackCache"), value: "Redis", status: t("admin.home.active") },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("admin.home.title")}
        description={t("admin.home.desc")}
        actions={
          <>
            <DashButton href="/dashboard/content/new" variant="amber">
              {t("admin.nav.addContent")}
            </DashButton>
            <DashButton href="/" variant="secondary">
              {t("admin.home.previewSite")}
            </DashButton>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t("admin.home.totalContent")}
          value={stats ? String(stats.content) : "—"}
          hint={t("admin.home.solutionsHint")}
          icon={FileText}
          tone="primary"
        />
        <StatCard
          label={t("admin.home.solutions")}
          value={stats ? String(stats.solutions) : "—"}
          icon={Globe}
        />
        <StatCard
          label={t("admin.home.products")}
          value={stats ? String(stats.products) : "—"}
          icon={Server}
        />
        <StatCard
          label={t("admin.home.siteStatus")}
          value={stats?.maintenance ? t("admin.home.maintenance") : t("admin.common.live")}
          hint={
            stats
              ? `${t("admin.home.defaultLang")}: ${stats.defaultLanguage.toUpperCase()}`
              : undefined
          }
          icon={Shield}
          tone={stats?.maintenance ? "warning" : "success"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Panel title={t("admin.home.quickActions")} description={t("admin.home.quickActionsDesc")} className="lg:col-span-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                target={action.href === "/" ? "_blank" : undefined}
                className="group flex gap-4 rounded-xl border border-border/60 bg-background p-4 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${action.color}`}>
                  <action.icon className="size-5" />
                </span>
                <div>
                  <p className="font-bold text-navy group-hover:text-primary">{action.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </Panel>

        <Panel title={t("admin.home.systemStack")} description={t("admin.home.cmsInfra")} className="lg:col-span-2">
          <ul className="space-y-3">
            {stackRows.map((row) => (
              <li
                key={row.name}
                className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/20 px-4 py-3"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{row.name}</p>
                  <p className="text-sm font-bold text-navy">{row.value}</p>
                </div>
                <Badge variant="success">{row.status}</Badge>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}
