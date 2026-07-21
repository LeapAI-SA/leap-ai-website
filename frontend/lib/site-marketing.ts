import { addonItems, pricingPlans, type AddonItem, type PricingPlan } from "./site-data"
import type { Localized, LocalizedArr } from "./i18n"

export type PartnerLogo = {
  name: string
  logo: string
  enabled?: boolean
}

export type AddonItemCms = AddonItem & { enabled?: boolean }

export type AddonsSection = {
  badge: Localized
  title: Localized
  lead: Localized
  items: AddonItemCms[]
}

export type AboutPageSettings = {
  title: Localized
  subtitle: Localized
  storyHeading: Localized
  story: LocalizedArr
  visionTagline: Localized
  visionTitle: Localized
  visionText: Localized
  missionTitle: Localized
  missionText: Localized
  valuesTitle: Localized
  valuesText: Localized
  quote: Localized
  quoteAttribution: string
  imageAlt: Localized
  image: string
  stats: { value: number; label: Localized }[]
}

export type PrivacySection = {
  title: Localized
  body: Localized
}

export type PrivacyPageSettings = {
  title: Localized
  subtitle: Localized
  introTitle: Localized
  introSubtitle: Localized
  image: string
  imageAlt: Localized
  sections: PrivacySection[]
}

export type CtaLabels = {
  pricing: Localized
  stores: Localized
  acquire: Localized
  headerSignup: Localized
  learnMore: Localized
}

export const DEFAULT_PARTNERS: PartnerLogo[] = [
  { name: "Meta", logo: "/logos/meta.png" },
  { name: "Microsoft", logo: "/logos/microsoft.png" },
  { name: "Salla", logo: "/logos/salla.png" },
  { name: "Zid", logo: "/logos/zid.png" },
  { name: "Vocalcom", logo: "/logos/vocalcom.png" },
  { name: "WebEngage", logo: "/logos/webengage.png" },
  { name: "LivePerson", logo: "/logos/liveperson.png" },
  { name: "Genesys", logo: "/logos/genesys.png" },
  { name: "Apple", logo: "/logos/apple.png" },
  { name: "Google My Business", logo: "/logos/gmb.png" },
]

export const DEFAULT_PRICING_PLANS = pricingPlans

export const DEFAULT_ADDONS_SECTION: AddonsSection = {
  badge: { ar: "الإضافات", en: "Add-ons" },
  title: { ar: "مكونات ذكاء اصطناعي جاهزة للاستخدام!", en: "Ready-to-use AI components!" },
  lead: {
    ar: "عزّز تجربة العملاء وحسّن نتائج عملك.",
    en: "Enhance customer experience and improve your business results.",
  },
  items: addonItems.map((item) => ({ ...item, enabled: true })),
}

