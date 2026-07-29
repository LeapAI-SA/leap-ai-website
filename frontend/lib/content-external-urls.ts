/** Live product / demo URLs keyed by content slug. */
export const CONTENT_EXTERNAL_URLS: Record<string, string> = {
  "voice-bot": "https://voicebot.leapai.ai/",
}

export function resolveContentExternalUrl(slug: string): string | undefined {
  return CONTENT_EXTERNAL_URLS[slug]
}
