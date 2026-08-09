import mongoose, { Schema } from "mongoose"
import { rewriteFeatureList, rewritePricingPlansCopy } from "../lib/whatsapp-tick.js"
import { cacheDel } from "../config/redis.js"

const localizedSchema = new Schema(
  {
    ar: { type: String, default: "" },
    en: { type: String, default: "" },
  },
  { _id: false },
)

const faqItemSchema = new Schema(
  {
    question: { type: localizedSchema, required: true },
    answer: { type: localizedSchema, required: true },
  },
  { _id: false },
)

const navLinkSchema = new Schema(
  {
    label: { type: localizedSchema, required: true },
    href: { type: String, required: true },
    enabled: { type: Boolean, default: true },
  },
  { _id: false },
)

const partnerSchema = new Schema(
  {
    name: { type: String, required: true },
    logo: { type: String, required: true },
    enabled: { type: Boolean, default: true },
  },
  { _id: false },
)

const localizedArraySchema = new Schema(
  {
    ar: { type: [String], default: [] },
    en: { type: [String], default: [] },
  },
  { _id: false },
)

const pricingPlanSchema = new Schema(
  {
    slug: { type: String, required: true },
    price: { type: String, required: true },
    featured: { type: Boolean, default: false },
    name: { type: localizedSchema, required: true },
    tagline: { type: localizedSchema, required: true },
    features: { type: localizedArraySchema, required: true },
  },
  { _id: false },
)

const addonItemSchema = new Schema(
  {
    icon: { type: String, required: true },
    title: { type: localizedSchema, required: true },
    desc: { type: localizedSchema, required: true },
    enabled: { type: Boolean, default: true },
  },
  { _id: false },
)

const legalSectionSchema = new Schema(
  {
    title: { type: localizedSchema, required: true },
    body: { type: localizedSchema, required: true },
  },
  { _id: false },
)

const statSchema = new Schema(
  {
    value: { type: Number, required: true },
    label: { type: localizedSchema, required: true },
  },
  { _id: false },
)

const defaultNavigation = () => ({
  headerLeft: [
    { label: { ar: "الرئيسية", en: "Home" }, href: "/", enabled: true },
    { label: { ar: "معلومات عنا", en: "About Us" }, href: "/about-us", enabled: true },
  ],
  headerRight: [
    { label: { ar: "كن شريكنا", en: "Become a Partner" }, href: "/become-a-partner", enabled: true },
    { label: { ar: "اتصل بنا", en: "Contact Us" }, href: "/contact-us", enabled: true },
  ],
  footerLinks: [
    { label: { ar: "الرئيسية", en: "Home" }, href: "/", enabled: true },
    { label: { ar: "معلومات عنا", en: "About Us" }, href: "/about-us", enabled: true },
    { label: { ar: "حلولنا", en: "Solutions" }, href: "/solutions", enabled: true },
    { label: { ar: "منتجاتنا", en: "Products" }, href: "/products", enabled: true },
    { label: { ar: "حالات الاستخدام", en: "Use Cases" }, href: "/use-cases", enabled: true },
    { label: { ar: "كن شريكنا", en: "Become a Partner" }, href: "/become-a-partner", enabled: true },
    { label: { ar: "اتصل بنا", en: "Contact Us" }, href: "/contact-us", enabled: true },
  ],
  footerLegal: [
    { label: { ar: "سياسة الخصوصية", en: "Privacy Policy" }, href: "/privacy-policy", enabled: true },
    { label: { ar: "أسئلة شائعة", en: "FAQ" }, href: "/#faq", enabled: true },
  ],
})

