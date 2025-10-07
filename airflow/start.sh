#!/usr/bin/env bash
set -euo pipefail

# Wait for Postgres
until pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" >/dev/null 2>&1; do
  echo "Waiting for Postgres..."
  sleep 2
done

PSQL_BASE="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/postgres"
psql "$PSQL_BASE" -tAc "SELECT 1 FROM pg_database WHERE datname='${AIRFLOW_DATABASE_NAME}'" | grep -q 1 \
  || psql "$PSQL_BASE" -c "CREATE DATABASE \"${AIRFLOW_DATABASE_NAME}\";"

# Run migrations
airflow db migrate

# Start Airflow in standalone mode
exec airflow standalone
