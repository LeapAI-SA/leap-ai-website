"use client"

import Image from "next/image"
import { useLanguage } from "@/lib/i18n"
import { resolveMediaUrl } from "@/lib/media"
import { useSiteSettings } from "@/lib/site-settings-context"
import { activePartners, mergePartners } from "@/lib/site-marketing"

export function Partners() {
  const { t } = useLanguage()
  const { settings } = useSiteSettings()
  const partners = activePartners(mergePartners(settings?.partners))

  return (
    <section id="partner" className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-2xl font-extrabold text-primary md:text-3xl">{t("partners.heading")}</h2>
        <div className="relative mt-10 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-y-0 end-0 z-10 w-24 bg-gradient-to-l from-background to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 start-0 z-10 w-24 bg-gradient-to-r from-background to-transparent"
            aria-hidden
          />
          <div className="flex w-max animate-[marquee_16s_linear_infinite] items-center gap-16">
            {[...partners, ...partners].map((p, i) => (
              <div
                key={`${p.name}-${i}`}
                className="flex h-14 w-32 shrink-0 items-center justify-center opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
              >
                <Image
                  src={resolveMediaUrl(p.logo || "/placeholder.svg")}
                  alt={p.name}
                  width={120}
                  height={48}
                  className="h-full w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
