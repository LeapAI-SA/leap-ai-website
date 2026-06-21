/** Default cover image per content slug (public paths). */
export const PAGE_IMAGES: Record<string, string> = {
  "digital-channels": "/pages/digital-channels.png",
  crm: "/pages/crm.png",
  "quality-management": "/pages/quality-management.png",
  "realtime-dashboard": "/pages/realtime-dashboard.png",
  "whatsapp-business": "/pages/whatsapp-business.png",
  "google-rcs": "/pages/google-rcs.png",
  "apple-messages": "/pages/apple-messages.png",
  "nlu-chatbot": "/pages/nlu-chatbot.png",
  "genai-chatbot": "/pages/genai-chatbot.png",
  "voice-bot": "/pages/voice-bot.png",
  "customer-journey": "/pages/customer-journey.png",
  cdp: "/pages/cdp.png",
  "whatsapp-campaigns": "/pages/whatsapp-campaigns.png",
  "leap-survey": "/pages/leap-survey.png",
  "digital-invoices": "/pages/digital-invoices.png",
  "whatsapp-invitations": "/pages/whatsapp-invitations.png",
  "chatbot-tree": "/pages/chatbot-tree.png",
  "whatsapp-officer": "/pages/whatsapp-officer.png",
  "recommendation-engine": "/pages/recommendation-engine.png",
  "ai-recruiter": "/pages/ai-recruiter.png",
  "ai-parking": "/pages/ai-parking.png",
  "leap-ticketing": "/pages/leap-ticketing.png",
  "complaints-automation": "/pages/complaints-automation.png",
  retail: "/pages/retail.png",
  telecom: "/pages/telecom.png",
  banking: "/pages/banking.png",
  healthcare: "/pages/healthcare.png",
  insurance: "/pages/insurance.png",
  "travel-hospitality": "/pages/travel-hospitality.png",
}

export function resolveContentImage(slug: string, cmsImage?: string): string {
  if (cmsImage) return cmsImage
  return PAGE_IMAGES[slug] ?? "/sections/omni-channel.png"
}
