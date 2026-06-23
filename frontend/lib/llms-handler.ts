import { getNavContent, staticNavContent } from "@/lib/cms"
import { buildLlmsTxt } from "@/lib/geo"

async function loadNav() {
  return Promise.race([
    getNavContent(),
    new Promise<Awaited<ReturnType<typeof getNavContent>>>((resolve) =>
      setTimeout(() => resolve(staticNavContent), 2500),
    ),
  ])
}

export async function llmsResponse(extended: boolean) {
  const nav = await loadNav()
  const body = buildLlmsTxt(nav, extended)

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
