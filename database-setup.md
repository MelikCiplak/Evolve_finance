
# Database Setup Instructions

This application uses PostgreSQL with TimescaleDB extension for time-series data and Redis for caching.

## Prerequisites

1. PostgreSQL (version 12+) with TimescaleDB extension
2. Redis (version 6+)
3. Node.js (version 14+)

## Setup Steps

### 1. Install PostgreSQL and TimescaleDB

#### Using Docker (recommended)

```bash
# Pull TimescaleDB image (includes PostgreSQL)
docker pull timescale/timescaledb:latest-pg14

# Run TimescaleDB container
docker run -d --name timescaledb \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  timescale/timescaledb:latest-pg14
```

#### Manual Installation
Follow the instructions at https://docs.timescale.com/install/latest/

### 2. Install Redis

#### Using Docker

```bash
# Pull Redis image
docker pull redis:latest

# Run Redis container
docker run -d --name redis \
  -p 6379:6379 \
  redis:latest
```

#### Manual Installation
Follow the instructions at https://redis.io/docs/getting-started/

### 3. Create Database and Tables

Connect to your PostgreSQL instance and run the SQL in `src/server/sql/schema.sql`.

```bash
# Using psql
psql -U postgres -h localhost -f src/server/sql/schema.sql
```

### 4. Set Environment Variables

Create a .env file in the root of your project with these variables:

```
# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=evolve_finance
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Server
SERVER_PORT=3001
VITE_API_URL=http://localhost:3001/api
```

### 5. Start the Backend Server

```bash
# Start the server
node dist/server/index.js
```

### 6. Start the Frontend

```bash
# Start the frontend development server
npm run dev
```

## Database Schema

### Transactions Table
- Contains all financial transactions
- Uses TimescaleDB hypertable for efficient time-series querying
- Indexed for optimal performance

### Users Table
- Stores user information and current balance

### User Balance History Table
- Records balance changes over time as a time-series
- Allows for time-bucketed queries to analyze balance trends

## Redis Caching Strategy

The application uses Redis to cache:
- Recent transactions lists
- Current user balances
- Balance history aggregations

Cache invalidation occurs when:
- New transactions are added
- Balances are updated

Cache TTL (Time-To-Live):
- Transactions: 5 minutes
- Balance: 5 minutes
- Balance history: 1 hour
