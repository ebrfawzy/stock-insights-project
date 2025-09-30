@echo off
echo Starting Stock Insights Development Environment...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo Building and starting services...
docker-compose up --build -d

echo.
echo Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo Services Status:
docker-compose ps

echo.
echo Development environment is ready!
echo.
echo Frontend: http://localhost:4200
echo Backend:  http://localhost:8000
echo Admin:    http://localhost:8000/admin
echo.
echo To view logs: docker-compose logs -f
echo To stop:     docker-compose down
echo.
pause
