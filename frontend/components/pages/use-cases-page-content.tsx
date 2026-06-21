"use client"

import { SitePageShell } from "@/components/site-page-shell"
import { PageSection, SectionHeading } from "@/components/section-heading"
import { ItemCardGrid } from "@/components/item-card-grid"
import type { NavItem } from "@/lib/site-data"
import { useLanguage } from "@/lib/i18n"

export function UseCasesPageContent({ useCases }: { useCases: NavItem[] }) {
  const { t } = useLanguage()

  return (
    <SitePageShell
      title={t("list.useCasesTitle")}
      subtitle={t("list.useCasesSubLong")}
      crumbs={[
        { label: t("common.breadcrumbHome"), href: "/" },
        { label: t("list.useCasesTitle") },
      ]}
    >
      <PageSection>
        <SectionHeading title={t("list.useCasesTitle")} subtitle={t("list.useCasesSubLong")} />
        <ItemCardGrid items={useCases} basePath="/use-cases" />
      </PageSection>
    </SitePageShell>
  )
}
