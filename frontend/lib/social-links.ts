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

export function socialLinksForSchema(links?: Partial<SocialLinks> | null): string[] {
  return Object.values(mergeSocialLinks(links)).filter(Boolean)
}
