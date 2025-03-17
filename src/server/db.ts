
import { Pool } from 'pg';
import { dbConfig } from './config';
import { createClient } from 'redis';
import { redisConfig } from './config';

// Create PostgreSQL connection pool
export const pool = new Pool(dbConfig);

// Initialize Redis client
export const redisClient = createClient({
  url: `redis://${redisConfig.password ? `:${redisConfig.password}@` : ''}${redisConfig.host}:${redisConfig.port}`,
});

(async () => {
  try {
    // Connect to Redis
    await redisClient.connect();
    console.log('Connected to Redis successfully');
    
    // Test PostgreSQL connection and setup TimescaleDB extension if needed
    const client = await pool.connect();
    try {
      // Check if TimescaleDB extension is installed
      const extResult = await client.query(
        "SELECT exists(SELECT 1 FROM pg_extension WHERE extname = 'timescaledb')"
      );
      
      if (!extResult.rows[0].exists) {
        console.log('Installing TimescaleDB extension...');
        await client.query('CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;');
        console.log('TimescaleDB extension installed');
      } else {
        console.log('TimescaleDB extension already installed');
      }
      
      console.log('Connected to PostgreSQL successfully');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Database connection error:', err);
  }
})();

// Cache middleware for frequently accessed data
export const cacheData = async (key: string, data: any, ttl = 3600) => {
  await redisClient.setEx(key, ttl, JSON.stringify(data));
};

export const getCachedData = async (key: string) => {
  const cachedData = await redisClient.get(key);
  return cachedData ? JSON.parse(cachedData) : null;
};
