import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { JobDetailPageContent } from "@/components/pages/job-detail-page-content"
import { JsonLd } from "@/components/seo/json-ld"
import { allJobSlugs, resolveJob } from "@/lib/cms"
import { metadataWithRequestLocale } from "@/lib/seo-locale"
import { absoluteUrl, getSiteUrl, siteConfig } from "@/lib/seo"
import { getRequestLocale } from "@/lib/locale"
import { pickLocalized } from "@/lib/api"

export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await allJobSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const [job, locale] = await Promise.all([resolveJob(slug), getRequestLocale()])
  if (!job) {
    return metadataWithRequestLocale({
      title: "Careers",
      titleAr: "الوظائف",
      description: "Open positions at LeapAI.",
      descriptionAr: "الشواغر في LeapAI.",
      path: "/careers",
    })
  }
  const title = pickLocalized(job.title, locale === "ar" ? "ar" : "en")
  const description = pickLocalized(job.excerpt, locale === "ar" ? "ar" : "en") || pickLocalized(job.description, locale === "ar" ? "ar" : "en")
  return metadataWithRequestLocale({
    title,
    titleAr: job.title.ar || title,
    description: description.slice(0, 160),
    descriptionAr: (job.excerpt.ar || job.description.ar || description).slice(0, 160),
    path: `/careers/${slug}`,
  })
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [job, locale] = await Promise.all([resolveJob(slug), getRequestLocale()])
  if (!job) notFound()

  const url = absoluteUrl(`/careers/${slug}`)
  const title = pickLocalized(job.title, locale)
  const description = pickLocalized(job.description, locale) || pickLocalized(job.excerpt, locale)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title,
    description,
    url,
    hiringOrganization: {
      "@type": "Organization",
      name: siteConfig.name,
      sameAs: getSiteUrl(),
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: locale === "ar" ? "الرياض" : "Riyadh",
        addressCountry: "SA",
      },
    },
    inLanguage: locale === "en" ? ["en"] : ["ar", "en"],
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <JobDetailPageContent job={job} />
    </>
  )
}
