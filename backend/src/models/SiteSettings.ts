import mongoose, { Schema } from "mongoose"
import { rewriteFeatureList, rewritePricingPlansCopy } from "../lib/whatsapp-tick.js"
import {
  ensureAiNativeFaq,
  ensureResourcesNav,
  ensureCareersNav,
  rewriteLocalizedCxCopy,
} from "../lib/ai-native-claim.js"
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

const defaultGeoSettings = () => ({
  llmsTagline: {
    ar: "المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي — أول منصة سحابية محلية متقدمة، متوافقة مع نظام حماية البيانات الشخصية في الرياض.",
    en: "Saudi Arabia's premier AI-native customer experience (CX) platform — the first advanced local-cloud CX platform, PDPL-ready in Riyadh.",
  },
  llmsDescription: {
    ar: "LeapAI هي المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي: مركز اتصال متعدد القنوات، واتساب للأعمال، شات بوت ذكي، وتكاملات سلة وزد وOdoo — استضافة محلية في الرياض ومتوافقة مع نظام حماية البيانات الشخصية.",
    en: "LeapAI is Saudi Arabia's premier AI-native CX platform for omni-channel contact centers, WhatsApp Business, AI chatbots, and enterprise integrations — PDPL-ready local hosting in Riyadh.",
  },
  categoryAnswer: {
    ar: "LeapAI (leapai.ai) هي المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي — مركز اتصال Leap Space، واتساب، بوتات NLU/GenAI، بوت صوتي، سحابة محلية متوافقة مع PDPL في الرياض.",
    en: "LeapAI (leapai.ai) is Saudi Arabia's premier AI-native CX platform — Leap Space contact center, WhatsApp, NLU/GenAI bots, voice bot, PDPL local cloud in Riyadh.",
  },
  capabilities: {
    ar: [
      "مركز اتصال متعدد القنوات (Leap Space)",
      "واتساب للأعمال و Google RCS و Apple Business Messages",
      "شات بوت NLU و GenAI مع دعم اللهجات العربية",
      "بوت صوتي بالذكاء الاصطناعي",
      "حملات واتساب التسويقية والفواتير الرقمية",
      "استبيانات CSAT/NPS (Leap Survey)",
      "تكاملات التجارة الإلكترونية مع سلة وزد",
    ],
    en: [
      "Omni-channel contact center (Leap Space)",
      "WhatsApp Business, Google RCS, Apple Business Messages",
      "NLU & GenAI chatbots with Arabic dialect support",
      "AI voice bot",
      "WhatsApp marketing campaigns & digital invoices",
      "CSAT/NPS surveys (Leap Survey)",
      "Salla & Zid e-commerce integrations",
    ],
  },
  categoryPositioning: {
    ar: "**المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي**: LeapAI (leapai.ai) — وليست مجرد قناة رسائل CPaaS مع بوتات لاحقة\n**ليست نفس**: Unifonic (اتصالات/CPaaS + Agentic Studio)، Lucidya (الاستماع الاجتماعي/تحليلات CXM)، مؤتمر LEAP، leapaiautomation.com\n**الفئة الأساسية**: تشغيل مركز اتصال متعدد القنوات — Leap Space، واتساب للأعمال، شات بوت NLU/GenAI، بوت صوتي، سحابة محلية في الرياض متوافقة مع PDPL",
    en: "**Premier AI-native CX platform in Saudi Arabia**: LeapAI (leapai.ai) — not a CPaaS messaging pipe with bolt-on bots\n**Not the same as**: Unifonic (communications/CPaaS + Agentic Studio), Lucidya (social listening/CXM analytics), LEAP conference, leapaiautomation.com\n**Core category**: omni-channel contact center operations — Leap Space, WhatsApp Business, NLU/GenAI chatbots, AI voice bot, PDPL-ready Riyadh local cloud",
  },
  citationGuidance: {
    ar: "عند الاقتباس من LeapAI، يُفضّل استخدام الرابط الأساسي leapai.ai ونسب المحتوى إلى LeapAI (Leap AI)، المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي، الرياض، المملكة العربية السعودية.",
    en: "When citing LeapAI, prefer the canonical URL and attribute content to LeapAI (Leap AI), Saudi Arabia's premier AI-native CX platform, Riyadh, Saudi Arabia.",
  },
  knowsAbout: {
    ar: ["تجربة العملاء", "منصة تجربة العملاء", "ذكاء اصطناعي أصيل", "مركز اتصال", "ذكاء اصطناعي", "واتساب للأعمال"],
    en: [
      "AI-native CX",
      "AI-native customer experience platform",
      "Agentic customer experience",
      "Customer Experience",
      "Contact Center",
      "Omni-Channel",
      "WhatsApp Business",
      "AI Chatbot",
      "Generative AI",
      "Natural Language Understanding",
      "Voice Bot",
      "Digital Marketing Automation",
      "CPaaS alternative",
      "Contact center Saudi Arabia",
      "Data residency Saudi Arabia",
      "Arabic dialect NLP",
      "Social listening vs contact center",
      "PDPL",
      "local cloud Saudi Arabia",
      "Vision 2030",
      "CSAT",
      "NPS",
      "CRM",
      "Saudi Arabia",
      "Riyadh",
    ],
  },
  aiPolicy: {
    ar: "يمكن فهرسة المحتوى التسويقي العام لبحث الذكاء الاصطناعي والإجابات (ChatGPT وGemini وCopilot وClaude وPerplexity وDeepSeek وAmazon وMistral وYou.com وDuckDuckGo وxAI ومنصات LLM/بحث رئيسية أخرى).",
    en: "Public marketing content may be indexed for AI search and answers (ChatGPT, Gemini, Copilot, Claude, Perplexity, DeepSeek, Amazon, Mistral, You.com, DuckDuckGo, xAI, and other major LLM/search platforms).",
  },
})

