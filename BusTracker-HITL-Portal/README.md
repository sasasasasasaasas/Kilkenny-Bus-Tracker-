# BusTracker-HITL-Portal

A full-stack portal for bus tracking, showroom live stream, rotating ads with local notes, lost & found board, taxi call integration (Moová API or fallback), and a 25-product showroom with QR order links. Includes Human-in-the-Loop (HITL) monitoring endpoints and lightweight AI worker stubs.

## Features
- Live map embed on the Home page
- Live stream player (configurable via `config/stream_keys.json`)
- Rotating ads panel with local notes
- Lost & Found community board
- Taxi call button (Moová API integration with fallback)
- Product showroom (25 products) with per-product QR order links
- Simple HITL monitoring endpoints and AI stubs

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- AI Workers: Python stubs (optional)

## Monorepo Layout
- `client/`: React app
- `server/`: Express API
- `ai/`: Optional Python workers
- `docs/`: Documentation
- `config/`: Environment configs

## Quickstart

Prereqs:
- Node.js 18+
- npm 9+
- Python 3.9+ (optional, for AI workers)

1) Install dependencies
```bash
npm install
npm --prefix client install
```

2) Configure environment
- Edit `config/dev.env` as needed (ports, API tokens)
- Edit `config/stream_keys.json` for your stream embed

3) Run in development (client + server concurrently)
```bash
npm run dev
```
- Client: http://localhost:5173
- Server API: http://localhost:5000/api

4) Production build (client only)
```bash
npm run build
```

5) Start server (serves API; in production, also serves built client)
```bash
npm start
```

## API
See `docs/api.md`.

## HITL Policy
See `docs/hitl_policy.md`.

## Notes
- All server data is persisted to JSON files in `server/data/` for simplicity. Replace with a real DB as needed.
- The Moová API integration is stubbed; provide `MOOVA_API_URL` and `MOOVA_API_TOKEN` in env for real calls.