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

# Copy built static files
COPY --from=builder /app/dist_root/ /usr/share/nginx/html/

# Copy nginx config template  
COPY nginx.conf.template /tmp/nginx.conf.template

# Install envsubst and create simple startup script
RUN apk add --no-cache gettext && \
    echo '#!/bin/sh' > /start.sh && \
    echo 'envsubst < /tmp/nginx.conf.template > /etc/nginx/nginx.conf' >> /start.sh && \
    echo 'nginx -g "daemon off;"' >> /start.sh && \
    chmod +x /start.sh

ENV PORT=8080
EXPOSE $PORT

CMD ["/start.sh"]
