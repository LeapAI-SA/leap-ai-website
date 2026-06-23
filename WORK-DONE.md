# LeapAI Website — Work Done

Summary of changes and improvements made to the LeapAI monorepo (public site + CMS dashboard + backend API).

---

## Project structure

| Folder | Purpose |
|--------|---------|
| `frontend/` | Next.js 16 app — public site + admin dashboard at `/dashboard` |
| `backend/` | Express + MongoDB + Redis API |
| `docker-compose.yml` | MongoDB, Redis, backend (4000), frontend (3000) |
| `scripts/` | Utility scripts (images, GEO verification, CMS startup) |

---

## 1. Style & layout parity (leapai.ai)

- Added shared layout components:
  - `SitePageShell`, `SectionHeading`, `PageSection`, `ContentCard`
- Refactored all public page content components to use the unified shell
- Moved **Voice Bot** to its own nav group (`ai-voice-bot`) in CMS seed and `site-data.ts`

---

## 2. Images on pages

- Downloaded **26 images** from leapai.ai into `frontend/public/pages/`
- Added fallback OG images for products missing `og:image`
- New files:
  - `frontend/lib/page-images.ts`
  - `scripts/download-page-images.ps1`
  - `scripts/inject-seed-images.mjs`
- Wired images in CMS seed, list cards, detail pages, and about page
- Backend sync script updated to include `image` field

---

## 3. SEO fixes

- Fixed duplicate titles (`| LeapAI | LeapAI`) using `title: { absolute: fullTitle }` in `seo.ts`
- Canonical and OG URLs use `getSiteUrl()` from `NEXT_PUBLIC_SITE_URL`
- Default OG image: `/hero-dashboard.png`
- JSON-LD on list, static, and detail pages via `seo-content.ts`
- Added `manifest.ts` and `noindex` on dashboard routes
- Default site URL set to `http://localhost:3000` for local development

---

## 4. GEO — Generative Engine Optimization

So AI search engines (ChatGPT, Perplexity, Claude, etc.) can find and cite the site.

### New files

| File | Purpose |
|------|---------|
| `frontend/lib/geo-faq.ts` | 8 FAQ items (AR + EN) |
| `frontend/lib/geo.ts` | Organization, SoftwareApplication, Corporation schemas + `buildLlmsTxt()` |
| `frontend/components/geo/faq-section.tsx` | FAQ accordion on homepage |
| `frontend/app/llms/route.ts` | Short AI crawler summary (rewritten to `/llms.txt`) |
| `frontend/app/llms-full/route.ts` | Extended version with FAQs (rewritten to `/llms-full.txt`) |
| `frontend/lib/llms-handler.ts` | Shared LLM text response builder |
| `scripts/verify-geo.ps1` | Automated GEO checks |

### Updates

- `robots.ts` — explicit allow rules for GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.
- `layout.tsx` — global GEO schemas (Organization, WebSite, SoftwareApplication, Corporation)
- `page.tsx` — FAQ section + FAQPage JSON-LD (EN + AR)
- `seo-content.ts` — feature-based FAQ schema on detail pages
- `site-footer.tsx` — FAQ link (`/#faq`)
- `sitemap.ts` — added `/llms.txt` and `/llms-full.txt`

### Verify GEO

```powershell
powershell -ExecutionPolicy Bypass -File scripts/verify-geo.ps1
```

### AI bots instructions (simple)

- You do **not** install GPTBot or ClaudeBot manually.
- Make your site public on a real domain (not localhost).
- Confirm this page works on live site: `https://your-domain.com/robots.txt`.
- In `robots.txt`, confirm these entries exist:
  - `GPTBot`
  - `ChatGPT-User`
  - `OAI-SearchBot`
  - `ClaudeBot`
  - `PerplexityBot`
- Keep public pages allowed and admin routes blocked:
  - `Allow: /`
  - `Disallow: /dashboard/`
  - `Disallow: /api/`
- Wait for crawling/indexing (usually days to weeks).
- Test live endpoints:
  - `https://your-domain.com/llms.txt`
  - `https://your-domain.com/llms-full.txt`
  - `https://your-domain.com/sitemap.xml`
  - `https://your-domain.com/robots.txt`

---

## 5. Build fix (static generation without backend)

**Problem:** `npm run build` hung for 60+ seconds when the backend API was not running.

