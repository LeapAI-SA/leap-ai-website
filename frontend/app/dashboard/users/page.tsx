"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2, RefreshCw, UserPlus, Shield } from "lucide-react"
import { mapAdminError, adminLocale } from "@/lib/admin-i18n"
import { adminFetch } from "@/lib/api"
import {
  PageHeader,
  Panel,
  LoadingBlock,
  Alert,
  DashButton,
  FormField,
  EmptyState,
} from "@/components/dashboard/ui"
import { useLanguage } from "@/lib/i18n"

type AdminUser = {
  id: string
  email: string
  role: string
  createdAt: string | null
}

export default function DashboardUsersPage() {
  const { t, lang } = useLanguage()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [saving, setSaving] = useState(false)
  const [meEmail, setMeEmail] = useState<string | null>(null)

  async function load(silent = false) {
    if (!silent) setLoading(true)
    setError(null)
    try {
      const [list, me] = await Promise.all([
        adminFetch<AdminUser[]>("/api/admin/users"),
        adminFetch<{ user: { email: string } }>("/api/auth/me"),
      ])
      setUsers(list)
      setMeEmail(me.user.email)
    } catch (err) {
      setError(mapAdminError(lang, err instanceof Error ? err.message : "", t("admin.users.loadFailed")))
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function formatDate(value: string | null) {
    if (!value) return "—"
    try {
      return new Intl.DateTimeFormat(adminLocale(lang), { dateStyle: "medium" }).format(new Date(value))
    } catch {
      return value
    }
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)
    setError(null)
    if (password !== confirmPassword) {
      setError(t("admin.users.passwordMismatch"))
      return
    }
    setSaving(true)
    try {
      const created = await adminFetch<AdminUser>("/api/admin/users", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
      setUsers((prev) => [...prev, created])
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setShowForm(false)
      setMessage(t("admin.users.created"))
    } catch (err) {
      setError(mapAdminError(lang, err instanceof Error ? err.message : "", t("admin.users.createFailed")))
    } finally {
      setSaving(false)
    }
  }

  async function removeUser(user: AdminUser) {
    if (!window.confirm(t("admin.users.deleteConfirm"))) return
    setBusyId(user.id)
    setError(null)
    setMessage(null)
    try {
      await adminFetch(`/api/admin/users/${user.id}`, { method: "DELETE" })
      setUsers((prev) => prev.filter((u) => u.id !== user.id))
      setMessage(t("admin.users.deleted"))
    } catch (err) {
      setError(mapAdminError(lang, err instanceof Error ? err.message : "", t("admin.users.deleteFailed")))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={t("admin.users.title")}
        description={t("admin.users.desc")}
        actions={
          <div className="flex flex-wrap gap-2">
            <DashButton type="button" variant="secondary" onClick={() => load()}>
              <RefreshCw className="size-4" />
              {t("admin.users.refresh")}
            </DashButton>
            <DashButton type="button" onClick={() => setShowForm((v) => !v)}>
              <Plus className="size-4" />
              {t("admin.users.add")}
            </DashButton>
          </div>
        }
      />

      {error && <Alert variant="error">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}

      {showForm && (
        <Panel title={t("admin.users.addTitle")} description={t("admin.users.addDesc")}>
          <form onSubmit={createUser} className="grid max-w-xl gap-4">
            <FormField label={t("admin.common.email")}>
              <input
                required
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="name@company.com"
              />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label={t("admin.users.password")} hint={t("admin.users.passwordHint")}>
                <input
                  required
                  type="password"
                  dir="ltr"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
              </FormField>
              <FormField label={t("admin.users.confirmPassword")}>
                <input
                  required
                  type="password"
                  dir="ltr"
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                />
              </FormField>
            </div>
            <div className="flex flex-wrap gap-2">
              <DashButton type="submit" disabled={saving}>
                <UserPlus className="size-4" />
                {saving ? t("admin.users.saving") : t("admin.users.create")}
              </DashButton>
              <DashButton type="button" variant="ghost" onClick={() => setShowForm(false)}>
                {t("admin.contentForm.cancel")}
              </DashButton>
            </div>
          </form>
        </Panel>
      )}

      <Panel title={t("admin.users.listTitle")} description={t("admin.users.listDesc")}>
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <Shield className="size-3.5" />
            {users.length} {t("admin.users.admins")}
          </span>
        </div>
        {loading ? (
          <LoadingBlock label={t("admin.users.loading")} />
        ) : users.length === 0 ? (
          <EmptyState
            title={t("admin.users.empty")}
            description={t("admin.users.emptyDesc")}
            action={
              <DashButton type="button" onClick={() => setShowForm(true)}>
                <Plus className="size-4" />
                {t("admin.users.add")}
              </DashButton>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-start text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider">{t("admin.common.email")}</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider">{t("admin.common.status")}</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider">{t("admin.common.date")}</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider">{t("admin.common.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isMe = meEmail?.toLowerCase() === user.email.toLowerCase()
                  return (
                    <tr key={user.id} className="border-b border-border/70 last:border-0">
                      <td className="px-3 py-3 font-semibold text-navy" dir="ltr">
                        {user.email}
                        {isMe && (
                          <span className="ms-2 rounded-full bg-amber/15 px-2 py-0.5 text-[10px] font-bold text-amber">
                            {t("admin.users.you")}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">{t("admin.users.roleAdmin")}</td>
                      <td className="px-3 py-3 text-muted-foreground">{formatDate(user.createdAt)}</td>
                      <td className="px-3 py-3">
                        <DashButton
                          type="button"
                          variant="danger"
                          disabled={isMe || busyId === user.id || users.length <= 1}
                          onClick={() => removeUser(user)}
                          className="!px-3 !py-1.5"
                        >
                          <Trash2 className="size-3.5" />
                          {t("admin.contentForm.delete")}
                        </DashButton>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  )
}
