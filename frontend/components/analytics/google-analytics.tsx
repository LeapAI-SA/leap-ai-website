import Script from "next/script"

const DEFAULT_GA_MEASUREMENT_ID = "G-7NWB9C7RNB"

/** Resolved GA4 measurement id. Empty string disables gtag (local opt-out). */
export function getGaMeasurementId() {
  const raw = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  if (raw === undefined) return DEFAULT_GA_MEASUREMENT_ID
  return raw.trim()
}

/** Official gtag.js — shares the same dataLayer as GTM. */
export function GoogleAnalytics({ id }: { id: string }) {
  if (!id) return null
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');
      `}</Script>
    </>
  )
}
