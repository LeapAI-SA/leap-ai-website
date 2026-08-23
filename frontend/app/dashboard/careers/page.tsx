"use client"

import { useEffect, useMemo, useState } from "react"
import { Mail, Phone, Trash2, CheckCircle2, Circle, RefreshCw, Eye, X, Download, Briefcase } from "lucide-react"
import { adminLocale, mapAdminError } from "@/lib/admin-i18n"
import { adminFetch, downloadJobApplicationCv, type JobApplicationPublic } from "@/lib/api"
import { adminTf } from "@/lib/admin-tf"
import { PageHeader, Panel, LoadingBlock, Alert, DashButton } from "@/components/dashboard/ui"
import { useLanguage } from "@/lib/i18n"

function formatDate(value: string, lang: "ar" | "en") {
  try {
    return new Intl.DateTimeFormat(adminLocale(lang), {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value))
  } catch {
    return value
  }
}

function positionLabel(item: JobApplicationPublic, lang: "ar" | "en") {
  return (lang === "ar" ? item.positionTitle.ar : item.positionTitle.en) || item.positionTitle.en || item.positionSlug
}

export default function DashboardCareersPage() {
  const { lang, t } = useLanguage()
  const [applications, setApplications] = useState<JobApplicationPublic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  async function load(silent = false) {
    if (!silent) setLoading(true)
    setError(null)
    try {
      const data = await adminFetch<JobApplicationPublic[]>("/api/admin/job-applications")
      setApplications(data)
    } catch (err) {
      setError(mapAdminError(lang, err instanceof Error ? err.message : "", t("admin.careers.loadFailed")))
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const timer = setInterval(() => load(true), 15000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!selectedId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [selectedId])

  const unreadCount = useMemo(() => applications.filter((m) => !m.read).length, [applications])
  const selected = useMemo(
    () => applications.find((item) => item.id === selectedId) ?? null,
    [applications, selectedId],
  )

  async function openView(item: JobApplicationPublic) {
    setSelectedId(item.id)
    if (!item.read) void toggleRead(item)
  }

  async function toggleRead(item: JobApplicationPublic) {
    setBusyId(item.id)
    try {
      const updated = await adminFetch<JobApplicationPublic>(`/api/admin/job-applications/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ read: !item.read }),
      })
      setApplications((prev) => prev.map((m) => (m.id === item.id ? updated : m)))
    } catch (err) {
      setError(mapAdminError(lang, err instanceof Error ? err.message : "", t("admin.careers.updateFailed")))
    } finally {
      setBusyId(null)
    }
  }

  async function remove(id: string) {
    if (!confirm(t("admin.careers.deleteConfirm"))) return
    setBusyId(id)
    try {
      await adminFetch(`/api/admin/job-applications/${id}`, { method: "DELETE" })
      setApplications((prev) => prev.filter((m) => m.id !== id))
      if (selectedId === id) setSelectedId(null)
    } catch (err) {
      setError(mapAdminError(lang, err instanceof Error ? err.message : "", t("admin.careers.deleteFailed")))
    } finally {
      setBusyId(null)
    }
  }

  async function downloadCv(item: JobApplicationPublic) {
    setBusyId(item.id)
    try {
      const ext = item.cvFile.split(".").pop() || "pdf"
      await downloadJobApplicationCv(item.id, `${item.name.replace(/\s+/g, "-")}-cv.${ext}`)
    } catch (err) {
      setError(mapAdminError(lang, err instanceof Error ? err.message : "", t("admin.careers.downloadFailed")))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("admin.careers.title")}
        description={t("admin.careers.desc")}
        actions={
          <>
            <DashButton onClick={() => load()} variant="secondary" disabled={loading}>
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
              {t("admin.common.refresh")}
            </DashButton>
            <DashButton href="/dashboard/content" variant="secondary">
              {t("admin.careers.manageJobs")}
            </DashButton>
          </>
        }
      />

      {error && <Alert variant="error">{error}</Alert>}

      <Panel
        title={
          unreadCount
            ? adminTf(t, "admin.careers.inboxUnread", { n: unreadCount })
            : t("admin.careers.inbox")
        }
        description={t("admin.careers.inboxDesc")}
      >
        {loading ? (
          <LoadingBlock label={t("admin.careers.loading")} />
        ) : applications.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{t("admin.careers.empty")}</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-start font-semibold">{t("admin.common.status")}</th>
                  <th className="px-3 py-2 text-start font-semibold">{t("admin.common.name")}</th>
                  <th className="px-3 py-2 text-start font-semibold">{t("admin.careers.position")}</th>
                  <th className="px-3 py-2 text-start font-semibold">{t("admin.common.email")}</th>
                  <th className="px-3 py-2 text-start font-semibold">{t("admin.common.date")}</th>
                  <th className="px-3 py-2 text-start font-semibold">{t("admin.common.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((item) => (
                  <tr key={item.id} className={!item.read ? "bg-primary/5" : "bg-card"}>
                    <td className="whitespace-nowrap px-3 py-2">
                      {!item.read ? (
                        <span className="rounded-full bg-amber px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
                          {t("admin.careers.new")}
                        </span>
                      ) : (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                          {t("admin.careers.read")}
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 font-semibold text-navy">{item.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{positionLabel(item, lang)}</td>
                    <td className="px-3 py-2">
                      <a href={`mailto:${item.email}`} className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
                        <Mail className="size-4" />
                        {item.email}
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">{formatDate(item.createdAt, lang)}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openView(item)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-muted"
                        >
                          <Eye className="size-3.5" />
                          {t("admin.careers.view")}
                        </button>
                        <button
                          type="button"
                          disabled={busyId === item.id}
                          onClick={() => downloadCv(item)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-muted"
                        >
                          <Download className="size-3.5" />
                          {t("admin.careers.downloadCv")}
                        </button>
                        <button
                          type="button"
                          disabled={busyId === item.id}
                          onClick={() => toggleRead(item)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-muted"
                        >
                          {item.read ? <Circle className="size-3.5" /> : <CheckCircle2 className="size-3.5 text-primary" />}
                          {item.read ? t("admin.careers.unreadBtn") : t("admin.careers.read")}
                        </button>
                        <button
                          type="button"
                          disabled={busyId === item.id}
                          onClick={() => remove(item.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 px-2.5 py-1.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10"
                        >
                          <Trash2 className="size-3.5" />
                          {t("admin.common.delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedId(null)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="careers-view-title"
            className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="absolute end-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={t("admin.common.close")}
            >
              <X className="size-5" />
            </button>

            <div className="flex flex-wrap items-center gap-2 pe-10">
              <h3 id="careers-view-title" className="text-xl font-bold text-navy">
                {selected.name}
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                <Briefcase className="size-3" />
                {positionLabel(selected, lang)}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{formatDate(selected.createdAt, lang)}</p>

            <dl className="mt-5 space-y-3 text-sm">
              <div>
                <dt className="font-semibold text-muted-foreground">{t("admin.common.email")}</dt>
                <dd>
                  <a href={`mailto:${selected.email}`} className="font-medium text-primary hover:underline">
                    {selected.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-muted-foreground">{t("admin.common.phone")}</dt>
                <dd dir="ltr">
                  <a href={`tel:${selected.phone.replace(/\s/g, "")}`} className="font-medium text-primary hover:underline">
                    {selected.phone}
                  </a>
                </dd>
              </div>
              {selected.message ? (
                <div>
                  <dt className="font-semibold text-muted-foreground">{t("admin.careers.coverLetter")}</dt>
                  <dd className="mt-1 whitespace-pre-wrap rounded-xl bg-muted/40 p-4 leading-relaxed text-foreground">
                    {selected.message}
                  </dd>
                </div>
              ) : null}
            </dl>

            <div className="mt-6">
              <DashButton type="button" onClick={() => downloadCv(selected)} disabled={busyId === selected.id}>
                <Download className="size-4" />
                {t("admin.careers.downloadCv")}
              </DashButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
