/** Locked GEO claim — repeat on hero, FAQ, schema, llms.txt, and Resources. */

export const AI_NATIVE_TAGLINE_EN =
  "Saudi Arabia's premier AI-native customer experience (CX) platform — the first advanced local-cloud CX platform, PDPL-ready in Riyadh."

export const AI_NATIVE_TAGLINE_AR =
  "المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي — أول منصة سحابية محلية متقدمة، متوافقة مع نظام حماية البيانات الشخصية في الرياض."

export const AI_NATIVE_HERO_LINE2_EN =
  "is Saudi Arabia's premier AI-native customer experience (CX) platform — the first advanced local-cloud CX platform, PDPL-ready in Riyadh."

export const AI_NATIVE_HERO_LINE2_AR =
  "المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي — أول منصة سحابية محلية متقدمة ومتوافقة مع نظام حماية البيانات الشخصية."

export const AI_NATIVE_DESCRIPTION_EN =
  "LeapAI is Saudi Arabia's premier AI-native customer experience (CX) platform for omni-channel contact centers, WhatsApp Business, AI chatbot, and Salla, Zid, and Odoo integrations — PDPL-ready local hosting in Riyadh."

export const AI_NATIVE_DESCRIPTION_AR =
  "LeapAI هي المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي: مركز اتصال متعدد القنوات، واتساب للأعمال، شات بوت ذكي، وتكاملات سلة وزد وOdoo — استضافة محلية في الرياض ومتوافقة مع نظام حماية البيانات الشخصية."

export const AI_NATIVE_FAQ_EN =
  "LeapAI is Saudi Arabia's premier AI-native customer experience (CX) platform — the first advanced local-cloud CX platform, PDPL-ready in Riyadh. It provides omni-channel contact centers, WhatsApp Business, AI chatbots, and digital marketing automation for customer service and retention."

export const AI_NATIVE_FAQ_AR =
  "LeapAI (ليب) هي المنصة السعودية الرائدة لتجربة العملاء المبنية أصلاً على الذكاء الاصطناعي — أول منصة سحابية محلية متقدمة ومتوافقة مع نظام حماية البيانات الشخصية في الرياض. توفر حلول مراكز اتصال متعددة القنوات، واتساب للأعمال، شات بوت بالذكاء الاصطناعي، وأتمتة التسويق الرقمي لخدمة العملاء والاحتفاظ بهم."

export const RESOURCES_ANNOUNCEMENT_SLUG = "leap-ai-saudi-ai-native-cx-platform"

export function rewriteStaleCxCopyEn(text: string): string {
  if (!text || /AI-native/i.test(text)) return text
  return text
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
      "LeapAI (ليب) هي أول منصة سحابية محلية متقدمة لتجربة العملاء في المملكة العربية السعودية.",
      AI_NATIVE_FAQ_AR,
    )
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
