# Stock Insights Development Makefile

.PHONY: help build up down logs clean test migrate superuser shell

# Default target
help:
	@echo "Stock Insights Development Commands:"
	@echo ""
	@echo "  make build     - Build all Docker images"
	@echo "  make up        - Start all services"
	@echo "  make down      - Stop all services"
	@echo "  make logs      - View logs from all services"
	@echo "  make clean     - Stop services and remove volumes"
	@echo "  make reset     - Complete reset (removes everything)"
	@echo ""
	@echo "  make migrate   - Run Django migrations"
	@echo "  make superuser - Create Django superuser"
	@echo "  make shell     - Open Django shell"
	@echo "  make test      - Run backend tests"
	@echo ""
	@echo "  make db        - Connect to PostgreSQL database"
	@echo ""

# Build all images
build:
	docker-compose build

# Start all services
up:
	docker-compose up -d
	@echo "Services started!"
	@echo "Frontend: http://localhost:4200"
	@echo "Backend:  http://localhost:8000"
	@echo "Admin:    http://localhost:8000/admin"

# Start with logs visible
up-logs:
	docker-compose up

# Stop all services
down:
	docker-compose down

# View logs
logs:
	docker-compose logs -f

# View logs for specific service
logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-db:
	docker-compose logs -f postgres

# Clean up (remove volumes)
clean:
	docker-compose down -v
	@echo "All services stopped and volumes removed"

# Complete reset
reset:
	docker-compose down -v --rmi all
	docker system prune -f
	@echo "Complete reset done"

# Django management commands
migrate:
	docker-compose exec backend python manage.py migrate

makemigrations:
	docker-compose exec backend python manage.py makemigrations

superuser:
	docker-compose exec backend python manage.py createsuperuser

shell:
	docker-compose exec backend python manage.py shell

collectstatic:
	docker-compose exec backend python manage.py collectstatic --noinput

# Testing
test:
	docker-compose exec backend python manage.py test

test-coverage:
	docker-compose exec backend coverage run --source='.' manage.py test
	docker-compose exec backend coverage report

# Database access
db:
	docker-compose exec postgres psql -U postgres -d stock_insights_db

# Backup database
backup:
	docker-compose exec postgres pg_dump -U postgres stock_insights_db > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Database backup created"

# Install frontend dependencies
npm-install:
	docker-compose exec frontend npm install

# Generate Angular component
ng-component:
	@read -p "Component name: " name; \
	docker-compose exec frontend ng generate component $$name

# Development setup (first time)
setup: build up migrate
	@echo ""
	@echo "🎉 Development environment is ready!"
	@echo ""
	@echo "Next steps:"
	@echo "1. Create a superuser: make superuser"
	@echo "2. Visit http://localhost:4200 for the frontend"
	@echo "3. Visit http://localhost:8000/admin for Django admin"
	@echo ""
