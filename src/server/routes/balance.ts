
import { Router } from 'express';
import { pool, cacheData, getCachedData } from '../db';

const router = Router();

// Get user balance
router.get('/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Try to get from cache first
    const cacheKey = `balance:${userId}`;
    const cachedData = await getCachedData(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }
    
    // If not in cache, get from database
    const result = await pool.query(
      'SELECT total_balance FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Store in cache for 5 minutes
    await cacheData(cacheKey, result.rows[0], 300);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// Get user balance history (with TimescaleDB time bucketing)
router.get('/:userId/history', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const interval = req.query.interval || 'day';
    
    // Try to get from cache first
    const cacheKey = `balance-history:${userId}:${interval}`;
    const cachedData = await getCachedData(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }
    
    // Use TimescaleDB time_bucket for aggregation
    const result = await pool.query(
      `SELECT 
        time_bucket($1, recorded_at) AS time,
        AVG(balance) AS avg_balance,
        MAX(balance) AS max_balance,
        MIN(balance) AS min_balance
      FROM user_balance_history
      WHERE user_id = $2
      GROUP BY time
      ORDER BY time DESC
      LIMIT 100`,
      [interval === 'day' ? '1 day' : interval === 'week' ? '1 week' : '1 month', userId]
    );
    
    // Store in cache for 1 hour
    await cacheData(cacheKey, result.rows, 3600);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching balance history:', error);
    res.status(500).json({ error: 'Failed to fetch balance history' });
  }
});

export default router;
