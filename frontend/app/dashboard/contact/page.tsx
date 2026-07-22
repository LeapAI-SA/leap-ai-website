"use client"

import { useEffect, useMemo, useState } from "react"
import { Mail, Phone, Trash2, CheckCircle2, Circle, RefreshCw, Eye } from "lucide-react"
import { adminFetch, type ContactMessage } from "@/lib/api"
import { PageHeader, Panel, LoadingBlock, Alert, DashButton } from "@/components/dashboard/ui"

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value))
  } catch {
    return value
  }
}

export default function DashboardContactPage() {
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
      setError(err instanceof Error ? err.message : "Failed to load contact messages")
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const timer = setInterval(() => load(true), 15000)
    return () => clearInterval(timer)
  }, [])

  const unreadCount = useMemo(() => messages.filter((m) => !m.read).length, [messages])
  const selectedMessage = useMemo(
    () => messages.find((item) => item.id === selectedId) ?? null,
    [messages, selectedId],
  )

  async function toggleRead(item: ContactMessage) {
    setBusyId(item.id)
    try {
      const updated = await adminFetch<ContactMessage>(`/api/admin/contact-messages/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ read: !item.read }),
      })
      setMessages((prev) => prev.map((m) => (m.id === item.id ? updated : m)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update message")
    } finally {
      setBusyId(null)
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this contact message?")) return
    setBusyId(id)
    try {
      await adminFetch(`/api/admin/contact-messages/${id}`, { method: "DELETE" })
      setMessages((prev) => prev.filter((m) => m.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete message")
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Contact Us"
        description="View messages submitted from the public Contact Us form. Edit contact details in Site Settings."
        actions={
          <>
            <DashButton onClick={() => load()} variant="secondary" disabled={loading}>
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </DashButton>
            <DashButton href="/dashboard/settings" variant="secondary">
              Edit contact info
            </DashButton>
          </>
        }
      />

      {error && <Alert variant="error">{error}</Alert>}

      <Panel
        title={`Inbox${unreadCount ? ` (${unreadCount} unread)` : ""}`}
        description="Messages from leapai.ai/contact-us"
      >
        {loading ? (
          <LoadingBlock label="Loading contact messages..." />
        ) : messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No contact messages yet. Submissions from the public Contact Us page will appear here.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-start font-semibold">Status</th>
                    <th className="px-3 py-2 text-start font-semibold">Name</th>
                    <th className="px-3 py-2 text-start font-semibold">Email</th>
                    <th className="px-3 py-2 text-start font-semibold">Phone</th>
                    <th className="px-3 py-2 text-start font-semibold">Source</th>
                    <th className="px-3 py-2 text-start font-semibold">Date</th>
                    <th className="px-3 py-2 text-start font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((item) => (
                    <tr key={item.id} className={!item.read ? "bg-primary/5" : "bg-card"}>
                      <td className="whitespace-nowrap px-3 py-2">
                        {!item.read ? (
                          <span className="rounded-full bg-amber px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
                            New
                          </span>
                        ) : (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                            Read
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
                        <a href={`tel:${item.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
                          <Phone className="size-4" />
                          {item.phone}
                        </a>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">
                        {item.source === "partner" ? "Partner form" : "Contact Us"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">{formatDate(item.createdAt)}</td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedId(item.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-muted"
                          >
                            <Eye className="size-3.5" />
                            View
                          </button>
                          <button
                            type="button"
                            disabled={busyId === item.id}
                            onClick={() => toggleRead(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-muted"
                          >
                            {item.read ? <Circle className="size-3.5" /> : <CheckCircle2 className="size-3.5 text-primary" />}
                            {item.read ? "Unread" : "Read"}
                          </button>
                          <button
                            type="button"
                            disabled={busyId === item.id}
                            onClick={() => remove(item.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 px-2.5 py-1.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10"
                          >
                            <Trash2 className="size-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedMessage && (
              <article className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-navy">{selectedMessage.name}</h3>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                        {selectedMessage.source === "partner" ? "Partner form" : "Contact Us"}
                      </span>
                    </div>
                    {selectedMessage.company && (
                      <p className="text-sm text-muted-foreground">{selectedMessage.company}</p>
                    )}
                    {selectedMessage.address && (
                      <p className="text-sm text-muted-foreground">{selectedMessage.address}</p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(selectedMessage.createdAt)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-navy hover:bg-muted"
                  >
                    Close
                  </button>
                </div>
                <p className="mt-4 whitespace-pre-wrap rounded-xl bg-muted/40 p-4 text-sm leading-relaxed text-foreground">
                  {selectedMessage.message}
                </p>
              </article>
            )}
          </div>
        )}
      </Panel>
    </div>
  )
}
