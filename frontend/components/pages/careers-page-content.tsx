"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { Briefcase, MapPin, Clock } from "lucide-react"
import { SitePageShell } from "@/components/site-page-shell"
import { PageSection } from "@/components/section-heading"
import { jobDepartments, type JobDepartment, type JobOpening } from "@/lib/jobs-data"
import { CareerApplyForm } from "@/components/career-apply-form"
import { useLanguage } from "@/lib/i18n"
import { sitePath } from "@/lib/site-path"

type FilterId = "all" | JobDepartment

function parseExcerptMeta(excerpt: string, fallbackType: string) {
  const parts = excerpt
    .split(/[·•|]/)
    .map((p) => p.trim())
    .filter(Boolean)
  if (parts.length >= 2) {
    return { location: parts[0], employmentType: parts.slice(1).join(" · ") }
  }
  if (parts.length === 1) {
    return { location: parts[0], employmentType: fallbackType }
  }
  return { location: "", employmentType: fallbackType }
}

export function CareersPageContent({ jobs }: { jobs: JobOpening[] }) {
  const { t, tr, lang } = useLanguage()
  const [filter, setFilter] = useState<FilterId>("all")
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)

  const filtered = useMemo(
    () => (filter === "all" ? jobs : jobs.filter((job) => job.department === filter)),
    [jobs, filter],
  )

  const selectedJob = useMemo(
    () => jobs.find((job) => job.slug === selectedSlug) ?? null,
    [jobs, selectedSlug],
  )

  const filters: { id: FilterId; label: string }[] = [
    { id: "all", label: t("careers.filterAll") },
    ...jobDepartments.map((dept) => ({ id: dept.id as FilterId, label: t(dept.labelKey) })),
  ]

  const defaultType = t("careers.defaultType")

  return (
    <SitePageShell
      title={t("careers.title")}
      subtitle={t("careers.subtitle")}
      crumbs={[{ label: t("common.breadcrumbHome"), href: "/" }, { label: t("careers.title") }]}
    >
      <PageSection>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start xl:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">{t("careers.openPositions")}</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {t("careers.selectOrGeneral")}
            </p>

            {jobs.length > 0 && (
              <div
                className="mt-6 flex flex-wrap items-center gap-2"
                role="tablist"
                aria-label={t("careers.openPositions")}
              >
                {filters.map((item) => {
                  const active = filter === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setFilter(item.id)}
                      className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors sm:text-sm ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-navy"
                      }`}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
            )}

            <div className="mt-8 space-y-4">
              {jobs.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-10 text-center text-sm text-muted-foreground">
                  {t("careers.empty")}
                </p>
              ) : filtered.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-10 text-center text-sm text-muted-foreground">
                  {t("careers.emptyFilter")}
                </p>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filtered.map((job, i) => {
                    const excerpt = tr(job.excerpt)
                    const { location, employmentType } = parseExcerptMeta(excerpt, defaultType)
                    const selected = selectedSlug === job.slug

                    return (
                      <motion.article
                        key={job.slug}
                        layout
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, delay: (i % 8) * 0.04 }}
                        className={`relative rounded-2xl border bg-card p-5 shadow-sm transition-all sm:p-6 ${
                          selected
                            ? "border-primary ring-2 ring-primary/15"
                            : "border-border hover:border-primary/30 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <Link
                              href={sitePath(`/careers/${job.slug}`, lang)}
                              className="text-lg font-bold text-navy transition-colors hover:text-primary sm:text-xl"
                            >
                              {tr(job.title)}
                            </Link>

                            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground sm:text-sm">
                              <li className="inline-flex items-center gap-1.5">
                                <Briefcase className="size-3.5 shrink-0 text-primary/80" />
                                {tr(job.departmentTitle)}
                              </li>
                              {location ? (
                                <li className="inline-flex items-center gap-1.5">
                                  <MapPin className="size-3.5 shrink-0 text-primary/80" />
                                  {location}
                                </li>
                              ) : null}
                              <li className="inline-flex items-center gap-1.5">
                                <Clock className="size-3.5 shrink-0 text-primary/80" />
                                {employmentType}
                              </li>
                            </ul>

                            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                              {tr(job.description)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedSlug(job.slug)}
                            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-colors sm:text-sm ${
                              selected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-navy hover:bg-primary/10 hover:text-primary"
                            }`}
                          >
                            {t("careers.apply")}
                          </button>
                        </div>
                      </motion.article>
                    )
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>

          <aside className="lg:sticky lg:top-28">
            <CareerApplyForm
              key={selectedJob?.slug ?? "general"}
              variant="panel"
              mode={selectedJob ? "job" : "general"}
              job={selectedJob ?? undefined}
            />
          </aside>
        </div>
      </PageSection>
    </SitePageShell>
  )
}
