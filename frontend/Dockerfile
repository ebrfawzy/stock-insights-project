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
COPY <<EOF /docker-entrypoint.sh
#!/bin/sh
set -e

echo "Starting with PORT=\$PORT"

# Replace API_URL in built files
if [ -n "\$API_URL" ]; then
  echo "Replacing API_URL_PLACEHOLDER with \$API_URL"
  find /usr/share/nginx/html -name "*.js" -exec sed -i "s|API_URL_PLACEHOLDER|\$API_URL|g" {} \;
fi

# Generate nginx config from template
echo "Generating nginx config for port \$PORT"
envsubst '\$PORT' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Show the generated config for debugging
echo "Generated nginx config:"
cat /etc/nginx/nginx.conf | grep -A 5 -B 5 "listen"

# Start nginx
exec nginx -g "daemon off;"
EOF

RUN chmod +x /docker-entrypoint.sh

# Start with our custom entrypoint script
CMD ["/docker-entrypoint.sh"]
