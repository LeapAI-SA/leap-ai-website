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
    { label: { ar: "كن شريكنا", en: "Become a Partner" }, href: "/become-a-partner" },
    { label: { ar: "اتصل بنا", en: "Contact Us" }, href: "/contact-us" },
  ],
  footerLinks: [
    { label: { ar: "الرئيسية", en: "Home" }, href: "/" },
    { label: { ar: "معلومات عنا", en: "About Us" }, href: "/about-us" },
    { label: { ar: "كن شريكنا", en: "Become a Partner" }, href: "/become-a-partner" },
    { label: { ar: "اتصل بنا", en: "Contact Us" }, href: "/contact-us" },
  ],
  footerLegal: [
    { label: { ar: "سياسة الخصوصية", en: "Privacy Policy" }, href: "/privacy-policy" },
    { label: { ar: "أسئلة شائعة", en: "FAQ" }, href: "/#faq" },
  ],
}

export function mergeNavigation(navigation?: Partial<SiteNavigation> | null): SiteNavigation {
  return {
    headerLeft: navigation?.headerLeft?.length ? navigation.headerLeft : DEFAULT_NAVIGATION.headerLeft,
    headerRight: navigation?.headerRight?.length ? navigation.headerRight : DEFAULT_NAVIGATION.headerRight,
    footerLinks: navigation?.footerLinks?.length ? navigation.footerLinks : DEFAULT_NAVIGATION.footerLinks,
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
