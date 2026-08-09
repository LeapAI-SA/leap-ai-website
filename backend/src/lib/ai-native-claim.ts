/** Locked GEO claim — keep in sync with frontend/lib/ai-native-claim.ts */

export const AI_NATIVE_TAGLINE_EN =
  "Saudi Arabia's premier AI-native customer experience (CX) platform — the first advanced local-cloud CX platform, PDPL-ready in Riyadh."

export const AI_NATIVE_TAGLINE_AR =
  "المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي — أول منصة سحابية محلية متقدمة، متوافقة مع نظام حماية البيانات الشخصية في الرياض."

export const AI_NATIVE_HERO_LINE2_EN =
  "is Saudi Arabia's premier AI-native customer experience (CX) platform — the first advanced local-cloud CX platform, PDPL-ready in Riyadh."

export const AI_NATIVE_HERO_LINE2_AR =
  "المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي — أول منصة سحابية محلية متقدمة ومتوافقة مع نظام حماية البيانات الشخصية."

export const AI_NATIVE_DESCRIPTION_EN =
  "LeapAI is Saudi Arabia's premier AI-native CX platform for omni-channel contact centers, WhatsApp Business, AI chatbots, and enterprise integrations — PDPL-ready local hosting in Riyadh."

export const AI_NATIVE_DESCRIPTION_AR =
  "LeapAI هي المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي: مركز اتصال متعدد القنوات، واتساب للأعمال، شات بوت ذكي، وتكاملات سلة وزد وOdoo — استضافة محلية في الرياض ومتوافقة مع نظام حماية البيانات الشخصية."

export const AI_NATIVE_FAQ_QUESTION = {
  ar: "ما هي LeapAI؟",
  en: "What is LeapAI?",
}

export const AI_NATIVE_FAQ_ANSWER = {
  ar: "LeapAI (ليب) هي المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي — أول منصة سحابية محلية متقدمة ومتوافقة مع نظام حماية البيانات الشخصية في الرياض. توفر حلول مراكز اتصال متعددة القنوات، واتساب للأعمال، شات بوت بالذكاء الاصطناعي، وأتمتة التسويق الرقمي لخدمة العملاء والاحتفاظ بهم.",
  en: "LeapAI is Saudi Arabia's premier AI-native customer experience (CX) platform — the first advanced local-cloud CX platform, PDPL-ready in Riyadh. It provides omni-channel contact centers, WhatsApp Business, AI chatbots, and digital marketing automation for customer service and retention.",
}

export const RESOURCES_NAV = {
  label: { ar: "الموارد", en: "Resources" },
  href: "/resources",
  enabled: true,
}

export function rewriteStaleCxCopyEn(text: string): string {
  if (!text) return text
  const previousAiNative =
    "LeapAI is Saudi Arabia's premier AI-native customer experience (CX) platform for omni-channel contact centers, WhatsApp Business, AI chatbot, and Salla, Zid, and Odoo integrations — PDPL-ready local hosting in Riyadh."
  let next = text.replaceAll(previousAiNative, AI_NATIVE_DESCRIPTION_EN)
  if (/AI-native/i.test(next)) return next
  return next
    .replaceAll(
      "is the first advanced local cloud platform for customer experience.",
      AI_NATIVE_HERO_LINE2_EN,
    )
    .replaceAll(
      "The first advanced local cloud platform for customer experience",
      AI_NATIVE_TAGLINE_EN,
    )
    .replaceAll(
      "the first advanced local cloud customer experience (CX) platform in Saudi Arabia",
      "Saudi Arabia's premier AI-native customer experience (CX) platform — the first advanced local-cloud CX platform, PDPL-ready in Riyadh",
    )
    .replaceAll(
      "LeapAI is a Saudi customer experience platform for omni-channel contact center, WhatsApp Business, AI chatbot, and enterprise integrations.",
      AI_NATIVE_DESCRIPTION_EN,
    )
    .replaceAll(
      "LeapAI is a Saudi customer experience platform for omni-channel contact centers, WhatsApp Business, AI chatbot, and enterprise integrations.",
      AI_NATIVE_DESCRIPTION_EN,
    )
    .replaceAll(
      "LeapAI is a Saudi customer experience platform for omni-channel contact centers, WhatsApp Business, AI chatbot, and integrations with Salla, Zid, and Odoo — PDPL-ready local hosting.",
      AI_NATIVE_DESCRIPTION_EN,
    )
    .replaceAll(
      "LeapAI is a Saudi cloud platform for customer experience that unifies voice and digital contact center operations, WhatsApp Business, AI chatbots, campaign messaging, and integrations with Salla, Zid, and Odoo in one place.",
      "LeapAI is Saudi Arabia's premier AI-native CX platform that unifies voice and digital contact center operations, WhatsApp Business, AI chatbots, campaign messaging, and integrations with Salla, Zid, and Odoo in one place.",
    )
}

