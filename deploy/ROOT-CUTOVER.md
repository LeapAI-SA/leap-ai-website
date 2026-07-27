# Production cutover — site at domain root (`/`)

## 1. Environment

Root `.env` or server env (Docker Compose):

```env
NEXT_PUBLIC_SITE_URL=https://leapai-webhook.bab.solutions
NEXT_PUBLIC_BASE_PATH=
NEXT_PUBLIC_API_URL=/backend
CORS_ORIGIN=https://leapai-webhook.bab.solutions,http://localhost:3000/leap-ai
```

## 2. Deploy

```bash
git pull
docker compose up --build -d
```

Or PM2: `pm2 restart ecosystem.config.cjs --update-env`

## 3. Nginx

Apply [`nginx-root-hosting.conf`](nginx-root-hosting.conf): proxy `/` to Next.js; legacy `/leap-ai/*` redirects.

## 4. Verify

```powershell
powershell -ExecutionPolicy Bypass -File scripts/test-all.ps1
powershell -ExecutionPolicy Bypass -File scripts/verify-geo-production.ps1
```

All suites must pass with **0 failures**.

## 5. Post-cutover

- Resubmit sitemap in Google Search Console: `https://leapai-webhook.bab.solutions/sitemap.xml`
- Confirm GEO files contain production URLs (not `localhost`)
