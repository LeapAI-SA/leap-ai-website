"use client"

import { SitePageShell } from "@/components/site-page-shell"
import { PageSection, SectionHeading } from "@/components/section-heading"
import { ItemCardGrid } from "@/components/item-card-grid"
import type { NavItem } from "@/lib/site-data"
import { useLanguage } from "@/lib/i18n"

export function ProductsPageContent({ products }: { products: NavItem[] }) {
  const { t } = useLanguage()

  return (
    <SitePageShell
      title={t("list.productsTitle")}
      subtitle={t("list.productsSubLong")}
      crumbs={[
        { label: t("common.breadcrumbHome"), href: "/" },
        { label: t("list.productsTitle") },
      ]}
    >
      <PageSection>
        <SectionHeading title={t("list.productsTitle")} subtitle={t("list.productsSubLong")} />
        <ItemCardGrid items={products} basePath="/products" />
      </PageSection>
    </SitePageShell>
  )
}
