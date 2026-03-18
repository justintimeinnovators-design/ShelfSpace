# chat-service

Real-time group chat service with HTTP endpoints and Socket.IO.

## Responsibilities

- Retrieve group messages via REST
- Real-time communication through Socket.IO
- Membership enforcement via forum-service checks
- Optional Redis adapter for horizontal scaling

## Runtime

- Default port: `3006`
- Health endpoint: `/health`
- Route prefix: `/api/chat`
- WebSocket path via gateway: `/socket.io/`

## Environment Variables

- `PORT` (default `3006`)
- `DATABASE_URL` (PostgreSQL)
- `USER_SERVICE_URL`
- `FORUM_SERVICE_URL`
- `REDIS_URL`
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

- Socket initialization happens at startup (`src/socket.ts`).
- Requires Redis availability for distributed Socket.IO adapter scenarios.

