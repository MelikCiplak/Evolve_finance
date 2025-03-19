
-- Create transactions hypertable for time-series data
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL, 
  transaction_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT
);

-- Convert transactions to a TimescaleDB hypertable
SELECT create_hypertable('transactions', 'transaction_date', if_not_exists => TRUE);

-- Create indexes for faster querying
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  total_balance DECIMAL(12, 2) DEFAULT 99.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_balance_history hypertable for storing balance changes over time
CREATE TABLE IF NOT EXISTS user_balance_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  balance DECIMAL(12, 2) NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Convert user_balance_history to a TimescaleDB hypertable
SELECT create_hypertable('user_balance_history', 'recorded_at', if_not_exists => TRUE);
