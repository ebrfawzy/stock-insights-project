#!/bin/bash

# Railway deployment script
# This script is for reference only - Railway will handle deployment automatically

echo "🚀 Deploying to Railway..."

# Set environment variables for Railway deployment
export DEBUG=False
export RAILWAY_ENVIRONMENT=production

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build

# Install backend dependencies
echo "🐍 Installing backend dependencies..."
cd ../backend
pip install -r requirements.txt

# Run migrations and collect static files
echo "🗄️ Running migrations..."
python manage.py migrate

echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

echo "✅ Deployment preparation complete!"
echo "🌐 Your app will be available at: https://your-app-name.railway.app"
