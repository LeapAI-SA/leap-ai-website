"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { Check, Eye, Target, HeartHandshake } from "lucide-react"
import { SitePageShell } from "@/components/site-page-shell"
import { PageSection, SectionHeading } from "@/components/section-heading"
import { Stats } from "@/components/stats"
import { useLanguage } from "@/lib/i18n"
import { pickLocalized } from "@/lib/api"
import { resolveMediaUrl } from "@/lib/media"
import { useSiteSettings } from "@/lib/site-settings-context"
import { mergeAboutPage } from "@/lib/site-marketing"

export function AboutPageContent() {
  const { t, lang, tr } = useLanguage()
  const { settings } = useSiteSettings()
  const about = mergeAboutPage(settings?.aboutPage)

  const title = pickLocalized(about.title, lang, t("about.title"))
  const subtitle = pickLocalized(about.subtitle, lang, t("about.subtitle"))
  const storyHeading = pickLocalized(about.storyHeading, lang, t("about.storyHeading"))
  const storyParagraphs = tr(about.story)
  const pillars = [
    {
      icon: Eye,
      title: pickLocalized(about.visionTitle, lang, t("about.visionTitle")),
      text: pickLocalized(about.visionText, lang, t("about.visionText")),
      tagline: pickLocalized(about.visionTagline, lang, t("about.visionTagline")),
    },
    {
      icon: Target,
      title: pickLocalized(about.missionTitle, lang, t("about.missionTitle")),
      text: pickLocalized(about.missionText, lang, t("about.missionText")),
    },
    {
      icon: HeartHandshake,
      title: pickLocalized(about.valuesTitle, lang, t("about.valuesTitle")),
      text: pickLocalized(about.valuesText, lang, t("about.valuesText")),
    },
  ]

  return (
    <SitePageShell
      title={title}
      subtitle={subtitle}
      crumbs={[
        { label: t("common.breadcrumbHome"), href: "/" },
        { label: title },
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
              src={resolveMediaUrl(about.image)}
              alt={pickLocalized(about.imageAlt, lang, t("about.imageAlt"))}
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
            <SectionHeading title={storyHeading} />
            <ul className="flex flex-col gap-5">
              {storyParagraphs.map((paragraph, index) => (
                <li key={index} className="flex gap-4">
                  <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-amber/15 text-amber">
                    <Check className="size-3.5 stroke-[3]" />
                  </span>
                  <p className="leading-relaxed text-muted-foreground">{paragraph}</p>
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
              key={pillar.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex min-h-[280px] flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              {pillar.tagline && (
                <span className="mb-4 inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {pillar.tagline}
                </span>
              )}
              <span className="flex size-14 items-center justify-center rounded-xl bg-amber/15 text-amber">
                <pillar.icon className="size-7" />
              </span>
              <h3 className="mt-5 text-xl font-extrabold text-navy">{pillar.title}</h3>
              <p className="mt-4 flex-1 leading-relaxed text-muted-foreground">{pillar.text}</p>
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
            {pickLocalized(about.quote, lang, t("about.quote"))}
          </motion.blockquote>
          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-amber">{about.quoteAttribution}</p>
        </div>
      </section>
    </SitePageShell>
  )
}
