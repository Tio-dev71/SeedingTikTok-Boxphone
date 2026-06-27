# Live Comment Control

Live Comment Control is an internal web application designed to help livestream operation teams manage comment scripts, receive manual posting reminders, coordinate staff, and track comment analytics without using bots or unapproved automation.

## System Architecture

- **Frontend:** React + TypeScript + Vite + TailwindCSS. Uses dark mode, glassmorphism UI for premium aesthetic.
- **Backend:** FastAPI + SQLAlchemy.
- **Database:** PostgreSQL 15.
- **Realtime:** WebSocket (placeholder in schema for reminder pushes).
- **Environment:** Docker Compose.

## Security & Compliance

- **NO AUTOMATION:** All comments must be manually typed/pasted by human operators into the TikTok app.
- **NO CREDENTIALS:** The system does not ask for or store TikTok account passwords.
- **NO BOTS:** Only internal API interactions.

## Quick Start (Local Dev)

1. **Prerequisites:** Docker and Docker Compose installed.
2. **Setup Env:**
   `cp .env.example .env`
3. **Run Services:**
   `docker compose up --build -d`
4. **Access the Application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Swagger Docs: http://localhost:8000/docs
5. **Seed Data:**
   The backend container automatically runs Alembic migrations and `app/seed.py` on startup to inject a demo session, comment templates, and internal test accounts (`admin@toolsseeding.local` / `admin123`).

## Project Structure

```
.
├── docker-compose.yml
├── .env.example
├── README.md
├── backend
│   ├── app
│   │   ├── api/routes
│   │   ├── core
│   │   ├── models
│   │   ├── schemas
│   │   ├── services
│   │   ├── main.py
│   │   └── seed.py
│   ├── alembic/
│   ├── alembic.ini
│   ├── Dockerfile
│   └── requirements.txt
└── frontend
    ├── src
    │   ├── components/
    │   ├── layouts/
    │   ├── lib/
    │   ├── pages/
    │   ├── types/
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── Dockerfile
    ├── package.json
    ├── tailwind.config.ts
    ├── tsconfig.json
    └── vite.config.ts
```
