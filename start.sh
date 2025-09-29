#!/bin/bash

# Install Python dependencies
cd backend
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Install Node.js dependencies and build the frontend
cd ../frontend
npm install
npm run build

# Start Django development server in the background
cd ../backend
python manage.py runserver &

# Store the Django server's process ID
DJANGO_PID=$!

# Start Angular development server
cd ../frontend
ng serve

# When the script is terminated, stop the Django server
trap "kill $DJANGO_PID" EXIT
