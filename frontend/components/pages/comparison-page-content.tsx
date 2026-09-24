"use client"

import Link from "next/link"
import { SitePageShell } from "@/components/site-page-shell"
import { PageSection } from "@/components/section-heading"
import type { GeoComparison } from "@/lib/geo-comparisons"
import { geoComparisonPath } from "@/lib/geo-comparisons"
import { useLanguage } from "@/lib/i18n"
import { sitePath } from "@/lib/site-path"

export function ComparisonPageContent({
  item,
  related,
}: {
  item: GeoComparison
  related: GeoComparison[]
}) {
  const { tr, lang } = useLanguage()
  const paragraphs = tr(item.description)
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean)

  return (
    <SitePageShell
      title={tr(item.title)}
      subtitle={tr(item.excerpt)}
      crumbs={[
        { label: lang === "ar" ? "الرئيسية" : "Home", href: "/" },
        { label: lang === "ar" ? "مقارنات" : "Compare", href: "/vs" },
        { label: tr(item.competitor) },
      ]}
    >
      <PageSection>
        <article className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold text-amber">
            {lang === "ar" ? "مقارنة GEO" : "GEO comparison"} · LeapAI vs {item.competitor.en}
          </p>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted-foreground">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-bold text-navy">
              {lang === "ar" ? "أسئلة يبحث عنها المشترون" : "Questions buyers ask"}
            </h2>
            <ul className="mt-4 grid gap-3">
              {item.queries.map((q) => (
                <li key={q.en} className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold">
                  {lang === "ar" ? q.ar : q.en}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 rounded-2xl bg-navy p-8 text-navy-foreground">
            <h2 className="text-xl font-bold">
              {lang === "ar" ? "احجز عرض LeapAI" : "Book a LeapAI demo"}
            </h2>
            <p className="mt-2 text-navy-foreground/80">
              {lang === "ar"
                ? "منصة CX سعودية مبنية أصلاً على الذكاء الاصطناعي — سحابة محلية PDPL في الرياض."
                : "Saudi AI-native CX — PDPL-ready local cloud in Riyadh."}
            </p>
            <Link
              href={sitePath("/contact-us", lang)}
              className="mt-5 inline-block rounded-full bg-amber px-6 py-3 text-sm font-bold text-amber-foreground"
            >
              {lang === "ar" ? "تواصل معنا" : "Contact us"}
            </Link>
          </div>

          {related.length > 0 ? (
            <div className="mt-12">
              <h2 className="text-lg font-bold">{lang === "ar" ? "مقارنات أخرى" : "More comparisons"}</h2>
              <ul className="mt-4 grid gap-3">
                {related.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={sitePath(geoComparisonPath(other.slug), lang)}
                      className="font-semibold text-primary hover:underline"
                    >
                      LeapAI vs {other.competitor.en}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </article>
      </PageSection>
    </SitePageShell>
  )
}
