import type React from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PageHero } from "@/components/page-hero"

type Crumb = { label: string; href?: string }

export function SitePageShell({
  title,
  subtitle,
  crumbs,
  children,
}: {
  title: string
  subtitle?: string
  crumbs: Crumb[]
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <PageHero title={title} subtitle={subtitle} crumbs={crumbs} />
      {children}
      <SiteFooter />
    </main>
  )
}
