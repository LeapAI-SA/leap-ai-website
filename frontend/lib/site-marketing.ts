import { pricingPlans, type PricingPlan } from "./site-data"

export type PartnerLogo = {
  name: string
  logo: string
  enabled?: boolean
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

export function mergePartners(partners?: PartnerLogo[] | null): PartnerLogo[] {
  return partners?.length ? partners : DEFAULT_PARTNERS
}

export function mergePricingPlans(plans?: PricingPlan[] | null): PricingPlan[] {
  return plans?.length ? plans : DEFAULT_PRICING_PLANS
}

export function activePartners(partners: PartnerLogo[]): PartnerLogo[] {
  return partners.filter((p) => p.enabled !== false && p.name && p.logo)
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