const siteSettingsSchema = new Schema(
  {
    maintenanceMode: { type: Boolean, default: false },
    defaultLanguage: { type: String, enum: ["ar", "en"], default: "ar" },
    contact: {
      email: { type: String, default: "info@leapai.ai" },
      phone: { type: String, default: "+966 53 553 3627" },
      businessHours: {
        type: localizedSchema,
        default: () => ({
          ar: "الأحد - الخميس 8:00 - 17:00",
          en: "Sun - Thu 8:00 AM - 5:00 PM",
        }),
      },
      address: {
        type: localizedSchema,
        default: () => ({
          ar: "المملكة العربية السعودية، الرياض، طريق الملك عبد العزيز الفرعي",
          en: "King Abdulaziz Branch Road, Riyadh, Saudi Arabia",
        }),
      },
    },
    hero: {
      line1: { type: localizedSchema, default: () => ({ ar: "تعتبر", en: "" }) },
      line2: {
        type: localizedSchema,
        default: () => ({
          ar: "أول منصة سحابية محلية متقدمة لتجربة العملاء.",
          en: "is the first advanced local cloud platform for customer experience.",
        }),
      },
      sub1: {
        type: localizedSchema,
        default: () => ({
          ar: "LeapAI منصة سحابية سعودية مخصصة لتجربة العملاء تجمع مركز الاتصال الصوتي والرقمي، واتساب للأعمال، الشات بوت الذكي، حملات الرسائل، والتكامل مع سلة وزد وOdoo في مكان واحد. توفر المنصة 3 باقات تشغيل مرنة (149، 199، 299 ريال لكل مستخدم شهريًا) وتساعدك على تحسين زمن الاستجابة، أتمتة الرحلات، ومتابعة الأداء عبر لوحة موحدة، مع استضافة محلية متوافقة مع PDPL ودعم متخصص لضمان تشغيل مستقر ونمو قابل للقياس.",
          en: "LeapAI is a Saudi cloud platform for customer experience that unifies voice and digital contact center operations, WhatsApp Business, AI chatbots, campaign messaging, and integrations with Salla, Zid, and Odoo in one place. The platform offers 3 flexible plans (149, 199, and 299 SAR per user/month) and helps teams improve response time, automate journeys, and track measurable performance from one dashboard, with PDPL-ready local hosting and dedicated support.",
        }),
      },
      sub2: {
        type: localizedSchema,
        default: () => ({
          ar: "منصة LeapAI هي الاختيار الأمثل لخدمة العملاء والاحتفاظ بهم على الأمد البعيد.",
          en: "LeapAI is the ideal choice for serving customers and retaining them for the long term.",
        }),
      },
      cta: {
        type: localizedSchema,
        default: () => ({ ar: "حجز تجربة", en: "Book a demo" }),
      },
    },
    stats: {
      type: [
        {
          value: Number,
          label: localizedSchema,
          _id: false,
        },
      ],
      default: () => [
        { value: 100, label: { ar: "مشاريع", en: "Projects" } },
        { value: 50, label: { ar: "خبراء", en: "Experts" } },
        { value: 80, label: { ar: "عملاء", en: "Customers" } },
      ],
    },
    images: {
      hero: { type: String, default: "/hero-dashboard.png" },
      ticketOverview: { type: String, default: "/sections/ticket-overview.png" },
      omniChannel: { type: String, default: "/sections/omni-channel.png" },
      logo: { type: String, default: "/leapai-logo.png" },
    },
    social: {
      facebook: { type: String, default: "https://www.facebook.com/leapai_cx/" },
      twitter: { type: String, default: "https://twitter.com/leapai_cx" },
      instagram: { type: String, default: "https://www.instagram.com/leapai_cx/" },
      youtube: { type: String, default: "https://www.youtube.com/channel/UC4kmc62wjm7IjKlO6j28jlg" },
      linkedin: { type: String, default: "https://www.linkedin.com/company/leapai-sa/" },
    },
    storeIntegrationLinks: {
      salla: { type: String, default: "https://apps.salla.sa/ar/app/1047911288/" },
      zid: { type: String, default: "https://apps.zid.sa/application/3277" },
    },
    seo: {
      siteTitle: {
        type: localizedSchema,
        default: () => ({
          ar: "Leap AI — أول منصة سحابية محلية متقدمة لتجربة العملاء",
          en: "Leap AI — The first advanced local cloud platform for customer experience",
        }),
      },
      metaDescription: {
        type: localizedSchema,
        default: () => ({
          ar: "LeapAI منصة سعودية لتجربة العملاء تشمل مركز اتصال متعدد القنوات، واتساب للأعمال، شات بوت ذكي، وتكاملات مع سلة وزد وOdoo — استضافة محلية ومتوافقة مع PDPL.",
          en: "LeapAI is a Saudi customer experience platform for omni-channel contact centers, WhatsApp Business, AI chatbot, and integrations with Salla, Zid, and Odoo — PDPL-ready local hosting.",
        }),
      },
      footerText: {
        type: localizedSchema,
        default: () => ({
          ar: "هدفنا هو تمكين العلاقة التكافلية بين البشر والذكاء الاصطناعي — ودفع نجاح الأعمال مع إثراء الحياة.",
          en: "Our goal is to enable a symbiotic relationship between humans and AI — and to drive business success while enriching lives.",
        }),
      },
      brandLock: { type: String, default: "LeapAI" },
    },
    navigation: {
      type: {
        headerLeft: { type: [navLinkSchema], default: () => defaultNavigation().headerLeft },
        headerRight: { type: [navLinkSchema], default: () => defaultNavigation().headerRight },
        footerLinks: { type: [navLinkSchema], default: () => defaultNavigation().footerLinks },
        footerLegal: { type: [navLinkSchema], default: () => defaultNavigation().footerLegal },
      },
      default: defaultNavigation,
    },
    partners: { type: [partnerSchema], default: () => [] },
    pricingPlans: { type: [pricingPlanSchema], default: () => [] },
    addons: {
      badge: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
      title: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
      lead: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
      items: { type: [addonItemSchema], default: () => [] },
    },
    aboutPage: {
      title: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
      subtitle: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
      storyHeading: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
      story: { type: localizedArraySchema, default: () => ({ ar: [], en: [] }) },
      visionTagline: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
      visionTitle: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
      visionText: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
      missionTitle: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
      missionText: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
      valuesTitle: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
      valuesText: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
      quote: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
      quoteAttribution: { type: String, default: "Leap AI" },
      imageAlt: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
      image: { type: String, default: "/pages/about-us.png" },
      stats: { type: [statSchema], default: () => [] },
    },
    privacyPage: {
      title: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
      subtitle: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
      introTitle: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
      introSubtitle: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
      image: { type: String, default: "/sections/ticket-overview.png" },
      imageAlt: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
      sections: { type: [legalSectionSchema], default: () => [] },
    },
    ctaLabels: {
      pricing: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
      stores: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
      acquire: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
      headerSignup: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
      learnMore: { type: localizedSchema, default: () => ({ ar: "", en: "" }) },
    },
    faq: {
      type: [faqItemSchema],
      default: () => [
        {
          question: { ar: "ما هي باقات Leap Space؟", en: "What are Leap Space pricing plans?" },
          answer: {
            ar: "الأسعار تبدأ من 149 و199 و299 ريال حسب الباقة، مع إمكانية تقديم باقات مخصصة حسب حجم التشغيل.",
            en: "Pricing starts at 149, 199, and 299 SAR by plan, with custom enterprise packages available based on scale.",
          },
        },
        {
          question: { ar: "هل LeapAI تدعم اللهجات العربية؟", en: "Does LeapAI support Arabic dialects?" },
          answer: {
            ar: "نعم، تدعم المنصة العربية الفصحى واللهجات المحلية نصاً وصوتاً عبر NLU وSpeech-to-Text.",
            en: "Yes, the platform supports Modern Standard Arabic and local dialects in text and voice using NLU and speech-to-text.",
          },
        },
        {
          question: {
            ar: "هل تتوافق LeapAI مع PDPL وتدعم الاستضافة المحلية؟",
            en: "Is LeapAI PDPL-ready and does it support local hosting?",
          },
          answer: {
            ar: "نعم، يمكن نشر الحل داخل السعودية (On-Premises أو Private Cloud) لتلبية متطلبات الامتثال وحوكمة البيانات.",
            en: "Yes, LeapAI can be deployed in Saudi (on-premises or private cloud) to satisfy compliance and data-governance requirements.",
          },
        },
        {
          question: { ar: "هل تتكامل LeapAI مع سلة وزد وOdoo؟", en: "Can LeapAI integrate with Salla, Zid, and Odoo?" },
          answer: {
            ar: "نعم، ندعم التكامل عبر API مع سلة وزد وOdoo وأنظمة CRM/ERP الأخرى.",
            en: "Yes, LeapAI supports API-based integrations with Salla, Zid, Odoo, and other CRM/ERP systems.",
          },
        },
      ],
    },
  },
  { timestamps: true },
)

