import type { Metadata } from "next"
import { MaintenancePageContent } from "@/components/pages/maintenance-page-content"
import { metadataWithRequestLocale } from "@/lib/seo-locale"

export async function generateMetadata(): Promise<Metadata> {
  return metadataWithRequestLocale({
    title: "Maintenance",
    titleAr: "تحت الصيانة",
    description: "LeapAI website is temporarily in maintenance mode.",
    descriptionAr: "موقع LeapAI تحت الصيانة مؤقتاً.",
    path: "/maintenance",
    noIndex: true,
  })
}

export default function MaintenancePage() {
  return <MaintenancePageContent />
}
