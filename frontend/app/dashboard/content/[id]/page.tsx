"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { adminFetch } from "@/lib/api"
import { LoadingBlock, Alert } from "@/components/dashboard/ui"
import { ContentForm, type ContentFormValues } from "@/components/dashboard/content-form"

export default function EditContentPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
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
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load content"))
  }, [id])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    setError("")
    try {
      await adminFetch(`/api/admin/content/${id}`, { method: "PUT", body: JSON.stringify(form) })
      router.push("/dashboard/content")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!confirm("Delete this content item permanently?")) return
    try {
      await adminFetch(`/api/admin/content/${id}`, { method: "DELETE" })
      router.push("/dashboard/content")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
    }
  }

  if (!form) {
    return (
      <div className="space-y-6">
        {error ? <Alert variant="error">{error}</Alert> : <LoadingBlock label="Loading content..." />}
      </div>
    )
  }

  return (
    <ContentForm
      title="Edit content"
      description={`Editing /${form.slug}`}
      form={form}
      setForm={setForm}
      onSubmit={submit}
      saving={saving}
      error={error}
      onDelete={remove}
    />
  )
}
