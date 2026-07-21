# LeapAI Website Platform

LeapAI monorepo for:
- Public website (Next.js)
- Admin CMS dashboard (`/dashboard`)
- Backend API (Express + MongoDB + Redis)

## Project Structure

- `frontend/` — Next.js 16 app (public pages + dashboard UI)
- `backend/` — Express API, auth, content/settings management, uploads
- `scripts/` — helper scripts (GEO verify, image import, local CMS start)
- `docker-compose.yml` — MongoDB + Redis + backend + frontend

## Local URLs

Without `NEXT_PUBLIC_BASE_PATH`:

- Website: `http://localhost:3000`
- Dashboard: `http://localhost:3000/dashboard`
- Dashboard login: `http://localhost:3000/dashboard/login`
- Backend API: `http://localhost:4000`
- Same-origin proxy: `http://localhost:3000/backend/...`

With `NEXT_PUBLIC_BASE_PATH=/leap-ai`:

- Website: `http://localhost:3000/leap-ai`
- Dashboard login: `http://localhost:3000/leap-ai/dashboard/login`
- Same-origin proxy: `http://localhost:3000/leap-ai/backend/...`

## Admin Credentials (default)

- Email: `admin@leapai.ai`
- Password: `admin123`

---

## Quick Start (PM2 + Docker — recommended for local dev)

Run **MongoDB and Redis in Docker**, and **frontend + backend with PM2** on the host.

### 1) Install dependencies

```powershell
cd backend
npm install

cd ../frontend
npm install
```

Install PM2 globally if needed:

```powershell
npm install -g pm2
```

### 2) Configure env files

`backend/.env`:

```env
PORT=4000
MONGODB_URI=mongodb://leap:leapsecret@localhost:27017/leapai?authSource=admin
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-jwt-secret-change-in-production
CORS_ORIGIN=http://localhost:3000
ADMIN_EMAIL=admin@leapai.ai
ADMIN_PASSWORD=admin123
```

`frontend/.env` (same-origin proxy + optional subpath):

```env
NEXT_PUBLIC_API_URL=/backend
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_BASE_PATH=/leap-ai
API_URL=http://localhost:4000
INTERNAL_API_URL=http://localhost:4000
```

For plain local URLs without a subpath, omit `NEXT_PUBLIC_BASE_PATH` and set:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3) Start MongoDB and Redis

```powershell
docker compose up -d mongodb redis
```

Stop the Docker app containers if they are running (PM2 needs ports 3000 and 4000):

```powershell
docker compose stop backend frontend
```

### 4) Seed the database (first run only)

```powershell
cd backend
npm run seed
```

### 5) Start frontend and backend with PM2

From the project root:

```powershell
pm2 start ecosystem.config.cjs
pm2 save
```

Useful PM2 commands:

```powershell
pm2 list
pm2 logs
pm2 restart all
pm2 stop all
```

After a reboot:

```powershell
docker compose up -d mongodb redis
pm2 start ecosystem.config.cjs
```

Verify:

- API health: `http://localhost:3000/leap-ai/backend/api/public/health` (or `/backend/api/public/health` without base path)
- Login: `http://localhost:3000/leap-ai/dashboard/login`

---

## Quick Start (Docker — full stack)

```powershell
docker compose up --build -d
```

- Site: `http://localhost:3000`
- API health: `http://localhost:3000/backend/api/public/health`

---

## Quick Start (No Docker)

Use this only for a quick backend-only test with an in-memory database.

### 1) Install dependencies

```powershell
cd backend
npm install

cd ../frontend
npm install
```

### 2) Start backend

```powershell
cd backend
npm run dev:local
```

### 3) Start frontend

```powershell
cd frontend
npm run dev
```

Set `frontend/.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Notes

- Docker browser calls use `/backend` (proxied to the backend container) to avoid CORS issues.
- With PM2, the frontend proxies `/backend` to `http://localhost:4000` via `frontend/next.config.mjs`.
- Optional subpath hosting: set `NEXT_PUBLIC_BASE_PATH=/leap-ai` in frontend env/build args.
- Public assets and logos must use the base path when `NEXT_PUBLIC_BASE_PATH` is set.
- Content and settings are managed from `/dashboard` when the backend is running.

---

## GEO — How It Works

> **Simple guide (no programming):** see [docs/HOW-TO-USE-GEO.md](docs/HOW-TO-USE-GEO.md)

**GEO (Generative Engine Optimization)** helps AI search tools (ChatGPT, Perplexity, Claude, Google AI, etc.) discover, understand, and cite the LeapAI site accurately.

You do **not** install AI bots manually. The site exposes structured public content and crawler rules so bots can read it when the site is live on a public domain.

### What happens at runtime

```mermaid
flowchart LR
  subgraph crawlers [AI crawlers]
    GPTBot
    ClaudeBot
    PerplexityBot
  end

  subgraph public [Public endpoints]
    robots["/robots.txt"]
    llms["/llms.txt"]
    llmsFull["/llms-full.txt"]
    sitemap["/sitemap.xml"]
    pages["Public pages + JSON-LD"]
  end

  subgraph blocked [Blocked from indexing]
    dash["/dashboard/*"]
    api["/api/*"]
  end

  crawlers --> robots
  crawlers --> llms
  crawlers --> llmsFull
  crawlers --> sitemap
  crawlers --> pages
  crawlers -.->|disallowed| dash
  crawlers -.->|disallowed| api
```

