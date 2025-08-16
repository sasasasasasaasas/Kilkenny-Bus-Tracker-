# BusTracker-HITL-Portal

Kiosk portal with live bus map, showroom stream, ads, taxi call, and HITL monitoring.

## Quickstart

- Node 18+
- In one terminal:
  - `npm install`
  - `npm run dev`
- Client: http://localhost:5173
- Server: http://localhost:4000

The server exposes:
- `GET /deals` — HTML fragments of submitted deals
- `POST /deals` — `{ deal: string }` to append a new deal
- `POST /events` — `{ timestamp, event }` pageview log
- `POST /taxi/request` — mock taxi request

Configure client with env:
- `VITE_API_URL` (default http://localhost:4000)
- `VITE_HLS_URL` (optional live stream)
