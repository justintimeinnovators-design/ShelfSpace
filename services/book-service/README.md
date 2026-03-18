# book-service

MongoDB-backed catalog service for books and metadata.

## Responsibilities

- Book CRUD (create/update/delete requires auth)
- Paginated listing and search
- Metadata endpoints (genres, authors, languages)

## Runtime

- Compose port: `3004`
- Source default port fallback: `3002` in `src/index.ts`
- Health endpoint: `/health`
- Route prefix: `/api/books`

Set `PORT=3004` explicitly for consistency with the rest of the platform.

## Environment Variables

- `PORT`
- `MONGO_URI`
- `USER_SERVICE_URL`
- `ANALYTICS_SERVICE_URL`
- `ALLOWED_ORIGINS`

## Scripts

```bash
npm run dev
npm run build
npm run start
```

## Notes

- Uses Mongoose with `autoIndex` disabled.
- Includes seed/helper scripts (`populateDb.ts`, `temp.py`) for data operations.

