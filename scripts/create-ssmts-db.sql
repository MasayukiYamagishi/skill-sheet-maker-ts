-- Create new database for skill-sheet-maker TypeScript version
-- Run this as PostgreSQL superuser to set up the ssmts_test database

-- Create database
CREATE DATABASE ssmts_test OWNER devuser;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ssmts_test TO devuser;

-- Note: After running this script, connect to the database and enable UUID extension:
-- \c ssmts_test
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";