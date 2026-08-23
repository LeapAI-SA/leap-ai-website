"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/i18n"

export function MaintenancePageContent() {
  const { t } = useLanguage()

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <section className="w-full max-w-2xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-sm font-bold uppercase tracking-widest text-amber">{t("maintenance.badge")}</p>
        <h1 className="mt-3 text-3xl font-extrabold text-navy md:text-4xl">{t("maintenance.title")}</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">{t("maintenance.body")}</p>
        <p className="mt-2 leading-relaxed text-muted-foreground">{t("maintenance.adminHint")}</p>
        <div className="mt-8">
          <Link
            href="/dashboard/login"
            className="inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("maintenance.openDashboard")}
          </Link>
        </div>
      </section>
    </main>
  )
}
