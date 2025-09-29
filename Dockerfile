# Multi-stage build for Railway deployment
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ ./
RUN npm run build

# Python backend stage
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./

# Copy built frontend assets
COPY --from=frontend-build /app/frontend/dist/ ./staticfiles/

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose the port
EXPOSE $PORT

# Command to run the application
CMD gunicorn stock_api.wsgi:application --bind 0.0.0.0:$PORT --workers 3 --timeout 120
