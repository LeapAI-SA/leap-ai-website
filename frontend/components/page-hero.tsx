"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"

type Crumb = { label: string; href?: string }

export function PageHero({
  title,
  subtitle,
  crumbs,
}: {
  title: string
  subtitle?: string
  crumbs: Crumb[]
}) {
  return (
    <section className="relative overflow-hidden bg-navy text-navy-foreground">
      <div className="pointer-events-none absolute -left-24 top-0 size-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 size-72 rounded-full bg-amber/20 blur-3xl" />
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <nav className="mb-5 flex flex-wrap items-center gap-1 text-sm text-navy-foreground/70">
          {crumbs.map((c, i) => (
            <span key={`${c.label}-${i}`} className="flex items-center gap-1">
              {i > 0 && <ChevronLeft className="size-3.5 opacity-50 rtl:rotate-180" />}
              {c.href ? (
                <Link href={c.href} className="transition-colors hover:text-amber">
                  {c.label}
                </Link>
              ) : (
                <span className="text-amber">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="max-w-3xl text-balance text-3xl font-extrabold leading-tight md:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-navy-foreground/80 md:text-lg">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
