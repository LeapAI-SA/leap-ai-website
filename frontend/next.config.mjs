/** @type {import('next').NextConfig} */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "")
const backendUrl = process.env.API_URL ?? process.env.INTERNAL_API_URL ?? "http://localhost:4000"

const nextConfig = {
  output: "standalone",
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      { source: "/llms.txt", destination: "/llms" },
      { source: "/llms-full.txt", destination: "/llms-full" },
      { source: "/llms-small.txt", destination: "/llms-small" },
      { source: "/.well-known/ai.txt", destination: "/ai-txt" },
      { source: "/backend/:path*", destination: `${backendUrl}/:path*` },
    ]
  },
}

export default nextConfig
