"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Settings,
  FileText,
  Mail,
  LogOut,
  ExternalLink,
  Menu,
  Plus,
  Sparkles,
} from "lucide-react"
import { getToken, setToken } from "@/lib/api"
import { useLanguage } from "@/lib/i18n"
import { resolveMediaUrl } from "@/lib/media"
import { DashButton } from "./ui"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { t, lang, setLang } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)

  const nav = [
    { href: "/dashboard", label: t("admin.nav.overview"), icon: LayoutDashboard, exact: true },
    { href: "/dashboard/settings", label: t("admin.nav.siteSettings"), icon: Settings },
    { href: "/dashboard/geo", label: t("admin.nav.geo"), icon: Sparkles },
    { href: "/dashboard/contact", label: t("admin.nav.contact"), icon: Mail },
    { href: "/dashboard/content", label: t("admin.nav.content"), icon: FileText },
  ]

  const pageTitle =
    ({
      "/dashboard": t("admin.nav.overview"),
      "/dashboard/settings": t("admin.nav.siteSettings"),
      "/dashboard/geo": t("admin.nav.geo"),
      "/dashboard/contact": t("admin.nav.contact"),
      "/dashboard/content": t("admin.nav.contentLibrary"),
      "/dashboard/content/new": t("admin.nav.newContent"),
    }[pathname] ??
    (pathname.startsWith("/dashboard/content/") && pathname !== "/dashboard/content/new"
      ? t("admin.nav.editContent")
      : t("admin.common.dashboard")))

  function logout() {
    setToken(null)
    router.push("/dashboard/login")
  }

  const sidebar = (
    <>
      <div className="flex h-[72px] items-center border-b border-white/10 px-5">
        <Link href="/dashboard" className="block">
          <Image
            src={resolveMediaUrl("/leapai-logo.png")}
            alt="LeapAI"
            width={168}
            height={52}
            className="h-11 w-auto"
            priority
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-white/40">{t("admin.common.menu")}</p>
        {nav.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                active
                  ? "dash-nav-active"
                  : "text-white/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className={`size-4 ${active ? "text-[#f28c00]" : ""}`} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-3">
        <Link
          href="/dashboard/content/new"
          onClick={() => setMobileOpen(false)}
          className="dash-cta flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-transform hover:scale-[1.02]"
        >
          <Plus className="size-4" />
          {t("admin.nav.newContent")}
        </Link>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-primary/10 hover:text-white"
        >
          <ExternalLink className="size-4 text-primary" />
          {t("admin.nav.viewLiveSite")}
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="size-4" />
          {t("admin.nav.signOut")}
        </button>
      </div>
    </>
  )

  return (
    <div className="dash-shell min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="dash-sidebar fixed inset-y-0 start-0 z-40 hidden w-[260px] flex-col lg:flex">
        {sidebar}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="dash-sidebar relative flex h-full w-[280px] flex-col shadow-2xl">{sidebar}</aside>
        </div>
      )}

      <div className="lg:ps-[260px]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-border/60 bg-white/85 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="flex size-10 items-center justify-center rounded-xl border border-border text-primary lg:hidden"
              >
                <Menu className="size-5" />
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">{t("admin.common.dashboard")}</p>
                <h1 className="text-lg font-extrabold text-navy">{pageTitle}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as "ar" | "en")}
                className="form-input h-10 w-[120px] py-1 text-sm"
              >
                <option value="ar">{t("admin.common.arabic")}</option>
                <option value="en">{t("admin.common.english")}</option>
              </select>
              <Image
                src={resolveMediaUrl("/leapai-logo.png")}
                alt="LeapAI"
                width={120}
                height={38}
                className="hidden h-8 w-auto sm:block"
              />
              <DashButton href="/" variant="secondary" className="hidden md:inline-flex">
                <ExternalLink className="size-4" />
                {t("admin.common.preview")}
              </DashButton>
            </div>
          </div>
        </header>

        <main className="dash-main relative px-4 py-8 md:px-8">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -end-24 -top-24 size-96 rounded-full bg-primary/8 blur-3xl" />
            <div className="absolute -bottom-32 start-0 size-80 rounded-full bg-amber/12 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}

export function useDashboardAuth() {
  const router = useRouter()

  function requireAuth() {
    if (!getToken()) {
      router.replace("/dashboard/login")
      return false
    }
    return true
  }

  return { requireAuth }
}
