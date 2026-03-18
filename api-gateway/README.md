# API Gateway

This directory contains NGINX configuration for routing frontend and API traffic to internal services.

## Files

- `nginx.conf`: upstream definitions, route mapping, rate limits, and health route.

## Responsibilities

- Route client requests to the correct backend service.
- Provide basic per-IP request rate limiting (`10r/s` with bursts on API locations).
- Proxy Socket.IO upgrades to chat-service.
- Expose gateway health endpoint (`/health`).

## Upstream Mapping

Configured upstreams:

- `frontend:3000`
- `user-service:3001`
- `review-service:3002`
- `user-library-service:3003`
- `book-service:3004`
- `forum-service:3005`
- `chat-service:3006`
- `admin-service:3007`
- `analytics-service:3008`
- `chatbot-service:8000`

## Route Mapping Highlights

- `/` -> frontend
- `/api/users/` -> user-service
- `/api/reviews/` -> review-service
- `/api/forums/` -> forum-service
- `/api/chat/` and `/socket.io/` -> chat-service
- `/api/admin/` -> admin-service
- `/api/library/` -> user-library-service (rewrite strips `/api/library/` prefix)
- `/api/books/` -> book-service
- `/api/analytics/` -> analytics-service
- `/api/chatbot/` -> chatbot-service

## Notes

- There is a compatibility rewrite for `/api/user-chat/` that forwards to user-service chat routes.
- TLS volume mounts are present in compose files (`api-gateway/ssl`) but certificate provisioning is external to this repository.

