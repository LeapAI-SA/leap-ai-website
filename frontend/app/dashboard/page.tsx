"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, Settings, Globe, Server, Shield, ArrowUpRight } from "lucide-react"
import { adminFetch } from "@/lib/api"
import { PageHeader, StatCard, Panel, DashButton, Badge } from "@/components/dashboard/ui"

export default function DashboardHomePage() {
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

  return (
    <div className="space-y-8">
      <PageHeader
        title="Good to see you"
        description="Manage your LeapAI website content, homepage settings, and published pages from one place."
        actions={
          <>
            <DashButton href="/dashboard/content/new" variant="amber">
              Add content
            </DashButton>
            <DashButton href="/" variant="secondary">
              Preview site
            </DashButton>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total content"
          value={stats ? String(stats.content) : "—"}
          hint="Solutions, products & use cases"
          icon={FileText}
          tone="primary"
        />
        <StatCard
          label="Solutions"
          value={stats ? String(stats.solutions) : "—"}
          icon={Globe}
        />
        <StatCard
          label="Products"
          value={stats ? String(stats.products) : "—"}
          icon={Server}
        />
        <StatCard
          label="Site status"
          value={stats?.maintenance ? "Maintenance" : "Live"}
          hint={stats ? `Default: ${stats.defaultLanguage.toUpperCase()}` : undefined}
          icon={Shield}
          tone={stats?.maintenance ? "warning" : "success"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Panel title="Quick actions" description="Common tasks to manage your site" className="lg:col-span-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                href: "/dashboard/settings",
                title: "Homepage settings",
                desc: "Hero, stats, contact & maintenance",
                icon: Settings,
                color: "bg-primary/10 text-primary",
              },
              {
                href: "/dashboard/content",
                title: "Content library",
                desc: "Edit solutions, products & use cases",
                icon: FileText,
                color: "bg-amber/15 text-amber-foreground",
              },
              {
                href: "/dashboard/content/new",
                title: "Create new page",
                desc: "Add a new content item",
                icon: ArrowUpRight,
                color: "bg-emerald-500/10 text-emerald-600",
              },
              {
                href: "/",
                title: "View live website",
                desc: "Open the public site in a new tab",
                icon: Globe,
                color: "bg-navy/10 text-navy",
              },
            ].map((action) => (
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

        <Panel title="System stack" description="Your CMS infrastructure" className="lg:col-span-2">
          <ul className="space-y-3">
            {[
              { name: "Frontend", value: "Next.js 16", status: "Running" },
              { name: "Backend", value: "Node.js + Express", status: "Running" },
              { name: "Database", value: "MongoDB", status: "Connected" },
              { name: "Cache", value: "Redis", status: "Active" },
            ].map((row) => (
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
