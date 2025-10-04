# Makefile — Option A: source .env file in the same shell invocation per-target
SHELL := /bin/bash
.PHONY: help build up up-logs down logs logs-service clean reset migrate makemigrations superuser shell collectstatic test test-coverage db backup npm-install ng-component setup

# Which docker compose CLI to use (override if you prefer the hyphenated binary)
DOCKER_COMPOSE ?= docker compose

# Which env file to load
ENV_FILE ?= .env.local

# Pass one or more profiles as a space-separated string, e.g.
#   make up PROFILES="analytics all"
PROFILES ?= all
PROFILE_FLAGS := $(if $(PROFILES),$(foreach p,$(PROFILES),--profile $(p)),)

# Friendly defaults for printed URLs
BACKEND_URL ?= http://localhost:8000
FRONTEND_URL ?= http://localhost:4200
AIRFLOW_URL ?= http://localhost:8080
MinIO_URL ?= http://localhost:9001

help:
	@echo "Stock Insights Development Commands:"
	@echo ""
	@echo "  make build                - Build all Docker images"
	@echo "  make up PROFILES=\"...\"    - Start services (optionally with profiles)"
	@echo "  make down                 - Stop all services"
	@echo "  make up-logs              - Start and show logs (foreground)"
	@echo "  make logs                 - Follow logs for all services"
	@echo "  make logs-service NAME=.. - Follow logs for a single service"
	@echo "  make clean                - Stop and remove volumes"
	@echo "  make reset                - Complete reset (remove images & volumes)"
	@echo ""
	@echo "  make migrate              - Run Django migrations"
	@echo "  make superuser            - Create Django superuser (interactive)"
	@echo "  make shell                - Open Django shell (interactive)"
	@echo "  make test                 - Run backend tests"
	@echo ""
	@echo "  make db                   - Open psql to the postgres container"
	@echo ""
	@echo "Variables you can override:"
	@echo "  ENV_FILE (default .env.local)"
	@echo "  DOCKER_COMPOSE (default 'docker compose')"
	@echo "  PROFILES (space-separated, e.g. 'analytics all')"
	@echo ""
	@echo "Examples:"
	@echo "  make up"
	@echo "  make up PROFILES=\"web\""
	@echo "  make up PROFILES=\"analytics all\""

# -------------------------
# Helpers: inline source pattern
# -------------------------
# Each recipe below uses the same pattern:
#   set -a; [ -f $(ENV_FILE) ] && . $(ENV_FILE); set +a; \
# so the env vars are exported in the same shell that runs docker compose.

# Build all images
build:
	@set -a; [ -f $(ENV_FILE) ] && . $(ENV_FILE); set +a; \
	$(DOCKER_COMPOSE) $(PROFILE_FLAGS) build

# Start all services (detached). Use PROFILES to include profile-labeled services.
up:
	@set -a; [ -f $(ENV_FILE) ] && . $(ENV_FILE); set +a; \
	echo "Starting services $(if $(PROFILES),with profiles: $(PROFILES),without extra profiles)"; \
	$(DOCKER_COMPOSE) $(PROFILE_FLAGS) up -d; \
	echo "Services started!"; \
	echo "Frontend: $(FRONTEND_URL)"; \
	echo "Backend:  $(BACKEND_URL)"; \
	echo "Airflow:  $(AIRFLOW_URL)"; \
	echo "MinIO:  $(MinIO_URL)"; \
	echo "Admin:    $(BACKEND_URL)/admin"

# Start and show logs (foreground)
up-logs:
	@set -a; [ -f $(ENV_FILE) ] && . $(ENV_FILE); set +a; \
	$(DOCKER_COMPOSE) $(PROFILE_FLAGS) up

# Stop all services
down:
	@set -a; [ -f $(ENV_FILE) ] && . $(ENV_FILE); set +a; \
	$(DOCKER_COMPOSE) $(PROFILE_FLAGS) down

# Follow logs for everything
logs:
	@set -a; [ -f $(ENV_FILE) ] && . $(ENV_FILE); set +a; \
	$(DOCKER_COMPOSE) $(PROFILE_FLAGS) logs -f

# Follow logs for a specific service (usage: make logs-service NAME=backend)
logs-service:
	@if [ -z "$(NAME)" ]; then \
		echo "Usage: make logs-service NAME=<service-name>"; exit 1; \
	fi
	@set -a; [ -f $(ENV_FILE) ] && . $(ENV_FILE); set +a; \
	$(DOCKER_COMPOSE) $(PROFILE_FLAGS) logs -f $(NAME)

