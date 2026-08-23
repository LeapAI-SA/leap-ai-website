"use client"

import Link from "next/link"
import { Check } from "lucide-react"
import { SitePageShell } from "@/components/site-page-shell"
import { PageSection, SectionHeading } from "@/components/section-heading"
import { CareerApplyForm } from "@/components/career-apply-form"
import type { JobOpening } from "@/lib/jobs-data"
import { useLanguage } from "@/lib/i18n"
import { sitePath } from "@/lib/site-path"

export function JobDetailPageContent({ job }: { job: JobOpening }) {
  const { t, tr, lang } = useLanguage()
  const requirements = tr(job.requirements)

  return (
    <SitePageShell
      title={tr(job.title)}
      subtitle={tr(job.excerpt)}
      crumbs={[
        { label: t("common.breadcrumbHome"), href: "/" },
        { label: t("careers.title"), href: sitePath("/careers", lang) },
        { label: tr(job.title) },
      ]}
    >
      <PageSection>
        <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
          <article>
            <p className="text-xs font-bold uppercase tracking-wide text-amber">{tr(job.departmentTitle)}</p>
            <SectionHeading title={t("detail.overview")} className="mt-6 mb-4" />
            <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">{tr(job.description)}</p>

            {requirements.length > 0 && (
              <div className="mt-12">
                <SectionHeading title={t("careers.requirements")} className="mb-6" />
                <ul className="grid gap-3 sm:grid-cols-2">
                  {requirements.map((line) => (
                    <li key={line} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="size-4" />
                      </span>
                      <span className="leading-relaxed text-foreground/90">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10 lg:hidden">
              <CareerApplyForm job={job} />
            </div>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-4">
              <CareerApplyForm job={job} />
              <Link
                href={sitePath("/careers", lang)}
                className="block text-center text-sm font-semibold text-primary hover:underline"
              >
                {t("careers.backToList")}
              </Link>
            </div>
          </aside>
        </div>
      </PageSection>
    </SitePageShell>
  )
}
