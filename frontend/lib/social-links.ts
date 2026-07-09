export type SocialLinks = {
  facebook: string
  twitter: string
  instagram: string
  youtube: string
  linkedin: string
}

/** Default links from https://leapai.ai/ footer */
export const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  facebook: "https://www.facebook.com/leapai_cx/",
  twitter: "https://twitter.com/leapai_cx",
  instagram: "https://www.instagram.com/leapai_cx/",
  youtube: "https://www.youtube.com/channel/UC4kmc62wjm7IjKlO6j28jlg",
  linkedin: "https://www.linkedin.com/company/leapai-sa/",
}

export type SocialPlatform = keyof SocialLinks

export const SOCIAL_PLATFORMS: {
  key: SocialPlatform
  label: string
  placeholder: string
}[] = [
  { key: "facebook", label: "Facebook", placeholder: "https://www.facebook.com/leapai_cx/" },
  { key: "twitter", label: "X (Twitter)", placeholder: "https://twitter.com/leapai_cx" },
  { key: "instagram", label: "Instagram", placeholder: "https://www.instagram.com/leapai_cx/" },
  { key: "youtube", label: "YouTube", placeholder: "https://www.youtube.com/channel/..." },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://www.linkedin.com/company/leapai-sa/" },
]

export function mergeSocialLinks(links?: Partial<SocialLinks> | null): SocialLinks {
  return { ...DEFAULT_SOCIAL_LINKS, ...links }
}

/** Allow only http(s) links — blocks javascript:, data:, etc. */
export function safeExternalUrl(url: string | undefined | null): string | null {
  if (!url?.trim()) return null
  try {
    const parsed = new URL(url.trim())
    if (parsed.protocol === "https:" || parsed.protocol === "http:") return parsed.href
  } catch {
    /* invalid */
  }
  return null
}

export function safeSocialLinks(links?: Partial<SocialLinks> | null): SocialLinks {
  const merged = mergeSocialLinks(links)
  return {
    facebook: safeExternalUrl(merged.facebook) ?? DEFAULT_SOCIAL_LINKS.facebook,
    twitter: safeExternalUrl(merged.twitter) ?? DEFAULT_SOCIAL_LINKS.twitter,
    instagram: safeExternalUrl(merged.instagram) ?? DEFAULT_SOCIAL_LINKS.instagram,
    youtube: safeExternalUrl(merged.youtube) ?? DEFAULT_SOCIAL_LINKS.youtube,
    linkedin: safeExternalUrl(merged.linkedin) ?? DEFAULT_SOCIAL_LINKS.linkedin,
  }
}

export function socialLinksForSchema(links?: Partial<SocialLinks> | null): string[] {
  return Object.values(mergeSocialLinks(links)).filter(Boolean)
}
