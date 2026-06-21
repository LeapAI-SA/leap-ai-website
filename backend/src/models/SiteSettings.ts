import mongoose, { Schema } from "mongoose"

const localizedSchema = new Schema(
  {
    ar: { type: String, default: "" },
    en: { type: String, default: "" },
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
    updatedAt: settings.updatedAt,
  }
}
