"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { geoFaqItems } from "@/lib/geo-faq"
import { useLanguage } from "@/lib/i18n"
import { useSiteSettings } from "@/lib/site-settings-context"

export function GeoFaqSection() {
  const { t, tr } = useLanguage()
  const { settings } = useSiteSettings()
  const [open, setOpen] = useState<number | null>(0)
  const faqItems = settings?.faq?.length ? settings.faq : geoFaqItems

  return (
    <section id="faq" className="bg-secondary py-20" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-amber">{t("faq.badge")}</span>
          <h2 id="faq-heading" className="mt-3 text-3xl font-extrabold text-navy md:text-4xl">
            {t("faq.heading")}
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{t("faq.lead")}</p>
        </div>

        <div className="mt-12 flex flex-col gap-3">
          {faqItems.map((item, i) => {
            const isOpen = open === i
            const question = tr(item.question)
            const answer = tr(item.answer)

            return (
              <article
                key={question}
                className="rounded-xl border border-border bg-card shadow-sm"
                itemScope
                itemType="https://schema.org/Question"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full min-w-0 items-center justify-between gap-3 p-4 text-start sm:gap-4 sm:p-5"
                >
                  <h3 className="min-w-0 flex-1 break-words font-bold text-navy" itemProp="name">
                    {question}
                  </h3>
                  <ChevronDown
                    className={`size-5 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
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
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
