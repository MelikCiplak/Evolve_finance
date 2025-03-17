
import type { Transaction } from '@/types/transaction';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Default user ID (in a real app, this would come from authentication)
const DEFAULT_USER_ID = 1;

export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await fetch(`${API_URL}/transactions/${DEFAULT_USER_ID}`);
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date' | 'category'>): Promise<Transaction> => {
  try {
    const response = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: DEFAULT_USER_ID,
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add transaction');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

export const fetchBalance = async (): Promise<number> => {
  try {
    const response = await fetch(`${API_URL}/balance/${DEFAULT_USER_ID}`);
    if (!response.ok) {
      throw new Error('Failed to fetch balance');
    }
    const data = await response.json();
    return data.total_balance;
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
};

export const fetchBalanceHistory = async (interval: 'day' | 'week' | 'month' = 'day') => {
  try {
    const response = await fetch(`${API_URL}/balance/${DEFAULT_USER_ID}/history?interval=${interval}`);
    if (!response.ok) {
      throw new Error('Failed to fetch balance history');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching balance history:', error);
    throw error;
  }
};
