-- Initialize the stock_insights_db database
-- This script runs when the PostgreSQL container starts for the first time

-- Create the database if it doesn't exist
SELECT 'CREATE DATABASE stock_insights_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'stock_insights_db')\gexec

-- Connect to the database
\c stock_insights_db;

-- Create any initial extensions if needed
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- You can add any initial data or schema setup here
-- For now, Django migrations will handle the schema creation
