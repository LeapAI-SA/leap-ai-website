export type Localized = { ar: string; en: string }

import { getApiUrl, getClientApiUrl, isBuildPhase } from "./api-url"

import type { SocialLinks } from "./social-links"
import type { SiteNavigation } from "./site-nav"
import type { PartnerLogo, AddonsSection, AboutPageSettings, PrivacyPageSettings, CtaLabels } from "./site-marketing"
import type { PricingPlan } from "./site-data"

export type PublicSiteSettings = {
  maintenanceMode: boolean
  defaultLanguage: "ar" | "en"
  contact: {
    email: string
    phone: string
    businessHours?: Localized
    address: Localized
  }
  hero: {
    line1: Localized
    line2: Localized
    sub1: Localized
    sub2: Localized
    cta: Localized
  }
  stats: { value: number; label: Localized }[]
  images?: {
    hero: string
    ticketOverview: string
    omniChannel: string
    logo: string
  }
  social?: SocialLinks
  seo?: {
    siteTitle: Localized
    metaDescription: Localized
    footerText: Localized
    brandLock: string
  }
  faq?: { question: Localized; answer: Localized }[]
  navigation?: SiteNavigation
  partners?: PartnerLogo[]
  pricingPlans?: PricingPlan[]
  addons?: AddonsSection
  aboutPage?: AboutPageSettings
  privacyPage?: PrivacyPageSettings
  ctaLabels?: CtaLabels
  updatedAt?: string
}

export type ContentItemPublic = {
  id: string
  type: "solution" | "product" | "use-case"
  slug: string
  groupSlug?: string
  groupTitle?: Localized
  title: Localized
  excerpt: Localized
  description: Localized
  features: { ar: string[]; en: string[] }
  image?: string
  published: boolean
  sortOrder: number
}

export type ContactMessage = {
  id: string
  source: "contact" | "partner"
  name: string
  email: string
  company: string
  address: string
  phone: string
  message: string
  read: boolean
  createdAt: string
}

function browserApiUrl() {
  return typeof window === "undefined" ? getApiUrl() : getClientApiUrl()
}

function apiUnreachableMessage() {
  return `Cannot reach the API at ${browserApiUrl()}. Start the backend: run "npm run dev:local" in the backend folder, or "docker compose up -d" from the project root.`
}

const FETCH_TIMEOUT_MS = 3000

async function clientFetch(input: string, init?: RequestInit) {
  try {
    return await fetch(input, init)
  } catch {
    throw new Error(apiUnreachableMessage())
  }
}

export async function fetchWithTimeout(url: string, init: RequestInit & { next?: { revalidate?: number } } = {}) {
  if (isBuildPhase()) {
    throw new Error("api-unavailable-during-build")
  }

  const fetchPromise = (async () => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
    try {
      return await fetch(url, { ...init, signal: controller.signal })
    } finally {
      clearTimeout(timer)
    }
  })()

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("fetch-timeout")), FETCH_TIMEOUT_MS)
  })

  return Promise.race([fetchPromise, timeoutPromise])
}

export function pickLocalized(value: Localized | undefined, lang: "ar" | "en", fallback = "") {
  if (!value) return fallback
  return value[lang] || value.ar || value.en || fallback
}

export async function fetchPublicSettings(): Promise<PublicSiteSettings | null> {
  if (isBuildPhase()) return null
  try {
    const res = await fetchWithTimeout(`${getApiUrl()}/api/public/settings`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function fetchPublicContent(type: ContentItemPublic["type"]): Promise<ContentItemPublic[]> {
  if (isBuildPhase()) return []
  try {
    const res = await fetchWithTimeout(`${getApiUrl()}/api/public/content?type=${type}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("leap-admin-token")
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return
  if (token) localStorage.setItem("leap-admin-token", token)
  else localStorage.removeItem("leap-admin-token")
}

export async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken()
  const res = await clientFetch(`${browserApiUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? "Request failed")
  }
  return res.json()
}

export async function loginAdmin(email: string, password: string) {
  const res = await clientFetch(`${browserApiUrl()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Login failed" }))
    throw new Error(err.error ?? "Login failed")
  }
  return res.json() as Promise<{ token: string; user: { email: string; role: string } }>
}

export async function submitContactMessage(payload: {
  source?: "contact" | "partner"
  name: string
  email: string
  company?: string
  address?: string
  phone: string
  message: string
}) {
  const res = await clientFetch(`${browserApiUrl()}/api/public/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Failed to send message" }))
    throw new Error(err.error ?? "Failed to send message")
  }
  return res.json() as Promise<{ ok: boolean; id: string }>
}

export async function uploadAdminImage(file: File): Promise<string> {
  const token = getToken()
  const form = new FormData()
  form.append("file", file)
  const res = await clientFetch(`${browserApiUrl()}/api/admin/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Upload failed" }))
    throw new Error(err.error ?? "Upload failed")
  }
  const data = (await res.json()) as { url: string }
  return data.url
}
