# API
Base URL: `/api`

## Ads
- GET `/ads` → List ads
- POST `/ads` → Create ad { title, imageUrl, linkUrl, startAt?, endAt?, tags? }
- PUT `/ads/:id` → Update ad
- DELETE `/ads/:id` → Delete ad
- POST `/ads/:id/view` → Increment view counter
- GET `/ads/random` → Random ad

## Products
- GET `/products` → List products (25 default)
- GET `/products/:id` → Get product
- POST `/products` → Create product { sku, title, description, price, imageUrl, orderLink }
- GET `/products/:id/qr` → PNG QR code for product order link

## Taxi
- POST `/taxi/request` → Request a taxi { pickup, destination?, passengerName?, phone? }
  - If `MOOVA_API_URL` and `MOOVA_API_TOKEN` set, uses Moová; otherwise returns mock

## HITL
- GET `/hitl/status` → Returns { status, incidents[], updatedAt }
- POST `/hitl/incident` → Creates incident { type, message, level?, meta? }
- DELETE `/hitl/incident/:id` → Removes incident

## Notes
- GET `/notes?type=note|lostfound` → List notes of a type
- POST `/notes` → Create { type, message, contact? }
- DELETE `/notes/:id` → Delete

## Stream
- GET `/stream/embed` → { embedUrl }