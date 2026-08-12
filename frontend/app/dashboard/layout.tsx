import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/seo"
import { DashboardAuthLayout } from "@/components/dashboard/dashboard-auth-layout"

export const metadata: Metadata = buildPageMetadata({
  title: "Admin Dashboard | لوحة الإدارة",
  description: "LeapAI CMS admin dashboard (Arabic + English)",
  path: "/dashboard",
  noIndex: true,
})

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardAuthLayout>{children}</DashboardAuthLayout>
}
