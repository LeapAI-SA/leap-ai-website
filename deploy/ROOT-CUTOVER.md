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

Docker frontend publishes on host port **`${FRONTEND_HOST_PORT:-3002}`** (local default **3002**). On production set `FRONTEND_HOST_PORT=3000` in the root `.env` so nginx can use:

```nginx
proxy_pass http://127.0.0.1:3000;
```

Apply sample [`nginx-root-hosting.conf`](nginx-root-hosting.conf), or patch an existing site config:

```bash
sudo bash deploy/apply-nginx-3000.sh
# or: sudo nginx -t && sudo systemctl reload nginx
```

If nginx still points at `:3001` while Docker is on `:3000` (or the reverse), `https://leapai.ai` will return **502**.

### 3a. Kill WordPress under `/en` (required)

Public traffic must never hit PHP/WordPress. Legacy `/en/*` is handled by Next.js ([`frontend/lib/legacy-redirects.mjs`](../frontend/lib/legacy-redirects.mjs)).

On the Ubuntu host:

```bash
sudo bash deploy/kill-wordpress-en.sh
```

That script re-applies [`nginx-root-hosting.conf`](nginx-root-hosting.conf) (proxy everything to `:3000`), flags leftover `wp-config.php` / `php-fpm` configs, and smoke-checks that `/en/...` responses have no `wp-content` markers.

After deploy of the Next redirect map: unmapped `/en/*` → `/` (no soft-404 strip). Mapped WordPress slugs → `/solutions|products|use-cases/...`.

### 3b. www SSL (`ERR_CERT_COMMON_NAME_INVALID`)

Browsers require the live certificate SAN to include **both** `leapai.ai` and `www.leapai.ai`. Apex alone is not enough — `https://www.leapai.ai` will fail TLS before any redirect runs.

Canonical host is **apex** (`https://leapai.ai`). After TLS succeeds, www must **301** to apex.

On the Ubuntu host that holds the Let’s Encrypt cert / nginx site:

```bash
git pull
sudo bash deploy/fix-www-ssl.sh
# optional: CERTBOT_EMAIL=ops@you.com sudo -E bash deploy/fix-www-ssl.sh
```

That script:

1. Runs `certbot` with `-d leapai.ai -d www.leapai.ai --expand`
2. Installs [`nginx-root-hosting.conf`](nginx-root-hosting.conf) (www HTTPS → `301 https://leapai.ai$request_uri`)
3. Reloads nginx

**Google HTTPS load balancer:** live responses include `Via: 1.1 google` and IP `34.117.172.39` (Google anycast). Browser TLS is decided **at the LB**, not only on the VM.

If Certbot on the VM succeeds but browsers still warn on www, expand the **Google-managed certificate** (domains `leapai.ai` + `www.leapai.ai`) and attach it to the HTTPS target proxy:

```bash
gcloud auth login
gcloud config set project YOUR_PROD_PROJECT   # not a unrelated/dev project
bash deploy/fix-www-ssl-gcp.sh
# optional: CERT_NAME=leapai-ai-cert-www PROXY_NAME=your-https-proxy bash deploy/fix-www-ssl-gcp.sh
```

Console path: **Network services → Load balancing →** HTTPS load balancer → **Certificates** → create/replace managed cert with both hostnames → wait until status is **ACTIVE** (often 15–60+ minutes; DNS for both names must point at the LB).

Then still run `sudo bash deploy/fix-www-ssl.sh` on the Ubuntu backend so nginx **301**s www → apex after TLS succeeds.

Verify from any machine:

```powershell
powershell -ExecutionPolicy Bypass -File deploy/verify-www-ssl.ps1
```

```bash
bash deploy/verify-www-ssl.sh
```

Expected: apex `200`; www `301` to `https://leapai.ai/...` with **no** certificate name mismatch.

## 4. Verify

```powershell
powershell -ExecutionPolicy Bypass -File scripts/test-all.ps1
powershell -ExecutionPolicy Bypass -File scripts/verify-geo-production.ps1
powershell -ExecutionPolicy Bypass -File deploy/verify-www-ssl.ps1
```

All suites must pass with **0 failures**.

Confirm:

- `https://leapai.ai` canonical / og:url use `https://leapai.ai`
- `http://leapai.ai` and `https://www.leapai.ai` redirect to `https://leapai.ai` (www must not show a cert warning)
- Response includes `Strict-Transport-Security` and `Content-Security-Policy`
## 5. Post-cutover

- Resubmit sitemap in Google Search Console and Bing Webmaster: `https://leapai.ai/sitemap.xml` (must list **0** `/en/` URLs)
- After deploy of legacy redirects: `cd frontend && npm run seo:classify-en && npm run seo:verify-index && npm run seo:submit-indexnow && npm run seo:prepare-webmaster`
- Confirm `/en/r24` → `/products/ai-recruiter` (200) and unknown `/en/foo` → `/` (not a soft-404)
- Bing/GSC URL Removals only for URLs that still hard-404 after redirects
- Confirm GEO files contain `https://leapai.ai` URLs (not localhost or webhook host)
