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
