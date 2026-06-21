"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { Check, ArrowLeft } from "lucide-react"
import { storeIntegrations } from "@/lib/site-data"
import { useLanguage } from "@/lib/i18n"

export function StoreIntegrations() {
  const { t, tr } = useLanguage()

  const sharedPoints = [t("stores.feat1"), t("stores.feat2"), t("stores.feat3"), t("stores.abandonedCart")]

  return (
    <section className="bg-background pb-20">
      <div className="mx-auto grid max-w-5xl gap-6 px-6 md:grid-cols-2">
        {storeIntegrations.map((store, i) => {
          const title = tr(store.title)

          return (
            <motion.div
              key={store.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm"
            >
              <div className="flex h-12 items-center">
                {store.isImage ? (
                  <Image src={store.logo || "/placeholder.svg"} alt={title} width={120} height={40} className="h-9 w-auto" />
                ) : (
                  <span className="text-3xl font-extrabold lowercase text-[#5b2be0]">zid</span>
                )}
              </div>
              <span className="mt-6 text-xs font-bold tracking-widest text-amber">{t("stores.eyebrow")}</span>
              <h3 className="mt-2 text-xl font-extrabold text-navy">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("stores.lead")}</p>
              <ul className="mt-4 flex flex-col gap-3">
                {sharedPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/80">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-amber px-6 py-3 text-sm font-bold text-amber-foreground transition-colors hover:bg-amber/90"
              >
                {t("stores.cta")}
                <ArrowLeft className="size-4 rtl:rotate-180" />
              </a>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
