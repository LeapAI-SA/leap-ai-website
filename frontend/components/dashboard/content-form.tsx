"use client"

import type React from "react"
import { ArrowLeft, Trash2 } from "lucide-react"
import {
  PageHeader,
  Panel,
  Alert,
  FormField,
  LocalizedFieldGroup,
  DashButton,
  Toggle,
  ImageUploadField,
} from "@/components/dashboard/ui"

export type ContentFormValues = {
  type: "solution" | "product" | "use-case"
  slug: string
  groupSlug: string
  groupTitle: { ar: string; en: string }
  title: { ar: string; en: string }
  excerpt: { ar: string; en: string }
  description: { ar: string; en: string }
  features: { ar: string[]; en: string[] }
  image: string
  published: boolean
  sortOrder: number
}

export const emptyContentForm: ContentFormValues = {
  type: "solution",
  slug: "",
  groupSlug: "",
  groupTitle: { ar: "", en: "" },
  title: { ar: "", en: "" },
  excerpt: { ar: "", en: "" },
  description: { ar: "", en: "" },
  features: { ar: [""], en: [""] },
  image: "",
  published: true,
  sortOrder: 0,
}

export function ContentForm({
  title,
  description,
  form,
  setForm,
  onSubmit,
  saving,
  error,
  onDelete,
}: {
  title: string
  description?: string
  form: ContentFormValues
  setForm: (v: ContentFormValues) => void
  onSubmit: (e: React.FormEvent) => void
  saving: boolean
  error: string
  onDelete?: () => void
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-8 pb-12">
      <PageHeader
        title={title}
        description={description}
        actions={
          <DashButton href="/dashboard/content" variant="ghost">
            <ArrowLeft className="size-4" />
            Back
          </DashButton>
        }
      />

      {error && <Alert variant="error">{error}</Alert>}

      <Panel title="Basic info" description="Type, URL slug, and publish status">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Content type">
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as ContentFormValues["type"] })}
              className="form-input"
            >
              <option value="solution">Solution</option>
              <option value="product">Product</option>
              <option value="use-case">Use case</option>
            </select>
          </FormField>
          <FormField label="URL slug" hint="e.g. whatsapp-business">
            <input
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="form-input font-mono text-sm"
              dir="ltr"
              placeholder="my-page-slug"
            />
          </FormField>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <FormField label="Sort order" hint="Lower numbers appear first">
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
              className="form-input max-w-xs"
            />
          </FormField>
          <Toggle
            checked={form.published}
            onChange={(published) => setForm({ ...form, published })}
            label="Published"
            description="When enabled, this item appears on the public website"
          />
        </div>
      </Panel>

      {form.type === "solution" && (
        <Panel title="Solution grouping" description="How this item appears on the Solutions page">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Group slug" hint="e.g. omnichannel-contact-center">
              <input
                value={form.groupSlug}
                onChange={(e) => setForm({ ...form, groupSlug: e.target.value })}
                className="form-input font-mono text-sm"
                dir="ltr"
                placeholder="group-slug"
              />
            </FormField>
            <LocalizedFieldGroup
              label="Group title"
              value={form.groupTitle}
              onChange={(groupTitle) => setForm({ ...form, groupTitle })}
              rows={1}
            />
          </div>
        </Panel>
      )}

      <Panel title="Page image" description="Shown on listing cards and the detail page">
        <ImageUploadField
          label="Featured image"
          hint="Upload or paste a path like /uploads/my-image.png"
          value={form.image}
          onChange={(image) => setForm({ ...form, image })}
        />
      </Panel>

      <Panel title="Content (bilingual)" description="Arabic and English versions">
        <div className="space-y-4">
          <LocalizedFieldGroup label="Title" value={form.title} onChange={(title) => setForm({ ...form, title })} />
          <LocalizedFieldGroup label="Excerpt" value={form.excerpt} onChange={(excerpt) => setForm({ ...form, excerpt })} rows={2} />
          <LocalizedFieldGroup
            label="Description"
            value={form.description}
            onChange={(description) => setForm({ ...form, description })}
            rows={5}
          />
        </div>
      </Panel>

      <Panel title="Key features" description="One feature per line">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Arabic features">
            <textarea
              rows={8}
              value={form.features.ar.join("\n")}
              onChange={(e) => setForm({ ...form, features: { ...form.features, ar: e.target.value.split("\n") } })}
              className="form-input resize-none font-mono text-sm"
              placeholder="Feature one&#10;Feature two"
            />
          </FormField>
          <FormField label="English features">
            <textarea
              rows={8}
              dir="ltr"
              value={form.features.en.join("\n")}
              onChange={(e) => setForm({ ...form, features: { ...form.features, en: e.target.value.split("\n") } })}
              className="form-input resize-none font-mono text-sm"
              placeholder="Feature one&#10;Feature two"
            />
          </FormField>
        </div>
      </Panel>

      <div className="flex flex-wrap items-center gap-3">
        <DashButton type="submit" disabled={saving} className="min-w-[120px]">
          {saving ? "Saving..." : "Save content"}
        </DashButton>
        <DashButton href="/dashboard/content" variant="secondary" type="button">
          Cancel
        </DashButton>
        {onDelete && (
          <DashButton type="button" variant="danger" onClick={onDelete} className="ms-auto">
            <Trash2 className="size-4" />
            Delete
          </DashButton>
        )}
      </div>
    </form>
  )
}
