import type { ArticleItem } from "./articles"

/** Unifonic-style dated news URL for GEO / Google News-style recrawl. */
export function datedNewsPath(publishedAt: string, slug: string): string {
  const [year, month, day] = publishedAt.slice(0, 10).split("-")
  return `/news/${year}/${month}/${day}/${slug}`
}

export function articleCanonicalPath(
  item: Pick<ArticleItem, "slug" | "publishedAt" | "kind">,
): string {
  if (item.kind === "news") return datedNewsPath(item.publishedAt, item.slug)
  return `/resources/${item.slug}`
}
