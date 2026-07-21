"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { adminFetch } from "@/lib/api"
import { notifyContentUpdated } from "@/lib/cms-refresh"
import { ContentForm, emptyContentForm } from "@/components/dashboard/content-form"

export default function NewContentPage() {
  const router = useRouter()
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
      setError(err instanceof Error ? err.message : "Failed to create")
    } finally {
      setSaving(false)
    }
  }

  return (
    <ContentForm
      title="Create content"
      description="Add a new solution, product, or use case to your website."
      form={form}
      setForm={setForm}
      onSubmit={submit}
      saving={saving}
      error={error}
    />
  )
}
