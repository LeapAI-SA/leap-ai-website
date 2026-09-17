import { randomBytes } from "crypto"
import { isValidSlug } from "./validate.js"

const SLUG_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789"

/** Random URL slug (letters and digits only). Not derived from the title. */
export function randomSlug(length = 12): string {
  const bytes = randomBytes(length)
  let out = ""
  for (const byte of bytes) {
    out += SLUG_ALPHABET[byte % SLUG_ALPHABET.length]
  }
  return out
}

const ARABIC_MAP: Record<string, string> = {
  ا: "a",
  أ: "a",
  إ: "i",
  آ: "a",
  ء: "",
  ؤ: "o",
  ئ: "e",
  ب: "b",
  ت: "t",
  ث: "th",
  ج: "j",
  ح: "h",
  خ: "kh",
  د: "d",
  ذ: "dh",
  ر: "r",
  ز: "z",
  س: "s",
  ش: "sh",
  ص: "s",
  ض: "d",
  ط: "t",
  ظ: "z",
  ع: "a",
  غ: "gh",
  ف: "f",
  ق: "q",
  ك: "k",
  ل: "l",
  م: "m",
  ن: "n",
  ه: "h",
  و: "w",
  ي: "y",
  ى: "a",
  ة: "a",
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

const TASHKEEL_AND_TATWEEL = /[\u064B-\u065F\u0670\u0640]/g

function transliterateArabic(text: string): string {
  let out = ""
  for (const ch of text) {
    out += ARABIC_MAP[ch] ?? ch
  }
  return out
}

export function slugify(text: string): string {
  const raw = text.trim()
  if (!raw) return ""

  const latin = transliterateArabic(raw.replace(TASHKEEL_AND_TATWEEL, ""))
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")

  const slug = latin
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120)
    .replace(/-$/g, "")

  return slug
}

export function slugifyTitle(title: { ar?: unknown; en?: unknown }): string {
  const en = typeof title.en === "string" ? title.en.trim() : ""
  const ar = typeof title.ar === "string" ? title.ar.trim() : ""
  return slugify(en || ar) || randomSlug()
}

/** Return `base`, or `base-2`, `base-3`, … until `exists` is false. */
export async function uniqueContentSlug(
  base: string,
  exists: (slug: string) => Promise<unknown>,
): Promise<string> {
  const root = (isValidSlug(base) ? base : randomSlug()).slice(0, 120)
  let slug = root
  let n = 2
  while (await exists(slug)) {
    const suffix = `-${n++}`
    slug = `${root.slice(0, Math.max(1, 120 - suffix.length))}${suffix}`
  }
  return slug
}
