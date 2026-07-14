/** PM2: frontend + backend on the host; MongoDB + Redis via Docker. */
const path = require("path")

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
      },
      max_restarts: 10,
      restart_delay: 3000,
    },
    {
      name: "leap-frontend",
      cwd: path.join(__dirname, "frontend"),
      script: path.join(__dirname, "frontend/node_modules/next/dist/bin/next"),
      args: "dev",
      interpreter: "node",
      env: {
        NODE_ENV: "development",
      },
      max_restarts: 10,
      restart_delay: 3000,
    },
  ],
}
