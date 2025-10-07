# ---------------------------------------------------------------------------
# Build stage (produces production-ready build)
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

# ---------------------------------------------------------------------------
# Production stage (serve compiled static files)
# ---------------------------------------------------------------------------
FROM node:24-alpine AS production
LABEL stage=production
WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/dist/ ./dist/

ENV PORT=4200
EXPOSE $PORT

CMD sh -c "serve dist/frontend -s -n -L -p $PORT"