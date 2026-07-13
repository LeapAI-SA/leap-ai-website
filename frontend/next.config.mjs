/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
    // Add these two lines
    basePath: "/leap-ai",
    assetPrefix: "/leap-ai",
    
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
    ]
  },
}

export default nextConfig
