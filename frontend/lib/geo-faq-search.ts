import type { GeoFaqItem } from "./geo-faq"

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "am", "was", "be", "do", "does", "did", "i", "my", "me", "we", "our", "you", "your",
  "what", "which", "who", "how", "why", "when", "where", "can", "should", "will", "would", "could",
  "in", "on", "at", "for", "to", "of", "and", "or", "with", "by", "from", "about", "into", "so", "it", "its", "this", "that",
  "ما", "ماذا", "هي", "هو", "هل", "كيف", "اي", "ايه", "لماذا", "متي", "اين", "من", "في", "علي", "الي", "عن", "مع", "او", "ثم",
  "ان", "هذا", "هذه", "ذلك", "التي", "الذي", "لدي", "عند", "كل", "ل", "لـ", "و", "ب",
])

/** Brand, product, and Arabic/English aliases → one shared token. */
const SYNONYMS: Record<string, string> = {
  leap: "leapai",
  ليب: "leapai",
  باب: "bab",
  chatbot: "bot",
  chatbots: "bot",
  bots: "bot",
  شات: "bot",
  شاتبوت: "bot",
  بوت: "bot",
  روبوت: "bot",
  روبوتات: "bot",
  واتس: "whatsapp",
  واتساب: "whatsapp",
  whats: "whatsapp",
  سله: "salla",
  زد: "zid",
  اودو: "odoo",
  يونيفونك: "unifonic",
  لوسيديا: "lucidya",
  زندسك: "zendesk",
  جينيسيس: "genesys",
  تويليو: "twilio",
  تقنيات: "taqnyat",
  انفوبيب: "infobip",
  بديل: "alternative",
  بدائل: "alternative",
  بديلا: "alternative",
  alternate: "alternative",
  vs: "alternative",
  versus: "alternative",
  مقابل: "alternative",
  سعر: "price",
  اسعار: "price",
  تسعير: "price",
  تكلفه: "price",
  pricing: "price",
  prices: "price",
  cost: "price",
  رياض: "riyadh",
  جده: "jeddah",
  دمام: "dammam",
  مكه: "makkah",
  مدينه: "madinah",
  سعوديه: "saudi",
  سعودي: "saudi",
  ksa: "saudi",
  خليج: "gcc",
  امارات: "uae",
  بنك: "bank",
  بنوك: "bank",
  مصرف: "bank",
  مصارف: "bank",
  banking: "bank",
  مستشفي: "hospital",
  مستشفيات: "hospital",
  صوت: "voice",
  صوتي: "voice",
  صوتيه: "voice",
  هاتف: "phone",
  مكالمات: "call",
  مكالمه: "call",
  calls: "call",
}

function normalizeArabic(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
}

function stemToken(token: string): string {
  let t = token
  if (/^[\u0600-\u06ff]/.test(t)) {
    if (t.length > 4 && /^(وال|بال|فال|كال)/.test(t)) t = t.slice(3)
    else if (t.length > 3 && /^(ال|لل)/.test(t)) t = t.slice(2)
    return t
  }
  if (SYNONYMS[t]) return t
  if (t.length > 5 && t.endsWith("ing")) t = t.slice(0, -3)
  else if (t.length > 3 && t.endsWith("s") && !t.endsWith("ss")) t = t.slice(0, -1)
  return t
}

/** Search tokens for a query or document. `withSurface` also keeps pre-alias stems so partial typing still matches. */
export function searchTokens(text: string, withSurface = false): string[] {
  const words = normalizeArabic(text.toLowerCase())
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, " ")
    .split(" ")
    .filter(Boolean)
  const out: string[] = []
  for (const word of words) {
    if (STOPWORDS.has(word)) continue
    const stem = stemToken(word)
    if (!stem || STOPWORDS.has(stem)) continue
    const canonical = SYNONYMS[stem] ?? SYNONYMS[word] ?? stem
    out.push(canonical)
    if (withSurface && canonical !== stem) out.push(stem)
  }
  return out
}

type IndexedItem = {
  item: GeoFaqItem
  question: Set<string>
  answer: Set<string>
  length: number
}

const indexCache = new WeakMap<GeoFaqItem[], IndexedItem[]>()

function indexFor(items: GeoFaqItem[]): IndexedItem[] {
  const cached = indexCache.get(items)
  if (cached) return cached
  const index = items.map((item) => ({
    item,
    question: new Set(searchTokens(`${item.question.en} ${item.question.ar}`, true)),
    answer: new Set(searchTokens(`${item.answer.en} ${item.answer.ar}`, true)),
    length: item.question.en.length,
  }))
  indexCache.set(items, index)
  return index
}

function hasToken(set: Set<string>, token: string): boolean {
  if (set.has(token)) return true
  if (token.length < 3) return false
  for (const candidate of set) {
    if (candidate.startsWith(token)) return true
  }
  return false
}

/**
 * Word-based FAQ search: any word order, Arabic spelling variants (أ/ا, ة/ه, ال),
 * AR/EN aliases (ليب → LeapAI, شات بوت → chatbot). Question hits rank above answer hits.
 */
export function filterGeoFaq(items: GeoFaqItem[], query: string): GeoFaqItem[] {
  const tokens = [...new Set(searchTokens(query))]
  if (!query.trim()) return items
  if (!tokens.length) return []

  const scored = indexFor(items).map((entry) => {
    let score = 0
    let matched = 0
    for (const token of tokens) {
      if (hasToken(entry.question, token)) {
        score += 3
        matched += 1
      } else if (hasToken(entry.answer, token)) {
        score += 1
        matched += 1
      }
    }
    return { entry, score, matched }
  })

  const all = scored.filter((s) => s.matched === tokens.length)
  const minPartial = Math.max(1, Math.ceil(tokens.length / 2))
  const results = all.length ? all : scored.filter((s) => s.matched >= minPartial && s.score >= 3)

  return results
    .sort((a, b) => b.score - a.score || b.matched - a.matched || a.entry.length - b.entry.length)
    .map((s) => s.entry.item)
}
