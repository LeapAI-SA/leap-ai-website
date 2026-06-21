"use client"

import { createContext, useContext } from "react"
import type { NavContent } from "./cms"
import { solutionsGroups, products, useCases } from "./site-data"

const fallback: NavContent = {
  solutionsGroups,
  products,
  useCases,
}

const NavContentContext = createContext<NavContent>(fallback)

export function NavContentProvider({
  children,
  nav,
}: {
  children: React.ReactNode
  nav: NavContent
}) {
  return <NavContentContext.Provider value={nav}>{children}</NavContentContext.Provider>
}

export function useNavContent() {
  return useContext(NavContentContext)
}
