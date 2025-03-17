
import express from 'express';
import cors from 'cors';
import { serverConfig } from './config';
import transactionRoutes from './routes/transactions';
import balanceRoutes from './routes/balance';
import { redisClient } from './db';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/balance', balanceRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ML model status endpoint
app.get('/api/ml/status', async (req, res) => {
  try {
    const isRedisConnected = redisClient.isReady;
    res.status(200).json({
      status: 'ok',
      cacheEnabled: isRedisConnected,
      modelReady: true,
    });
  } catch (error) {
    console.error('Error checking ML status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to check ML model status'
    });
  }
});

// Start server
app.listen(serverConfig.port, () => {
  console.log(`Server running on port ${serverConfig.port}`);
});

export default app;