# Clean up (remove volumes)
clean:
	@set -a; [ -f $(ENV_FILE) ] && . $(ENV_FILE); set +a; \
	$(DOCKER_COMPOSE) $(PROFILE_FLAGS) down -v; \
	echo "All services stopped and volumes removed"

# Complete reset (remove containers, volumes, images)
reset:
	@set -a; [ -f $(ENV_FILE) ] && . $(ENV_FILE); set +a; \
	$(DOCKER_COMPOSE) $(PROFILE_FLAGS) down -v --rmi all; \
	docker system prune -f; \
	echo "Complete reset done"

# -------------------------
# Django management commands
# -------------------------
migrate:
	@set -a; [ -f $(ENV_FILE) ] && . $(ENV_FILE); set +a; \
	$(DOCKER_COMPOSE) $(PROFILE_FLAGS) exec -T backend python manage.py migrate

makemigrations:
	@set -a; [ -f $(ENV_FILE) ] && . $(ENV_FILE); set +a; \
	$(DOCKER_COMPOSE) $(PROFILE_FLAGS) exec -T backend python manage.py makemigrations

# interactive: no -T so tty is allocated (use from a terminal)
superuser:
	@set -a; [ -f $(ENV_FILE) ] && . $(ENV_FILE); set +a; \
	$(DOCKER_COMPOSE) $(PROFILE_FLAGS) exec backend python manage.py createsuperuser

# interactive shell
shell:
	@set -a; [ -f $(ENV_FILE) ] && . $(ENV_FILE); set +a; \
	$(DOCKER_COMPOSE) $(PROFILE_FLAGS) exec backend python manage.py shell

collectstatic:
	@set -a; [ -f $(ENV_FILE) ] && . $(ENV_FILE); set +a; \
	$(DOCKER_COMPOSE) $(PROFILE_FLAGS) exec -T backend python manage.py collectstatic --noinput

# Testing
test:
	@set -a; [ -f $(ENV_FILE) ] && . $(ENV_FILE); set +a; \
	$(DOCKER_COMPOSE) $(PROFILE_FLAGS) exec -T backend python manage.py test

test-coverage:
	@set -a; [ -f $(ENV_FILE) ] && . $(ENV_FILE); set +a; \
	$(DOCKER_COMPOSE) $(PROFILE_FLAGS) exec -T backend coverage run --source='.' manage.py test; \
	$(DOCKER_COMPOSE) $(PROFILE_FLAGS) exec -T backend coverage report

# -------------------------
# Database access + backup
# -------------------------
db:
	@set -a; [ -f $(ENV_FILE) ] && . $(ENV_FILE); set +a; \
	$(DOCKER_COMPOSE) $(PROFILE_FLAGS) exec -T postgres psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}

backup:
	@set -a; [ -f $(ENV_FILE) ] && . $(ENV_FILE); set +a; \
	echo "Creating DB backup..."; \
	$(DOCKER_COMPOSE) $(PROFILE_FLAGS) exec -T postgres pg_dump -U ${POSTGRES_USER} ${POSTGRES_DB} > backup_$$(date +%Y%m%d_%H%M%S).sql; \
	echo "Database backup created"

# -------------------------
# Frontend helpers
# -------------------------
npm-install:
	@set -a; [ -f $(ENV_FILE) ] && . $(ENV_FILE); set +a; \
	$(DOCKER_COMPOSE) $(PROFILE_FLAGS) exec -T frontend npm install

# Interactive component generator
ng-component:
	@set -a; [ -f $(ENV_FILE) ] && . $(ENV_FILE); set +a; \
	read -p "Component name: " name; \
	$(DOCKER_COMPOSE) $(PROFILE_FLAGS) exec frontend ng generate component $$name


startfresh: clean build up logs

# -------------------------
# Setup target: build, up, migrate
# -------------------------
setup: build up migrate
	@echo ""
	@echo "🎉 Development environment is ready!"
	@echo ""
	@echo "Next steps:"
	@echo "1. Create a superuser: make superuser"
	@echo "2. Visit $(FRONTEND_URL) for the frontend"
	@echo "3. Visit $(BACKEND_URL)/admin for Django admin"
