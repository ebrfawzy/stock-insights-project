#!/bin/bash

# Check if Docker is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker and Docker Compose first."
    exit 1
fi

# Start the application using Docker Compose
docker-compose up --build
