# forum-service

Forum/group domain service.

## Responsibilities

- Forum CRUD
- Membership join/leave/list/verify
- Thread CRUD
- Post CRUD and thread discussion workflows

## Runtime

- Default port: `3005`
- Health endpoint: `/health`
- Route prefix: `/api/forums`

## Environment Variables

- `PORT` (default `3005`)
- `DATABASE_URL` (PostgreSQL)
- `USER_SERVICE_URL`
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

- This service implements the functionality often referred to as "group service" in some CI/test files.
- Prisma schema and migrations are under `prisma/`.

