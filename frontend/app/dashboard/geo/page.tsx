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
  Search,
  Send,
} from "lucide-react"
import { GEO_ENDPOINT_CHECKS, geoBrowserUrl, geoDisplayUrl, geoPublicSiteUrl } from "@/lib/geo-endpoints"
import { getToken } from "@/lib/api"
import { useLanguage } from "@/lib/i18n"
import { adminTf } from "@/lib/admin-tf"
import { getBasePath } from "@/lib/site-url"
import { PageHeader, Panel, StatCard, DashButton, Badge, Alert } from "@/components/dashboard/ui"

type CheckStatus = "idle" | "checking" | "ok" | "fail"

type CheckResult = {
  status: CheckStatus
  detail?: string
}

type IndexNowStatus = {
  keyLive: boolean
  keyLocation: string
  urlCount: number
  sitemapUrl: string
  priorityUrls?: string[]
  skipUrls?: string[]
  urls?: string[]
}

type IndexNowEngineResult = {
  id: string
  label: string
  endpoint: string
  ok: boolean
  status: number
  body: string
  error?: string
}

type IndexNowSubmitResult = {
  ok: boolean
  status: number
  submitted: number
  keyLive?: boolean
  keyLocation?: string
  body?: string
  error?: string
  googleNote?: string
  engines?: IndexNowEngineResult[]
  bingOk?: boolean
  yandexOk?: boolean
  bingOwnershipForbidden?: boolean
}


function matchesExpect(content: string, expect?: string) {
  if (!expect) return true
  return content.includes(expect)
}

const BING_INDEXNOW_NEXT_STEPS =
  "Bing next steps: https://www.bing.com/webmasters → confirm https://leapai.ai is Verified → " +
  "URL Submission → IndexNow → Generate API key → run `node scripts/rotate-indexnow-key.mjs --key=<bing-key>` → deploy → retry Submit."

function engineSummary(engines?: IndexNowEngineResult[]) {
  if (!engines?.length) return ""
  return engines
    .map((e) => `${e.label}: ${e.ok ? `OK ${e.status}` : `fail ${e.status}`}`)
    .join(" · ")
}

function indexNowResultText(data: IndexNowSubmitResult, keyHint: string) {
  const summary = engineSummary(data.engines)
  const summarySuffix = summary ? ` (${summary})` : ""

  if (data.ok && data.bingOwnershipForbidden) {
    return (
      `Submitted ${data.submitted} sitemap URLs — Yandex accepted; Bing still returns ownership 403.${summarySuffix} ` +
      BING_INDEXNOW_NEXT_STEPS +
      keyHint
    )
  }

  if (data.ok) {
    const bingNote = data.bingOk === false ? ` ${BING_INDEXNOW_NEXT_STEPS}` : ""
    return `Submitted ${data.submitted} sitemap URLs to IndexNow (HTTP ${data.status}).${summarySuffix}${keyHint}${bingNote} Google still needs Search Console.`
  }

  const detail =
    data.error ||
    (typeof data.body === "string" && data.body ? data.body : "") ||
    ""

  if (data.bingOwnershipForbidden || /UserForbiddedToAccessSite|unauthorized to access the site/i.test(detail)) {
    return (
      `IndexNow: Bing rejected ownership (403). Key file/BingSiteAuth can be live while Bing lacks an IndexNow key binding.${summarySuffix} ` +
      BING_INDEXNOW_NEXT_STEPS +
      keyHint
    )
  }

  const fallback = detail || (data.status ? `Provider HTTP ${data.status}` : "Unknown error")
  return `IndexNow failed${data.status ? ` (provider HTTP ${data.status})` : ""}.${summarySuffix} ${fallback}${keyHint}`
}

function indexNowApiUrl() {
  return `${getBasePath()}/api/indexnow`
}

