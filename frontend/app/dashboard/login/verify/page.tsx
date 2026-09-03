"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { RotateCcw, ShieldCheck } from "lucide-react"
import {
  cancelAdminMfa,
  fetchAdminMfaStatus,
  resendAdminMfa,
  verifyAdminMfa,
} from "@/lib/api"
import { adminTf } from "@/lib/admin-tf"
import { useLanguage } from "@/lib/i18n"
import { resolveMediaUrl } from "@/lib/media"

export default function DashboardMfaVerifyPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [maskedEmail, setMaskedEmail] = useState("")
  const [code, setCode] = useState("")
  const [expiresSeconds, setExpiresSeconds] = useState(0)
  const [resendSeconds, setResendSeconds] = useState(0)
  const [attemptsRemaining, setAttemptsRemaining] = useState(5)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false
    void fetchAdminMfaStatus().then((status) => {
      if (cancelled) return
      if (!status) {
        router.replace("/dashboard/login")
        return
      }
      setMaskedEmail(status.maskedEmail)
      setExpiresSeconds(status.expiresIn)
      setResendSeconds(status.resendAfter)
      setAttemptsRemaining(status.attemptsRemaining)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [router])

  useEffect(() => {
    if (loading) return
    const timer = window.setInterval(() => {
      setExpiresSeconds((value) => {
        if (value <= 1) {
          window.clearInterval(timer)
          router.replace("/dashboard/login")
          return 0
        }
        return value - 1
      })
      setResendSeconds((value) => Math.max(0, value - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [loading, router])

  async function handleVerify(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      await verifyAdminMfa(code)
      router.replace("/dashboard")
    } catch (err) {
      const remaining =
        err instanceof Error && "attemptsRemaining" in err && typeof err.attemptsRemaining === "number"
          ? err.attemptsRemaining
          : undefined
      if (remaining !== undefined) setAttemptsRemaining(remaining)
      setError(err instanceof Error ? err.message : t("admin.login.mfaFailed"))
      setCode("")
      if (remaining === 0) router.replace("/dashboard/login")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleResend() {
    if (resendSeconds > 0) return
    setSubmitting(true)
    setError("")
    try {
      const result = await resendAdminMfa()
      setMaskedEmail(result.maskedEmail)
      setExpiresSeconds(result.expiresIn)
      setResendSeconds(result.resendAfter)
      setAttemptsRemaining(5)
      setCode("")
    } catch (err) {
      const retryAfter =
        err instanceof Error && "retryAfter" in err && typeof err.retryAfter === "number"
          ? err.retryAfter
          : 0
      if (retryAfter > 0) setResendSeconds(retryAfter)
      setError(err instanceof Error ? err.message : t("admin.login.mfaResendFailed"))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleBack() {
    setSubmitting(true)
    await cancelAdminMfa()
    router.replace("/dashboard/login")
  }

  const minutes = Math.floor(expiresSeconds / 60)
  const seconds = String(expiresSeconds % 60).padStart(2, "0")

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-navy p-12 text-navy-foreground lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="relative inline-block">
          <Image
            src={resolveMediaUrl("/leapai-logo.png")}
            alt="LeapAI"
            width={180}
            height={56}
            className="h-12 w-auto"
            priority
          />
        </Link>
        <div className="relative max-w-md">
          <ShieldCheck className="size-12 text-amber" />
          <h1 className="mt-6 text-4xl font-extrabold">{t("admin.login.mfaTitle")}</h1>
          <p className="mt-4 leading-relaxed text-navy-foreground/75">{t("admin.login.mfaSecurityNote")}</p>
        </div>
        <p className="relative text-xs text-navy-foreground/50">© {t("admin.login.portal")}</p>
      </div>

      <div className="flex items-center justify-center bg-background px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
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
              <ShieldCheck className="size-6 text-primary" />
            </div>
            <h2 className="text-2xl font-extrabold text-navy">{t("admin.login.mfaTitle")}</h2>

            {loading ? (
              <p className="mt-4 text-sm text-muted-foreground">{t("admin.login.mfaLoading")}</p>
            ) : (
              <>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t("admin.login.mfaSent")} <bdi dir="ltr" className="font-semibold text-navy">{maskedEmail}</bdi>
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {t("admin.login.mfaExpiresIn")} <bdi dir="ltr">{minutes}:{seconds}</bdi>
                </p>

                {error && (
                  <p className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {error}
                  </p>
                )}

                <form onSubmit={handleVerify} className="mt-6 space-y-4" autoComplete="off">
                  <label className="block">
                    <span className="text-sm font-semibold text-navy">{t("admin.login.mfaCode")}</span>
                    <input
                      type="text"
                      name="mfa-code"
                      required
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      value={code}
                      onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="form-input mt-2 text-center text-2xl font-bold tracking-[0.5em]"
                      dir="ltr"
                      autoComplete="one-time-code"
                      autoFocus
                    />
                  </label>

                  <p className="text-xs text-muted-foreground">
                    {adminTf(t, "admin.login.mfaAttemptsRemaining", { n: attemptsRemaining })}
                  </p>

                  <button
                    type="submit"
                    disabled={submitting || code.length !== 6}
                    className="dash-cta flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all disabled:opacity-60"
                  >
                    {submitting ? t("admin.login.mfaVerifying") : t("admin.login.mfaVerify")}
                    {!submitting && <ShieldCheck className="size-4" />}
                  </button>

                  <div className="flex items-center justify-between gap-3 text-sm">
                    <button type="button" onClick={handleBack} disabled={submitting} className="font-semibold text-primary hover:underline">
                      {t("admin.login.mfaBack")}
                    </button>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={submitting || resendSeconds > 0}
                      className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <RotateCcw className="size-3.5" />
                      {resendSeconds > 0
                        ? `${t("admin.login.mfaResendIn")} ${resendSeconds}s`
                        : t("admin.login.mfaResend")}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
