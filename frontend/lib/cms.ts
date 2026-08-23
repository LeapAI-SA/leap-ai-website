import type { NavGroup, NavItem } from "./site-data"
import type { ContentItemPublic, Localized } from "./api"
import { fetchPublicContent, fetchWithTimeout } from "./api"
import { getApiUrl, isBuildPhase } from "./api-url"
import { solutionsGroups, solutionsFlat, products, useCases, findSolution, findProduct, findUseCase } from "./site-data"
import { ARTICLES, findArticle, type ArticleItem } from "./articles"
import { resolveContentImage } from "./page-images"
import { jobs as staticJobs, isJobDepartment, jobDepartmentTitles, type JobOpening } from "./jobs-data"
import { cases as staticCases, isCaseCategory, type CaseStudy } from "./cases-data"

export const staticNavContent = {
  solutionsGroups,
  products,
  useCases,
}

export function toNavItem(item: ContentItemPublic): NavItem {
  return {
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    description: item.description,
    features: item.features,
    image: item.image || resolveContentImage(item.slug),
  }
}

export function buildSolutionGroups(items: ContentItemPublic[]): NavGroup[] {
  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder)
  const groupMap = new Map<string, { title: Localized; items: ContentItemPublic[] }>()

  for (const item of sorted) {
    const key = item.groupSlug || "general"
    if (!groupMap.has(key)) {
      groupMap.set(key, {
        title: item.groupTitle ?? { ar: key, en: key },
        items: [],
      })
    }
    groupMap.get(key)!.items.push(item)
  }

  return Array.from(groupMap.entries()).map(([slug, { title, items: groupItems }]) => ({
    slug,
    title,
    items: groupItems.map(toNavItem),
  }))
}

export type NavContent = {
  solutionsGroups: NavGroup[]
  products: NavItem[]
  useCases: NavItem[]
}

export async function getNavContent(): Promise<NavContent> {
  if (isBuildPhase()) return staticNavContent
  const [solutionItems, productItems, useCaseItems] = await Promise.all([
    fetchPublicContent("solution"),
    fetchPublicContent("product"),
    fetchPublicContent("use-case"),
  ])

  return {
    solutionsGroups: solutionItems.length ? buildSolutionGroups(solutionItems) : solutionsGroups,
    products: productItems.length ? productItems.map(toNavItem) : products,
    useCases: useCaseItems.length ? useCaseItems.map(toNavItem) : useCases,
  }
}

export async function getSolutionsFromCms(): Promise<NavItem[] | null> {
  const items = await fetchPublicContent("solution")
  return items.length ? items.map(toNavItem) : null
}

export async function getProductsFromCms(): Promise<NavItem[] | null> {
  const items = await fetchPublicContent("product")
  return items.length ? items.map(toNavItem) : null
}

export async function getUseCasesFromCms(): Promise<NavItem[] | null> {
  const items = await fetchPublicContent("use-case")
  return items.length ? items.map(toNavItem) : null
}

async function fetchContentBySlug(slug: string): Promise<ContentItemPublic | null> {
  if (isBuildPhase()) return null
  try {
    return await Promise.race([
      (async () => {
        const res = await fetchWithTimeout(`${getApiUrl()}/api/public/content/${slug}`, {
          cache: "no-store",
        })
        if (!res.ok) return null
        return (await res.json()) as ContentItemPublic
      })(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000)),
    ])
  } catch {
    return null
  }
}

async function resolveContent(
  slug: string,
  type: ContentItemPublic["type"],
  findStatic: (slug: string) => NavItem | undefined,
): Promise<NavItem | undefined> {
  const cms = await fetchContentBySlug(slug)
  if (cms?.type === type) return toNavItem(cms)
  return findStatic(slug)
}

async function allSlugsForType(
  type: ContentItemPublic["type"],
  staticSlugs: string[],
): Promise<string[]> {
  if (isBuildPhase()) return staticSlugs
  const items = await fetchPublicContent(type)
  if (!items.length) return staticSlugs
  const fromCms = items.map((item) => item.slug)
  return [...new Set([...fromCms, ...staticSlugs])]
}

