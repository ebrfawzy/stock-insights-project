# Deployment Guide

This guide covers deploying the Stock Insights application with separate backend and frontend repositories on Railway.app.

## Architecture Overview

- **Backend**: Django REST API with PostgreSQL database
- **Frontend**: Angular SPA served with static file server
- **Deployment**: Separate Railway services for backend and frontend

## Prerequisites

1. Railway.app account
2. PostgreSQL database service on Railway

## Backend Deployment

### 1. Repository Setup
Create a separate repository for the backend containing only the `backend/` directory contents.

### 2. Environment Variables
Set the following environment variables in Railway:

```bash
# Required
DJ_ENV=production
DJ_DEBUG=False
DJ_SECRET=your-super-secret-key-here
DATABASE_URL=${POSTGRES.DATABASE_URL}

# Database (auto-provided by Railway PostgreSQL)
PGDATABASE=${POSTGRES.PGDATABASE}
PGHOST=${POSTGRES.PGHOST}
PGPASSWORD=${POSTGRES.PGPASSWORD}
PGPORT=${POSTGRES.PGPORT}
PGUSER=${POSTGRES.PGUSER}

# CORS
FRONTEND_URL=https://your-frontend-domain.railway.app

# Optional
DJ_SAME_SITE=Lax
DJANGO_LOG_LEVEL=INFO
```

### 3. Railway Configuration
The backend includes:
- `Dockerfile`: Multi-stage build with security best practices
- `railway.json`: Railway-specific configuration
- `Procfile`: Process definitions for Railway

### 4. Database Migration
Railway will automatically run migrations on deployment via the `release` process in Procfile.

## Frontend Deployment

### 1. Repository Setup
Create a separate repository for the frontend containing only the `frontend/` directory contents.

### 2. Environment Variables
Set the following environment variables in Railway:

```bash
# Required
PORT=3000
API_URL=https://your-backend-domain.railway.app
```

### 3. Railway Configuration
The frontend includes:
- `Dockerfile`: Multi-stage build optimized for production
- `railway.json`: Railway-specific configuration
- Updated `package.json` with production start script

## Docker Deployment (Generic)

### Backend
```bash
# Build
docker build -t stock-api-backend .

# Run with environment variables
docker run -p 8000:8000 \
  -e DJ_ENV=production \
  -e DJ_SECRET=your-secret-key \
  -e DATABASE_URL=postgresql://... \
  stock-api-backend
```

### Frontend
```bash
# Build
docker build -t stock-api-frontend .

# Run
docker run -p 3000:3000 \
  -e PORT=3000 \
  stock-api-frontend
```

## GitLab CI/CD Pipeline

### Backend Pipeline
```yaml
deploy-railway-django:
  stage: deploy-django
  image: ubuntu
  only:
    - main
  script:
    - apt-get clean
    - apt-get -o Acquire::ForceIPv4=true update
    - apt-get install -y curl
    - curl -fsSL https://railway.app/install.sh | sh
    - railway up --service=$RAILWAY_DJANGO -d
```

### Frontend Pipeline
```yaml
deploy-railway-angular:
  stage: deploy-angular
  image: ubuntu
  only:
    - main
  script:
    - apt-get clean
    - apt-get -o Acquire::ForceIPv4=true update
    - apt-get install -y curl
    - curl -fsSL https://railway.app/install.sh | sh
    - railway up --service=$RAILWAY_ANGULAR -d
```

## Security Considerations

### Backend
- Non-root user in Docker container
- Environment-based configuration
- HTTPS enforcement in production
- CORS properly configured
- Security headers enabled
- Static files served via WhiteNoise

### Frontend
- Multi-stage Docker build
- Non-root user in container
- Production-optimized Angular build

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure DATABASE_URL is properly set
2. **CORS Errors**: Verify FRONTEND_URL matches your frontend domain
3. **Static Files**: Check STATIC_ROOT and WhiteNoise configuration
4. **Build Failures**: Ensure all dependencies are in requirements.txt/package.json

### Logs
Check Railway logs for detailed error information:
```bash
railway logs --service=your-service-name
```

## Performance Optimization

### Backend
- Gunicorn with multiple workers
- Database connection pooling
- Static file compression via WhiteNoise
- Proper caching headers

### Frontend
- Angular production build optimization
- Gzip compression
- Static file serving optimizations
- Bundle size monitoring

## Monitoring

Set up monitoring for:
- Database performance
- Error rates
- Response times
- Resource usage

## Scaling

### Backend
- Horizontal scaling via Railway
- Database read replicas

### Frontend
- CDN for static assets
- Multiple deployment regions
- Load balancing