**Solution:**

- Added `isBuildPhase()` in `frontend/lib/api-url.ts` — skips CMS/API fetches during `next build`
- Public API functions return static fallbacks immediately during build
- Hardened `fetchWithTimeout` with `Promise.race` (3s cap) for runtime
- `SKIP_CMS_FETCH=true` in frontend Dockerfile builder stage
- Sitemap uses static `site-data.ts` (no API)

**Result:** 47/47 pages generate in ~2 seconds without backend.

---

## 6. Local CMS without Docker

**Problem:** Dashboard showed **"Failed to fetch"** because backend was not running and Docker Desktop was unavailable.

**Solution:**

- Added `mongodb-memory-server` for in-memory MongoDB (no Docker required)
- New backend scripts:
  - `npm run dev:local` — start API with in-memory DB + auto-seed
  - `npm run seed:local` — seed in-memory DB manually
- Auto-seed on startup when `USE_MEMORY_DB=true` (admin + 29 content items)
- Redis connection fails fast so backend starts without Redis
- `scripts/start-cms.ps1` — quick backend startup helper

### Start locally (no Docker)

```powershell
# Terminal 1 — backend
cd backend
npm run dev:local

# Terminal 2 — frontend
cd frontend
npm run build
npm run start
```

**Login:** `admin@leapai.ai` / `admin123`

> **Note:** In-memory data resets when you stop the backend. For persistent data, use Docker: `docker compose up -d`

---

## 7. Dashboard fixes

### Clearer API errors

- Replaced generic **"Failed to fetch"** with a message pointing to how to start the backend
- Settings page shows an error alert instead of infinite loading when API is down

### Content edit page crash

**Problem:** `/dashboard/content/[id]` showed **"This page couldn't load"** (500) when clicking Edit.

**Cause:** Edit page imported `ContentForm` from `new/page.tsx`, which broke Next.js client navigation in production.

**Fix:** Extracted `ContentForm` to `frontend/components/dashboard/content-form.tsx`

---

## 8. Environment variables

```env
# frontend/.env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# backend/.env
PORT=4000
MONGODB_URI=mongodb://leap:leapsecret@localhost:27017/leapai?authSource=admin
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-jwt-secret-change-in-production
CORS_ORIGIN=http://localhost:3000
ADMIN_EMAIL=admin@leapai.ai
ADMIN_PASSWORD=admin123
```

Inside Docker, frontend SSR uses `API_URL=http://backend:4000`.

---

## 9. Useful commands

```powershell
# Full stack (requires Docker Desktop)
docker compose up --build -d
cd backend; npm run sync

# Frontend build
cd frontend; npm run build

# GEO verification
powershell -ExecutionPolicy Bypass -File scripts/verify-geo.ps1

# Download page images from leapai.ai
powershell -ExecutionPolicy Bypass -File scripts/download-page-images.ps1

# Backend without Docker
cd backend; npm run dev:local
```

---

## 10. Key URLs (local)

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Public website |
| http://localhost:3000/dashboard | CMS admin |
| http://localhost:3000/dashboard/login | Admin login |
| http://localhost:3000/llms.txt | AI crawler summary |
| http://localhost:3000/llms-full.txt | Full AI summary + FAQs |
| http://localhost:4000 | Backend API |

---

## 11. Known issues

- **Docker Desktop** must be running for `docker compose`. If you see `500 Internal Server Error` from the Docker API, restart Docker Desktop.
- **`next start` warning:** With `output: "standalone"`, production can also be run as `node .next/standalone/server.js`.
- **In-memory backend:** Content IDs change after each restart — refresh the Content Library list after restarting `dev:local`.

---

## 12. Important files reference

```
frontend/
  lib/seo.ts, seo-content.ts, geo.ts, geo-faq.ts, page-images.ts, cms.ts, api.ts, api-url.ts
  app/llms/route.ts, llms-full/route.ts, sitemap.ts, robots.ts, layout.tsx, page.tsx
  lib/llms-handler.ts
  components/geo/faq-section.tsx, dashboard/content-form.tsx
  public/pages/*.png

backend/
  src/ensure-seeded.ts, config/db.ts, config/redis.ts, data/content-seed.json

scripts/
  verify-geo.ps1, download-page-images.ps1, inject-seed-images.mjs, start-cms.ps1
```

---

*Last updated: June 2026*
