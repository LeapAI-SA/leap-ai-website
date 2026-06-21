"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Pencil, Plus, Search } from "lucide-react"
import { adminFetch, type ContentItemPublic } from "@/lib/api"
import {
  PageHeader,
  DashButton,
  FilterTabs,
  EmptyState,
  LoadingBlock,
  Badge,
} from "@/components/dashboard/ui"

const typeLabels: Record<ContentItemPublic["type"], string> = {
  solution: "Solution",
  product: "Product",
  "use-case": "Use Case",
}

export default function DashboardContentPage() {
  const [items, setItems] = useState<ContentItemPublic[]>([])
  const [filter, setFilter] = useState<"all" | ContentItemPublic["type"]>("all")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminFetch<ContentItemPublic[]>("/api/admin/content")
      .then(setItems)
      .finally(() => setLoading(false))
  }, [])

  const counts = useMemo(
    () => ({
      all: items.length,
      solution: items.filter((i) => i.type === "solution").length,
      product: items.filter((i) => i.type === "product").length,
      "use-case": items.filter((i) => i.type === "use-case").length,
    }),
    [items],
  )

  const filtered = items.filter((item) => {
    if (filter !== "all" && item.type !== filter) return false
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      item.slug.toLowerCase().includes(q) ||
      item.title.en.toLowerCase().includes(q) ||
      item.title.ar.includes(query)
    )
  })

  return (
    <div className="space-y-8">
      <PageHeader
        title="Content Library"
        description="Manage solutions, products, and use cases displayed on your public website."
        actions={
          <DashButton href="/dashboard/content/new" variant="amber">
            <Plus className="size-4" />
            Add content
          </DashButton>
        }
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs
          value={filter}
          onChange={setFilter}
          options={[
            { id: "all", label: "All", count: counts.all },
            { id: "solution", label: "Solutions", count: counts.solution },
            { id: "product", label: "Products", count: counts.product },
            { id: "use-case", label: "Use Cases", count: counts["use-case"] },
          ]}
        />
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or slug..."
            className="form-input ps-10"
          />
        </div>
      </div>

      {loading ? (
        <LoadingBlock label="Loading content..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No content found"
          description={items.length === 0 ? "Run the backend seed or create your first content item." : "Try a different search or filter."}
          action={
            items.length === 0 ? (
              <DashButton href="/dashboard/content/new" variant="primary">
                Create first item
              </DashButton>
            ) : undefined
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40 text-start">
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Type</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Slug</th>
                  <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-muted/20">
                    <td className="px-5 py-4">
                      <p className="font-bold text-navy">{item.title.en || item.title.ar}</p>
                      {item.title.ar && item.title.en && (
                        <p className="mt-0.5 text-xs text-muted-foreground">{item.title.ar}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <Badge>{typeLabels[item.type]}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <code className="rounded-md bg-muted px-2 py-1 text-xs text-foreground/80">{item.slug}</code>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={item.published ? "success" : "muted"}>
                        {item.published ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-end">
                      <Link
                        href={`/dashboard/content/${item.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
