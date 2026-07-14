"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { Check, Eye, Target, HeartHandshake } from "lucide-react"
import { SitePageShell } from "@/components/site-page-shell"
import { PageSection, SectionHeading } from "@/components/section-heading"
import { Stats } from "@/components/stats"
import { useLanguage } from "@/lib/i18n"
import { resolveMediaUrl } from "@/lib/media"
import type { TranslationKey } from "@/lib/translations"

const storyKeys = ["about.story1", "about.story2", "about.story3", "about.story4"] as const

const pillars: {
  icon: typeof Eye
  titleKey: TranslationKey
  textKey: TranslationKey
  taglineKey?: TranslationKey
}[] = [
  { icon: Eye, titleKey: "about.visionTitle", textKey: "about.visionText", taglineKey: "about.visionTagline" },
  { icon: Target, titleKey: "about.missionTitle", textKey: "about.missionText" },
  { icon: HeartHandshake, titleKey: "about.valuesTitle", textKey: "about.valuesText" },
]

export function AboutPageContent() {
  const { t } = useLanguage()

  return (
    <SitePageShell
      title={t("about.title")}
      subtitle={t("about.subtitle")}
      crumbs={[
        { label: t("common.breadcrumbHome"), href: "/" },
        { label: t("about.title") },
      ]}
    >
      <PageSection className="pb-0">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="relative overflow-hidden rounded-2xl border border-border bg-muted shadow-lg"
          >
            <Image
              src={resolveMediaUrl("/pages/about-us.png")}
              alt={t("about.imageAlt")}
              width={800}
              height={600}
              className="h-auto w-full object-cover"
              unoptimized
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
          >
            <SectionHeading title={t("about.storyHeading")} />
            <ul className="flex flex-col gap-5">
              {storyKeys.map((key) => (
                <li key={key} className="flex gap-4">
                  <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-amber/15 text-amber">
                    <Check className="size-3.5 stroke-[3]" />
                  </span>
                  <p className="leading-relaxed text-muted-foreground">{t(key)}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </PageSection>

      <PageSection className="bg-muted/40 py-16 md:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.titleKey}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex min-h-[280px] flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              {pillar.taglineKey && (
                <span className="mb-4 inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {t(pillar.taglineKey)}
                </span>
              )}
              <span className="flex size-14 items-center justify-center rounded-xl bg-amber/15 text-amber">
                <pillar.icon className="size-7" />
              </span>
              <h3 className="mt-5 text-xl font-extrabold text-navy">{t(pillar.titleKey)}</h3>
              <p className="mt-4 flex-1 leading-relaxed text-muted-foreground">{t(pillar.textKey)}</p>
            </motion.div>
          ))}
        </div>
      </PageSection>

      <Stats preset="about" />

      <section className="bg-navy py-20 text-navy-foreground">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="text-balance text-2xl font-extrabold leading-snug md:text-3xl"
          >
            {t("about.quote")}
          </motion.blockquote>
          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-amber">Leap AI</p>
        </div>
      </section>
    </SitePageShell>
  )
}