export const DEFAULT_ABOUT_PAGE: AboutPageSettings = {
  title: { ar: "معلومات عنا", en: "About us" },
  subtitle: { ar: "قصتنا ورؤيتنا ومهمتنا", en: "Our story, vision, and mission" },
  storyHeading: { ar: "قصتنا", en: "Our Story" },
  story: {
    ar: [
      "مع أكثر من 23 عامًا من الخبرة في مجال التكنولوجيا داخل السوق السعودي، أصبحت LeapAI ثمرة إرث وابتكار BAB International. وبصفتها رائدة في تكنولوجيا المعلومات والاتصالات منذ 1999، أطلقت BAB International منصة LeapAI في 2022 لتكون مخصصة لحلول الذكاء الاصطناعي للمؤسسات ورائدة في السوق كمزود رائد لحلول الذكاء الاصطناعي.",
      "نهدف إلى تشكيل حقبة جديدة من التحول المدعوم بالذكاء الاصطناعي بقيادة خبرة تقنية وقيادية واسعة تمتد لأكثر من عقدين.",
      "شغوفون بالعمل معًا والمساعدة في ربط الشركات بالمستقبل الناشئ.",
      "نسعى إلى المساهمة في تحقيق أعلى معايير الرفاهية للمجتمع السعودي من خلال توفير قيمة مضافة في مجال خدمة العملاء وفق أعلى المعايير لتحقيق التميز.",
    ],
    en: [
      "With more than 23 years of experience in the technology space within the Saudi market, LeapAI became the fruit of BAB International's legacy and innovation. As an ICT leader since 1999, BAB International initiated LeapAI in 2022 to be dedicated to enterprise AI solutions and a leader in the marketplace as a pioneer AI solution provider.",
      "We aim to shape a new era of AI-powered transformation led by vast technical and leadership experience spanning more than two decades.",
      "Passionate to work together and help bridge businesses to the emerging future.",
      "We seek to contribute to achieving the highest standards of excellence for Saudi society by providing added value in customer service in accordance with the highest standards.",
    ],
  },
  visionTagline: { ar: "كن في صدارة اللعبة", en: "Stay ahead of the game" },
  visionTitle: { ar: "رؤيتنا", en: "Our Vision" },
  visionText: {
    ar: "تمكين العلاقة التكافلية بين البشر والذكاء الاصطناعي — وتعزيز نجاح الأعمال مع إثراء الحياة.",
    en: "To enable a symbiotic relationship between humans and artificial intelligence — enhancing business success while enriching lives.",
  },
  missionTitle: { ar: "مهمتنا", en: "Our Mission" },
  missionText: {
    ar: "نهدف إلى دفع التقدم المستدام من خلال جعل إمكانات الذكاء الاصطناعي مؤثرة ومفيدة عبر الأفق التجارية والمجتمعية.",
    en: "We aim to drive sustainable progress by making AI's potential impactful and beneficial across commercial and societal landscapes.",
  },
  valuesTitle: { ar: "قيمنا", en: "Our Values" },
  valuesText: {
    ar: "نؤمن بالتعاون متعدد الوظائف الذي يزيد من مشاركة أصحاب المصلحة والاحتفاظ بهم ومشاركة الموظفين لإطلاق العنان للإمكانات والابتكار. نُثري علاقتنا مع عملائنا كرائدين في تقنيات الذكاء الاصطناعي.",
    en: "We believe in cross-functional collaboration that increases stakeholder buy-in, retention, and employee engagement to unlock potential and innovation. We enrich the relationship with our clients as a pioneer in AI technologies.",
  },
  quote: {
    ar: "هدفنا هو تمكين العلاقة التكافلية بين البشر والذكاء الاصطناعي — ودفع نجاح الأعمال مع إثراء الحياة.",
    en: "Our goal is to enable a symbiotic relationship between humans and AI — and to drive business success while enriching lives.",
  },
  quoteAttribution: "Leap AI",
  imageAlt: { ar: "فريق LeapAI", en: "LeapAI team" },
  image: "/pages/about-us.png",
  stats: [
    { value: 100, label: { ar: "مشاريع", en: "Projects" } },
    { value: 50, label: { ar: "خبراء", en: "Experts" } },
    { value: 80, label: { ar: "عملاء", en: "Clients" } },
  ],
}

export const DEFAULT_PRIVACY_PAGE: PrivacyPageSettings = {
  title: { ar: "سياسة الخصوصية", en: "Privacy Policy" },
  subtitle: { ar: "كيف نحمي ونستخدم بياناتك", en: "How we protect and use your data" },
  introTitle: { ar: "سياسة الخصوصية", en: "Privacy Policy" },
  introSubtitle: {
    ar: "نلتزم بحماية خصوصيتك وبياناتك الشخصية.",
    en: "We are committed to protecting your privacy and personal data.",
  },
  image: "/sections/ticket-overview.png",
  imageAlt: { ar: "سياسة الخصوصية", en: "Privacy Policy" },
  sections: [
    {
      title: { ar: "جمع المعلومات", en: "Information We Collect" },
      body: {
        ar: "نجمع المعلومات التي تقدمها لنا مباشرة عند التسجيل أو التواصل معنا، مثل الاسم والبريد الإلكتروني ورقم الهاتف وبيانات الشركة.",
        en: "We collect information you provide directly when registering or contacting us, such as name, email, phone number, and company details.",
      },
    },
    {
      title: { ar: "استخدام المعلومات", en: "How We Use Information" },
      body: {
        ar: "نستخدم معلوماتك لتقديم خدماتنا، وتحسين تجربة العملاء، والرد على استفساراتك، وإرسال التحديثات المتعلقة بخدمات LeapAI.",
        en: "We use your information to deliver our services, improve customer experience, respond to inquiries, and send updates related to LeapAI services.",
      },
    },
    {
      title: { ar: "حماية البيانات", en: "Data Protection" },
      body: {
        ar: "نطبق معايير أمان عالية لحماية بياناتك وفق أفضل الممارسات واللوائح المعمول بها في المملكة العربية السعودية.",
        en: "We apply high security standards to protect your data in accordance with best practices and applicable regulations in Saudi Arabia.",
      },
    },
    {
      title: { ar: "حقوقك", en: "Your Rights" },
      body: {
        ar: "يمكنك طلب الوصول إلى بياناتك أو تصحيحها أو حذفها بالتواصل معنا عبر info@leapai.ai.",
        en: "You may request access, correction, or deletion of your data by contacting us at info@leapai.ai.",
      },
    },
  ],
}

