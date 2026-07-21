import { buildRobotsTxt, plainTextResponse } from "@/lib/crawler-files"

export const dynamic = "force-dynamic"
export const revalidate = 3600

export async function GET() {
  return plainTextResponse(buildRobotsTxt())
}
