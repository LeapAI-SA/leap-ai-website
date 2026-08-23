export type CaseCategory = "cx" | "da" | "mobile-web"

export type CaseStudy = {
  id: string
  category: CaseCategory
  title: { ar: string; en: string }
  description: { ar: string; en: string }
  image?: string
}

export const caseCategoryTitles: Record<CaseCategory, { ar: string; en: string }> = {
  cx: { ar: "تجربة العملاء", en: "CX" },
  da: { ar: "تحليل البيانات", en: "DA" },
  "mobile-web": { ar: "حلول التطبيقات والمواقع", en: "Mobile and Web Solutions" },
}

export function isCaseCategory(value: string): value is CaseCategory {
  return value === "cx" || value === "da" || value === "mobile-web"
}

export const caseCategories: { id: CaseCategory; labelKey: "cases.cat.cx" | "cases.cat.da" | "cases.cat.mobileWeb" }[] = [
  { id: "cx", labelKey: "cases.cat.cx" },
  { id: "da", labelKey: "cases.cat.da" },
  { id: "mobile-web", labelKey: "cases.cat.mobileWeb" },
]

/** Static fallback — empty; cases are managed via CMS dashboard. */
export const cases: CaseStudy[] = []
