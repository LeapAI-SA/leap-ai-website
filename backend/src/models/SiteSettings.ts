import mongoose, { Schema } from "mongoose"

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

const siteSettingsSchema = new Schema(
  {
    maintenanceMode: { type: Boolean, default: false },
    defaultLanguage: { type: String, enum: ["ar", "en"], default: "ar" },
    contact: {
      email: { type: String, default: "info@leapai.ai" },
      phone: { type: String, default: "+966 53 553 3627" },
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
          ar: "اختر الباقة التي تلبي احتياجك وابدأ مركز خدمة عملائك بكل سهولة وسرعة!",
          en: "Choose the plan that fits your needs and launch your customer service center easily and quickly!",
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
        default: () => ({ ar: "تحدث إلى مستشارنا", en: "Talk to Our Advisor" }),
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
          ar: "LeapAI هي منصة سعودية لتجربة العملاء تشمل مركز اتصال متعدد القنوات، واتساب للأعمال، شات بوت ذكي، وتكاملات أعمال.",
          en: "LeapAI is a Saudi customer experience platform for omni-channel contact center, WhatsApp Business, AI chatbot, and enterprise integrations.",
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

export async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne()
  if (!settings) {
    settings = await SiteSettings.create({})
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
    seo: settings.seo,
    faq: settings.faq,
    updatedAt: settings.updatedAt,
  }
}
