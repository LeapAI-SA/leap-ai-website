"use client"

import type React from "react"
import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Loader2, Upload, X } from "lucide-react"
import { uploadAdminImage } from "@/lib/api"
import { resolveMediaUrl } from "@/lib/media"

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy md:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string
  value: string
  hint?: string
  icon: React.ComponentType<{ className?: string }>
  tone?: "default" | "success" | "warning" | "primary"
}) {
  const tones = {
    default: "from-slate-500/10 to-transparent text-slate-600",
    success: "from-emerald-500/15 to-transparent text-emerald-600",
    warning: "from-amber-500/15 to-transparent text-amber-600",
    primary: "from-primary/15 to-transparent text-primary",
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className={`absolute inset-0 bg-gradient-to-br ${tones[tone]} opacity-80`} />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-extrabold tabular-nums text-navy">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <span className="flex size-11 items-center justify-center rounded-xl bg-background/80 shadow-sm ring-1 ring-border/60">
          <Icon className="size-5 text-navy/70" />
        </span>
      </div>
    </div>
  )
}

export function Panel({
  title,
  description,
  children,
  className = "",
}: {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm ${className}`}>
      <div className="border-b border-border/60 bg-muted/30 px-6 py-4">
        <h2 className="text-base font-bold text-navy">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="p-6">{children}</div>
    </section>
  )
}

export function DashButton({
  children,
  variant = "primary",
  href,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "amber"
  href?: string
}) {
  const styles = {
    primary: "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90",
    secondary: "border border-border bg-background text-foreground hover:bg-muted",
    ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
    danger: "border border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10",
    amber: "bg-amber text-accent-foreground shadow-md shadow-amber/25 hover:bg-amber/90",
  }[variant]

  const classes = `inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-50 ${styles} ${className}`

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}

export function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode
  variant?: "default" | "success" | "warning" | "muted"
}) {
  const styles = {
    default: "bg-primary/10 text-primary",
    success: "bg-emerald-500/10 text-emerald-700",
    warning: "bg-amber/20 text-amber-foreground",
    muted: "bg-muted text-muted-foreground",
  }[variant]

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${styles}`}>
      {children}
    </span>
  )
}

export function Alert({
  children,
  variant = "info",
}: {
  children: React.ReactNode
  variant?: "info" | "success" | "error"
}) {
  const styles = {
    info: "border-primary/20 bg-primary/5 text-foreground",
    success: "border-emerald-500/20 bg-emerald-500/5 text-emerald-800",
    error: "border-destructive/20 bg-destructive/5 text-destructive",
  }[variant]

  return <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${styles}`}>{children}</div>
}

export function FilterTabs<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: { id: T; label: string; count?: number }[]
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-xl border border-border/80 bg-muted/40 p-1">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
            value === opt.id
              ? "bg-card text-primary shadow-sm ring-1 ring-primary/25"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt.label}
          {opt.count !== undefined && (
            <span className="ms-1.5 text-xs font-bold text-muted-foreground">({opt.count})</span>
          )}
        </button>
      ))}
    </div>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <span className="text-2xl">📄</span>
      </div>
      <h3 className="text-lg font-bold text-navy">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function LoadingBlock({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-8 text-muted-foreground">
      <Loader2 className="size-5 animate-spin text-primary" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border/60 bg-muted/20 p-4 transition-colors hover:bg-muted/40">
      <div>
        <span className="text-sm font-semibold text-navy">{label}</span>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? "bg-primary" : "bg-border"}`}
      >
        <span
          className={`absolute top-0.5 size-6 rounded-full bg-white shadow transition-transform ${checked ? "start-5" : "start-0.5"}`}
        />
      </button>
    </div>
  )
}

export function FormField({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-navy">{label}</span>
      {hint && <span className="ms-2 text-xs font-normal text-muted-foreground">{hint}</span>}
      <div className="mt-2">{children}</div>
    </label>
  )
}

export function LocalizedFieldGroup({
  label,
  value,
  onChange,
  rows = 2,
}: {
  label: string
  value: { ar: string; en: string }
  onChange: (v: { ar: string; en: string }) => void
  rows?: number
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/10 p-4">
      <p className="mb-3 text-sm font-bold text-navy">{label}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Arabic">
          <textarea
            rows={rows}
            value={value.ar}
            onChange={(e) => onChange({ ...value, ar: e.target.value })}
            className="form-input resize-none"
          />
        </FormField>
        <FormField label="English">
          <textarea
            rows={rows}
            dir="ltr"
            value={value.en}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
            className="form-input resize-none"
          />
        </FormField>
      </div>
    </div>
  )
}

export function StickySaveBar({
  onSave,
  saving,
  label = "Save changes",
}: {
  onSave: () => void
  saving: boolean
  label?: string
}) {
  return (
    <div className="sticky bottom-4 z-20 flex justify-end">
      <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card/95 px-4 py-3 shadow-lg backdrop-blur-md">
        <DashButton onClick={onSave} disabled={saving} className="min-w-[140px]">
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </>
          ) : (
            label
          )}
        </DashButton>
      </div>
    </div>
  )
}

export function ImageUploadField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint?: string
  value: string
  onChange: (url: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  async function handleFile(file: File) {
    setUploading(true)
    setError("")
    try {
      const url = await uploadAdminImage(file)
      onChange(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const preview = resolveMediaUrl(value)

  return (
    <div className="space-y-3">
      <FormField label={label} hint={hint}>
        <div className="flex flex-wrap items-start gap-3">
          {preview ? (
            <div className="relative overflow-hidden rounded-xl border border-border bg-muted/20">
              <Image src={preview} alt="" width={160} height={100} className="h-24 w-40 object-cover" unoptimized />
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute end-1 top-1 flex size-7 items-center justify-center rounded-lg bg-black/60 text-white"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <div className="flex h-24 w-40 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 text-xs text-muted-foreground">
              No image
            </div>
          )}
          <div className="flex min-w-[200px] flex-1 flex-col gap-2">
            <input
              type="text"
              dir="ltr"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/hero-dashboard.png or /uploads/..."
              className="form-input font-mono text-xs"
            />
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void handleFile(file)
                e.target.value = ""
              }}
            />
            <DashButton
              type="button"
              variant="secondary"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="w-fit"
            >
              {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              {uploading ? "Uploading..." : "Upload image"}
            </DashButton>
          </div>
        </div>
      </FormField>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
