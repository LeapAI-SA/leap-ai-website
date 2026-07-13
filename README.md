# LeapAI Website (Static Frontend)

Next.js static website for LeapAI — public pages, SEO, and GEO optimization.

## Project Structure

- `frontend/` — Next.js 16 app (public site)
- `docker-compose.yml` — optional Docker deployment for the frontend

## Local URLs

- Website: `http://localhost:3000`
- GEO endpoints:
  - `http://localhost:3000/llms.txt`
  - `http://localhost:3000/llms-full.txt`
  - `http://localhost:3000/robots.txt`
  - `http://localhost:3000/sitemap.xml`

---

## Quick Start

### Install dependencies

```powershell
cd frontend
npm install
```

### Development

```powershell
cd frontend
npm run dev
```

### Production build

```powershell
cd frontend
npm run build
npm run start
```

Or from repo root:

```powershell
npm run build
npm run start
```

---

## Docker

```powershell
docker compose up --build -d
```

Site: `http://localhost:3000`

---

## Environment

Create `frontend/.env`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production, set `NEXT_PUBLIC_SITE_URL` to your live domain.

---

## Content

Public page content is sourced from static data in `frontend/lib/site-data.ts` and related CMS helpers with build-time fallbacks (`SKIP_CMS_FETCH=true` during Docker builds).

---

## Notes

- The `/dashboard` routes remain in the codebase but require a separate API to function for CMS editing.
- Set `NEXT_PUBLIC_SITE_URL` before deploying so canonical URLs, OG tags, and sitemap are correct.
