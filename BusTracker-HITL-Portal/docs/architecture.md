# Architecture Overview

The system is a small monorepo with a React (Vite) client and an Express API server. Optional Python workers simulate AI/HITL processing.

- Client (Vite/React)
  - Pages: Home (map + live stream + ads + notes + taxi) and Showroom (products grid)
  - Components call the API via `/api/*` proxied in dev, same-origin in prod
- Server (Express)
  - Routes: `ads`, `products`, `taxi`, `hitl`, `notes`
  - JSON-file storage under `server/data/` for simplicity
  - Serves built client in production
- AI (Python)
  - `hitl_monitor.py`: simulates incidents
  - `ad_optimizer.py`: example utility to reorder ads by views
  - `anomaly_detector.py`: stdin JSON to severity score

## Data Flow
- Client fetches `/api/ads` and rotates display; each cycle posts `/api/ads/:id/view`
- Client fetches `/api/notes?type=note` and `/api/notes?type=lostfound`
- Client fetches `/api/products`, renders grid; per-item QR at `/api/products/:id/qr`
- Client calls `/api/taxi/request` to request a ride (Moová or mock)
- Live stream embed URL at `/api/stream/embed` is derived from `config/stream_keys.json`

## Configuration
- `config/dev.env` and `config/prod.env` for server env vars
- `config/stream_keys.json` for stream provider and stream id

## Production
- Build client: `npm run build`
- Start server: `npm start`
- Server will statically serve `client/dist` if it exists