export async function resolveSolution(slug: string): Promise<NavItem | undefined> {
  return resolveContent(slug, "solution", findSolution)
}

export async function resolveProduct(slug: string): Promise<NavItem | undefined> {
  return resolveContent(slug, "product", findProduct)
}

export async function resolveUseCase(slug: string): Promise<NavItem | undefined> {
  return resolveContent(slug, "use-case", findUseCase)
}

export async function allSolutionSlugs(): Promise<string[]> {
  return allSlugsForType("solution", solutionsFlat.map((i) => i.slug))
}

export async function allProductSlugs(): Promise<string[]> {
  return allSlugsForType("product", products.map((i) => i.slug))
}

export async function allUseCaseSlugs(): Promise<string[]> {
  return allSlugsForType("use-case", useCases.map((i) => i.slug))
}

function toArticleItem(item: ContentItemPublic): ArticleItem {
  const fallback = findArticle(item.slug)
  return {
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    description: item.description,
    features: item.features,
    image: item.image || fallback?.image,
    publishedAt: fallback?.publishedAt ?? item.updatedAt?.slice(0, 10) ?? "2026-08-09",
    kind: item.slug === "leap-ai-saudi-ai-native-cx-platform" ? "news" : (fallback?.kind ?? "article"),
  }
}

export async function getArticles(): Promise<ArticleItem[]> {
  const items = await fetchPublicContent("article")
  if (!items.length) return ARTICLES
  const fromCms = items.sort((a, b) => a.sortOrder - b.sortOrder).map(toArticleItem)
  const extra = ARTICLES.filter((article) => !fromCms.some((item) => item.slug === article.slug))
  return [...fromCms, ...extra]
}

export async function resolveArticle(slug: string): Promise<ArticleItem | undefined> {
  const cms = await fetchContentBySlug(slug)
  if (cms?.type === "article") return toArticleItem(cms)
  return findArticle(slug)
}

export async function allArticleSlugs(): Promise<string[]> {
  return allSlugsForType("article", ARTICLES.map((item) => item.slug))
}

function toCaseStudy(item: ContentItemPublic): CaseStudy | null {
  const category = item.groupSlug || ""
  if (!isCaseCategory(category)) return null
  return {
    id: item.slug,
    category,
    title: item.title,
    description: item.description.en || item.description.ar ? item.description : item.excerpt,
    image: item.image || "",
  }
}

export async function getCases(): Promise<CaseStudy[]> {
  if (isBuildPhase()) return staticCases
  const items = await fetchPublicContent("case")
  if (!items.length) return []
  return items
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(toCaseStudy)
    .filter((item): item is CaseStudy => item !== null)
}

function toJobOpening(item: ContentItemPublic): JobOpening | null {
  const department = item.groupSlug || ""
  if (!isJobDepartment(department)) return null
  return {
    id: item.slug,
    slug: item.slug,
    department,
    departmentTitle: item.groupTitle?.ar || item.groupTitle?.en ? item.groupTitle : jobDepartmentTitles[department],
    title: item.title,
    excerpt: item.excerpt,
    description: item.description.en || item.description.ar ? item.description : item.excerpt,
    requirements: item.features,
  }
}

export async function getJobs(): Promise<JobOpening[]> {
  if (isBuildPhase()) return staticJobs
  const items = await fetchPublicContent("job")
  if (!items.length) return []
  return items
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(toJobOpening)
    .filter((item): item is JobOpening => item !== null)
}

export async function resolveJob(slug: string): Promise<JobOpening | undefined> {
  const cms = await fetchContentBySlug(slug)
  if (cms?.type === "job") {
    return toJobOpening(cms) ?? undefined
  }
  return undefined
}

export async function allJobSlugs(): Promise<string[]> {
  if (isBuildPhase()) return []
  const items = await fetchPublicContent("job")
  return items.map((item) => item.slug)
}
