# Services

This directory contains ShelfSpace backend services.

## Service Catalog

- `user-service`: identity, auth verification, profiles, preferences, user chat sessions.
- `user-library-service`: reading lists and collection management.
- `review-service`: book review CRUD and review queries.
- `book-service`: book catalog APIs and metadata queries (MongoDB-backed).
- `forum-service`: forum/group lifecycle, membership, threads, posts.
- `chat-service`: group chat APIs + Socket.IO real-time layer.
- `admin-service`: moderation/admin orchestration endpoints.
- `analytics-service`: event ingestion and dashboard projections.
- `chatbot-service`: FastAPI RAG chatbot.

## Data Stores

- PostgreSQL + Prisma: `user-service`, `user-library-service`, `review-service`, `forum-service`, `chat-service`, `admin-service`
- MongoDB: `book-service`, `analytics-service`
- Redis: `chat-service` and user-service caching use-cases

## Running a Single Service

Typical Node service flow:

```bash
cd services/<service-name>
npm install
npm run dev
```

Each service has its own README with route prefixes, required env vars, and scripts.

## Cross-Service Dependencies

Common dependency patterns:

- Most services verify user tokens through `user-service`.
- `review-service` and `user-library-service` depend on `book-service` for book references.
- `chat-service` depends on `forum-service` for membership validation.
- Multiple services emit analytics events to `analytics-service`.

