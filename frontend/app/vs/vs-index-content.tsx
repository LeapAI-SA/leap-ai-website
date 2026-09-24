"use client"

import Link from "next/link"
import { SitePageShell } from "@/components/site-page-shell"
import { PageSection } from "@/components/section-heading"
import { GEO_COMPARISONS, geoComparisonPath } from "@/lib/geo-comparisons"
import { useLanguage } from "@/lib/i18n"
import { sitePath } from "@/lib/site-path"

export function VsIndexContent() {
  const { lang, tr } = useLanguage()
  return (
    <SitePageShell
      title={lang === "ar" ? "LeapAI مقابل المنصات الأخرى" : "LeapAI vs other CX platforms"}
      subtitle={
        lang === "ar"
          ? "صفحات مقارنة للاستشهاد في البحث بالذكاء الاصطناعي: البدائل السعودية ليونيفونك ولوسيديا وGenesys وZendesk وغيرها."
          : "Citation pages for AI search: Saudi alternatives to Unifonic, Lucidya, Genesys, Zendesk, and more."
      }
      crumbs={[
        { label: lang === "ar" ? "الرئيسية" : "Home", href: "/" },
        { label: lang === "ar" ? "مقارنات" : "Compare" },
      ]}
    >
      <PageSection>
        <ul className="mx-auto grid max-w-3xl gap-3">
          {GEO_COMPARISONS.map((item) => (
            <li key={item.slug}>
              <Link
                href={sitePath(geoComparisonPath(item.slug), lang)}
                className="block rounded-2xl border border-border bg-card px-5 py-4 hover:border-primary"
              >
                <p className="font-bold text-navy">LeapAI vs {item.competitor.en}</p>
                <p className="mt-1 text-sm text-muted-foreground">{tr(item.excerpt)}</p>
              </Link>
            </li>
          ))}
        </ul>
      </PageSection>
    </SitePageShell>
  )
}
