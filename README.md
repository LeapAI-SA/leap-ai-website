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
- Same-origin proxy (Docker): `http://localhost:3000/backend/...`

## Admin Credentials (default)

- Email: `admin@leapai.ai`
- Password: `admin123`

---

## Quick Start (Docker — recommended)

```powershell
docker compose up --build -d
```

- Site: `http://localhost:3000`
- API health: `http://localhost:3000/backend/api/public/health`

---

## Quick Start (No Docker)

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
- Optional subpath hosting: set `NEXT_PUBLIC_BASE_PATH=/leap-ai` in frontend env/build args.
- Content and settings are managed from `/dashboard` when the backend is running.
