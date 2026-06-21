"use client"

import Link from "next/link"
import Image from "next/image"
import { Check } from "lucide-react"
import { PageSection, SectionHeading } from "@/components/section-heading"
import type { NavItem } from "@/lib/site-data"
import { useLanguage } from "@/lib/i18n"
import { resolveMediaUrl } from "@/lib/media"
import { resolveContentImage } from "@/lib/page-images"

export function DetailBody({ item, related, basePath }: { item: NavItem; related: NavItem[]; basePath: string }) {
  const { t, tr } = useLanguage()
  const description = tr(item.description)
  const features = tr(item.features)
  const imageSrc = resolveMediaUrl(resolveContentImage(item.slug, item.image))

  return (
    <PageSection>
      <div className="grid gap-12 lg:grid-cols-3">
        <article className="lg:col-span-2">
          <div className="relative mb-8 overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
            <Image
              src={imageSrc}
              alt={tr(item.title)}
              width={960}
              height={480}
              className="h-auto max-h-[420px] w-full object-cover"
              unoptimized
            />
          </div>

          <SectionHeading title={t("detail.overview")} className="mb-6" />
          <p className="text-lg leading-relaxed text-muted-foreground">{description}</p>

          <div className="mt-12">
            <SectionHeading title={t("detail.features")} className="mb-6" />
            <ul className="grid gap-4 sm:grid-cols-2">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="size-4" />
                  </span>
                  <span className="leading-relaxed text-foreground/90">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mt-12 overflow-hidden rounded-2xl bg-navy p-8 text-navy-foreground shadow-lg">
            <div className="pointer-events-none absolute -left-16 top-0 size-48 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 bottom-0 size-48 rounded-full bg-amber/20 blur-3xl" />
            <div className="relative">
              <h3 className="text-xl font-bold">{t("detail.ctaTitle")}</h3>
              <p className="mt-2 leading-relaxed text-navy-foreground/80">{t("detail.ctaTextAlt")}</p>
              <Link
                href="/contact-us"
                className="mt-5 inline-block rounded-full bg-amber px-6 py-3 text-sm font-bold text-amber-foreground transition-transform hover:scale-105"
              >
                {t("detail.demoBtn")}
              </Link>
            </div>
          </div>
        </article>

        <aside>
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-6 w-1.5 rounded-full bg-amber" />
              <h3 className="text-lg font-bold text-navy">{t("detail.related")}</h3>
            </div>
            <ul className="flex flex-col gap-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`${basePath}/${r.slug}`}
                    className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
                  >
                    {tr(r.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </PageSection>
  )
}
