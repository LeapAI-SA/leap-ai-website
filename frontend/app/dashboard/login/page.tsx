"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { Lock, Mail, ArrowRight, Globe, Database, Zap } from "lucide-react"
import { loginAdmin, setToken } from "@/lib/api"
import { resolveMediaUrl } from "@/lib/media"

export default function DashboardLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const { token } = await loginAdmin(email, password)
      setToken(token)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
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
              Content Management
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight">
              Manage your website
              <span className="text-amber"> in one place</span>
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-navy-foreground/75">
              Update homepage content, hero sections, stats, and all solutions — in Arabic and English — without touching code.
            </p>
          </div>

          <ul className="space-y-4">
            {[
              { icon: Globe, text: "Bilingual AR / EN content editing" },
              { icon: Database, text: "Powered by MongoDB & Redis" },
              { icon: Zap, text: "Changes reflect on the live site instantly" },
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

        <p className="relative text-xs text-navy-foreground/50">© LeapAI — Admin Portal</p>
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
            <h2 className="text-2xl font-extrabold text-navy">Welcome back</h2>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to your CMS dashboard</p>

            {error && (
              <p className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-navy">Email address</span>
                <div className="relative mt-2">
                  <Mail className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input ps-10"
                    dir="ltr"
                    placeholder="admin@leapai.ai"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-navy">Password</span>
                <div className="relative mt-2">
                  <Lock className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input ps-10"
                    dir="ltr"
                    placeholder="••••••••"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="dash-cta mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in to dashboard"}
                {!loading && <ArrowRight className="size-4" />}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link href="/" className="font-semibold text-primary hover:underline">
              ← Back to website
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
