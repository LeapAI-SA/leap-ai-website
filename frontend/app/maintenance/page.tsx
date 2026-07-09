import type { Metadata } from "next"
import Link from "next/link"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Maintenance",
  titleAr: "تحت الصيانة",
  description: "LeapAI website is temporarily in maintenance mode.",
  descriptionAr: "موقع LeapAI تحت الصيانة مؤقتاً.",
  path: "/maintenance",
  noIndex: true,
})

export default function MaintenancePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <section className="w-full max-w-2xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-sm font-bold uppercase tracking-widest text-amber">Maintenance Mode</p>
        <h1 className="mt-3 text-3xl font-extrabold text-navy md:text-4xl">We will be back soon</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          The public website is temporarily unavailable while updates are being applied.
        </p>
        <p className="mt-2 leading-relaxed text-muted-foreground">
          If you are an administrator, continue to the dashboard to manage settings and publish changes.
        </p>
        <div className="mt-8">
          <Link
            href="/dashboard/login"
            className="inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Open Dashboard
          </Link>
        </div>
      </section>
    </main>
  )
}

