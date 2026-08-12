"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { mapAdminError } from "@/lib/admin-i18n"
import { adminFetch } from "@/lib/api"
import { notifyContentUpdated } from "@/lib/cms-refresh"
import { ContentForm, emptyContentForm } from "@/components/dashboard/content-form"
import { useLanguage } from "@/lib/i18n"

export default function NewContentPage() {
  const router = useRouter()
  const { t, lang } = useLanguage()
  const [form, setForm] = useState(emptyContentForm)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      await adminFetch("/api/admin/content", { method: "POST", body: JSON.stringify(form) })
      notifyContentUpdated()
      router.push("/dashboard/content")
    } catch (err) {
      setError(mapAdminError(lang, err instanceof Error ? err.message : "", t("admin.contentForm.createFailed")))
    } finally {
      setSaving(false)
    }
  }

  return (
    <ContentForm
      title={t("admin.contentForm.createTitle")}
      description={t("admin.content.newDesc")}
      form={form}
      setForm={setForm}
      onSubmit={submit}
      saving={saving}
      error={error}
      locale={lang}
    />
  )
}
