"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { mapAdminError } from "@/lib/admin-i18n"
import { adminFetch } from "@/lib/api"
import { notifyContentUpdated } from "@/lib/cms-refresh"
import { LoadingBlock, Alert } from "@/components/dashboard/ui"
import { ContentForm, type ContentFormValues } from "@/components/dashboard/content-form"
import { useLanguage } from "@/lib/i18n"
import { adminTf } from "@/lib/admin-tf"

export default function EditContentPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { t, lang } = useLanguage()
  const [form, setForm] = useState<ContentFormValues | null>(null)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    adminFetch<ContentFormValues & { id: string }>(`/api/admin/content/${id}`)
      .then((item) => {
        setForm({
          type: item.type,
          slug: item.slug,
          groupSlug: item.groupSlug ?? "",
          groupTitle: item.groupTitle ?? { ar: "", en: "" },
          title: item.title,
          excerpt: item.excerpt,
          description: item.description,
          features: item.features,
          image: item.image ?? "",
          published: item.published,
          sortOrder: item.sortOrder,
        })
      })
      .catch((err) =>
        setError(mapAdminError(lang, err instanceof Error ? err.message : "", t("admin.contentForm.loadFailed"))),
      )
  }, [id, lang, t])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    setError("")
    try {
      await adminFetch(`/api/admin/content/${id}`, { method: "PUT", body: JSON.stringify(form) })
      notifyContentUpdated()
      router.push("/dashboard/content")
    } catch (err) {
      setError(mapAdminError(lang, err instanceof Error ? err.message : "", t("admin.contentForm.saveFailed")))
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!confirm(t("admin.contentForm.deleteConfirm"))) return
    try {
      await adminFetch(`/api/admin/content/${id}`, { method: "DELETE" })
      notifyContentUpdated()
      router.push("/dashboard/content")
    } catch (err) {
      setError(mapAdminError(lang, err instanceof Error ? err.message : "", t("admin.contentForm.deleteFailed")))
    }
  }

  if (!form) {
    return (
      <div className="space-y-6">
        {error ? <Alert variant="error">{error}</Alert> : <LoadingBlock label={t("admin.common.loadingContent")} />}
      </div>
    )
  }

  return (
    <ContentForm
      title={t("admin.contentForm.editTitle")}
      description={adminTf(t, "admin.content.editingSlug", { slug: form.slug })}
      form={form}
      setForm={setForm}
      onSubmit={submit}
      saving={saving}
      error={error}
      onDelete={remove}
      autoSlug={false}
    />
  )
}