export const DEFAULT_CTA_LABELS: CtaLabels = {
  pricing: { ar: "تحدث إلى مستشارنا", en: "Talk to Our Advisor" },
  stores: { ar: "اعرف أكثر", en: "Learn More" },
  acquire: { ar: "القيمة المضافة من ليب", en: "Added Value by Leap" },
  headerSignup: { ar: "تسجيل واتساب أعمال", en: "WhatsApp Business Signup" },
  learnMore: { ar: "اكتشف المزيد", en: "Learn more" },
}

function mergeLocalized(defaults: Localized, value?: Localized): Localized {
  if (!value) return defaults
  return { ar: value.ar || defaults.ar, en: value.en || defaults.en }
}

export function mergePartners(partners?: PartnerLogo[] | null): PartnerLogo[] {
  return partners?.length ? partners : DEFAULT_PARTNERS
}

export function mergePricingPlans(plans?: PricingPlan[] | null): PricingPlan[] {
  return plans?.length ? plans : DEFAULT_PRICING_PLANS
}

export function mergeAddonsSection(section?: Partial<AddonsSection> | null): AddonsSection {
  const defaults = DEFAULT_ADDONS_SECTION
  if (!section) return defaults
  return {
    badge: mergeLocalized(defaults.badge, section.badge),
    title: mergeLocalized(defaults.title, section.title),
    lead: mergeLocalized(defaults.lead, section.lead),
    items: section.items?.length ? section.items : defaults.items,
  }
}

export function mergeAboutPage(about?: Partial<AboutPageSettings> | null): AboutPageSettings {
  const defaults = DEFAULT_ABOUT_PAGE
  if (!about) return defaults
  return {
    title: mergeLocalized(defaults.title, about.title),
    subtitle: mergeLocalized(defaults.subtitle, about.subtitle),
    storyHeading: mergeLocalized(defaults.storyHeading, about.storyHeading),
    story: about.story?.ar?.length || about.story?.en?.length ? about.story : defaults.story,
    visionTagline: mergeLocalized(defaults.visionTagline, about.visionTagline),
    visionTitle: mergeLocalized(defaults.visionTitle, about.visionTitle),
    visionText: mergeLocalized(defaults.visionText, about.visionText),
    missionTitle: mergeLocalized(defaults.missionTitle, about.missionTitle),
    missionText: mergeLocalized(defaults.missionText, about.missionText),
    valuesTitle: mergeLocalized(defaults.valuesTitle, about.valuesTitle),
    valuesText: mergeLocalized(defaults.valuesText, about.valuesText),
    quote: mergeLocalized(defaults.quote, about.quote),
    quoteAttribution: about.quoteAttribution?.trim() || defaults.quoteAttribution,
    imageAlt: mergeLocalized(defaults.imageAlt, about.imageAlt),
    image: about.image || defaults.image,
    stats: about.stats?.length ? about.stats : defaults.stats,
  }
}

export function mergePrivacyPage(page?: Partial<PrivacyPageSettings> | null): PrivacyPageSettings {
  const defaults = DEFAULT_PRIVACY_PAGE
  if (!page) return defaults
  return {
    title: mergeLocalized(defaults.title, page.title),
    subtitle: mergeLocalized(defaults.subtitle, page.subtitle),
    introTitle: mergeLocalized(defaults.introTitle, page.introTitle),
    introSubtitle: mergeLocalized(defaults.introSubtitle, page.introSubtitle),
    image: page.image || defaults.image,
    imageAlt: mergeLocalized(defaults.imageAlt, page.imageAlt),
    sections: page.sections?.length ? page.sections : defaults.sections,
  }
}

export function mergeCtaLabels(labels?: Partial<CtaLabels> | null): CtaLabels {
  const defaults = DEFAULT_CTA_LABELS
  if (!labels) return defaults
  return {
    pricing: mergeLocalized(defaults.pricing, labels.pricing),
    stores: mergeLocalized(defaults.stores, labels.stores),
    acquire: mergeLocalized(defaults.acquire, labels.acquire),
    headerSignup: mergeLocalized(defaults.headerSignup, labels.headerSignup),
    learnMore: mergeLocalized(defaults.learnMore, labels.learnMore),
  }
}

export function activePartners(partners: PartnerLogo[]): PartnerLogo[] {
  return partners.filter((p) => p.enabled !== false && p.name && p.logo)
}

export function activeAddonItems(items: AddonItemCms[]): AddonItemCms[] {
  return items.filter((item) => item.enabled !== false && item.icon && (item.title.ar || item.title.en))
}

export function featuresToText(features: string[] | undefined): string {
  return (features ?? []).join("\n")
}

export function textToFeatures(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

export function paragraphsToText(paragraphs: string[] | undefined): string {
  return (paragraphs ?? []).join("\n\n")
}

export function textToParagraphs(text: string): string[] {
  return text
    .split("\n\n")
    .map((line) => line.trim())
    .filter(Boolean)
}
