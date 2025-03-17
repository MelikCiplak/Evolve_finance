
import express from 'express';
import cors from 'cors';
import { serverConfig } from './config';
import transactionRoutes from './routes/transactions';
import balanceRoutes from './routes/balance';

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

// Start server
app.listen(serverConfig.port, () => {
  console.log(`Server running on port ${serverConfig.port}`);
});

export default app;
