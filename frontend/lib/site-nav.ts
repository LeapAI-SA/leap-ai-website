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
    { label: { ar: "الموارد", en: "Resources" }, href: "/resources" },
    { label: { ar: "كن شريكنا", en: "Become a Partner" }, href: "/become-a-partner" },
    { label: { ar: "اتصل بنا", en: "Contact Us" }, href: "/contact-us" },
  ],
  footerLinks: [
    { label: { ar: "الرئيسية", en: "Home" }, href: "/" },
    { label: { ar: "معلومات عنا", en: "About Us" }, href: "/about-us" },
    { label: { ar: "حلولنا", en: "Solutions" }, href: "/solutions" },
    { label: { ar: "منتجاتنا", en: "Products" }, href: "/products" },
    { label: { ar: "حالات الاستخدام", en: "Use Cases" }, href: "/use-cases" },
    { label: { ar: "الموارد", en: "Resources" }, href: "/resources" },
    { label: { ar: "كن شريكنا", en: "Become a Partner" }, href: "/become-a-partner" },
    { label: { ar: "اتصل بنا", en: "Contact Us" }, href: "/contact-us" },
  ],
  footerLegal: [
    { label: { ar: "سياسة الخصوصية", en: "Privacy Policy" }, href: "/privacy-policy" },
    { label: { ar: "أسئلة شائعة", en: "FAQ" }, href: "/#faq" },
  ],
}

const RESOURCES_LINK: SiteNavLink = { label: { ar: "الموارد", en: "Resources" }, href: "/resources" }

function ensureResourcesLink(links: SiteNavLink[], beforeHref: string): SiteNavLink[] {
  if (links.some((link) => link.href === "/resources" || link.href.startsWith("/resources/"))) {
    return links
  }
  const next = [...links]
  const idx = next.findIndex((link) => link.href === beforeHref)
  if (idx >= 0) next.splice(idx, 0, RESOURCES_LINK)
  else next.push(RESOURCES_LINK)
  return next
}

export function mergeNavigation(navigation?: Partial<SiteNavigation> | null): SiteNavigation {
  const headerRight = navigation?.headerRight?.length ? navigation.headerRight : DEFAULT_NAVIGATION.headerRight
  const footerLinks = navigation?.footerLinks?.length ? navigation.footerLinks : DEFAULT_NAVIGATION.footerLinks
  return {
    headerLeft: navigation?.headerLeft?.length ? navigation.headerLeft : DEFAULT_NAVIGATION.headerLeft,
    headerRight: ensureResourcesLink(headerRight, "/become-a-partner"),
    footerLinks: ensureResourcesLink(footerLinks, "/become-a-partner"),
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
