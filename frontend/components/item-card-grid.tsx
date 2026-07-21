"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"
import { ArrowLeft } from "lucide-react"
import type { NavItem } from "@/lib/site-data"
import { useLanguage } from "@/lib/i18n"
import { pickLocalized } from "@/lib/api"
import { resolveMediaUrl } from "@/lib/media"
import { resolveContentImage } from "@/lib/page-images"
import { useSiteSettings } from "@/lib/site-settings-context"
import { mergeCtaLabels } from "@/lib/site-marketing"

export function ItemCardGrid({ items, basePath }: { items: NavItem[]; basePath: string }) {
  const { t, tr, lang } = useLanguage()
  const { settings } = useSiteSettings()
  const learnMoreLabel = pickLocalized(mergeCtaLabels(settings?.ctaLabels).learnMore, lang, t("common.learnMore"))

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => {
        const imageSrc = resolveMediaUrl(resolveContentImage(item.slug, item.image))

        return (
          <motion.div
            key={item.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
          >
            <Link
              href={`${basePath}/${item.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl"
            >
              <div className="relative h-44 overflow-hidden bg-muted">
                <Image
                  src={imageSrc}
                  alt={tr(item.title)}
                  width={400}
                  height={176}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h3 className="text-lg font-bold text-navy">{tr(item.title)}</h3>
                <p className="mt-2 flex-1 leading-relaxed text-muted-foreground">{tr(item.excerpt)}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                  {learnMoreLabel}
                  <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
