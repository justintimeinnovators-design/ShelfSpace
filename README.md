# ShelfSpace

ShelfSpace is a microservices-based social reading platform with a Next.js frontend, Node.js backend services, and a Python chatbot service.

## Architecture Overview

The platform is composed of:

- `frontend` (Next.js 16, React 19): UI, session management, dashboard features.
- `api-gateway` (NGINX): route aggregation, basic rate limiting, WebSocket proxying.
- Backend Node services (Express + TypeScript): user, reviews, library, books, forums, chat, admin, analytics.
- `chatbot-service` (FastAPI + RAG pipeline): conversational recommendations.
- Data stores:
  - PostgreSQL (Prisma-backed services)
  - MongoDB (book catalog + analytics read model)
  - Redis (chat adapter/cache)

Service ports (from `docker-compose.yml`):

- Frontend: `3000`
- User service: `3001`
- Review service: `3002`
- User library service: `3003`
- Book service: `3004`
- Forum service: `3005`
- Chat service: `3006`
- Admin service: `3007`
- Analytics service: `3008`
- Chatbot service: `8000`
- Gateway: `80` / `443`

## Repository Layout

- `frontend/`: Next.js application.
- `api-gateway/`: NGINX gateway configuration.
- `services/`: all backend services.
- `tests/`: integration tests and curl smoke scripts.
- `ml-lab/`: notebooks and ML experimentation assets.
- `docker-compose*.yml`: orchestration for base, dev, and prod modes.

## Prerequisites

- Docker + Docker Compose (recommended run mode)
- Node.js 20+ for local service development
- npm 10+
- Python 3.11+ for chatbot local development

## Environment Variables

`docker-compose.yml` enforces several required values:

- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB` (optional, defaults to `shelfspace`)
- `MONGO_USER`
- `MONGO_PASSWORD`
- `MONGO_DATABASE` (optional, defaults to `books`)
- `MONGO_ANALYTICS_DB` (optional, defaults to `analytics`)
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_URL`
- `PINECONE_API_KEY`
- `PINECONE_ENV`
- `PINECONE_INDEX_NAME` (optional)

Create a root `.env` file before running Docker.

## Running the Platform

### Option 1: Docker Compose (recommended)

Development mode:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Production-style mode:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

Stop services:

```bash
docker-compose down
```

## Makefile Commands

The root `Makefile` provides helper targets (`lint`, `typecheck`, `build`, `docker-up`, etc.).

Important: several targets reference `./scripts/*.sh`, but the `scripts/` directory is not present in this repository snapshot. Use direct `docker-compose` commands instead when those targets fail.

## Testing

- Frontend tests: `cd frontend && npm test`
- User-service tests: `cd services/user-service && npm test`
- Cross-service integration tests (root): `npx jest -c jest.config.cjs`
- Curl smoke scripts: see `tests/README.md`

## Additional Documentation

- API gateway details: `api-gateway/README.md`
- Frontend details: `frontend/README.md`
- Backend service catalog: `services/README.md`
- Service-level docs: each `services/*/README.md`
- Testing guide: `tests/README.md`
- ML notebooks: `ml-lab/README.md`

## Known Repository Gaps

- CI workflow files reference `services/group-service`, but this directory does not exist; forum functionality is implemented in `services/forum-service`.
- Root Makefile targets `scripts/` helpers that are absent.

