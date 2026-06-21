"use client"

import { SitePageShell } from "@/components/site-page-shell"
import { PageSection, SectionHeading } from "@/components/section-heading"
import { ItemCardGrid } from "@/components/item-card-grid"
import type { NavGroup } from "@/lib/site-data"
import { useLanguage } from "@/lib/i18n"

export function SolutionsPageContent({ solutionsGroups }: { solutionsGroups: NavGroup[] }) {
  const { t, tr } = useLanguage()

  return (
    <SitePageShell
      title={t("list.solutionsTitle")}
      subtitle={t("list.solutionsSubLong")}
      crumbs={[
        { label: t("common.breadcrumbHome"), href: "/" },
        { label: t("list.solutionsTitle") },
      ]}
    >
      <PageSection>
        {solutionsGroups.map((group, i) => (
          <div key={group.slug} className={i > 0 ? "mt-16" : ""}>
            <SectionHeading title={tr(group.title)} />
            <ItemCardGrid items={group.items} basePath="/solutions" />
          </div>
        ))}
      </PageSection>
    </SitePageShell>
  )
}
