"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ChevronDown, FileDown, Search } from "lucide-react"
import { featuredGeoFaq, mergeGeoFaq, type GeoFaqItem } from "@/lib/geo-faq"
import { filterGeoFaq, printGeoFaqPdf } from "@/lib/geo-faq-pdf"
import { useLanguage } from "@/lib/i18n"
import { useSiteSettings } from "@/lib/site-settings-context"
import { sitePath } from "@/lib/site-path"

export function GeoFaqSection({
  items,
  showSeeAll = false,
  showIntro = true,
  searchable = false,
}: {
  items?: GeoFaqItem[]
  showSeeAll?: boolean
  showIntro?: boolean
  searchable?: boolean
}) {
  const { t, tr, lang } = useLanguage()
  const { settings } = useSiteSettings()
  const [open, setOpen] = useState<number | null>(0)
  const [query, setQuery] = useState("")
  const allItems = items ?? featuredGeoFaq(mergeGeoFaq(settings?.faq))
  const faqItems = useMemo(
    () => (searchable ? filterGeoFaq(allItems, query) : allItems),
    [allItems, query, searchable],
  )

  return (
    <section id="faq" className={showIntro ? "bg-secondary py-20" : "bg-background pb-20"} aria-labelledby={showIntro ? "faq-heading" : undefined}>
      <div className="mx-auto max-w-3xl px-6">
        {showIntro ? (
        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-amber">{t("faq.badge")}</span>
          <h2 id="faq-heading" className="mt-3 text-3xl font-extrabold text-navy md:text-4xl">
            {t("faq.heading")}
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{t("faq.lead")}</p>
        </div>
        ) : null}

        {searchable ? (
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setOpen(0)
                }}
                className="form-input w-full ps-10"
                placeholder={t("faq.searchPlaceholder")}
              />
            </label>
            <button
              type="button"
              onClick={() => printGeoFaqPdf(faqItems.length ? faqItems : allItems, lang)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold text-navy hover:bg-muted"
            >
              <FileDown className="size-4" />
              {t("faq.pdfAll")}
            </button>
          </div>
        ) : null}

        {searchable && query.trim() && faqItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("faq.noMatch")}</p>
        ) : (
        <div className={showIntro ? "mt-12 flex flex-col gap-3" : "flex flex-col gap-3"}>
          {faqItems.map((item, i) => {
            const isOpen = open === i
            const question = tr(item.question)
            const answer = tr(item.answer)

            return (
              <article
                key={`${item.question.en}-${i}`}
                className="rounded-xl border border-border bg-card shadow-sm"
                itemScope
                itemType="https://schema.org/Question"
              >
                <div className="flex items-stretch gap-1">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex min-w-0 flex-1 items-center justify-between gap-3 p-4 text-start sm:gap-4 sm:p-5"
                >
                  <h3 className="min-w-0 flex-1 break-words font-bold text-navy" itemProp="name">
                    {question}
                  </h3>
                  <ChevronDown
                    className={`size-5 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => printGeoFaqPdf([item], lang)}
                  className="me-2 my-2 inline-flex shrink-0 items-center justify-center rounded-lg px-2 text-muted-foreground hover:bg-muted hover:text-navy"
                  title={t("faq.pdfOne")}
                  aria-label={t("faq.pdfOne")}
                >
                  <FileDown className="size-4" />
                </button>
                </div>
                <div
                  className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 leading-relaxed text-muted-foreground" itemProp="text">
                      {answer}
                    </p>
                    <p className="px-5 pb-5">
                      <button
                        type="button"
                        onClick={() => printGeoFaqPdf([item], lang)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-navy underline decoration-amber underline-offset-4 hover:text-amber"
                      >
                        <FileDown className="size-4" />
                        {t("faq.pdfOne")}
                      </button>
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        )}

        {showSeeAll ? (
          <p className="mt-8 text-center">
            <Link
              href={sitePath("/faq", lang)}
              className="font-semibold text-navy underline decoration-amber underline-offset-4 hover:text-amber"
            >
              {t("faq.seeAll")}
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  )
}
