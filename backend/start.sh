#!/usr/bin/env bash
set -euo pipefail

# Run database migrations
echo "Running migrations..."
python manage.py makemigrations
if ! python manage.py migrate; then
    echo "Migration failed!"
    exit 1
fi
echo "Migrations completed successfully"

# Collect static files
echo "Collecting static files..."
if ! python manage.py collectstatic --noinput; then
    echo "Failed to collect static files!"
    exit 1
fi
echo "Static files collected successfully"

# Create superuser if environment variables are set
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
    echo "Creating/updating superuser..."
    if ! python manage.py create_superuser; then
        echo "Warning: Failed to create/update superuser"
        # Don't exit here as this is not critical
    fi
fi

# Start the server based on environment
echo "Starting server..."
if [ "$DJ_ENV" = "development" ]; then
    exec python manage.py runserver 0.0.0.0:8000
else
    # Use recommended formula: 2 * CPU cores + 1
    WORKERS=${GUNICORN_WORKERS}
    TIMEOUT=${GUNICORN_TIMEOUT}
    
    exec gunicorn \
        --bind 0.0.0.0:8000 \
        --workers $WORKERS \
        --timeout $TIMEOUT \
        --access-logfile - \
        --error-logfile - \
        --log-level info \
        stock_api.wsgi:application
fi