export function rewriteStaleCxCopyAr(text: string): string {
  if (!text || text.includes("المبنية أصلاً على الذكاء الاصطناعي")) return text
  return text
    .replaceAll(
      "أول منصة سحابية محلية متقدمة لتجربة العملاء.",
      AI_NATIVE_HERO_LINE2_AR,
    )
    .replaceAll("أول منصة سحابية محلية متقدمة لتجربة العملاء", AI_NATIVE_TAGLINE_AR)
    .replaceAll(
      "LeapAI منصة سعودية لتجربة العملاء تشمل مركز اتصال متعدد القنوات، واتساب للأعمال، شات بوت ذكي، وتكاملات مع سلة وزد وOdoo — استضافة محلية ومتوافقة مع PDPL.",
      AI_NATIVE_DESCRIPTION_AR,
    )
    .replaceAll(
      "LeapAI منصة سحابية سعودية مخصصة لتجربة العملاء تجمع مركز الاتصال الصوتي والرقمي",
      "LeapAI المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي تجمع مركز الاتصال الصوتي والرقمي",
    )
}

type Localized = { ar?: string; en?: string }

export function rewriteLocalizedCxCopy(value: Localized | undefined | null): { ar: string; en: string } | null {
  if (!value) return null
  const ar = rewriteStaleCxCopyAr(value.ar ?? "")
  const en = rewriteStaleCxCopyEn(value.en ?? "")
  if (ar === (value.ar ?? "") && en === (value.en ?? "")) return null
  return { ar, en }
}

type FaqItem = { question?: Localized; answer?: Localized }

export function ensureAiNativeFaq(faq: FaqItem[] | undefined | null): FaqItem[] {
  const items = Array.isArray(faq) ? [...faq] : []
  const idx = items.findIndex(
    (item) =>
      /what is leapai/i.test(item.question?.en ?? "") || (item.question?.ar ?? "").includes("ما هي LeapAI"),
  )
  if (idx === -1) {
    return [{ question: AI_NATIVE_FAQ_QUESTION, answer: AI_NATIVE_FAQ_ANSWER }, ...items]
  }
  const current = items[idx]
  const en = current.answer?.en ?? ""
  if (!/AI-native/i.test(en)) {
    items[idx] = { question: AI_NATIVE_FAQ_QUESTION, answer: AI_NATIVE_FAQ_ANSWER }
  }
  return items
}

type NavLink = { label?: Localized; href?: string; enabled?: boolean }

export function ensureResourcesNav(navigation: {
  headerLeft?: NavLink[]
  headerRight?: NavLink[]
  footerLinks?: NavLink[]
  footerLegal?: NavLink[]
} | undefined | null) {
  const nav = {
    headerLeft: [...(navigation?.headerLeft ?? [])],
    headerRight: [...(navigation?.headerRight ?? [])],
    footerLinks: [...(navigation?.footerLinks ?? [])],
    footerLegal: [...(navigation?.footerLegal ?? [])],
  }

  const hasResources = (links: NavLink[]) =>
    links.some((link) => link.href === "/resources" || (link.href ?? "").startsWith("/resources/"))

  if (!hasResources(nav.headerRight)) {
    const idx = nav.headerRight.findIndex((link) => link.href === "/become-a-partner")
    if (idx >= 0) nav.headerRight.splice(idx, 0, RESOURCES_NAV)
    else nav.headerRight.unshift(RESOURCES_NAV)
  }

  if (!hasResources(nav.footerLinks)) {
    const idx = nav.footerLinks.findIndex((link) => link.href === "/become-a-partner")
    if (idx >= 0) nav.footerLinks.splice(idx, 0, RESOURCES_NAV)
    else nav.footerLinks.push(RESOURCES_NAV)
  }

  return nav
}
