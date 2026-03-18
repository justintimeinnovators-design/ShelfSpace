# user-service

User identity and profile service.

## Responsibilities

- Create/login users by email-based platform identity (`POST /api/me`)
- Verify JWT tokens for other services (`POST /api/auth/verify`)
- Manage user profile, stats, and preferences
- Issue token snapshots (`GET /api/token/:userId`)
- Manage user chat sessions under `/api/chat`

## Runtime

- Default port: `3001`
- Health endpoint: `/health`
- Base route prefixes:
  - `/api` (user routes)
  - `/api/auth`
  - `/api/token`
  - `/api/chat`

## Environment Variables

- `PORT` (default `3001`)
- `DATABASE_URL` (PostgreSQL)
- `JWT_SECRET`
- `REDIS_URL` (optional but used by cache utilities)
- `LIBRARY_SERVICE_URL`
- `ANALYTICS_SERVICE_URL`
- `ALLOWED_ORIGINS` (comma-separated)

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run test
npm run db:migrate
npm run db:generate
npm run db:studio
```

## Notes

- Service includes request ID logging and CORS allowlist handling.
- Prisma migrations are located in `prisma/migrations`.

