/** PM2: frontend + backend on the host; MongoDB + Redis via Docker. */
const path = require("path")

const PRODUCTION_SITE = "https://leapai-webhook.bab.solutions/leap-ai"

module.exports = {
  apps: [
    {
      name: "leap-backend",
      cwd: path.join(__dirname, "backend"),
      script: path.join(__dirname, "backend/node_modules/tsx/dist/cli.mjs"),
      args: "watch src/index.ts",
      interpreter: "node",
      env: {
        NODE_ENV: "development",
        CORS_ORIGIN: "http://localhost:3000,http://localhost:3000/leap-ai",
      },
      env_production: {
        NODE_ENV: "production",
        CORS_ORIGIN: `https://leapai-webhook.bab.solutions,${PRODUCTION_SITE}`,
        ENFORCE_PROD_SECRETS: "true",
      },
      max_restarts: 10,
      restart_delay: 3000,
    },
    {
      name: "leap-frontend",
      cwd: path.join(__dirname, "frontend"),
      script: path.join(__dirname, "frontend/node_modules/next/dist/bin/next"),
      args: "dev -p 3000",
      interpreter: "node",
      env: {
        NODE_ENV: "development",
        PORT: "3000",
        NEXT_PUBLIC_BASE_PATH: "/leap-ai",
        NEXT_PUBLIC_API_URL: "/backend",
        NEXT_PUBLIC_SITE_URL: "http://localhost:3000/leap-ai",
        API_URL: "http://localhost:4000",
        INTERNAL_API_URL: "http://localhost:4000",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: "3000",
        NEXT_PUBLIC_BASE_PATH: "/leap-ai",
        NEXT_PUBLIC_API_URL: "/backend",
        NEXT_PUBLIC_SITE_URL: PRODUCTION_SITE,
        API_URL: "http://localhost:4000",
        INTERNAL_API_URL: "http://localhost:4000",
      },
      max_restarts: 10,
      restart_delay: 3000,
    },
    {
      name: "leap-frontend-prod",
      cwd: path.join(__dirname, "frontend"),
      script: path.join(__dirname, "frontend/node_modules/next/dist/bin/next"),
      args: "start -p 3000",
      interpreter: "node",
      autorestart: true,
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        NEXT_PUBLIC_BASE_PATH: "/leap-ai",
        NEXT_PUBLIC_API_URL: "/backend",
        NEXT_PUBLIC_SITE_URL: PRODUCTION_SITE,
        API_URL: "http://localhost:4000",
        INTERNAL_API_URL: "http://localhost:4000",
      },
      max_restarts: 10,
      restart_delay: 3000,
    },
  ],
}
