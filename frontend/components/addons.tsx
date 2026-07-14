"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { addonItems } from "@/lib/site-data"
import { useLanguage } from "@/lib/i18n"
import { resolveMediaUrl } from "@/lib/media"

export function Addons() {
  const [active, setActive] = useState<number | null>(0)
  const { t, tr } = useLanguage()

  return (
    <section id="products" className="bg-background py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-amber">{t("addons.badge")}</span>
          <h2 className="mt-3 text-balance text-3xl font-extrabold text-navy md:text-4xl">{t("addons.title")}</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{t("addons.lead")}</p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {addonItems.map((addon, i) => {
            const isOpen = active === i
            const title = tr(addon.title)
            const desc = tr(addon.desc)

            return (
              <div key={addon.icon} className="rounded-xl border border-border bg-card">
                <button
                  onClick={() => setActive(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3 p-4 text-start"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center">
                    <Image src={resolveMediaUrl(addon.icon || "/placeholder.svg")} alt="" width={44} height={44} className="size-11" />
                  </span>
                  <span className="flex-1 font-bold text-navy">{title}</span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
