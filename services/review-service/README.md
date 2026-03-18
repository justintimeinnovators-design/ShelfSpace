# review-service

Provides review CRUD and query endpoints.

## Responsibilities

- Create/update/delete reviews (authenticated)
- Query reviews by book, user, and review ID
- Forward analytics events (best-effort)

## Runtime

- Default port: `3002`
- Health endpoint: `/health`
- Route prefix: `/api/reviews`

## Environment Variables

- `PORT` (default `3002`)
- `DATABASE_URL` (PostgreSQL)
- `USER_SERVICE_URL`
- `BOOK_SERVICE_URL`
- `ANALYTICS_SERVICE_URL`
- `ALLOWED_ORIGINS`

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run db:migrate
npm run db:generate
```

## Notes

- Authentication is delegated to user-service verification.
- Prisma schema and migrations are in `prisma/`.

