import type { Metadata } from "next"
import { ProductsPageContent } from "@/components/pages/products-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { getNavContent } from "@/lib/cms"
import { buildPageMetadata } from "@/lib/seo"
import { buildListPageJsonLd } from "@/lib/seo-content"

export const metadata: Metadata = buildPageMetadata({
  title: "Products",
  titleAr: "منتجاتنا",
  description:
    "Explore LeapAI AI-powered products: WhatsApp campaigns, digital invoices, AI recruiter, recommendation engine, and more.",
  descriptionAr:
    "استكشف منتجات LeapAI المدعومة بالذكاء الاصطناعي: حملات واتساب، فواتير رقمية، مسؤول توظيف ذكي، محرك توصيات، والمزيد.",
  path: "/products",
  image: "/pages/whatsapp-campaigns.png",
})

export default async function ProductsPage() {
  const { products } = await getNavContent()

  return (
    <>
      <JsonLd
        data={buildListPageJsonLd({
          title: "Products",
          description:
            "Explore LeapAI AI-powered products: WhatsApp campaigns, digital invoices, AI recruiter, recommendation engine, and more.",
          path: "/products",
          items: products,
        })}
      />
      <ProductsPageContent products={products} />
    </>
  )
}
