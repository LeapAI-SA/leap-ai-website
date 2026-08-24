"use client"

import type React from "react"
import { useState } from "react"
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
import { useLanguage } from "@/lib/i18n"
import { slugifyTitle } from "@/lib/slugify"

export type ContentFormValues = {
  type: "solution" | "product" | "use-case" | "article" | "case" | "job"
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
  autoSlug = true,
}: {
  title: string
  description?: string
  form: ContentFormValues
  setForm: (v: ContentFormValues) => void
  onSubmit: (e: React.FormEvent) => void
  saving: boolean
  error: string
  onDelete?: () => void
  /** When true, slug follows the title until the admin edits it manually. */
  autoSlug?: boolean
}) {
  const { t } = useLanguage()
  const [slugLocked, setSlugLocked] = useState(!autoSlug)

  function updateTitle(nextTitle: ContentFormValues["title"]) {
    if (autoSlug && !slugLocked) {
      setForm({ ...form, title: nextTitle, slug: slugifyTitle(nextTitle) })
      return
    }
    setForm({ ...form, title: nextTitle })
  }

  function updateSlug(nextSlug: string) {
    setSlugLocked(true)
    setForm({ ...form, slug: nextSlug })
  }

  const groupingTitle =
    form.type === "case"
      ? t("admin.contentForm.caseCategory")
      : form.type === "job"
        ? t("admin.contentForm.jobDepartment")
        : t("admin.contentForm.solutionGrouping")

  const groupingDesc =
    form.type === "case"
      ? t("admin.contentForm.caseCategoryHint")
      : form.type === "job"
        ? t("admin.contentForm.jobDepartmentHint")
        : t("admin.contentForm.solutionGroupingHint")

  const slugLabel =
    form.type === "case"
      ? t("admin.contentForm.categorySlug")
      : form.type === "job"
        ? t("admin.contentForm.departmentSlug")
        : t("admin.contentForm.groupSlug")

  const slugHint =
    form.type === "case"
      ? t("admin.contentForm.categorySlugHint")
      : form.type === "job"
        ? t("admin.contentForm.departmentSlugHint")
        : t("admin.contentForm.groupSlugHint")

  const groupTitleLabel =
    form.type === "case"
      ? t("admin.contentForm.categoryTitle")
      : form.type === "job"
        ? t("admin.contentForm.departmentTitle")
        : t("admin.contentForm.groupTitle")

  return (
    <form onSubmit={onSubmit} className="space-y-8 pb-12">
      <PageHeader
        title={title}
        description={description}
        actions={
          <DashButton href="/dashboard/content" variant="ghost">
            <ArrowLeft className="size-4" />
            {t("admin.contentForm.back")}
          </DashButton>
        }
      />

      {error && <Alert variant="error">{error}</Alert>}

      <Panel title={t("admin.contentForm.basicInfo")} description={t("admin.contentForm.basicInfoDesc")}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label={t("admin.contentForm.contentType")}>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as ContentFormValues["type"] })}
              className="form-input"
            >
              <option value="solution">{t("admin.contentForm.typeSolution")}</option>
              <option value="product">{t("admin.contentForm.typeProduct")}</option>
              <option value="use-case">{t("admin.contentForm.typeUseCase")}</option>
              <option value="case">{t("admin.contentForm.typeCase")}</option>
              <option value="job">{t("admin.contentForm.typeJob")}</option>
              <option value="article">{t("admin.contentForm.typeArticle")}</option>
            </select>
          </FormField>
          <FormField
            label={t("admin.contentForm.urlSlug")}
            hint={
              autoSlug && !slugLocked
                ? t("admin.contentForm.urlSlugAutoHint")
                : t("admin.contentForm.urlSlugHint")
            }
          >
            <input
              required
              value={form.slug}
              onChange={(e) => updateSlug(e.target.value)}
              className="form-input font-mono text-sm"
              dir="ltr"
              placeholder="my-page-slug"
            />
          </FormField>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <FormField label={t("admin.contentForm.sortOrder")} hint={t("admin.contentForm.sortOrderHint")}>
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
            label={t("admin.contentForm.published")}
            description={t("admin.contentForm.publishedDesc")}
          />
        </div>
      </Panel>

      {(form.type === "solution" || form.type === "case" || form.type === "job") && (
        <Panel title={groupingTitle} description={groupingDesc}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label={slugLabel} hint={slugHint}>
              {form.type === "case" ? (
                <select
                  value={form.groupSlug}
                  onChange={(e) => {
                    const groupSlug = e.target.value
                    const titles: Record<string, { ar: string; en: string }> = {
                      cx: { ar: "تجربة العملاء", en: "CX" },
                      da: { ar: "تحليل البيانات", en: "DA" },
                      "mobile-web": { ar: "حلول التطبيقات والمواقع", en: "Mobile and Web Solutions" },
                    }
                    setForm({ ...form, groupSlug, groupTitle: titles[groupSlug] ?? form.groupTitle })
                  }}
                  className="form-input font-mono text-sm"
                  dir="ltr"
                >
                  <option value="">—</option>
                  <option value="cx">cx — CX</option>
                  <option value="da">da — DA</option>
                  <option value="mobile-web">mobile-web — Mobile and Web</option>
                </select>
              ) : form.type === "job" ? (
                <select
                  value={form.groupSlug}
                  onChange={(e) => {
                    const groupSlug = e.target.value
                    const titles: Record<string, { ar: string; en: string }> = {
                      engineering: { ar: "الهندسة والتقنية", en: "Engineering" },
                      sales: { ar: "المبيعات", en: "Sales" },
                      operations: { ar: "العمليات", en: "Operations" },
                      general: { ar: "عام", en: "General" },
                    }
                    setForm({ ...form, groupSlug, groupTitle: titles[groupSlug] ?? form.groupTitle })
                  }}
                  className="form-input font-mono text-sm"
                  dir="ltr"
                >
                  <option value="">—</option>
                  <option value="engineering">engineering — Engineering</option>
                  <option value="sales">sales — Sales</option>
                  <option value="operations">operations — Operations</option>
                  <option value="general">general — General</option>
                </select>
              ) : (
                <input
                  value={form.groupSlug}
                  onChange={(e) => setForm({ ...form, groupSlug: e.target.value })}
                  className="form-input font-mono text-sm"
                  dir="ltr"
                  placeholder="group-slug"
                />
              )}
            </FormField>
            <LocalizedFieldGroup
              label={groupTitleLabel}
              value={form.groupTitle}
              onChange={(groupTitle) => setForm({ ...form, groupTitle })}
              rows={1}
            />
          </div>
        </Panel>
      )}

      {form.type !== "job" && (
        <Panel title={t("admin.contentForm.pageImage")} description={t("admin.contentForm.pageImageDesc")}>
          <ImageUploadField
            label={t("admin.contentForm.featuredImage")}
            hint={t("admin.contentForm.featuredImageHint")}
            value={form.image}
            onChange={(image) => setForm({ ...form, image })}
          />
        </Panel>
      )}

      <Panel title={t("admin.contentForm.bilingualContent")} description={t("admin.contentForm.bilingualContentDesc")}>
        <div className="space-y-4">
          <LocalizedFieldGroup label={t("admin.contentForm.fieldTitle")} value={form.title} onChange={updateTitle} />
          <LocalizedFieldGroup label={t("admin.contentForm.fieldExcerpt")} value={form.excerpt} onChange={(excerpt) => setForm({ ...form, excerpt })} rows={2} />
          <LocalizedFieldGroup
            label={t("admin.contentForm.fieldDescription")}
            value={form.description}
            onChange={(description) => setForm({ ...form, description })}
            rows={5}
          />
        </div>
      </Panel>

      <Panel
        title={form.type === "job" ? t("admin.contentForm.requirements") : t("admin.contentForm.keyFeatures")}
        description={t("admin.contentForm.onePerLine")}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label={t("admin.contentForm.featuresAr")}>
            <textarea
              rows={8}
              value={form.features.ar.join("\n")}
              onChange={(e) => setForm({ ...form, features: { ...form.features, ar: e.target.value.split("\n") } })}
              className="form-input resize-none font-mono text-sm"
              placeholder="Feature one&#10;Feature two"
            />
          </FormField>
          <FormField label={t("admin.contentForm.featuresEn")}>
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
          {saving ? t("admin.contentForm.saving") : t("admin.contentForm.saveContent")}
        </DashButton>
        <DashButton href="/dashboard/content" variant="secondary" type="button">
          {t("admin.contentForm.cancel")}
        </DashButton>
        {onDelete && (
          <DashButton type="button" variant="danger" onClick={onDelete} className="ms-auto">
            <Trash2 className="size-4" />
            {t("admin.contentForm.delete")}
          </DashButton>
        )}
      </div>
    </form>
  )
}
