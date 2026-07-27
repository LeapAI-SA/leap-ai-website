import { ImageResponse } from "next/og"
import { resolveLogoDataUrl } from "@/lib/dynamic-icon"

export const runtime = "nodejs"
export const contentType = "image/png"
export const size = { width: 64, height: 64 }

export default async function Icon() {
  const logoDataUrl = await resolveLogoDataUrl()

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          borderRadius: "14px",
        }}
      >
        {logoDataUrl ? (
          // Leave padding so rectangular logos remain readable in tiny favicon sizes.
          <img src={logoDataUrl} alt="LeapAI" style={{ width: "78%", height: "78%", objectFit: "contain" }} />
        ) : (
          <div style={{ fontSize: 30, fontWeight: 700, color: "#0066b2" }}>L</div>
        )}
      </div>
    ),
    size,
  )
}
