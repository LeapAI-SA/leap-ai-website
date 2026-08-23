import { buildAiTxt, plainTextResponse } from "@/lib/crawler-files"
import { fetchPublicSettings } from "@/lib/api"

export const dynamic = "force-dynamic"
export const revalidate = 3600

export async function GET() {
  const settings = await fetchPublicSettings()
  return plainTextResponse(buildAiTxt(settings ?? undefined))
}
