"use client"

import { SitePageShell } from "@/components/site-page-shell"
import { DetailBody } from "@/components/detail-body"
import type { NavItem } from "@/lib/site-data"
import { useLanguage } from "@/lib/i18n"

export function DetailPageContent({
  item,
  related,
  basePath,
  listLabelKey,
  listHref,
}: {
  item: NavItem
  related: NavItem[]
  basePath: string
  listLabelKey: "list.solutionsTitle" | "list.productsTitle" | "list.useCasesTitle"
  listHref: string
}) {
  const { t, tr } = useLanguage()

  return (
    <SitePageShell
      title={tr(item.title)}
      subtitle={tr(item.excerpt)}
      crumbs={[
        { label: t("common.breadcrumbHome"), href: "/" },
        { label: t(listLabelKey), href: listHref },
        { label: tr(item.title) },
      ]}
    >
      <DetailBody item={item} related={related} basePath={basePath} />
    </SitePageShell>
  )
}
