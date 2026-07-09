import type { NavGroup, NavItem } from "./site-data"
import type { ContentItemPublic, Localized } from "./api"
import { fetchPublicContent, fetchWithTimeout } from "./api"
import { getApiUrl, isBuildPhase } from "./api-url"
import { solutionsGroups, solutionsFlat, products, useCases, findSolution, findProduct, findUseCase } from "./site-data"
import { resolveContentImage } from "./page-images"

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
          next: { revalidate: 60 },
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
