export type JobDepartment = "engineering" | "sales" | "operations" | "general"

export type JobOpening = {
  id: string
  slug: string
  department: JobDepartment
  departmentTitle: { ar: string; en: string }
  title: { ar: string; en: string }
  excerpt: { ar: string; en: string }
  description: { ar: string; en: string }
  requirements: { ar: string[]; en: string[] }
}

export const jobDepartmentTitles: Record<JobDepartment, { ar: string; en: string }> = {
  engineering: { ar: "الهندسة والتقنية", en: "Engineering" },
  sales: { ar: "المبيعات", en: "Sales" },
  operations: { ar: "العمليات", en: "Operations" },
  general: { ar: "عام", en: "General" },
}

export function isJobDepartment(value: string): value is JobDepartment {
  return value === "engineering" || value === "sales" || value === "operations" || value === "general"
}

export const jobDepartments: {
  id: JobDepartment
  labelKey: "careers.dept.engineering" | "careers.dept.sales" | "careers.dept.operations" | "careers.dept.general"
}[] = [
  { id: "engineering", labelKey: "careers.dept.engineering" },
  { id: "sales", labelKey: "careers.dept.sales" },
  { id: "operations", labelKey: "careers.dept.operations" },
  { id: "general", labelKey: "careers.dept.general" },
]

/** Static fallback — empty; jobs are managed via CMS dashboard. */
export const jobs: JobOpening[] = []
