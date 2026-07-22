"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { useLanguage } from "@/lib/i18n"
import { useSiteSettings } from "@/lib/site-settings-context"
import { resolveMediaUrl } from "@/lib/media"

export function OmniChannel() {
  const { t } = useLanguage()
  const { settings } = useSiteSettings()
  const imageSrc = resolveMediaUrl(settings?.images?.omniChannel ?? "/sections/omni-channel.png")

  return (
    <section className="bg-background pb-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="order-2"
        >
          <Image
            src={imageSrc}
            alt={t("omni.imageAlt")}
            width={1031}
            height={1069}
            className="mx-auto h-auto w-full max-w-md"
            unoptimized
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="order-1 text-start"
        >
          <span className="inline-block rounded-full bg-amber/15 px-4 py-1.5 text-sm font-bold text-amber-foreground">
            {t("omni.badge")}
          </span>
          <h2 className="mt-5 text-balance text-3xl font-extrabold leading-snug text-primary md:text-4xl">
            {t("omni.heading")}
          </h2>
          <p className="mt-6 text-pretty leading-loose text-muted-foreground">{t("omni.p1")}</p>
          <p className="mt-4 text-pretty leading-loose text-muted-foreground">{t("omni.p2")}</p>
        </motion.div>
      </div>
    </section>
  )
}
