-- Database initialization script
-- Run this as PostgreSQL superuser to set up the skill-sheet-maker databases

-- Create user
DO $$BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'devuser') THEN
      CREATE USER devuser WITH PASSWORD 'password';
   END IF;
END$$;

-- Create databases
SELECT 'CREATE DATABASE users_test OWNER devuser'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'users_test');

SELECT 'CREATE DATABASE users_prod OWNER devuser'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'users_prod');

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE users_test TO devuser;
GRANT ALL PRIVILEGES ON DATABASE users_prod TO devuser;

-- Note: After running this script, connect to each database and enable UUID extension:
-- \c users_test
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- \c users_prod  
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";