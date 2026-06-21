import { getNavContent, staticNavContent } from "@/lib/cms"
import { buildLlmsTxt } from "@/lib/geo"

export const dynamic = "force-dynamic"
export const revalidate = 3600

async function loadNav() {
  return Promise.race([
    getNavContent(),
    new Promise<Awaited<ReturnType<typeof getNavContent>>>((resolve) =>
      setTimeout(() => resolve(staticNavContent), 2500),
    ),
  ])
}

export async function GET() {
  const nav = await loadNav()
  const body = buildLlmsTxt(nav, true)

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
