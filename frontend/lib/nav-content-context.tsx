"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { buildSolutionGroups, staticNavContent, toNavItem, type NavContent } from "./cms"
import type { ContentItemPublic } from "./api"
import { getClientApiUrl } from "./api-url"
import { solutionsGroups, products, useCases } from "./site-data"
import { CONTENT_UPDATED_EVENT, subscribeCmsUpdates } from "./cms-refresh"

const fallback: NavContent = {
  solutionsGroups,
  products,
  useCases,
}

const NavContentContext = createContext<NavContent>(fallback)

async function fetchContentType(type: ContentItemPublic["type"]): Promise<ContentItemPublic[]> {
  const res = await fetch(`${getClientApiUrl()}/api/public/content?type=${type}`, { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

export function NavContentProvider({
  children,
  nav: initialNav,
}: {
  children: React.ReactNode
  nav: NavContent
}) {
  const [nav, setNav] = useState<NavContent>(initialNav)

  useEffect(() => {
    setNav(initialNav)
  }, [initialNav])

  const refreshNav = useCallback(async () => {
    try {
      const [solutionItems, productItems, useCaseItems] = await Promise.all([
        fetchContentType("solution"),
        fetchContentType("product"),
        fetchContentType("use-case"),
      ])

      setNav({
        solutionsGroups: solutionItems.length ? buildSolutionGroups(solutionItems) : staticNavContent.solutionsGroups,
        products: productItems.length ? productItems.map(toNavItem) : staticNavContent.products,
        useCases: useCaseItems.length ? useCaseItems.map(toNavItem) : staticNavContent.useCases,
      })
    } catch {
      /* keep current nav */
    }
  }, [])

  useEffect(() => {
    refreshNav()
    return subscribeCmsUpdates(CONTENT_UPDATED_EVENT, () => {
      void refreshNav()
    })
  }, [refreshNav])

  return <NavContentContext.Provider value={nav}>{children}</NavContentContext.Provider>
}

export function useNavContent() {
  return useContext(NavContentContext)
}
