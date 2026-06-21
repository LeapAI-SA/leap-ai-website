"use client"

import { useEffect, useRef, useState } from "react"
import { useLanguage } from "@/lib/i18n"
import { useSiteSettings } from "@/lib/site-settings-context"
import { pickLocalized } from "@/lib/api"
import type { TranslationKey } from "@/lib/translations"

const fallbackStats: { value: number; labelKey: TranslationKey }[] = [
  { value: 120, labelKey: "stats.projects" },
  { value: 60, labelKey: "stats.experts" },
  { value: 250, labelKey: "stats.customers" },
]

function useCountUp(target: number, start: boolean, duration = 1500) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    let raf = 0
    const startTime = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      setValue(Math.floor(progress * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, start, duration])
  return value
}

function StatItem({ value, label, start }: { value: number; label: string; start: boolean }) {
  const count = useCountUp(value, start)
  return (
    <div className="text-center">
      <p className="text-5xl font-extrabold text-primary-foreground md:text-6xl">
        {count}
        <span className="text-amber">+</span>
      </p>
      <p className="mt-2 text-lg font-semibold text-primary-foreground/80">{label}</p>
    </div>
  )
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const { lang, t } = useLanguage()
  const { settings } = useSiteSettings()

  const stats =
    settings?.stats?.length
      ? settings.stats.map((stat) => ({
          value: stat.value,
          label: pickLocalized(stat.label, lang),
        }))
      : fallbackStats.map((stat) => ({
          value: stat.value,
          label: t(stat.labelKey),
        }))

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="bg-navy py-20">
      <div className="mx-auto grid max-w-5xl gap-12 px-6 sm:grid-cols-3">
        {stats.map((s) => (
          <StatItem key={`${s.label}-${s.value}`} value={s.value} label={s.label} start={visible} />
        ))}
      </div>
    </section>
  )
}
