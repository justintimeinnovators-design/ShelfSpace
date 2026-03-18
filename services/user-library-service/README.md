# user-library-service

Manages user reading lists and list-book associations.

## Responsibilities

- Initialize default lists
- CRUD reading lists
- Add/remove books from lists
- Reorder lists

## Runtime

- Default port: `3003`
- Health endpoint: `/health`
- Route prefix in service: `/reading-lists`
- Route prefix via gateway: `/api/library/...` (gateway rewrites to service path)

## Environment Variables

- `PORT` (default `3003`)
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
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

## Notes

- Requires valid Bearer tokens for protected routes.
- Prisma schema and migrations are under `prisma/`.