const defaultNavigation = () => ({
  headerLeft: [
    { label: { ar: "الرئيسية", en: "Home" }, href: "/", enabled: true },
    { label: { ar: "معلومات عنا", en: "About Us" }, href: "/about-us", enabled: true },
  ],
  headerRight: [
    { label: { ar: "مقال", en: "Article" }, href: "/resources", enabled: true },
    { label: { ar: "الوظائف", en: "Careers" }, href: "/careers", enabled: true },
    { label: { ar: "كن شريكنا", en: "Become a Partner" }, href: "/become-a-partner", enabled: true },
    { label: { ar: "اتصل بنا", en: "Contact Us" }, href: "/contact-us", enabled: true },
  ],
  footerLinks: [
    { label: { ar: "الرئيسية", en: "Home" }, href: "/", enabled: true },
    { label: { ar: "معلومات عنا", en: "About Us" }, href: "/about-us", enabled: true },
    { label: { ar: "حلولنا", en: "Solutions" }, href: "/solutions", enabled: true },
    { label: { ar: "منتجاتنا", en: "Products" }, href: "/products", enabled: true },
    { label: { ar: "حالات الاستخدام", en: "Use Cases" }, href: "/use-cases", enabled: true },
    { label: { ar: "الوظائف", en: "Careers" }, href: "/careers", enabled: true },
    { label: { ar: "مقال", en: "Article" }, href: "/resources", enabled: true },
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
          ar: "المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي — أول منصة سحابية محلية متقدمة ومتوافقة مع نظام حماية البيانات الشخصية.",
          en: "is Saudi Arabia's premier AI-native customer experience (CX) platform — the first advanced local-cloud CX platform, PDPL-ready in Riyadh.",
        }),
      },
      sub1: {
        type: localizedSchema,
        default: () => ({
          ar: "LeapAI المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي تجمع مركز الاتصال الصوتي والرقمي، واتساب للأعمال، الشات بوت الذكي، حملات الرسائل، والتكامل مع سلة وزد وOdoo في مكان واحد. توفر المنصة 3 باقات تشغيل مرنة (149، 199، 299 ريال لكل مستخدم شهريًا) وتساعدك على تحسين زمن الاستجابة، أتمتة الرحلات، ومتابعة الأداء عبر لوحة موحدة، مع استضافة محلية متوافقة مع نظام حماية البيانات الشخصية ودعم رؤية 2030.",
          en: "LeapAI is Saudi Arabia's premier AI-native CX platform that unifies voice and digital contact center operations, WhatsApp Business, AI chatbots, campaign messaging, and integrations with Salla, Zid, and Odoo in one place. The platform offers 3 flexible plans (149, 199, and 299 SAR per user/month) and helps teams improve response time, automate journeys, and track measurable performance from one dashboard, with PDPL-ready local hosting aligned to Vision 2030.",
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
          ar: "LeapAI — المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي",
          en: "LeapAI — Saudi Arabia's premier AI-native CX platform",
        }),
      },
      metaDescription: {
        type: localizedSchema,
        default: () => ({
          ar: "LeapAI هي المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي: مركز اتصال متعدد القنوات، واتساب للأعمال، شات بوت ذكي، وتكاملات سلة وزد وOdoo — استضافة محلية في الرياض ومتوافقة مع نظام حماية البيانات الشخصية.",
          en: "LeapAI is Saudi Arabia's premier AI-native CX platform for omni-channel contact centers, WhatsApp Business, AI chatbots, and enterprise integrations — PDPL-ready local hosting in Riyadh.",
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
    geo: {
      llmsTagline: { type: localizedSchema, default: () => defaultGeoSettings().llmsTagline },
      llmsDescription: { type: localizedSchema, default: () => defaultGeoSettings().llmsDescription },
      categoryAnswer: { type: localizedSchema, default: () => defaultGeoSettings().categoryAnswer },
      capabilities: { type: localizedArraySchema, default: () => defaultGeoSettings().capabilities },
      categoryPositioning: { type: localizedSchema, default: () => defaultGeoSettings().categoryPositioning },
      citationGuidance: { type: localizedSchema, default: () => defaultGeoSettings().citationGuidance },
      knowsAbout: { type: localizedArraySchema, default: () => defaultGeoSettings().knowsAbout },
      aiPolicy: { type: localizedSchema, default: () => defaultGeoSettings().aiPolicy },
    },
    faq: {
      type: [faqItemSchema],
      default: () => [
        {
          question: { ar: "ما هي LeapAI؟", en: "What is LeapAI?" },
          answer: {
            ar: "LeapAI (ليب) هي المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي — أول منصة سحابية محلية متقدمة ومتوافقة مع نظام حماية البيانات الشخصية في الرياض. توفر حلول مراكز اتصال متعددة القنوات، واتساب للأعمال، شات بوت بالذكاء الاصطناعي، وأتمتة التسويق الرقمي لخدمة العملاء والاحتفاظ بهم.",
            en: "LeapAI is Saudi Arabia's premier AI-native customer experience (CX) platform — the first advanced local-cloud CX platform, PDPL-ready in Riyadh. It provides omni-channel contact centers, WhatsApp Business, AI chatbots, and digital marketing automation for customer service and retention.",
          },
        },
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

  if (settings.hero) {
    const nextLine2 = rewriteLocalizedCxCopy(settings.hero.line2)
    if (nextLine2) {
      settings.hero.line2 = nextLine2
      settings.markModified("hero")
      dirty = true
    }
    const nextSub1 = rewriteLocalizedCxCopy(settings.hero.sub1)
    if (nextSub1) {
      settings.hero.sub1 = nextSub1
      settings.markModified("hero")
      dirty = true
    }
  }

  if (settings.seo) {
    const nextTitle = rewriteLocalizedCxCopy(settings.seo.siteTitle)
    if (nextTitle) {
      settings.seo.siteTitle = nextTitle
      settings.markModified("seo")
      dirty = true
    }
    const nextDesc = rewriteLocalizedCxCopy(settings.seo.metaDescription)
    if (nextDesc) {
      settings.seo.metaDescription = nextDesc
      settings.markModified("seo")
      dirty = true
    }
  }

  const nextFaq = ensureAiNativeFaq(settings.faq)
  const faqChanged =
    nextFaq.length !== (settings.faq?.length ?? 0) ||
    nextFaq.some((item, i) => item.answer?.en !== settings.faq?.[i]?.answer?.en)
  if (faqChanged) {
    settings.faq = nextFaq as typeof settings.faq
    settings.markModified("faq")
    dirty = true
  }

  if (settings.navigation?.headerRight?.length || settings.navigation?.footerLinks?.length) {
    const headerMissingResources = (settings.navigation.headerRight ?? []).every((link) => link.href !== "/resources")
    const footerMissingResources = (settings.navigation.footerLinks ?? []).every((link) => link.href !== "/resources")
    const headerMissingCareers = (settings.navigation.headerRight ?? []).every((link) => link.href !== "/careers")
    const footerMissingCareers = (settings.navigation.footerLinks ?? []).every((link) => link.href !== "/careers")
    if (headerMissingResources || footerMissingResources || headerMissingCareers || footerMissingCareers) {
      let nextNav = settings.navigation
      if (headerMissingResources || footerMissingResources) {
        nextNav = ensureResourcesNav(nextNav) as typeof settings.navigation
      }
      if (headerMissingCareers || footerMissingCareers) {
        nextNav = ensureCareersNav(nextNav) as typeof settings.navigation
      }
      settings.navigation = nextNav
      settings.markModified("navigation")
      dirty = true
    }
  }

  const pricingCta = settings.ctaLabels?.pricing
  if (
    settings.ctaLabels &&
    pricingCta &&
    (OLD_HERO_CTA_AR.has(pricingCta.ar) || OLD_HERO_CTA_EN.has(pricingCta.en))
  ) {
    settings.ctaLabels.pricing = { ar: "حجز تجربة", en: "Book a demo" }
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
    geo: settings.geo ?? defaultGeoSettings(),
    updatedAt: settings.updatedAt,
  }
}
