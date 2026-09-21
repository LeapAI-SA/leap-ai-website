"use client"

import { useMemo, useState } from "react"
import { FileDown, Search } from "lucide-react"
import { mergeGeoFaq, type GeoFaqItem } from "@/lib/geo-faq"
import { filterGeoFaq, printGeoFaqPdf } from "@/lib/geo-faq-pdf"
import { useLanguage } from "@/lib/i18n"
import { adminTf } from "@/lib/admin-tf"
import { Panel, DashButton } from "@/components/dashboard/ui"

export function GeoFaqAskPanel({ extras }: { extras?: GeoFaqItem[] | null }) {
  const { t, lang } = useLanguage()
  const library = useMemo(() => mergeGeoFaq(extras), [extras])
  const [query, setQuery] = useState("")
  const matches = useMemo(() => filterGeoFaq(library, query).slice(0, 12), [library, query])
  const [selected, setSelected] = useState<GeoFaqItem | null>(null)
  const shown =
    selected ?? (query.trim() ? matches[0] ?? null : null)

  return (
    <Panel title={t("admin.geo.askTitle")} description={t("admin.geo.askDesc")}>
      <label className="block">
        <span className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-navy">
          <Search className="size-4" />
          {t("admin.geo.askLabel")}
        </span>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelected(null)
          }}
          className="form-input w-full"
          placeholder={t("admin.geo.askPlaceholder")}
        />
      </label>

      {query.trim() && matches.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{t("admin.geo.askNone")}</p>
      ) : (
        <ul className="mt-4 max-h-48 space-y-1 overflow-auto">
          {(query.trim() ? matches : library.slice(0, 8)).map((item) => {
            const label = lang === "ar" ? item.question.ar : item.question.en
            const active = shown === item
            return (
              <li key={item.question.en}>
                <button
                  type="button"
                  onClick={() => setSelected(item)}
                  className={`w-full rounded-lg px-3 py-2 text-start text-sm ${
                    active ? "bg-primary/10 font-semibold text-navy" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {label}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {shown ? (
        <div className="mt-4 rounded-xl border border-border bg-muted/20 p-4">
          <p className="font-bold text-navy">{lang === "ar" ? shown.question.ar : shown.question.en}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {lang === "ar" ? shown.answer.ar : shown.answer.en}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <DashButton type="button" onClick={() => printGeoFaqPdf([shown], lang)}>
              <FileDown className="size-4" />
              {t("admin.geo.askPdf")}
            </DashButton>
            {query.trim() && matches.length > 1 ? (
              <DashButton type="button" variant="secondary" onClick={() => printGeoFaqPdf(matches, lang)}>
                <FileDown className="size-4" />
                {adminTf(t, "admin.geo.askPdfMatches", { n: matches.length })}
              </DashButton>
            ) : null}
          </div>
        </div>
      ) : null}
    </Panel>
  )
}
