"use client"

import Image from "next/image"
import { useLanguage } from "@/lib/i18n"

const partners = [
  { name: "Meta", src: "/logos/meta.png" },
  { name: "Microsoft", src: "/logos/microsoft.png" },
  { name: "Salla", src: "/logos/salla.png" },
  { name: "Zid", src: "/logos/zid.png" },
  { name: "Vocalcom", src: "/logos/vocalcom.png" },
  { name: "WebEngage", src: "/logos/webengage.png" },
  { name: "LivePerson", src: "/logos/liveperson.png" },
  { name: "Genesys", src: "/logos/genesys.png" },
  { name: "Apple", src: "/logos/apple.png" },
  { name: "Google My Business", src: "/logos/gmb.png" },
]

export function Partners() {
  const { t } = useLanguage()

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
                  src={p.src || "/placeholder.svg"}
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
