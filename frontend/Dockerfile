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

# Copy nginx config template
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Install envsubst for environment variable substitution
RUN apk add --no-cache gettext

# Set default port if not provided
ENV PORT=80

# Expose the port (will be dynamic based on PORT env var)
EXPOSE $PORT

# Create startup script that substitutes environment variables
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo '# Replace API_URL in built files' >> /docker-entrypoint.sh && \
    echo 'if [ -n "$API_URL" ]; then' >> /docker-entrypoint.sh && \
    echo '  find /usr/share/nginx/html -name "*.js" -exec sed -i "s|API_URL_PLACEHOLDER|$API_URL|g" {} \;' >> /docker-entrypoint.sh && \
    echo 'fi' >> /docker-entrypoint.sh && \
    echo '# Generate nginx config from template' >> /docker-entrypoint.sh && \
    echo 'envsubst "\$PORT" < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf' >> /docker-entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Simple HTTP healthcheck (using PORT env var)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:$PORT/ || exit 1

# Start with our custom entrypoint script
CMD ["/docker-entrypoint.sh"]
