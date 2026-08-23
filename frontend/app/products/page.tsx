import type { Metadata } from "next"
import { ProductsPageContent } from "@/components/pages/products-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { getNavContent } from "@/lib/cms"
import { getRequestLocale } from "@/lib/locale"
import { metadataWithRequestLocale } from "@/lib/seo-locale"
import { buildListPageJsonLd } from "@/lib/seo-content"

const LIST_META = {
  title: { en: "Products", ar: "منتجاتنا" },
  description: {
    en: "Explore LeapAI AI-powered products: WhatsApp campaigns, digital invoices, AI recruiter, recommendation engine, and more.",
    ar: "استكشف منتجات LeapAI المدعومة بالذكاء الاصطناعي: حملات واتساب، فواتير رقمية، مسؤول توظيف ذكي، محرك توصيات، والمزيد.",
  },
} as const

export async function generateMetadata(): Promise<Metadata> {
  return metadataWithRequestLocale({
    title: "Products",
    titleAr: "منتجاتنا",
    description: LIST_META.description.en,
    descriptionAr: LIST_META.description.ar,
    path: "/products",
    image: "/pages/whatsapp-campaigns.png",
  })
}

export default async function ProductsPage() {
  const [{ products }, locale] = await Promise.all([getNavContent(), getRequestLocale()])

  return (
    <>
      <JsonLd
        data={buildListPageJsonLd({
          ...LIST_META,
          path: "/products",
          items: products,
          locale,
        })}
      />
      <ProductsPageContent products={products} />
    </>
  )
}
