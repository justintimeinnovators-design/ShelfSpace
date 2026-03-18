# analytics-service

CQRS-style analytics ingestion and read-model query service.

## Responsibilities

- Ingest event batches (`POST /api/analytics/events`)
- Serve dashboard-oriented projections:
  - `/api/analytics/dashboard/summary`
  - `/api/analytics/dashboard/reading-analytics`
  - `/api/analytics/dashboard/reading-goals`
  - `/api/analytics/dashboard/activity`

## Runtime

- Default port: `3008`
- Health endpoint: `/health`
- Route prefix: `/api/analytics`

## Environment Variables

- `PORT` (default `3008`)
- `MONGO_URI`
- `MONGO_DB`
- `USER_SERVICE_URL`

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run backfill
```

## Notes

- Protected by auth middleware before analytics routes.
- MongoDB connection and projection logic are in `src/db.ts` and `src/projections/`.