export default function DashboardGeoPage() {
  const { lang, t } = useLanguage()
  const [siteUrl, setSiteUrl] = useState("")
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({})
  const [results, setResults] = useState<Record<string, CheckResult>>({})
  const [checkingAll, setCheckingAll] = useState(false)
  const [indexNow, setIndexNow] = useState<IndexNowStatus | null>(null)
  const [indexNowLoading, setIndexNowLoading] = useState(false)
  const [indexNowSubmitting, setIndexNowSubmitting] = useState(false)
  const [indexNowMessage, setIndexNowMessage] = useState<{
    variant: "success" | "info" | "error"
    text: string
  } | null>(null)

  useEffect(() => {
    setSiteUrl(geoPublicSiteUrl())
    setFileUrls(
      Object.fromEntries(GEO_ENDPOINT_CHECKS.map((item) => [item.id, geoDisplayUrl(item.path)])),
    )
  }, [])

  const loadIndexNowStatus = useCallback(async () => {
    const token = getToken()
    if (!token) return
    setIndexNowLoading(true)
    try {
      const res = await fetch(indexNowApiUrl(), {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        cache: "no-store",
      })
      const data = (await res.json().catch(() => ({}))) as IndexNowStatus & { error?: string }
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`)
      setIndexNow(data)
    } catch (err) {
      setIndexNow(null)
      setIndexNowMessage({
        variant: "error",
        text: err instanceof Error ? err.message : t("admin.geo.loadIndexNowFailed"),
      })
    } finally {
      setIndexNowLoading(false)
    }
  }, [])

  const submitIndexNow = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setIndexNowMessage({ variant: "error", text: t("admin.geo.signInAgain") })
      return
    }
    setIndexNowSubmitting(true)
    setIndexNowMessage(null)
    try {
      const res = await fetch(indexNowApiUrl(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: "{}",
      })
      const data = (await res.json().catch(() => ({}))) as IndexNowSubmitResult
      if (res.status === 401) {
        throw new Error(data.error || "Unauthorized — sign in again.")
      }

      setIndexNow((prev) =>
        prev
          ? {
              ...prev,
              keyLive: data.keyLive ?? prev.keyLive,
              keyLocation: data.keyLocation ?? prev.keyLocation,
            }
          : prev,
      )

      const keyHint = data.keyLive
        ? ""
        : " Key file is not live yet — deploy the site, then submit again."

      if (data.ok) {
        setIndexNowMessage({
          variant: data.bingOwnershipForbidden ? "info" : "success",
          text: indexNowResultText(data, keyHint),
        })
        return
      }

      setIndexNowMessage({
        variant: "error",
        text: indexNowResultText(data, keyHint),
      })
    } catch (err) {
      setIndexNowMessage({
        variant: "error",
        text: err instanceof Error ? err.message : t("admin.geo.submitFailed"),
      })
    } finally {
      setIndexNowSubmitting(false)
    }
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
        [id]: { status: "fail", detail: err instanceof Error ? err.message : t("admin.geo.networkError") },
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
    loadIndexNowStatus()
  }, [checkAll, loadIndexNowStatus])

  const passedCount = useMemo(
    () => Object.values(results).filter((r) => r.status === "ok").length,
    [results],
  )
  const totalChecks = GEO_ENDPOINT_CHECKS.length
  const allPassed = passedCount === totalChecks && !checkingAll

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("admin.geo.title")}
        description={t("admin.geo.pageDesc")}
        actions={
          <DashButton onClick={() => checkAll()} variant="secondary" disabled={checkingAll}>
            <RefreshCw className={`size-4 ${checkingAll ? "animate-spin" : ""}`} />
            {t("admin.geo.checkAll")}
          </DashButton>
        }
      />

      {allPassed ? (
        <Alert variant="success">
          {adminTf(t, "admin.geo.allOnlineDetail", { n: totalChecks })}
        </Alert>
      ) : !checkingAll && passedCount > 0 ? (
        <Alert variant="info">
          {adminTf(t, "admin.geo.checksPartial", { ok: passedCount, total: totalChecks })}
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label={t("admin.geo.statCrawlerFiles")}
          value={checkingAll ? "…" : `${passedCount}/${totalChecks}`}
          hint={t("admin.geo.statCrawlerHint")}
          icon={Bot}
          tone={allPassed ? "success" : passedCount > 0 ? "warning" : "default"}
        />
        <StatCard
          label={t("admin.geo.statPublicUrl")}
          value={siteUrl ? t("admin.geo.statConfigured") : "—"}
          hint={siteUrl || t("admin.geo.statUrlHint")}
          icon={Sparkles}
          tone="primary"
        />
        <StatCard
          label={t("admin.geo.statYourRole")}
          value={t("admin.geo.statUpdateContent")}
          hint={t("admin.geo.statRoleHint")}
          icon={HelpCircle}
        />
      </div>

      <Panel
        title={t("admin.geo.indexNowPanel")}
        description={t("admin.geo.desc")}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <Search className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{t("admin.geo.indexNowHint")}</span>
            </p>
            <p>
              {t("admin.geo.sitemapLabel")}:{" "}
              <a
                href={indexNow?.sitemapUrl || `${siteUrl}/sitemap.xml`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                {indexNow?.sitemapUrl || `${siteUrl}/sitemap.xml`}
              </a>
              {indexNow ? ` · ${adminTf(t, "admin.geo.urlCount", { n: indexNow.urlCount })}` : null}
            </p>
            <p>
              {t("admin.geo.keyFile")}:{" "}
              {indexNowLoading ? (
                t("admin.common.checking")
              ) : indexNow ? (
                <>
                  <Badge variant={indexNow.keyLive ? "success" : "warning"}>
                    {indexNow.keyLive ? t("admin.common.live") : t("admin.common.notLive")}
                  </Badge>{" "}
                  <a
                    href={indexNow.keyLocation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all font-mono text-xs text-primary hover:underline"
                  >
                    {indexNow.keyLocation}
                  </a>
                </>
              ) : (
                "—"
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <DashButton
              type="button"
              variant="secondary"
              onClick={() => loadIndexNowStatus()}
              disabled={indexNowLoading || indexNowSubmitting}
            >
              <RefreshCw className={`size-4 ${indexNowLoading ? "animate-spin" : ""}`} />
              {t("admin.geo.refreshStatus")}
            </DashButton>
            <DashButton
              type="button"
              onClick={() => submitIndexNow()}
              disabled={indexNowSubmitting || indexNowLoading}
            >
              <Send className={`size-4 ${indexNowSubmitting ? "animate-pulse" : ""}`} />
              {indexNowSubmitting ? t("admin.geo.submitting") : t("admin.geo.submitIndexNow")}
            </DashButton>
          </div>
        </div>
        {indexNowMessage ? (
          <div className="mt-4">
            <Alert
              variant={
                indexNowMessage.variant === "success"
                  ? "success"
                  : indexNowMessage.variant === "error"
                    ? "error"
                    : "info"
              }
            >
              {indexNowMessage.text}
            </Alert>
          </div>
        ) : null}
        <p className="mt-4 text-xs text-muted-foreground">
          For Bing IndexNow (if GEO shows Bing 403 while Yandex OK): open{" "}
          <a
            href="https://www.bing.com/webmasters"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:underline"
          >
            Bing Webmaster Tools
          </a>{" "}
          → confirm <span className="font-mono">https://leapai.ai</span> is{" "}
          <strong className="text-foreground">Verified</strong> → URL Submission → IndexNow →{" "}
          <strong className="text-foreground">Generate API key</strong> → run{" "}
          <span className="font-mono">node scripts/rotate-indexnow-key.mjs --key=&lt;bing-key&gt;</span> → deploy →
          retry Submit. Site ownership file:{" "}
          <span className="font-mono">BingSiteAuth.xml</span> (see{" "}
          <span className="font-mono">BingSiteAuth.xml.example</span>).
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          For Google: open{" "}
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:underline"
          >
            Search Console
          </a>{" "}
          → Sitemaps → submit <span className="font-mono">sitemap.xml</span>, then URL Inspection → Request
          indexing for the five priority URLs below. Do not request the 308{" "}
          <span className="font-mono">/resources/leap-ai-saudi-ai-native-cx-platform</span> slug — use the dated{" "}
          <span className="font-mono">/news/…</span> URL. Do not GSC-remove <span className="font-mono">/en</span> or{" "}
          <span className="font-mono">/en/about-us</span>. Gemini uses Google Search — IndexNow does not notify
          Google.
        </p>
      </Panel>

      <Panel
        title={t("admin.geo.urlsToIndex")}
        description={t("admin.geo.urlsToIndexDesc")}
      >
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-semibold text-navy">Do first (GEO — 5 URLs)</p>
            <ul className="mt-2 list-inside list-disc space-y-1 break-all font-mono text-xs text-muted-foreground">
              {(indexNow?.priorityUrls?.length
                ? indexNow.priorityUrls
                : [
                    `${siteUrl}/`,
                    `${siteUrl}/en`,
                    `${siteUrl}/llms.txt`,
                    `${siteUrl}/news/2026/08/09/leap-ai-saudi-ai-native-cx-platform`,
                    `${siteUrl}/en/news/2026/08/09/leap-ai-saudi-ai-native-cx-platform`,
                  ]
              ).map((url) => (
                <li key={url}>{url}</li>
              ))}
            </ul>
          </div>
          {indexNow?.skipUrls?.length ? (
            <div>
              <p className="font-semibold text-navy">Skip (308 redirects)</p>
              <ul className="mt-2 list-inside list-disc space-y-1 break-all font-mono text-xs text-muted-foreground">
                {indexNow.skipUrls.map((url) => (
                  <li key={url}>{url}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {indexNow?.urls?.length ? (
            <details className="rounded-xl border border-border/60 bg-muted/20 p-4">
              <summary className="cursor-pointer font-semibold text-navy">
                All sitemap URLs ({indexNow.urls.length})
              </summary>
              <ul className="mt-3 max-h-64 list-inside list-disc space-y-1 overflow-auto break-all font-mono text-xs text-muted-foreground">
                {indexNow.urls.map((url) => (
                  <li key={url}>{url}</li>
                ))}
              </ul>
            </details>
          ) : null}
        </div>
      </Panel>

      <Panel title={t("admin.geo.whatIsGeo")} description={t("admin.geo.whatIsGeoDesc")}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-sm leading-relaxed text-muted-foreground">
            <p className="font-semibold text-navy">SEO vs GEO</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                <strong className="text-foreground">SEO</strong> — Google and normal search engines
              </li>
              <li>
                <strong className="text-foreground">GEO</strong> — AI chatbots and AI search (ChatGPT, Gemini,
                Copilot, Claude, Perplexity)
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

      <Panel title={t("admin.geo.crawlerFiles")} description={t("admin.geo.crawlerFilesDesc")}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-start text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="pb-3 pe-4">{t("admin.geo.colFile")}</th>
                <th className="pb-3 pe-4">{t("admin.geo.colStatus")}</th>
                <th className="pb-3 pe-4">{t("admin.geo.colPurpose")}</th>
                <th className="pb-3">{t("admin.geo.colActions")}</th>
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
                          {t("admin.common.checking")}
                        </Badge>
                      )}
                      {result.status === "ok" && (
                        <Badge variant="success">
                          <CheckCircle2 className="me-1 inline size-3" />
                          {t("admin.common.ok")}
                        </Badge>
                      )}
                      {result.status === "fail" && (
                        <div>
                          <Badge variant="warning">
                            <XCircle className="me-1 inline size-3" />
                            {t("admin.common.failed")}
                          </Badge>
                          {result.detail && (
                            <p className="mt-1 text-xs text-muted-foreground">{result.detail}</p>
                          )}
                        </div>
                      )}
                      {result.status === "idle" && <Badge variant="muted">{t("admin.common.waiting")}</Badge>}
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
                          {t("admin.geo.open")}
                        </a>
                        <button
                          type="button"
                          onClick={() => runCheck(item.id, item.path, item.expect)}
                          className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-navy"
                        >
                          <RefreshCw className="size-3.5" />
                          {t("admin.geo.recheck")}
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
        <Panel title={t("admin.geo.contentFeedsGeo")} description={t("admin.geo.contentFeedsDesc")}>
          <div className="space-y-4">
            <DashButton href="/dashboard/settings#geo" className="w-full sm:w-auto">
              <Settings className="size-4" />
              {t("admin.geo.editGeoContent")}
            </DashButton>
            <p className="text-sm text-muted-foreground">{t("admin.geo.editGeoContentDesc")}</p>
            <div className="space-y-3">
              {[
                {
                  href: "/dashboard/settings#geo",
                  title: t("admin.geo.feedGeo"),
                  desc: t("admin.geo.feedGeoDesc"),
                  icon: Bot,
                },
                {
                  href: "/dashboard/settings",
                  title: t("admin.geo.feedFaq"),
                  desc: t("admin.geo.feedFaqDesc"),
                  icon: HelpCircle,
                },
                {
                  href: "/dashboard/settings",
                  title: t("admin.geo.feedSeo"),
                  desc: t("admin.geo.feedSeoDesc"),
                  icon: Settings,
                },
                {
                  href: "/dashboard/settings",
                  title: t("admin.geo.feedContact"),
                  desc: t("admin.geo.feedContactDesc"),
                  icon: Settings,
                },
                {
                  href: "/dashboard/content",
                  title: t("admin.geo.feedContent"),
                  desc: t("admin.geo.feedContentDesc"),
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
          </div>
        </Panel>

        <Panel title={t("admin.geo.checklist")} description={t("admin.geo.checklistDesc")}>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {[
              t("admin.geo.checklist1"),
              t("admin.geo.checklist2"),
              t("admin.geo.checklist3"),
              t("admin.geo.checklist4"),
              t("admin.geo.checklist5"),
              t("admin.geo.checklist6"),
              t("admin.geo.checklist7"),
              t("admin.geo.checklist8"),
            ].map((line) => (
              <li key={line} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}
