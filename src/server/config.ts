
import dotenv from 'dotenv';
dotenv.config();

// Database Configuration
export const dbConfig = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'evolve_finance',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
};

// Redis Configuration
export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || '',
};

// Server Configuration
export const serverConfig = {
  port: parseInt(process.env.SERVER_PORT || '3001'),
};

// NLP Configuration for transaction categorization
export const nlpConfig = {
  // Default confidence threshold for ML categorization
  confidenceThreshold: parseFloat(process.env.NLP_CONFIDENCE_THRESHOLD || '0.65'),
  // Cache time for NLP model results in seconds
  cacheTime: parseInt(process.env.NLP_CACHE_TIME || '86400'),
};
