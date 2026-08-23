"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "motion/react"
import { User, Mail, Phone, MessageSquare, Send, FileUp } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { submitJobApplication } from "@/lib/api"
import type { JobOpening } from "@/lib/jobs-data"

type Fields = {
  name: string
  email: string
  phone: string
  message: string
}

const initial: Fields = {
  name: "",
  email: "",
  phone: "",
  message: "",
}

const ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"

const GENERAL_TITLE = { ar: "طلب عام", en: "General application" }

export function CareerApplyForm({
  job,
  mode = "job",
  variant = "default",
}: {
  job?: JobOpening
  mode?: "job" | "general"
  variant?: "default" | "panel"
}) {
  const { t, tr } = useLanguage()
  const [values, setValues] = useState<Fields>(initial)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isGeneral = mode === "general" || !job
  const isPanel = variant === "panel"
  const heading = isGeneral ? t("careers.generalApplyTitle") : t("careers.applyTitle")
  const subtitle = isGeneral ? t("careers.generalApplySub") : tr(job!.title)

  function update(key: keyof Fields, val: string) {
    setValues((v) => ({ ...v, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!cvFile) {
      setError(t("careers.cvRequired"))
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const form = new FormData()
      if (isGeneral) {
        form.append("positionSlug", "general-application")
        form.append("positionTitleAr", GENERAL_TITLE.ar)
        form.append("positionTitleEn", GENERAL_TITLE.en)
      } else {
        form.append("positionSlug", job!.slug)
        form.append("positionTitleAr", job!.title.ar)
        form.append("positionTitleEn", job!.title.en)
      }
      form.append("name", values.name)
      form.append("email", values.email)
      form.append("phone", values.phone)
      form.append("message", values.message)
      form.append("cv", cvFile)
      await submitJobApplication(form)
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("careers.submitFailed"))
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl border border-border bg-card shadow-sm ${isPanel ? "p-6" : "p-10 text-center"}`}
      >
        <p className="text-xs font-bold uppercase tracking-wider text-amber">LeapAI</p>
        <h3 className={`mt-2 font-bold text-navy ${isPanel ? "text-xl" : "text-2xl"}`}>
          {t("careers.applicationReceived")}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("careers.successText")}</p>
      </motion.div>
    )
  }

  if (isPanel) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm" id="apply">
        <div className="border-b border-border/80 px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-wider text-amber">LeapAI</p>
          <h2 className="mt-1 text-lg font-bold text-navy">{heading}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {error && (
            <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}

          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-navy">
              <User className="size-3.5 text-primary" />
              {t("contact.name")}
            </span>
            <input
              required
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-navy">
              <Mail className="size-3.5 text-primary" />
              {t("contact.email")}
            </span>
            <input
              required
              type="email"
              dir="ltr"
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-navy">
              <Phone className="size-3.5 text-primary" />
              {t("contact.phone")}
            </span>
            <input
              required
              type="tel"
              dir="ltr"
              value={values.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-navy">
              <FileUp className="size-3.5 text-primary" />
              {t("careers.cvLabel")}
            </span>
            <input
              required
              type="file"
              accept={ACCEPT}
              onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-xl border border-dashed border-border bg-muted/20 px-3 py-2.5 text-xs file:me-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-primary-foreground"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">{t("careers.cvHint")}</p>
          </label>

          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-navy">
              <MessageSquare className="size-3.5 text-primary" />
              {t("careers.coverLetter")}
            </span>
            <textarea
              rows={3}
              value={values.message}
              onChange={(e) => update("message", e.target.value)}
              className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
              placeholder={t("careers.coverLetterPlaceholder")}
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md shadow-primary/15 transition-all hover:bg-primary/90 disabled:opacity-60"
          >
            <Send className="size-4" />
            {submitting ? t("careers.submitting") : t("careers.submit")}
          </button>
        </form>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg"
      id="apply"
    >
      <div className="border-b border-border px-6 py-5 md:px-8">
        <p className="text-xs font-bold uppercase tracking-wider text-amber">LeapAI</p>
        <h2 className="mt-1 text-lg font-bold text-navy">{heading}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-6 md:p-8">
        {error && (
          <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
            <User className="size-4 text-primary" />
            {t("contact.name")}
          </span>
          <input
            required
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
              <Mail className="size-4 text-primary" />
              {t("contact.email")}
            </span>
            <input
              required
              type="email"
              dir="ltr"
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
              <Phone className="size-4 text-primary" />
              {t("contact.phone")}
            </span>
            <input
              required
              type="tel"
              dir="ltr"
              value={values.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
            <FileUp className="size-4 text-primary" />
            {t("careers.cvLabel")}
          </span>
          <input
            required
            type="file"
            accept={ACCEPT}
            onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3 text-sm file:me-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-bold file:text-primary-foreground"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">{t("careers.cvHint")}</p>
        </label>

        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
            <MessageSquare className="size-4 text-primary" />
            {t("careers.coverLetter")}
          </span>
          <textarea
            rows={4}
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
            placeholder={t("careers.coverLetterPlaceholder")}
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 disabled:opacity-60 sm:w-auto"
        >
          <Send className="size-4" />
          {submitting ? t("careers.submitting") : t("careers.submit")}
        </button>
      </form>
    </motion.div>
  )
}
