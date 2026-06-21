"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { useLanguage } from "@/lib/i18n"
import { useSiteSettings } from "@/lib/site-settings-context"
import { resolveMediaUrl } from "@/lib/media"

export function ServicesIntro() {
  const { t } = useLanguage()
  const { settings } = useSiteSettings()
  const imageSrc = resolveMediaUrl(settings?.images?.ticketOverview ?? "/sections/ticket-overview.png")

  return (
    <section id="about" className="bg-background py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="order-2 lg:order-1"
        >
          <Image
            src={imageSrc}
            alt={t("services.imageAlt")}
            width={1024}
            height={770}
            className="h-auto w-full"
            unoptimized
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="order-1 text-start lg:order-2"
        >
          <div className="flex items-center justify-start gap-3">
            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{t("services.label")}</span>
            <span className="h-px w-10 bg-amber" />
          </div>
          <h2 className="mt-3 text-balance text-3xl font-extrabold text-primary md:text-4xl">{t("services.heading")}</h2>
          <p className="mt-6 text-pretty leading-loose text-muted-foreground">{t("services.p1")}</p>
          <p className="mt-4 text-pretty leading-loose text-muted-foreground">{t("services.p2")}</p>
        </motion.div>
      </div>
    </section>
  )
}
