
import { Router } from 'express';
import { pool, cacheData, getCachedData } from '../db';
import { categorizeTransaction } from '../../utils/transactionCategorizer';

const router = Router();

// Get all transactions for a user
router.get('/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Try to get from cache first
    const cacheKey = `transactions:${userId}`;
    const cachedData = await getCachedData(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }
    
    // If not in cache, get from database
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY transaction_date DESC LIMIT 100',
      [userId]
    );
    
    // Store in cache for 5 minutes
    await cacheData(cacheKey, result.rows, 300);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Add a new transaction
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { userId, description, amount, type } = req.body;
    
    if (!userId || !description || !amount || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Determine category
    const category = categorizeTransaction(description, parseFloat(amount));
    
    await client.query('BEGIN');
    
    // Insert transaction
    const transactionResult = await client.query(
      'INSERT INTO transactions (user_id, description, amount, type, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, description, amount, type, category]
    );
    
    // Update user balance
    const balanceChange = type === 'income' ? amount : -amount;
    await client.query(
      'UPDATE users SET total_balance = total_balance + $1 WHERE id = $2 RETURNING total_balance',
      [balanceChange, userId]
    );
    
    // Record balance history
    const balanceResult = await client.query(
      'SELECT total_balance FROM users WHERE id = $1',
      [userId]
    );
    
    await client.query(
      'INSERT INTO user_balance_history (user_id, balance) VALUES ($1, $2)',
      [userId, balanceResult.rows[0].total_balance]
    );
    
    await client.query('COMMIT');
    
    // Invalidate cache
    await getCachedData(`transactions:${userId}`);
    
    res.status(201).json(transactionResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Failed to add transaction' });
  } finally {
    client.release();
  }
});

export default router;
