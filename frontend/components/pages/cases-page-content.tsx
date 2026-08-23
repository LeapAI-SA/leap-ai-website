"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { SitePageShell } from "@/components/site-page-shell"
import { PageSection, SectionHeading, ContentCard } from "@/components/section-heading"
import { caseCategories, type CaseCategory, type CaseStudy } from "@/lib/cases-data"
import { useLanguage } from "@/lib/i18n"
import { resolveMediaUrl } from "@/lib/media"

type FilterId = "all" | CaseCategory

export function CasesPageContent({ cases }: { cases: CaseStudy[] }) {
  const { t, tr } = useLanguage()
  const [filter, setFilter] = useState<FilterId>("all")

  const filtered = useMemo(
    () => (filter === "all" ? cases : cases.filter((c) => c.category === filter)),
    [cases, filter],
  )

  const filters: { id: FilterId; label: string }[] = [
    { id: "all", label: t("cases.filterAll") },
    ...caseCategories.map((cat) => ({ id: cat.id as FilterId, label: t(cat.labelKey) })),
  ]

  return (
    <SitePageShell
      title={t("list.casesTitle")}
      subtitle={t("list.casesSubLong")}
      crumbs={[{ label: t("common.breadcrumbHome"), href: "/" }, { label: t("list.casesTitle") }]}
    >
      <PageSection>
        <SectionHeading title={t("list.casesTitle")} subtitle={t("list.casesSubLong")} />

        {cases.length > 0 && (
          <div
            className="mb-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
            role="tablist"
            aria-label={t("list.casesTitle")}
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
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors sm:px-5 ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground/80 hover:border-primary/50 hover:text-primary"
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        )}

        {cases.length === 0 ? (
          <p className="mx-auto max-w-xl text-center text-muted-foreground">{t("cases.empty")}</p>
        ) : filtered.length === 0 ? (
          <p className="mx-auto max-w-xl text-center text-muted-foreground">{t("cases.emptyFilter")}</p>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((item, i) => {
                const imageSrc = item.image ? resolveMediaUrl(item.image) : null

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
                  >
                    <ContentCard className="flex h-full flex-col overflow-hidden p-0">
                      <div className="relative h-44 overflow-hidden bg-muted">
                        {imageSrc ? (
                          <Image
                            src={imageSrc}
                            alt={tr(item.title)}
                            width={400}
                            height={176}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs font-medium text-muted-foreground">
                            {t("cases.noImage")}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <p className="text-xs font-bold uppercase tracking-wide text-amber">
                          {t(
                            item.category === "cx"
                              ? "cases.cat.cx"
                              : item.category === "da"
                                ? "cases.cat.da"
                                : "cases.cat.mobileWeb",
                          )}
                        </p>
                        <h3 className="mt-2 text-lg font-bold text-navy">{tr(item.title)}</h3>
                        <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">{tr(item.description)}</p>
                      </div>
                    </ContentCard>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </PageSection>
    </SitePageShell>
  )
}
