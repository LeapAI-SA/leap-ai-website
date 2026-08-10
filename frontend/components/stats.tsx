"use client"

import { useLanguage } from "@/lib/i18n"
import { useSiteSettings } from "@/lib/site-settings-context"
import { mergeAboutPage } from "@/lib/site-marketing"
import { pickLocalized } from "@/lib/api"
import type { TranslationKey } from "@/lib/translations"

const fallbackStats: { value: number; labelKey: TranslationKey }[] = [
  { value: 120, labelKey: "stats.projects" },
  { value: 60, labelKey: "stats.experts" },
  { value: 250, labelKey: "stats.customers" },
]

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-4xl font-extrabold text-primary-foreground sm:text-5xl lg:text-6xl">
        {value}
        <span className="text-amber">+</span>
      </p>
      <p className="mt-2 text-base font-semibold text-primary-foreground/80 sm:text-lg">{label}</p>
    </div>
  )
}

const aboutFallbackStats: { value: number; labelKey: TranslationKey }[] = [
  { value: 100, labelKey: "stats.projects" },
  { value: 50, labelKey: "stats.experts" },
  { value: 80, labelKey: "stats.customers" },
]

export function Stats({
  preset = "default",
}: {
  /** `about` matches leapai.ai/about-us figures (100 / 50 / 80). */
  preset?: "default" | "about"
}) {
  const { lang, t } = useLanguage()
  const { settings } = useSiteSettings()

  const fallback = preset === "about" ? aboutFallbackStats : fallbackStats

  const aboutStats =
    preset === "about" && settings?.aboutPage?.stats?.length
      ? mergeAboutPage(settings.aboutPage).stats.map((stat) => ({
          value: stat.value,
          label: pickLocalized(stat.label, lang),
        }))
      : null

  const stats =
    aboutStats ??
    (settings?.stats?.length && preset === "default"
      ? settings.stats.map((stat) => ({
          value: stat.value,
          label: pickLocalized(stat.label, lang),
        }))
      : fallback.map((stat) => ({
          value: stat.value,
          label: t(stat.labelKey),
        })))

  return (
    <section className="bg-navy py-20">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 sm:grid-cols-3 sm:gap-12 sm:px-6">
        {stats.map((s) => (
          <StatItem key={`${s.label}-${s.value}`} value={s.value} label={s.label} />
        ))}
      </div>
    </section>
  )
}
