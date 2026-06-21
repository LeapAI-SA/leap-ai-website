import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DetailPageContent } from "@/components/pages/detail-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { allProductSlugs, resolveProduct, getProductsFromCms } from "@/lib/cms"
import { buildContentJsonLd, buildContentMetadata } from "@/lib/seo-content"
import { products } from "@/lib/site-data"

export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await allProductSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const item = await resolveProduct(slug)
  if (!item) {
    return buildContentMetadata(
      { slug: "", title: { ar: "منتجاتنا", en: "Products" }, excerpt: { ar: "", en: "" }, description: { ar: "", en: "" }, features: { ar: [], en: [] } },
      "/products",
      { en: "Products", ar: "منتجاتنا" },
    )
  }
  return buildContentMetadata(item, `/products/${slug}`, { en: "Products", ar: "منتجاتنا" })
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = await resolveProduct(slug)
  if (!item) notFound()

  const all = (await getProductsFromCms()) ?? products
  const related = all.filter((i) => i.slug !== slug).slice(0, 6)

  return (
    <>
      <JsonLd data={buildContentJsonLd(item, `/products/${slug}`, { en: "Products", ar: "منتجاتنا" }, "product")} />
      <DetailPageContent
        item={item}
        related={related}
        basePath="/products"
        listLabelKey="list.productsTitle"
        listHref="/products"
      />
    </>
  )
}
