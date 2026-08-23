import { getNavContent, staticNavContent } from "@/lib/cms"
import { fetchPublicSettings } from "@/lib/api"
import { buildLlmsSmallTxt, buildLlmsTxt } from "@/lib/geo"

async function loadNav() {
  return Promise.race([
    getNavContent(),
    new Promise<Awaited<ReturnType<typeof getNavContent>>>((resolve) =>
      setTimeout(() => resolve(staticNavContent), 2500),
    ),
  ])
}

export async function llmsResponse(extended: boolean, compact = false) {
  const [nav, settings] = await Promise.all([loadNav(), fetchPublicSettings()])
  const buildSettings = settings ?? undefined
  const body = compact
    ? buildLlmsSmallTxt(buildSettings)
    : buildLlmsTxt(nav, extended, buildSettings)

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
