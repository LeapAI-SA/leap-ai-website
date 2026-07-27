import { ImageResponse } from "next/og"
import { resolveLogoDataUrl } from "@/lib/dynamic-icon"

export const runtime = "nodejs"
export const contentType = "image/png"
export const size = { width: 180, height: 180 }

export default async function AppleIcon() {
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
          borderRadius: "40px",
        }}
      >
        {logoDataUrl ? (
          <img src={logoDataUrl} alt="LeapAI" style={{ width: "80%", height: "80%", objectFit: "contain" }} />
        ) : (
          <div style={{ fontSize: 72, fontWeight: 700, color: "#0066b2" }}>L</div>
        )}
      </div>
    ),
    size,
  )
}
