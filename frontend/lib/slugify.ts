/** Minimal Arabic → Latin map for URL-friendly slugs. */
const ARABIC_MAP: Record<string, string> = {
  "ا": "a",
  "أ": "a",
  "إ": "i",
  "آ": "a",
  "ء": "",
  "ؤ": "o",
  "ئ": "e",
  "ب": "b",
  "ت": "t",
  "ث": "th",
  "ج": "j",
  "ح": "h",
  "خ": "kh",
  "د": "d",
  "ذ": "dh",
  "ر": "r",
  "ز": "z",
  "س": "s",
  "ش": "sh",
  "ص": "s",
  "ض": "d",
  "ط": "t",
  "ظ": "z",
  "ع": "a",
  "غ": "gh",
  "ف": "f",
  "ق": "q",
  "ك": "k",
  "ل": "l",
  "م": "m",
  "ن": "n",
  "ه": "h",
  "و": "w",
  "ي": "y",
  "ى": "a",
  "ة": "a",
  "\u0660": "0",
  "\u0661": "1",
  "\u0662": "2",
  "\u0663": "3",
  "\u0664": "4",
  "\u0665": "5",
  "\u0666": "6",
  "\u0667": "7",
  "\u0668": "8",
  "\u0669": "9",
}

function transliterateArabic(text: string): string {
  let out = ""
  for (const ch of text) {
    out += ARABIC_MAP[ch] ?? ch
  }
  return out
}

/** Lowercase kebab-case slug: letters, digits, hyphens only. */
export function slugify(text: string): string {
  const raw = text.trim()
  if (!raw) return ""

  const latin = transliterateArabic(raw)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")

  return latin
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

/** Prefer English title for URLs; fall back to Arabic. */
export function slugifyTitle(title: { ar?: string; en?: string }): string {
  const en = title.en?.trim() ?? ""
  const ar = title.ar?.trim() ?? ""
  return slugify(en || ar)
}