### 1) Crawler access (`robots.txt`)

File: `frontend/app/robots.ts`

- **Allows** all public pages (`/`)
- **Blocks** admin and API routes (`/dashboard`, `/api`)
- Adds explicit **Allow** rules for AI user agents:
  - `GPTBot`, `ChatGPT-User`, `OAI-SearchBot`
  - `ClaudeBot`, `Claude-Web`, `anthropic-ai`
  - `PerplexityBot`, `Google-Extended`, and others
- Points crawlers to the sitemap and canonical host (`NEXT_PUBLIC_SITE_URL`)

### 2) LLM-readable site summaries (`llms.txt`)

Files: `frontend/app/llms/route.ts`, `frontend/app/llms-full/route.ts`, `frontend/lib/llms-handler.ts`, `frontend/lib/geo.ts`

| URL | Purpose |
|-----|---------|
| `/llms.txt` | Short plain-text summary for AI crawlers |
| `/llms-full.txt` | Extended version with FAQs |

Next.js rewrites in `frontend/next.config.mjs` map those `.txt` URLs to internal routes.

`buildLlmsTxt()` generates markdown-style text with:

- Company overview, contact, languages, location
- Core capabilities and pricing (Leap Space plans)
- Links to solutions, products, and use cases (from CMS nav content)
- Citation guidance (canonical URL + attribution)
- Sitemap link
- FAQs (full version only)

### 3) Structured data (JSON-LD)

Files: `frontend/lib/geo.ts`, `frontend/lib/geo-faq.ts`, `frontend/app/layout.tsx`, `frontend/app/page.tsx`, `frontend/lib/seo-content.ts`

Embedded schema.org data helps search and AI systems understand the business:

| Schema | Where |
|--------|-------|
| `Organization` | Global layout — logo, contact, social, `knowsAbout` topics |
| `WebSite` | Global layout |
| `SoftwareApplication` | Global layout — product category + pricing offers |
| `Corporation` | Global layout — company details |
| `FAQPage` (EN + AR) | Homepage — default FAQs or CMS FAQs from settings |
| `Question` / `Answer` | Solution, product, and use-case detail pages |

Homepage FAQ content comes from:

1. **CMS settings** (`/dashboard/settings`) when FAQs are configured
2. **Fallback defaults** in `frontend/lib/geo-faq.ts` (8 bilingual Q&A items)

The visible FAQ accordion lives in `frontend/components/geo/faq-section.tsx` at `/#faq` (linked from the footer).

### 4) Sitemap and metadata

- `frontend/app/sitemap.ts` includes `/llms.txt` and `/llms-full.txt`
- Root metadata in `frontend/lib/seo.ts` exposes geo hints (`geo:region`, `geo:placename`) and an alternate link to `/llms.txt`

### Key files

| File | Role |
|------|------|
| `frontend/lib/geo.ts` | JSON-LD builders + `buildLlmsTxt()` |
| `frontend/lib/geo-faq.ts` | Default bilingual FAQ items and `knowsAbout` topics |
| `frontend/components/geo/faq-section.tsx` | Homepage FAQ UI |
| `frontend/lib/llms-handler.ts` | Plain-text response for LLM routes |
| `frontend/app/robots.ts` | Crawler allow/block rules |
| `scripts/verify-geo.ps1` | Automated local GEO checks |

### Verify locally

Start the frontend, then run:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/verify-geo.ps1
```

The script checks:

- `/llms.txt` contains `LeapAI`
- `/llms-full.txt` contains FAQs
- `/robots.txt` lists `GPTBot`
- `/sitemap.xml` includes `llms.txt`
- Homepage includes `FAQPage` JSON-LD and `#faq` section
- A detail page includes `Question` schema

If you use `NEXT_PUBLIC_BASE_PATH=/leap-ai`, open the site at `http://localhost:3000/leap-ai` first, or update the `$base` variable in `scripts/verify-geo.ps1` to include the prefix.

### Verify on production

After deploy, confirm these live URLs (adjust domain and base path):

- `https://your-domain.com/robots.txt`
- `https://your-domain.com/llms.txt`
- `https://your-domain.com/llms-full.txt`
- `https://your-domain.com/sitemap.xml`

AI indexing is not instant — crawlers may take days or weeks to pick up changes. Keep public pages allowed and admin routes blocked.

### Edit GEO content

| What to change | Where |
|----------------|-------|
| Default FAQs | `frontend/lib/geo-faq.ts` or CMS → Settings |
| LLM summary text | `buildLlmsTxt()` in `frontend/lib/geo.ts` |
| Allowed/blocked bots | `frontend/app/robots.ts` |
| Organization / product schema | `frontend/lib/geo.ts` + CMS settings (logo, contact, social) |