export const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema)

const OLD_HERO_CTA_AR = new Set(["تحدث إلى مستشارنا", "تحدث إلى مستشارينا"])
const OLD_HERO_CTA_EN = new Set(["Talk to Our Advisor", "Talk to our consultants", "Talk to Our Consultants"])

export async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne()
  if (!settings) {
    settings = await SiteSettings.create({})
  }

  let dirty = false
  const cta = settings.hero?.cta
  if (settings.hero && cta && (OLD_HERO_CTA_AR.has(cta.ar) || OLD_HERO_CTA_EN.has(cta.en))) {
    settings.hero.cta = { ar: "حجز تجربة", en: "Book a demo" }
    dirty = true
  }

  const plans = settings.pricingPlans ?? []
  for (const plan of plans) {
    const ar = plan.features?.ar ?? []
    const en = plan.features?.en ?? []
    const nextAr = rewriteFeatureList(ar)
    const nextEn = rewriteFeatureList(en)
    if (nextAr.some((line, i) => line !== ar[i]) || nextEn.some((line, i) => line !== en[i])) {
      plan.features = { ar: nextAr, en: nextEn }
      dirty = true
    }
  }

  if (dirty) {
    await settings.save()
    await cacheDel("public:settings")
  }

  return settings
}

export function serializePublicSettings(settings: InstanceType<typeof SiteSettings>) {
  return {
    maintenanceMode: settings.maintenanceMode,
    defaultLanguage: settings.defaultLanguage,
    contact: settings.contact,
    hero: settings.hero,
    stats: settings.stats,
    images: settings.images,
    social: settings.social,
    storeIntegrationLinks: settings.storeIntegrationLinks ?? {
      salla: "https://apps.salla.sa/ar/app/1047911288/",
      zid: "https://apps.zid.sa/application/3277",
    },
    seo: settings.seo,
    navigation: settings.navigation ?? defaultNavigation(),
    partners: settings.partners ?? [],
    pricingPlans: rewritePricingPlansCopy(
      (settings.pricingPlans ?? []).map((plan) =>
        typeof plan.toObject === "function" ? plan.toObject() : plan,
      ),
    ),
    addons: settings.addons,
    aboutPage: settings.aboutPage,
    privacyPage: settings.privacyPage,
    ctaLabels: settings.ctaLabels,
    faq: settings.faq,
    updatedAt: settings.updatedAt,
  }
}
