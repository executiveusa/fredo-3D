# syntax=docker/dockerfile:1.7
# FREDO 3D — Next.js 15 standalone production image
# Multi-stage. Output: minimal runtime image with the standalone server,
# static chunks, and public assets. Zero application secrets baked in.
#
# Build context: repository root (so ../../content is reachable).
#   docker build -f apps/web/Dockerfile -t fredo3d-web:<sha>  <repo-root>

# ---------- 1. deps ----------
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install based on lockfile for reproducible builds.
COPY apps/web/package.json apps/web/package-lock.json* ./
RUN npm ci --no-audit --no-fund

# ---------- 2. builder ----------
FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY apps/web/ ./

# The web app imports the artwork manifest from ../../content.
# Copy only that data so the build can resolve the relative import.
COPY content/ ./../../content/

# Static-first build requires no secrets. Next.js emits:
#   .next/standalone   -> self-contained server
#   .next/static       -> JS/CSS chunks
#   public             -> static assets (copied below)
RUN npm run build

# ---------- 3. runner ----------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Non-root runtime user.
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 --ingroup nodejs nextjs

# Standalone server.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Static chunks (must sit beside the server at .next/static).
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Public assets (sitemap, robots, /art images).
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Lightweight health probe used by docker compose / monitoring.
# Next.js standalone already serves /; we expose it directly.
USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "apps/web/server.js"]
