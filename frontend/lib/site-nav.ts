import type { Localized } from "./api"

export type SiteNavLink = {
  label: Localized
  href: string
  enabled?: boolean
}

export type SiteNavigation = {
  headerLeft: SiteNavLink[]
  headerRight: SiteNavLink[]
  footerLinks: SiteNavLink[]
  footerLegal: SiteNavLink[]
}

export const DEFAULT_NAVIGATION: SiteNavigation = {
  headerLeft: [
    { label: { ar: "الرئيسية", en: "Home" }, href: "/" },
    { label: { ar: "معلومات عنا", en: "About Us" }, href: "/about-us" },
  ],
  headerRight: [
    { label: { ar: "مقال", en: "Article" }, href: "/resources" },
    { label: { ar: "الوظائف", en: "Careers" }, href: "/careers" },
    { label: { ar: "كن شريكنا", en: "Become a Partner" }, href: "/become-a-partner" },
    { label: { ar: "اتصل بنا", en: "Contact Us" }, href: "/contact-us" },
  ],
  footerLinks: [
    { label: { ar: "الرئيسية", en: "Home" }, href: "/" },
    { label: { ar: "معلومات عنا", en: "About Us" }, href: "/about-us" },
    { label: { ar: "حلولنا", en: "Solutions" }, href: "/solutions" },
    { label: { ar: "منتجاتنا", en: "Products" }, href: "/products" },
    { label: { ar: "حالات الاستخدام", en: "Use Cases" }, href: "/use-cases" },
    { label: { ar: "قصص النجاح", en: "Success Stories" }, href: "/cases" },
    { label: { ar: "الوظائف", en: "Careers" }, href: "/careers" },
    { label: { ar: "مقال", en: "Article" }, href: "/resources" },
    { label: { ar: "كن شريكنا", en: "Become a Partner" }, href: "/become-a-partner" },
    { label: { ar: "اتصل بنا", en: "Contact Us" }, href: "/contact-us" },
  ],
  footerLegal: [
    { label: { ar: "سياسة الخصوصية", en: "Privacy Policy" }, href: "/privacy-policy" },
    { label: { ar: "أسئلة شائعة", en: "FAQ" }, href: "/#faq" },
  ],
}

const RESOURCES_LINK: SiteNavLink = { label: { ar: "مقال", en: "Article" }, href: "/resources" }
const CAREERS_LINK: SiteNavLink = { label: { ar: "الوظائف", en: "Careers" }, href: "/careers" }

function isResourcesHref(href: string) {
  return href === "/resources" || href.startsWith("/resources/")
}

/** Keep CMS-saved /resources links, but refresh stale Resources/الموارد labels. */
function normalizeResourcesLabels(links: SiteNavLink[]): SiteNavLink[] {
  return links.map((link) => {
    if (!isResourcesHref(link.href)) return link
    const ar = link.label.ar.trim()
    const en = link.label.en.trim()
    const staleAr = !ar || ar === "الموارد"
    const staleEn = !en || en === "Resources"
    if (!staleAr && !staleEn) return link
    return {
      ...link,
      label: {
        ar: staleAr ? RESOURCES_LINK.label.ar : link.label.ar,
        en: staleEn ? RESOURCES_LINK.label.en : link.label.en,
      },
    }
  })
}

function ensureResourcesLink(links: SiteNavLink[], beforeHref: string): SiteNavLink[] {
  const normalized = normalizeResourcesLabels(links)
  if (normalized.some((link) => isResourcesHref(link.href))) {
    return normalized
  }
  const next = [...normalized]
  const idx = next.findIndex((link) => link.href === beforeHref)
  if (idx >= 0) next.splice(idx, 0, RESOURCES_LINK)
  else next.push(RESOURCES_LINK)
  return next
}

function ensureCareersLink(links: SiteNavLink[], beforeHref: string): SiteNavLink[] {
  if (links.some((link) => link.href === "/careers" || link.href.startsWith("/careers/"))) {
    return links
  }
  const next = [...links]
  const idx = next.findIndex((link) => link.href === beforeHref)
  if (idx >= 0) next.splice(idx, 0, CAREERS_LINK)
  else next.push(CAREERS_LINK)
  return next
}

export function mergeNavigation(navigation?: Partial<SiteNavigation> | null): SiteNavigation {
  const headerRight = navigation?.headerRight?.length ? navigation.headerRight : DEFAULT_NAVIGATION.headerRight
  const footerLinks = navigation?.footerLinks?.length ? navigation.footerLinks : DEFAULT_NAVIGATION.footerLinks
  return {
    headerLeft: navigation?.headerLeft?.length ? navigation.headerLeft : DEFAULT_NAVIGATION.headerLeft,
    headerRight: ensureCareersLink(ensureResourcesLink(headerRight, "/become-a-partner"), "/contact-us"),
    footerLinks: ensureCareersLink(ensureResourcesLink(footerLinks, "/become-a-partner"), "/resources"),
    footerLegal: navigation?.footerLegal?.length ? navigation.footerLegal : DEFAULT_NAVIGATION.footerLegal,
  }
}

export function activeNavLinks(links: SiteNavLink[]): SiteNavLink[] {
  return links.filter(
    (link) => link.enabled !== false && link.href && (link.label.ar.trim() || link.label.en.trim()),
  )
}

export function navLinkLabel(link: SiteNavLink, lang: "ar" | "en"): string {
  return (lang === "ar" ? link.label.ar : link.label.en) || link.label.en || link.label.ar
}
