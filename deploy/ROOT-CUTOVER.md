# Production cutover — site at domain root on https://leapai.ai

## 1. Environment

Root `.env` or server env (Docker Compose):

```env
NEXT_PUBLIC_SITE_URL=https://leapai.ai
NEXT_PUBLIC_BASE_PATH=
NEXT_PUBLIC_API_URL=/backend
CORS_ORIGIN=https://leapai.ai,https://leapai-webhook.bab.solutions
```

Rebuild the frontend after changing `NEXT_PUBLIC_SITE_URL` so canonical, sitemap, and GEO URLs bake correctly.

## 2. Deploy

```bash
git pull
docker compose up --build -d
```

Or PM2: `pm2 restart ecosystem.config.cjs --update-env`

## 3. Nginx

Apply [`nginx-root-hosting.conf`](nginx-root-hosting.conf): HTTP→HTTPS, www→apex, HSTS, proxy `/` to Next.js. Then `nginx -t && systemctl reload nginx`.

## 4. Verify

```powershell
powershell -ExecutionPolicy Bypass -File scripts/test-all.ps1
powershell -ExecutionPolicy Bypass -File scripts/verify-geo-production.ps1
```

All suites must pass with **0 failures**.

Confirm:

- `https://leapai.ai` canonical / og:url use `https://leapai.ai`
- `http://leapai.ai` and `https://www.leapai.ai` redirect to `https://leapai.ai`
- Response includes `Strict-Transport-Security` and `Content-Security-Policy`

## 5. Post-cutover

- Resubmit sitemap in Google Search Console: `https://leapai.ai/sitemap.xml`
- Confirm GEO files contain `https://leapai.ai` URLs (not localhost or webhook host)
