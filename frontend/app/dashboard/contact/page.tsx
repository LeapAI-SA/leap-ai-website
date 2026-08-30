"use client"

import { useEffect, useMemo, useState } from "react"
import { Mail, Phone, Trash2, CheckCircle2, Circle, RefreshCw, Eye, X } from "lucide-react"
import { adminLocale, mapAdminError } from "@/lib/admin-i18n"
import { adminFetch, type ContactMessage } from "@/lib/api"
import { adminTf } from "@/lib/admin-tf"
import { PageHeader, Panel, LoadingBlock, Alert, DashButton } from "@/components/dashboard/ui"
import { useLanguage } from "@/lib/i18n"

function sourceLabel(source: ContactMessage["source"], t: ReturnType<typeof useLanguage>["t"]) {
  if (source === "partner") return t("admin.contact.sourcePartner")
  if (source === "demo") return t("admin.contact.sourceDemo")
  if (source === "campaign") return t("admin.contact.sourceCampaign")
  return t("admin.contact.sourceContact")
}

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

export default function DashboardContactPage() {
  const { lang, t } = useLanguage()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  async function load(silent = false) {
    if (!silent) setLoading(true)
    setError(null)
    try {
      const data = await adminFetch<ContactMessage[]>("/api/admin/contact-messages")
      setMessages(data)
    } catch (err) {
      setError(mapAdminError(lang, err instanceof Error ? err.message : "", t("admin.contact.loadFailed")))
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

  const unreadCount = useMemo(() => messages.filter((m) => !m.read).length, [messages])
  const selectedMessage = useMemo(
    () => messages.find((item) => item.id === selectedId) ?? null,
    [messages, selectedId],
  )

  function closeView() {
    setSelectedId(null)
  }

  async function openView(item: ContactMessage) {
    setSelectedId(item.id)
    if (!item.read) {
      void toggleRead(item)
    }
  }

  async function toggleRead(item: ContactMessage) {
    setBusyId(item.id)
    try {
      const updated = await adminFetch<ContactMessage>(`/api/admin/contact-messages/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ read: !item.read }),
      })
      setMessages((prev) => prev.map((m) => (m.id === item.id ? updated : m)))
    } catch (err) {
      setError(mapAdminError(lang, err instanceof Error ? err.message : "", t("admin.contact.updateFailed")))
    } finally {
      setBusyId(null)
    }
  }

  async function remove(id: string) {
    if (!confirm(t("admin.contact.deleteConfirm"))) return
    setBusyId(id)
    try {
      await adminFetch(`/api/admin/contact-messages/${id}`, { method: "DELETE" })
      setMessages((prev) => prev.filter((m) => m.id !== id))
    } catch (err) {
      setError(mapAdminError(lang, err instanceof Error ? err.message : "", t("admin.contact.deleteFailed")))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("admin.contact.title")}
        description={t("admin.contact.desc")}
        actions={
          <>
            <DashButton onClick={() => load()} variant="secondary" disabled={loading}>
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
              {t("admin.common.refresh")}
            </DashButton>
            <DashButton href="/dashboard/settings" variant="secondary">
              {t("admin.contact.editInfo")}
            </DashButton>
          </>
        }
      />

      {error && <Alert variant="error">{error}</Alert>}

      <Panel
        title={
          unreadCount
            ? adminTf(t, "admin.contact.inboxUnread", { n: unreadCount })
            : t("admin.contact.inbox")
        }
        description={t("admin.contact.inboxDesc")}
      >
        {loading ? (
          <LoadingBlock label={t("admin.contact.loading")} />
        ) : messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{t("admin.contact.empty")}</p>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-start font-semibold">{t("admin.common.status")}</th>
                    <th className="px-3 py-2 text-start font-semibold">{t("admin.common.name")}</th>
                    <th className="px-3 py-2 text-start font-semibold">{t("admin.common.email")}</th>
                    <th className="px-3 py-2 text-start font-semibold">{t("admin.common.phone")}</th>
                    <th className="px-3 py-2 text-start font-semibold">{t("admin.common.source")}</th>
                    <th className="px-3 py-2 text-start font-semibold">{t("admin.common.date")}</th>
                    <th className="px-3 py-2 text-start font-semibold">{t("admin.common.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((item) => (
                    <tr key={item.id} className={!item.read ? "bg-primary/5" : "bg-card"}>
                      <td className="whitespace-nowrap px-3 py-2">
                        {!item.read ? (
                          <span className="rounded-full bg-amber px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
                            {t("admin.contact.new")}
                          </span>
                        ) : (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                            {t("admin.contact.read")}
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 font-semibold text-navy">{item.name}</td>
                      <td className="px-3 py-2">
                        <a href={`mailto:${item.email}`} className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
                          <Mail className="size-4" />
                          {item.email}
                        </a>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2" dir="ltr">
                        {item.phone ? (
                          <a href={`tel:${item.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
                            <Phone className="size-4" />
                            {item.phone}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">
                        {sourceLabel(item.source, t)}
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
                            {t("admin.contact.view")}
                          </button>
                          <button
                            type="button"
                            disabled={busyId === item.id}
                            onClick={() => toggleRead(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-muted"
                          >
                            {item.read ? <Circle className="size-3.5" /> : <CheckCircle2 className="size-3.5 text-primary" />}
                            {item.read ? t("admin.contact.unreadBtn") : t("admin.contact.read")}
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

          </div>
        )}
      </Panel>

      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm"
          onClick={closeView}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-view-title"
            className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeView}
              className="absolute end-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={t("admin.common.close")}
            >
              <X className="size-5" />
            </button>

            <div className="flex flex-wrap items-center gap-2 pe-10">
              <h3 id="contact-view-title" className="text-xl font-bold text-navy">
                {selectedMessage.name}
              </h3>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                {sourceLabel(selectedMessage.source, t)}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{formatDate(selectedMessage.createdAt, lang)}</p>

            <dl className="mt-5 space-y-3 text-sm">
              <div>
                <dt className="font-semibold text-muted-foreground">{t("admin.common.email")}</dt>
                <dd>
                  <a href={`mailto:${selectedMessage.email}`} className="font-medium text-primary hover:underline">
                    {selectedMessage.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-muted-foreground">{t("admin.common.phone")}</dt>
                <dd dir="ltr">
                  {selectedMessage.phone ? (
                    <a href={`tel:${selectedMessage.phone.replace(/\s/g, "")}`} className="font-medium text-primary hover:underline">
                      {selectedMessage.phone}
                    </a>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
              {selectedMessage.company ? (
                <div>
                  <dt className="font-semibold text-muted-foreground">{t("admin.common.company")}</dt>
                  <dd>{selectedMessage.company}</dd>
                </div>
              ) : null}
              {selectedMessage.address ? (
                <div>
                  <dt className="font-semibold text-muted-foreground">{t("admin.common.address")}</dt>
                  <dd>{selectedMessage.address}</dd>
                </div>
              ) : null}
              <div>
                <dt className="font-semibold text-muted-foreground">{t("admin.common.message")}</dt>
                <dd className="mt-1 whitespace-pre-wrap rounded-xl bg-muted/40 p-4 leading-relaxed text-foreground">
                  {selectedMessage.message || "—"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  )
}
