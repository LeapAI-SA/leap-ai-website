"use client"

import Link from "next/link"
import { useLanguage } from "@/lib/i18n"
import type { TranslationKey } from "@/lib/translations"
import { sitePath } from "@/lib/site-path"

const exploreLinks: { href: string; labelKey: TranslationKey }[] = [
  { href: "/about-us", labelKey: "nav.about" },
  { href: "/solutions", labelKey: "nav.solutions" },
  { href: "/products", labelKey: "nav.products" },
  { href: "/use-cases", labelKey: "nav.useCases" },
  { href: "/cases", labelKey: "nav.cases" },
  { href: "/careers", labelKey: "nav.careers" },
  { href: "/resources", labelKey: "list.resourcesTitle" },
  { href: "/become-a-partner", labelKey: "nav.partner" },
  { href: "/contact-us", labelKey: "nav.contact" },
]

export function HomeExploreSection() {
  const { t, lang } = useLanguage()

  return (
    <section className="bg-secondary/40 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-center text-2xl font-extrabold text-foreground sm:text-3xl">{t("home.exploreTitle")}</h2>
        <p className="mx-auto mt-3 max-w-3xl text-center text-sm text-muted-foreground sm:text-base">
          {t("home.exploreSubtitle")}
        </p>
        <ul className="mx-auto mt-8 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {exploreLinks.map((item) => (
            <li key={item.href}>
              <Link
                href={sitePath(item.href, lang)}
                className="block rounded-xl border border-border bg-card px-4 py-3 text-center text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {t(item.labelKey)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
