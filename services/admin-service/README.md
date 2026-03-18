# admin-service

Administrative API for moderation and privileged operations.

## Responsibilities

- User moderation/status updates
- Admin-level settings and operational controls
- Coordinating admin workflows across services

## Runtime

- Default port: `3007`
- Health endpoint: `/health`
- Route prefix: `/api/admin`

## Environment Variables

- `PORT` (default `3007`)
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

- Uses Prisma for persistence.
- Authentication/authorization is enforced by middleware and role checks.

