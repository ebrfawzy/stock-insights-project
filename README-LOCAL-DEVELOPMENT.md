# Local Development with Docker Compose

This guide helps you set up and run the Stock Insights application locally using Docker Compose for development and testing.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)
- Git

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd stock-insights-project
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the applications**
   - **Frontend**: http://localhost:4200
   - **Backend API**: http://localhost:8000
   - **Backend Admin**: http://localhost:8000/admin

## Services Overview

### 🐘 PostgreSQL Database
- **Port**: 5432
- **Database**: `stock_insights_db`
- **Username**: `postgres`
- **Password**: `password`
- **Connection**: `postgresql://postgres:password@localhost:5432/stock_insights_db`

### 🐍 Django Backend
- **Port**: 8000
- **Debug Mode**: Enabled
- **Auto-reload**: Enabled (development server)
- **Static Files**: Served by Django development server

### 🅰️ Angular Frontend
- **Port**: 4200
- **Development Mode**: Enabled
- **Hot Reload**: Enabled
- **API Proxy**: Configured to backend at http://localhost:8000

## Development Commands

### Start Services
```bash
# Start all services in background
docker-compose up -d

# Start with logs visible
docker-compose up

# Build and start (after code changes)
docker-compose up --build

# Start specific service
docker-compose up backend
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v

# Stop and remove everything including images
docker-compose down --rmi all -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Execute Commands in Containers
```bash
# Django management commands
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
docker-compose exec backend python manage.py collectstatic
docker-compose exec backend python manage.py shell

# Database access
docker-compose exec postgres psql -U postgres -d stock_insights_db

# Frontend commands
docker-compose exec frontend npm install
docker-compose exec frontend ng generate component my-component
```

## Environment Variables

### Development Configuration
The `docker-compose.yml` includes development-friendly environment variables:

#### Backend Environment
```yaml
DJ_ENV: development          # Enables development mode
DJ_DEBUG: "True"            # Django debug mode
DJ_SECRET: dev-secret-key   # Development secret key
PGHOST: postgres            # Database host (container name)
FRONTEND_URL: http://localhost:4200  # CORS configuration
DJANGO_LOG_LEVEL: DEBUG     # Verbose logging
```

#### Frontend Environment
```yaml
NODE_ENV: development       # Node.js development mode
API_URL: http://localhost:8000  # Backend API URL
```

## Database Management

### Initial Setup
The database is automatically initialized when you first run `docker-compose up`. Django migrations are run automatically.

### Create Superuser
```bash
docker-compose exec backend python manage.py createsuperuser
```

### Reset Database
```bash
# Stop services and remove volumes
docker-compose down -v

# Start again (will recreate database)
docker-compose up
```

### Backup Database
```bash
docker-compose exec postgres pg_dump -U postgres stock_insights_db > backup.sql
```

### Restore Database
```bash
docker-compose exec -T postgres psql -U postgres stock_insights_db < backup.sql
```

## Development Workflow

### Making Backend Changes
1. Edit files in `backend/` directory
2. Changes are automatically reflected (Django development server auto-reloads)
3. For new dependencies, rebuild: `docker-compose up --build backend`

### Making Frontend Changes
1. Edit files in `frontend/` directory
2. Changes are automatically reflected (Angular dev server hot reload)
3. For new dependencies, rebuild: `docker-compose up --build frontend`

### Database Schema Changes
```bash
# Create migrations
docker-compose exec backend python manage.py makemigrations

# Apply migrations
docker-compose exec backend python manage.py migrate
```

## Testing

### Backend Tests
```bash
# Run Django tests
docker-compose exec backend python manage.py test

# Run with coverage
docker-compose exec backend coverage run --source='.' manage.py test
docker-compose exec backend coverage report
```

### Frontend Tests
```bash
# Run Angular tests
docker-compose exec frontend npm test

# Run e2e tests
docker-compose exec frontend npm run e2e
```

## Debugging

### Backend Debugging
- Django debug toolbar is available in development mode
- Logs are visible with `docker-compose logs -f backend`
- Use `docker-compose exec backend python manage.py shell` for interactive debugging

### Frontend Debugging
- Angular dev tools work normally in the browser
- Console logs are visible with `docker-compose logs -f frontend`
- Source maps are enabled for debugging

### Database Debugging
```bash
# Connect to database
docker-compose exec postgres psql -U postgres -d stock_insights_db

# View database logs
docker-compose logs -f postgres
```

## Performance Considerations

### Development vs Production
This setup is optimized for development:
- Debug mode enabled
- Auto-reload enabled
- Verbose logging
- Development dependencies included
- No optimization for production

### Resource Usage
- PostgreSQL: ~100MB RAM
- Backend: ~200MB RAM
- Frontend: ~300MB RAM
- **Total**: ~600MB RAM

## Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check what's using the ports
   netstat -tulpn | grep :8000
   netstat -tulpn | grep :4200
   netstat -tulpn | grep :5432
   ```

2. **Database connection issues**
   ```bash
   # Check if PostgreSQL is ready
   docker-compose exec postgres pg_isready -U postgres
   ```

3. **Frontend not loading**
   ```bash
   # Check if Angular dev server started
   docker-compose logs frontend
   ```

4. **Permission issues**
   ```bash
   # Fix file permissions (Linux/Mac)
   sudo chown -R $USER:$USER .
   ```

### Clean Reset
```bash
# Nuclear option - removes everything
docker-compose down -v --rmi all
docker system prune -a
docker-compose up --build
```

## Production Differences

This development setup differs from production:
- Uses Django development server instead of Gunicorn
- Uses Angular dev server instead of static file serving
- Debug mode enabled
- Verbose logging
- Auto-reload enabled
- Development dependencies included

For production deployment, use the separate Dockerfiles in each service directory.

## VS Code Integration

### Recommended Extensions
- Docker
- Python
- Angular Language Service
- PostgreSQL

### Debug Configuration
Add to `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: Django",
      "type": "python",
      "request": "attach",
      "connect": {
        "host": "localhost",
        "port": 3000
      },
      "pathMappings": [
        {
          "localRoot": "${workspaceFolder}/backend",
          "remoteRoot": "/app"
        }
      ]
    }
  ]
}
```
