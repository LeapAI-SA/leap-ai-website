import { llmsResponse } from "@/lib/llms-handler"

export const dynamic = "force-dynamic"
export const revalidate = 3600

export async function GET() {
  return llmsResponse(true)
}
