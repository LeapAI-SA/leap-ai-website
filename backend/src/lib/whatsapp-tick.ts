/** CMS/Mongo may still store the old “green WhatsApp mark” copy. */
export function rewriteWhatsAppTickCopy(text: string): string {
  return text
    .replaceAll("العلامة الخضراء", "العلامة الزرقاء")
    .replaceAll("Green badge verification", "Blue Tick verification")
    .replaceAll("Green Tick verification", "Blue Tick verification")
    .replaceAll("green badge verification", "Blue Tick verification")
    .replaceAll("green tick verification", "Blue Tick verification")
}

export function rewriteFeatureList(features: string[] | undefined): string[] {
  return (features ?? []).map(rewriteWhatsAppTickCopy)
}

export function rewritePricingPlansCopy<T extends { features?: { ar?: string[]; en?: string[] } }>(
  plans: T[] | undefined | null,
): T[] {
  return (plans ?? []).map((plan) => ({
    ...plan,
    features: {
      ar: rewriteFeatureList(plan.features?.ar),
      en: rewriteFeatureList(plan.features?.en),
    },
  }))
}
