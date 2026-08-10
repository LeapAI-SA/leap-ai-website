"use client"

import Link from "next/link"
import { SitePageShell } from "@/components/site-page-shell"
import { PageSection } from "@/components/section-heading"
import type { ArticleItem } from "@/lib/articles"
import { articleCanonicalPath } from "@/lib/article-paths"
import { useLanguage } from "@/lib/i18n"
import { sitePath } from "@/lib/site-path"

export function ArticlePageContent({
  item,
  related,
}: {
  item: ArticleItem
  related: ArticleItem[]
}) {
  const { t, tr, lang } = useLanguage()
  const paragraphs = tr(item.description)
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean)
  const takeaways = tr(item.features)

  return (
    <SitePageShell
      title={tr(item.title)}
      subtitle={tr(item.excerpt)}
      crumbs={[
        { label: t("common.breadcrumbHome"), href: "/" },
        { label: t("list.resourcesTitle"), href: "/resources" },
        { label: tr(item.title) },
      ]}
    >
      <PageSection>
        <article className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold text-amber">
            {item.kind === "news" ? (lang === "ar" ? "خبر" : "News") : lang === "ar" ? "مقال" : "Article"} ·{" "}
            {item.publishedAt}
          </p>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted-foreground">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>

          {takeaways.length > 0 ? (
            <ul className="mt-10 grid gap-3">
              {takeaways.map((line) => (
                <li
                  key={line}
                  className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground/90"
                >
                  {line}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-12 rounded-2xl bg-navy p-8 text-navy-foreground">
            <h2 className="text-xl font-bold">{t("detail.ctaTitle")}</h2>
            <p className="mt-2 text-navy-foreground/80">{t("detail.ctaTextAlt")}</p>
            <Link
              href={sitePath("/contact-us")}
              className="mt-5 inline-block rounded-full bg-amber px-6 py-3 text-sm font-bold text-amber-foreground"
            >
              {t("detail.demoBtn")}
            </Link>
          </div>

          {related.length > 0 ? (
            <div className="mt-12">
              <h2 className="text-lg font-bold">{t("list.resourcesTitle")}</h2>
              <ul className="mt-4 grid gap-3">
                {related.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={sitePath(articleCanonicalPath(other))}
                      className="font-semibold text-primary hover:underline"
                    >
                      {tr(other.title)}
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
