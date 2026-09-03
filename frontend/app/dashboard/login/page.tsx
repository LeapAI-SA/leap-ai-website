"use client"

import type React from "react"
import { Suspense, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "motion/react"
import { Lock, Mail, ArrowRight, Globe, Database, Zap } from "lucide-react"
import { loginAdmin } from "@/lib/api"
import { useLanguage } from "@/lib/i18n"
import { resolveMediaUrl } from "@/lib/media"

function DashboardLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionExpired = searchParams.get("sessionExpired") === "1"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { t } = useLanguage()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await loginAdmin(email, password)
      router.push("/dashboard")
    } catch (err) {
      const message = err instanceof Error ? err.message : ""
      setError(message || t("admin.login.failed"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-navy p-12 text-navy-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -left-20 -top-20 size-80 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 size-96 rounded-full bg-amber/20 blur-3xl" />

        <div className="relative">
          <Link href="/" className="inline-block">
            <Image
              src={resolveMediaUrl("/leapai-logo.png")}
              alt="LeapAI"
              width={180}
              height={56}
              className="h-12 w-auto"
              priority
            />
          </Link>
        </div>

        <div className="relative space-y-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-xs font-bold text-[#7ec4ff]">
              {t("admin.login.badge")}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight">
              {t("admin.login.heading1")}
              <span className="text-amber"> {t("admin.login.heading2")}</span>
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-navy-foreground/75">
              {t("admin.login.sub")}
            </p>
          </div>

          <ul className="space-y-4">
            {[
              { icon: Globe, text: t("admin.login.f1") },
              { icon: Database, text: t("admin.login.f2") },
              { icon: Zap, text: t("admin.login.f3") },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-3 text-sm text-navy-foreground/85">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15">
                  <item.icon className="size-4 text-primary" />
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-navy-foreground/50">© {t("admin.login.portal")}</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 lg:hidden">
            <Image
              src={resolveMediaUrl("/leapai-logo.png")}
              alt="LeapAI"
              width={160}
              height={50}
              className="h-10 w-auto"
              priority
            />
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-8 shadow-xl shadow-primary/5">
            <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-primary/10">
              <Lock className="size-6 text-primary" />
            </div>
            <h2 className="text-2xl font-extrabold text-navy">{t("admin.login.welcome")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("admin.login.subtitle")}</p>

            {sessionExpired && (
              <p className="mt-4 rounded-xl border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-navy">
                {t("admin.login.sessionExpired")}
              </p>
            )}

            {error && (
              <p className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" autoComplete="off">
              <label className="block">
                <span className="text-sm font-semibold text-navy">{t("admin.login.email")}</span>
                <div className="relative mt-2">
                  <Mail className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input ps-10"
                    dir="ltr"
                    placeholder=""
                    autoComplete="username"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-navy">{t("admin.login.password")}</span>
                <div className="relative mt-2">
                  <Lock className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input ps-10"
                    dir="ltr"
                    placeholder=""
                    autoComplete="current-password"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="dash-cta mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all disabled:opacity-60"
              >
                {loading ? t("admin.login.signingIn") : t("admin.login.signIn")}
                {!loading && <ArrowRight className="size-4" />}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link href="/" className="font-semibold text-primary hover:underline">
              ← {t("admin.common.backToWebsite")}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function DashboardLoginPage() {
  const { t } = useLanguage()
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          {t("admin.auth.checkingAccess")}
        </div>
      }
    >
      <DashboardLoginForm />
    </Suspense>
  )
}
