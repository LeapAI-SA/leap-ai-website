"use client"

import { motion } from "motion/react"
import { Check, Headphones, MessagesSquare, LayoutGrid } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { pickLocalized } from "@/lib/api"
import { useSiteSettings } from "@/lib/site-settings-context"
import { mergePricingPlans, mergeCtaLabels } from "@/lib/site-marketing"

const planIcons = [Headphones, MessagesSquare, LayoutGrid]

export function Pricing() {
  const { t, tr, lang } = useLanguage()
  const { settings } = useSiteSettings()
  const pricingPlans = mergePricingPlans(settings?.pricingPlans)
  const pricingCta = pickLocalized(mergeCtaLabels(settings?.ctaLabels).pricing, lang, t("pricing.cta"))

  return (
    <section id="pricing" className="bg-secondary py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.h2
          className="text-center text-3xl font-extrabold text-primary md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {t("pricing.heading")}
        </motion.h2>
        <p className="mx-auto mt-4 max-w-xl text-center leading-relaxed text-muted-foreground">{t("pricing.subtitle")}</p>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan, i) => {
            const Icon = planIcons[i] ?? Headphones
            const name = tr(plan.name)
            const tagline = tr(plan.tagline)
            const features = tr(plan.features)

            return (
              <motion.div
                key={plan.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ y: -8 }}
                className={`relative flex flex-col rounded-2xl border bg-card p-8 transition-shadow hover:shadow-xl ${
                  plan.featured ? "border-amber shadow-lg ring-1 ring-amber/40 lg:-translate-y-3" : "border-border"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 end-8 rounded-full bg-amber px-4 py-1 text-xs font-bold text-accent-foreground">
                    {t("pricing.popular")}
                  </span>
                )}

                <div className="flex size-16 items-center justify-center self-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-8" />
                </div>
                <h3 className="mt-5 text-center text-xl font-bold text-navy">{name}</h3>

                <div className="mt-4 flex items-end justify-center gap-1">
                  <span className={`text-5xl font-extrabold ${plan.featured ? "text-amber" : "text-navy"}`}>
                    {plan.price}
                  </span>
                  <span className="mb-1 text-lg font-bold text-muted-foreground">{t("pricing.currency")}</span>
                </div>
                <p className="mt-1 text-center text-sm text-muted-foreground">{t("pricing.perUserMonth")}</p>

                <p className="mt-6 text-sm font-bold text-navy">{tagline}</p>
                <ul className="mt-4 flex flex-1 flex-col gap-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/80">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 font-bold transition-colors ${
                    plan.featured
                      ? "bg-amber text-accent-foreground hover:bg-amber/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {pricingCta}
                </a>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
