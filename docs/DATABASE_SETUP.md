# Database Setup Guide

This project uses PostgreSQL with two databases: `users_test` for development and `users_prod` for production.

## Prerequisites

1. Install PostgreSQL on your system
2. Ensure PostgreSQL service is running

## Database Setup

### 1. Create User and Databases

Connect to PostgreSQL as superuser and run:

```sql
-- Create user
CREATE USER devuser WITH PASSWORD 'password';

-- Create databases
CREATE DATABASE users_test OWNER devuser;
CREATE DATABASE users_prod OWNER devuser;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE users_test TO devuser;
GRANT ALL PRIVILEGES ON DATABASE users_prod TO devuser;

-- Connect to each database and enable UUID extension
\c users_test
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c users_prod
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 2. Update Environment Variables

Copy `.env.example` to `.env` and update the database connection string:

```bash
cp .env.example .env
```

Update the `DATABASE_URL` in `.env`:

```
DATABASE_URL="postgresql://devuser:password@localhost:5432/users_test"
```

### 3. Run Migrations

```bash
# Generate Prisma client
npm run db:generate

# Apply migrations
npm run db:migrate

# Run seed data
npm run db:seed
```

## Alternative: Using Docker

If you prefer using Docker:

```bash
# Start PostgreSQL container
docker run --name skill-sheet-postgres \
  -e POSTGRES_USER=devuser \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=users_test \
  -p 5432:5432 \
  -d postgres:15

# Create production database
docker exec -it skill-sheet-postgres createdb -U devuser users_prod

# Enable UUID extension in both databases
docker exec -it skill-sheet-postgres psql -U devuser -d users_test -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
docker exec -it skill-sheet-postgres psql -U devuser -d users_prod -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
```

## Troubleshooting

1. **Connection refused**: Make sure PostgreSQL is running
2. **Authentication failed**: Verify username/password in `.env`
3. **Database does not exist**: Create the databases as shown above
4. **Permission denied**: Grant proper privileges to the user
