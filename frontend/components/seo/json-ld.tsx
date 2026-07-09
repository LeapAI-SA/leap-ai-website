type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[]
}

/** Prevent </script> breakout when embedding JSON-LD in HTML. */
function safeJsonLd(data: JsonLdProps["data"]) {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  )
}
