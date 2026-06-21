"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { useLanguage } from "@/lib/i18n"
import { useSiteSettings } from "@/lib/site-settings-context"
import { pickLocalized } from "@/lib/api"
import { resolveMediaUrl } from "@/lib/media"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const } },
}

export function Hero() {
  const { lang, t } = useLanguage()
  const { settings } = useSiteSettings()

  const line1 = settings ? pickLocalized(settings.hero.line1, lang, t("hero.line1")) : t("hero.line1")
  const line2 = settings ? pickLocalized(settings.hero.line2, lang, t("hero.line2")) : t("hero.line2")
  const sub1 = settings ? pickLocalized(settings.hero.sub1, lang, t("hero.sub1")) : t("hero.sub1")
  const sub2 = settings ? pickLocalized(settings.hero.sub2, lang, t("hero.sub2")) : t("hero.sub2")
  const cta = settings ? pickLocalized(settings.hero.cta, lang, t("hero.cta")) : t("hero.cta")
  const heroImage = resolveMediaUrl(settings?.images?.hero ?? "/hero-dashboard.png")

  return (
    <section id="home" className="relative overflow-hidden bg-navy text-navy-foreground">
      <motion.div
        className="pointer-events-none absolute -left-40 -top-40 size-[480px] rounded-full bg-primary/15 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-32 right-0 size-[360px] rounded-full bg-amber/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:py-24 lg:grid-cols-2">
        <motion.div className="max-w-xl" variants={container} initial="hidden" animate="show">
          <motion.h1
            variants={item}
            className="text-balance text-3xl font-extrabold leading-tight md:text-4xl lg:text-5xl"
          >
            {lang === "ar" && line1 && <>{line1} </>}
            <span className="text-primary">Leap</span>
            <span className="text-amber">AI</span> {line2}
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-6 text-pretty text-base leading-relaxed text-navy-foreground/85 md:text-lg"
          >
            {sub1}
          </motion.p>
          <motion.p variants={item} className="mt-3 text-pretty font-medium leading-relaxed text-amber">
            {sub2}
          </motion.p>
          <motion.div variants={item} className="mt-8">
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center rounded-full bg-amber px-12 py-4 text-lg font-bold text-accent-foreground shadow-lg"
            >
              {cta}
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] as const }}
        >
          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <Image
              src={heroImage}
              alt={t("hero.imageAlt")}
              width={760}
              height={620}
              priority
              className="h-auto w-full drop-shadow-2xl"
              unoptimized
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
