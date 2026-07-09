"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "motion/react"
import { CheckCircle2, User, Mail, Building2, Phone, MessageSquare, Send, Headset } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { submitContactMessage } from "@/lib/api"

type Fields = {
  name: string
  email: string
  company: string
  phone: string
  message: string
}

const initial: Fields = {
  name: "",
  email: "",
  company: "",
  phone: "",
  message: "",
}

export function ContactForm() {
  const { t } = useLanguage()
  const [values, setValues] = useState<Fields>(initial)
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(key: keyof Fields, val: string) {
    setValues((v) => ({ ...v, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await submitContactMessage({ ...values, source: "contact" })
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message")
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-card p-12 text-center shadow-lg"
      >
        <span className="flex size-16 items-center justify-center rounded-full bg-whatsapp/10">
          <CheckCircle2 className="size-9 text-whatsapp" />
        </span>
        <h3 className="text-2xl font-bold text-foreground">{t("contact.success")}</h3>
        <p className="max-w-md leading-relaxed text-muted-foreground">{t("contact.successText")}</p>
        <button
          onClick={() => {
            setValues(initial)
            setSent(false)
          }}
          className="mt-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {t("contact.sendAnother")}
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg"
    >
      <div className="flex items-center gap-3 border-b border-border bg-navy px-6 py-5 text-navy-foreground md:px-8">
        <span className="flex size-11 items-center justify-center rounded-xl bg-white/10">
          <Headset className="size-6 text-amber" />
        </span>
        <div>
          <h2 className="text-lg font-bold">{t("contact.formTitle")}</h2>
          <p className="text-sm text-navy-foreground/70">{t("contact.formExpert")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t("contact.name")} required icon={<User className="size-4" />}>
            <input
              type="text"
              required
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder={t("contact.name")}
              className="form-input"
            />
          </Field>
          <Field label={t("contact.emailLabel")} required icon={<Mail className="size-4" />}>
            <input
              type="email"
              required
              dir="ltr"
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder={t("contact.emailLabel")}
              className="form-input"
            />
          </Field>
          <Field label={t("contact.company")} icon={<Building2 className="size-4" />}>
            <input
              type="text"
              value={values.company}
              onChange={(e) => update("company", e.target.value)}
              placeholder={t("contact.company")}
              className="form-input"
            />
          </Field>
          <Field label={t("contact.phone")} required icon={<Phone className="size-4" />}>
            <input
              type="tel"
              required
              dir="ltr"
              value={values.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder={t("contact.phoneExample")}
              className="form-input"
            />
          </Field>
        </div>

        <div className="mt-5">
          <Field label={t("contact.message")} required icon={<MessageSquare className="size-4" />}>
            <textarea
              required
              maxLength={180}
              rows={5}
              value={values.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder={t("contact.messagePlaceholder")}
              className="form-input resize-none"
            />
            <span className="mt-1 block text-end text-xs text-muted-foreground">{values.message.length} / 180</span>
          </Field>
        </div>

        {error && <p className="mt-4 text-sm font-medium text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="size-4" />
          {submitting ? "Sending..." : t("contact.submit")}
        </button>
      </form>
    </motion.div>
  )
}

function Field({
  label,
  required,
  icon,
  children,
}: {
  label: string
  required?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
        {icon && <span className="text-primary">{icon}</span>}
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      {children}
    </label>
  )
}
