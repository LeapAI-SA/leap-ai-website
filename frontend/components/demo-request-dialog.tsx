"use client"

import type React from "react"
import { useEffect, useId, useState } from "react"
import { CheckCircle2, Mail, User, X } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { submitDemoRequest } from "@/lib/api"
import { isBusinessEmail, isValidEmailFormat } from "@/lib/business-email"

type Props = {
  open: boolean
  onClose: () => void
}

export function DemoRequestDialog({ open, onClose }: Props) {
  const { t, lang } = useLanguage()
  const titleId = useId()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      setName("")
      setEmail("")
      setSubmitting(false)
      setSent(false)
      setError(null)
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fullName = name.trim()
    const businessEmail = email.trim()
    if (!fullName) {
      setError(t("demo.nameRequired"))
      return
    }
    if (!isValidEmailFormat(businessEmail)) {
      setError(t("demo.emailInvalid"))
      return
    }
    if (!isBusinessEmail(businessEmail)) {
      setError(t("demo.emailBusinessOnly"))
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      await submitDemoRequest({ name: fullName, email: businessEmail })
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : t("demo.error"))
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        dir={lang === "ar" ? "rtl" : "ltr"}
        className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute end-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={t("demo.close")}
        >
          <X className="size-5" />
        </button>

        {sent ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-whatsapp/10">
              <CheckCircle2 className="size-8 text-whatsapp" />
            </span>
            <h2 id={titleId} className="text-xl font-bold text-foreground">
              {t("demo.success")}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{t("demo.successText")}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 rounded-full bg-amber px-6 py-2.5 text-sm font-bold text-accent-foreground"
            >
              {t("demo.close")}
            </button>
          </div>
        ) : (
          <>
            <h2 id={titleId} className="pe-8 text-xl font-bold text-foreground">
              {t("demo.title")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("demo.sub")}</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-foreground">{t("demo.fullName")}</span>
                <span className="relative block">
                  <User className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background py-2.5 ps-10 pe-3 text-sm text-foreground outline-none ring-amber/40 focus:ring-2"
                  />
                </span>
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-foreground">{t("demo.businessEmail")}</span>
                <span className="relative block">
                  <Mail className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("demo.emailPlaceholder")}
                    className="w-full rounded-xl border border-border bg-background py-2.5 ps-10 pe-3 text-sm text-foreground outline-none ring-amber/40 focus:ring-2"
                  />
                </span>
              </label>
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-amber py-3 text-sm font-bold text-accent-foreground shadow-md transition-opacity disabled:opacity-60"
              >
                {submitting ? t("demo.submitting") : t("demo.submit")}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
