import type React from "react"

export function SectionHeading({
  title,
  subtitle,
  className = "",
}: {
  title: string
  subtitle?: string
  className?: string
}) {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center gap-3">
        <span className="h-7 w-1.5 rounded-full bg-amber" />
        <h2 className="text-2xl font-extrabold text-navy md:text-3xl">{title}</h2>
      </div>
      {subtitle && <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

export function PageSection({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={`bg-background py-16 md:py-20 ${className}`}>
      <div className="mx-auto max-w-7xl px-6">{children}</div>
    </section>
  )
}

export function ContentCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-shadow hover:shadow-md ${className}`}>
      {children}
    </div>
  )
}
