# Frontend

Next.js App Router application for ShelfSpace.

## Tech Stack

- Next.js `16.x`
- React `19`
- TypeScript
- Tailwind CSS
- NextAuth (Google OAuth)
- Axios
- Socket.IO client

## Key Features

- Dashboard area (`/dashboard`, `/library`, `/discover`, `/forums`, `/chat`, `/settings`)
- Onboarding and profile flows
- Service console (`/dev/services`) for development diagnostics
- Report rendering (`/report`)
- API route handlers for auth/user/chatbot/feedback bridging

## Directory Highlights

- `src/app/`: routes, layouts, route handlers
- `src/components/`: feature and shared UI components
- `src/lib/`: API clients and service integrations
- `src/hooks/`: feature hooks
- `src/services/`: client-side service modules and mock data
- `src/utils/`: utility helpers

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run test:watch
npm run test:coverage
```

## Environment Variables

Commonly required variables:

- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_USER_SERVICE_URL` (optional override)
- `NEXT_PUBLIC_REVIEW_SERVICE_URL` (optional override)
- `NEXT_PUBLIC_FORUM_SERVICE_URL` (optional override)
- `NEXT_PUBLIC_BOOK_SERVICE_URL` (optional override)
- `NEXT_PUBLIC_LIBRARY_SERVICE_URL` (optional override)
- `CHATBOT_SERVICE_URL` (server-side chatbot proxy target)
- `FEEDBACK_WEBHOOK_URL` (optional)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional)

## Authentication Flow

- OAuth provider: Google (`next-auth`).
- On sign-in, frontend coordinates with `user-service` to create/resolve platform user and issue backend token.
- Middleware (`src/middleware.ts`) protects dashboard and onboarding routes and enforces backend verification state.

## Local Development

Run frontend only:

```bash
npm install
npm run dev
```

Default dev URL: `http://localhost:3000`.

For full functionality, run backend services via Docker Compose from repository root.

## Testing

- Unit/component tests: Jest + Testing Library.
- Accessibility tests exist for selected components.

