import type { GeoFaqItem } from "./geo-faq"

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function slugFile(text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48)
  return slug || "leapai-faq"
}

/** Opens a print window so the browser can Save as PDF (reliable for Arabic). */
export function printGeoFaqPdf(items: GeoFaqItem[], lang: "ar" | "en") {
  if (typeof window === "undefined" || items.length === 0) return

  const title =
    items.length === 1
      ? lang === "ar"
        ? items[0].question.ar
        : items[0].question.en
      : lang === "ar"
        ? "أسئلة LeapAI الشائعة (GEO)"
        : "LeapAI GEO FAQ"

  const blocks = items
    .map((item) => {
      const primaryQ = lang === "ar" ? item.question.ar : item.question.en
      const primaryA = lang === "ar" ? item.answer.ar : item.answer.en
      const secondaryQ = lang === "ar" ? item.question.en : item.question.ar
      const secondaryA = lang === "ar" ? item.answer.en : item.answer.ar
      return `
        <article class="item">
          <h2>${escapeHtml(primaryQ)}</h2>
          <p>${escapeHtml(primaryA)}</p>
          <h3 dir="${lang === "ar" ? "ltr" : "rtl"}">${escapeHtml(secondaryQ)}</h3>
          <p dir="${lang === "ar" ? "ltr" : "rtl"}">${escapeHtml(secondaryA)}</p>
        </article>`
    })
    .join("")

  const html = `<!DOCTYPE html>
<html lang="${lang}" dir="${lang === "ar" ? "rtl" : "ltr"}">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(`leapai-faq-${slugFile(title)}`)}</title>
  <style>
    @page { margin: 18mm; }
    body { font-family: "Segoe UI", Tahoma, Arial, sans-serif; color: #0f2744; line-height: 1.55; margin: 24px; }
    .brand { font-size: 13px; font-weight: 700; color: #c47a12; letter-spacing: .08em; text-transform: uppercase; }
    h1 { font-size: 22px; margin: 6px 0 4px; }
    .meta { color: #5b6b7c; font-size: 12px; margin-bottom: 24px; }
    .item { border-top: 1px solid #e5e7eb; padding: 16px 0; page-break-inside: avoid; }
    h2 { font-size: 16px; margin: 0 0 8px; }
    h3 { font-size: 13px; margin: 16px 0 6px; color: #5b6b7c; font-weight: 600; }
    p { margin: 0; white-space: pre-wrap; }
  </style>
</head>
<body>
  <p class="brand">LeapAI · leapai.ai</p>
  <h1>${escapeHtml(title)}</h1>
  <p class="meta">${escapeHtml(
    lang === "ar"
      ? "إجابة GEO — احفظ هذه الصفحة كملف PDF من نافذة الطباعة."
      : "GEO answer — save this page as PDF from the print dialog.",
  )}</p>
  ${blocks}
  <script>
    window.addEventListener("load", function () {
      setTimeout(function () { window.print(); }, 200);
    });
  </script>
</body>
</html>`

  const win = window.open("", "_blank", "noopener,noreferrer,width=900,height=700")
  if (!win) return
  win.document.open()
  win.document.write(html)
  win.document.close()
}

export function filterGeoFaq(items: GeoFaqItem[], query: string): GeoFaqItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return items
  return items.filter((item) =>
    [item.question.ar, item.question.en, item.answer.ar, item.answer.en].some((text) =>
      text.toLowerCase().includes(q),
    ),
  )
}
