"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { useLanguage } from "@/lib/i18n"
import { pickLocalized } from "@/lib/api"
import { resolveMediaUrl } from "@/lib/media"
import { useSiteSettings } from "@/lib/site-settings-context"
import { mergeCtaLabels } from "@/lib/site-marketing"

export function AcquireCta() {
  const { t, lang } = useLanguage()
  const { settings } = useSiteSettings()
  const acquireCta = pickLocalized(mergeCtaLabels(settings?.ctaLabels).acquire, lang, t("acquire.cta"))

  return (
    <section id="use-cases" className="bg-navy py-20 text-navy-foreground">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.h2
          className="text-balance text-3xl font-extrabold md:text-4xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          {t("acquire.heading")}
        </motion.h2>
        <motion.p
          className="mx-auto mt-4 max-w-2xl text-pretty leading-relaxed text-navy-foreground/70"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t("acquire.subtitleLong")}
        </motion.p>
        <motion.a
          href="#contact"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#22c55e] px-7 py-3.5 font-bold text-white shadow-lg transition-colors hover:bg-[#16a34a]"
        >
          {acquireCta}
        </motion.a>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-4 px-6 sm:gap-6 md:grid-cols-4">
        {[1, 2, 3, 4].map((n, i) => (
          <motion.div
            key={n}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.12 }}
          >
            <Image
              src={resolveMediaUrl(`/phones/whatsapp-${n}.png`)}
              alt={`${t("common.chatPreview")} ${n}`}
              width={482}
              height={992}
              className="h-auto w-full drop-shadow-2xl"
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
