# ---------------------------------------------------------------------------
# Build stage
# ---------------------------------------------------------------------------
FROM node:24-alpine AS builder
LABEL stage=builder

WORKDIR /app

# Copy lock and manifest first to leverage layer caching
COPY package*.json ./

# Use npm ci for deterministic installs — make sure package-lock.json matches package.json
RUN npm ci

# Copy source and build
COPY . .
# Production build (Angular). Adjust --configuration if you use a different name.
RUN npm run build -- --configuration=production

# Normalize build output: copy contents of dist/* (whatever actual project folder name is)
# into /app/dist_root so final stage doesn't need the exact project name.
RUN mkdir -p /app/dist_root \
    && cp -r /app/dist/* /app/dist_root/ || true

# ---------------------------------------------------------------------------
# Production stage
# ---------------------------------------------------------------------------
FROM nginx:1.29.1-alpine AS production
LABEL stage=production

# Copy built static files into nginx html root
COPY --from=builder /app/dist_root/ /usr/share/nginx/html/

# Copy main nginx config (we place a full nginx.conf at repo root)
COPY nginx.conf /etc/nginx/nginx.conf

# Expose default port
EXPOSE 80

# Simple HTTP healthcheck (will return 200 for root)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx in foreground (this is used by most PaaS)
CMD ["nginx", "-g", "daemon off;"]
