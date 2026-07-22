"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Bot,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  RefreshCw,
  Settings,
  FileText,
  XCircle,
  Sparkles,
} from "lucide-react"
import { GEO_ENDPOINT_CHECKS, geoBrowserUrl, geoPublicSiteUrl } from "@/lib/geo-endpoints"
import { PageHeader, Panel, StatCard, DashButton, Badge, Alert } from "@/components/dashboard/ui"

type CheckStatus = "idle" | "checking" | "ok" | "fail"

type CheckResult = {
  status: CheckStatus
  detail?: string
}

function matchesExpect(content: string, expect?: string) {
  if (!expect) return true
  return content.includes(expect)
}

export default function DashboardGeoPage() {
  const [siteUrl, setSiteUrl] = useState("")
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({})
  const [results, setResults] = useState<Record<string, CheckResult>>({})
  const [checkingAll, setCheckingAll] = useState(false)

  useEffect(() => {
    setSiteUrl(geoPublicSiteUrl())
    setFileUrls(
      Object.fromEntries(GEO_ENDPOINT_CHECKS.map((item) => [item.id, geoBrowserUrl(item.path)])),
    )
  }, [])

  const runCheck = useCallback(async (id: string, path: string, expect?: string) => {
    setResults((prev) => ({ ...prev, [id]: { status: "checking" } }))
    const url = geoBrowserUrl(path)

    try {
      const res = await fetch(url, { cache: "no-store" })
      const text = await res.text()
      if (res.ok && matchesExpect(text, expect)) {
        setResults((prev) => ({ ...prev, [id]: { status: "ok" } }))
        return true
      }
      const detail = !res.ok
        ? `HTTP ${res.status}`
        : expect
          ? `Missing expected text: ${expect}`
          : "Unexpected response"
      setResults((prev) => ({ ...prev, [id]: { status: "fail", detail } }))
      return false
    } catch (err) {
      setResults((prev) => ({
        ...prev,
        [id]: { status: "fail", detail: err instanceof Error ? err.message : "Network error" },
      }))
      return false
    }
  }, [])

  const checkAll = useCallback(async () => {
    setCheckingAll(true)
    let passed = 0
    for (const item of GEO_ENDPOINT_CHECKS) {
      const ok = await runCheck(item.id, item.path, item.expect)
      if (ok) passed++
    }
    setCheckingAll(false)
    return passed
  }, [runCheck])

  useEffect(() => {
    checkAll()
  }, [checkAll])

  const passedCount = useMemo(
    () => Object.values(results).filter((r) => r.status === "ok").length,
    [results],
  )
  const totalChecks = GEO_ENDPOINT_CHECKS.length
  const allPassed = passedCount === totalChecks && !checkingAll

  return (
    <div className="space-y-8">
      <PageHeader
        title="GEO — AI visibility"
        description="GEO helps ChatGPT, Perplexity, Claude, and other AI tools find and describe LeapAI correctly. Files update automatically when you save Site Settings and Content."
        actions={
          <DashButton onClick={() => checkAll()} variant="secondary" disabled={checkingAll}>
            <RefreshCw className={`size-4 ${checkingAll ? "animate-spin" : ""}`} />
            Check all links
          </DashButton>
        }
      />

      {allPassed ? (
        <Alert variant="success">
          All {totalChecks} GEO crawler files are online. AI tools can read your public summary pages.
        </Alert>
      ) : !checkingAll && passedCount > 0 ? (
        <Alert variant="info">
          {passedCount} of {totalChecks} checks passed. Open failed links below or ask your developer if the site is
          offline.
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Crawler files"
          value={checkingAll ? "…" : `${passedCount}/${totalChecks}`}
          hint="Should all show OK when the site is live"
          icon={Bot}
          tone={allPassed ? "success" : passedCount > 0 ? "warning" : "default"}
        />
        <StatCard
          label="Public site URL"
          value={siteUrl ? "Configured" : "—"}
          hint={siteUrl || "Set NEXT_PUBLIC_SITE_URL on the server"}
          icon={Sparkles}
          tone="primary"
        />
        <StatCard
          label="Your role"
          value="Update content"
          hint="FAQ, SEO, and Content Library feed GEO automatically"
          icon={HelpCircle}
        />
      </div>

      <Panel
        title="What is GEO?"
        description="Simple explanation — no extra setup required"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-sm leading-relaxed text-muted-foreground">
            <p className="font-semibold text-navy">SEO vs GEO</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                <strong className="text-foreground">SEO</strong> — Google and normal search engines
              </li>
              <li>
                <strong className="text-foreground">GEO</strong> — AI chatbots and AI search (ChatGPT, Claude,
                Perplexity)
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-sm leading-relaxed text-muted-foreground">
            <p className="font-semibold text-navy">How it works</p>
            <ol className="mt-2 list-inside list-decimal space-y-1">
              <li>You update FAQ, SEO, and content in this dashboard</li>
              <li>The website publishes plain-text files for AI bots</li>
              <li>Over days or weeks, AI may mention LeapAI in answers</li>
            </ol>
          </div>
        </div>
        {siteUrl && (
          <p className="mt-4 text-sm text-muted-foreground">
            Live site:{" "}
            <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
              {siteUrl}
            </a>
          </p>
        )}
      </Panel>

      <Panel title="Crawler files" description="Open each link in a new tab — you should see plain text, not an error page">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-start text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="pb-3 pe-4">File</th>
                <th className="pb-3 pe-4">Status</th>
                <th className="pb-3 pe-4">Purpose</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {GEO_ENDPOINT_CHECKS.map((item) => {
                const result = results[item.id] ?? { status: "idle" as CheckStatus }
                const url = fileUrls[item.id] ?? item.path

                return (
                  <tr key={item.id}>
                    <td className="py-4 pe-4 align-top">
                      <p className="font-bold text-navy">{item.label}</p>
                      <p className="mt-0.5 break-all font-mono text-xs text-muted-foreground">{url}</p>
                    </td>
                    <td className="py-4 pe-4 align-top">
                      {result.status === "checking" && (
                        <Badge variant="muted">
                          <RefreshCw className="me-1 inline size-3 animate-spin" />
                          Checking
                        </Badge>
                      )}
                      {result.status === "ok" && (
                        <Badge variant="success">
                          <CheckCircle2 className="me-1 inline size-3" />
                          OK
                        </Badge>
                      )}
                      {result.status === "fail" && (
                        <div>
                          <Badge variant="warning">
                            <XCircle className="me-1 inline size-3" />
                            Failed
                          </Badge>
                          {result.detail && (
                            <p className="mt-1 text-xs text-muted-foreground">{result.detail}</p>
                          )}
                        </div>
                      )}
                      {result.status === "idle" && <Badge variant="muted">Waiting</Badge>}
                    </td>
                    <td className="py-4 pe-4 align-top text-muted-foreground">{item.description}</td>
                    <td className="py-4 align-top">
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-navy hover:bg-muted"
                        >
                          <ExternalLink className="size-3.5" />
                          Open
                        </a>
                        <button
                          type="button"
                          onClick={() => runCheck(item.id, item.path, item.expect)}
                          className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-navy"
                        >
                          <RefreshCw className="size-3.5" />
                          Recheck
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Content that feeds GEO" description="Update these sections — GEO files refresh automatically on save">
          <div className="space-y-3">
            {[
              {
                href: "/dashboard/settings",
                title: "Site Settings → Homepage FAQ",
                desc: "Questions and answers appear in llms-full.txt and on the homepage",
                icon: HelpCircle,
              },
              {
                href: "/dashboard/settings",
                title: "Site Settings → SEO",
                desc: "Site title and meta description used across the public site",
                icon: Settings,
              },
              {
                href: "/dashboard/settings",
                title: "Site Settings → Contact",
                desc: "Phone, email, and address in AI summaries",
                icon: Settings,
              },
              {
                href: "/dashboard/content",
                title: "Content Library",
                desc: "Solutions, products, and use cases listed in llms.txt",
                icon: FileText,
              },
            ].map((row) => (
              <Link
                key={row.title}
                href={row.href}
                className="group flex gap-3 rounded-xl border border-border/60 bg-background p-4 transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <row.icon className="size-4" />
                </span>
                <div>
                  <p className="font-bold text-navy group-hover:text-primary">{row.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{row.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </Panel>

        <Panel title="Checklist & tips" description="What you need to do — and what happens automatically">
          <ul className="space-y-3 text-sm text-muted-foreground">
            {[
              "Keep the website online on your real domain (not localhost only)",
              "Fill in Homepage FAQ in Site Settings — Arabic and English",
              "Keep SEO title and description accurate",
              "Publish solutions, products, and use cases in Content Library",
              "All 6 crawler files above should show OK",
              "Be patient — AI may take days or weeks to mention LeapAI",
            ].map((line) => (
              <li key={line} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 rounded-xl border border-amber/30 bg-amber/10 px-4 py-3 text-xs leading-relaxed text-amber-foreground">
            <strong>Domain root note:</strong> Some AI validators check{" "}
            <code className="rounded bg-background/80 px-1">/llms.txt</code> without{" "}
            <code className="rounded bg-background/80 px-1">/leap-ai</code>. Your files work under{" "}
            <code className="rounded bg-background/80 px-1">/leap-ai/…</code> today. Ask your server admin to add nginx
            redirects from <code className="rounded bg-background/80 px-1">deploy/nginx-crawler-root.conf</code> if
            needed.
          </p>
        </Panel>
      </div>
    </div>
  )
}
