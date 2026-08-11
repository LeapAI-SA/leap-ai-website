"use client"

import Link from "next/link"
import { SitePageShell } from "@/components/site-page-shell"
import { PageSection, SectionHeading } from "@/components/section-heading"
import type { ArticleItem } from "@/lib/articles"
import { articleCanonicalPath } from "@/lib/article-paths"
import { useLanguage } from "@/lib/i18n"
import { sitePath } from "@/lib/site-path"

export function ResourcesPageContent({ articles }: { articles: ArticleItem[] }) {
  const { t, tr, lang } = useLanguage()

  return (
    <SitePageShell
      title={t("list.resourcesTitle")}
      subtitle={t("list.resourcesSubLong")}
      crumbs={[{ label: t("common.breadcrumbHome"), href: "/" }, { label: t("list.resourcesTitle") }]}
    >
      <PageSection>
        <SectionHeading title={t("list.resourcesTitle")} subtitle={t("list.resourcesSubLong")} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((item) => (
            <Link
              key={item.slug}
              href={sitePath(articleCanonicalPath(item), lang)}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/40"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-amber">
                {item.kind === "news"
                  ? lang === "ar"
                    ? "خبر"
                    : "News"
                  : lang === "ar"
                    ? "مقال"
                    : "Article"}{" "}
                · {item.publishedAt}
              </p>
              <h2 className="mt-2 text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                {tr(item.title)}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{tr(item.excerpt)}</p>
              <span className="mt-4 text-sm font-bold text-primary">{t("list.resourcesTitle")} →</span>
            </Link>
          ))}
        </div>
      </PageSection>
    </SitePageShell>
  )
}
