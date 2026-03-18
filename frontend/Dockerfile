# ── Stage 1: install dependencies ─────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ── Stage 2: build ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars must be present at build time (baked into JS bundles).
# Override these build args when building for a custom domain.
ARG NEXT_PUBLIC_APP_URL=http://localhost
ARG NEXT_PUBLIC_BOOK_SERVICE_URL=http://localhost
ARG NEXT_PUBLIC_FORUM_SERVICE_URL=http://localhost
ARG NEXT_PUBLIC_REVIEW_SERVICE_URL=http://localhost
ARG NEXT_PUBLIC_LIBRARY_SERVICE_URL=http://localhost/api/library
ARG NEXT_PUBLIC_USER_SERVICE_URL=http://localhost/api/users

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_BOOK_SERVICE_URL=$NEXT_PUBLIC_BOOK_SERVICE_URL
ENV NEXT_PUBLIC_FORUM_SERVICE_URL=$NEXT_PUBLIC_FORUM_SERVICE_URL
ENV NEXT_PUBLIC_REVIEW_SERVICE_URL=$NEXT_PUBLIC_REVIEW_SERVICE_URL
ENV NEXT_PUBLIC_LIBRARY_SERVICE_URL=$NEXT_PUBLIC_LIBRARY_SERVICE_URL
ENV NEXT_PUBLIC_USER_SERVICE_URL=$NEXT_PUBLIC_USER_SERVICE_URL

RUN npm run build

# ── Stage 3: production runner ─────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Standalone output (set in next.config.ts: output: 'standalone')
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
