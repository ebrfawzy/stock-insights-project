# Dockerfile
FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

# Build Angular; ensure this produces dist/<project-name>/
RUN npm run build -- --configuration=production

# Normalize build output so final stage can copy a flat folder (index.html at root)
# Create a dist_root folder and copy built files into it
RUN mkdir -p /app/dist_root && cp -r /app/dist/* /app/dist_root/

FROM nginx:1.29.1-alpine AS production

# Copy normalized build output
COPY --from=builder /app/dist_root/ /usr/share/nginx/html/

# COPY nginx config (assumes nginx.conf is in repo root)
# If you placed it under docker/nginx/default.conf, change the source path accordingly.
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
