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

- Website: `http://localhost:3000`
- Dashboard: `http://localhost:3000/dashboard`
- Dashboard login: `http://localhost:3000/dashboard/login`
- Backend API: `http://localhost:4000`
- GEO endpoints:
  - `http://localhost:3000/llms.txt`
  - `http://localhost:3000/llms-full.txt`
  - `http://localhost:3000/robots.txt`
  - `http://localhost:3000/sitemap.xml`

## Admin Credentials (default)

- Email: `admin@leapai.ai`
- Password: `admin123`

---

## Quick Start (No Docker)

Use this mode if Docker Desktop is unavailable.

### 1) Install dependencies

At repo root:

```powershell
npm install
```

In backend:

```powershell
cd backend
npm install
```

In frontend:

```powershell
cd frontend
npm install
```

### 2) Start backend with in-memory MongoDB

```powershell
cd backend
npm run dev:local
```

This auto-seeds admin/settings/content for quick testing.

### 3) Start frontend

Development:

```powershell
cd frontend
npm run dev
```

Production test:

```powershell
cd frontend
npm run build
npm run start
```

---

## Quick Start (Docker)

Requires Docker Desktop running.

```powershell
docker compose up --build -d
```

Optional content sync:

```powershell
cd backend
npm run sync
```

Stop stack:

```powershell
docker compose down
```

---

## Environment Variables

### Root `.env` (for compose)

See `.env.example`:
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `MONGODB_URI`
- `REDIS_URL`
- `NEXT_PUBLIC_API_URL`

### Frontend (`frontend/.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Backend (`backend/.env`)

```env
PORT=4000
MONGODB_URI=mongodb://leap:leapsecret@localhost:27017/leapai?authSource=admin
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-jwt-secret-change-in-production
CORS_ORIGIN=http://localhost:3000
ADMIN_EMAIL=admin@leapai.ai
ADMIN_PASSWORD=admin123
```

---

## GEO / AI Discoverability

This project includes GEO to help AI systems discover and cite content:

- `robots.txt` includes AI crawler rules (`GPTBot`, `ChatGPT-User`, `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`, etc.)
- `llms.txt` and `llms-full.txt` provide AI-friendly summaries
- JSON-LD schemas (Organization, FAQPage, SoftwareApplication, content schemas)
- GEO FAQ section on homepage

### Important

- You do **not** build/install bots yourself.
- Bots are external crawlers run by OpenAI/Anthropic/etc.
- Your job is to keep pages crawlable and structured.

### Verify GEO locally

```powershell
powershell -ExecutionPolicy Bypass -File scripts/verify-geo.ps1
```

---

## Common Scripts

Repo root:

```powershell
npm run dev
npm run build
npm run docker:up
npm run docker:down
npm run seed
npm run sync
```

Backend:

```powershell
npm run dev
npm run dev:local
npm run seed
npm run seed:local
npm run sync
```

Frontend:

```powershell
npm run dev
npm run build
npm run start
```

---

## Troubleshooting

- `Failed to fetch` in dashboard:
  - Backend is down. Start `backend` with `npm run dev:local`.
- Docker API 500 / daemon errors:
  - Restart Docker Desktop, then run `docker compose up -d`.
- `llms.txt` not found:
  - Rebuild frontend and ensure app routes are up to date.
- Port in use (`EADDRINUSE`):
  - Stop existing process on that port and restart the app.

---

## Notes

- In-memory backend mode (`dev:local`) resets data on restart.
- For persistent data, use Docker MongoDB + Redis.
- Detailed implementation history is in `WORK-DONE.md`.
