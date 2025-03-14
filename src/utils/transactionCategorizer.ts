
import { Transaction } from "@/types/transaction";

// Basic machine learning categorizer for transactions
// This is a simple rule-based system that could be replaced with a more sophisticated ML model in the future

type CategoryRule = {
  keywords: string[];
  category: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
};

// Define category rules with keywords and price ranges that suggest different spending categories
const categoryRules: CategoryRule[] = [
  {
    keywords: ['grocery', 'groceries', 'food', 'supermarket', 'market', 'fruit', 'vegetable', 'meat', 'dairy', 'bread', 'milk', 'egg'],
    category: 'Groceries',
    priceRange: {
      min: 5,
      max: 300
    }
  },
  {
    keywords: ['restaurant', 'cafe', 'coffee', 'dinner', 'lunch', 'breakfast', 'takeout', 'takeaway', 'delivery', 'uber eats', 'doordash'],
    category: 'Dining Out',
    priceRange: {
      min: 5,
      max: 200
    }
  },
  {
    keywords: ['rent', 'mortgage', 'housing', 'apartment', 'condo', 'house payment'],
    category: 'Housing',
    priceRange: {
      min: 500,
      max: 5000
    }
  },
  {
    keywords: ['electricity', 'water', 'gas', 'internet', 'phone', 'utility', 'bill', 'subscription', 'netflix', 'spotify', 'hulu', 'disney'],
    category: 'Bills & Utilities',
    priceRange: {
      min: 10,
      max: 300
    }
  },
  {
    keywords: ['transport', 'transportation', 'gas', 'fuel', 'uber', 'lyft', 'taxi', 'bus', 'train', 'subway', 'transit', 'car', 'vehicle'],
    category: 'Transportation',
    priceRange: {
      min: 5,
      max: 200
    }
  },
  {
    keywords: ['health', 'medical', 'doctor', 'hospital', 'clinic', 'pharmacy', 'medicine', 'prescription', 'insurance'],
    category: 'Healthcare',
    priceRange: {
      min: 20,
      max: 1000
    }
  },
  {
    keywords: ['entertainment', 'movie', 'game', 'gaming', 'concert', 'theatre', 'theater', 'show', 'event', 'ticket'],
    category: 'Entertainment',
    priceRange: {
      min: 10,
      max: 200
    }
  },
  {
    keywords: ['clothing', 'clothes', 'shoes', 'apparel', 'fashion', 'accessory', 'accessories', 'jewelry'],
    category: 'Shopping',
    priceRange: {
      min: 20,
      max: 500
    }
  },
  {
    keywords: ['salary', 'income', 'payment', 'paycheck', 'deposit', 'wage', 'earnings', 'tax return', 'bonus', 'commission'],
    category: 'Income'
  },
  {
    keywords: ['transfer', 'wire', 'send', 'zelle', 'venmo', 'paypal', 'cash app'],
    category: 'Transfers'
  },
  {
    keywords: ['education', 'school', 'college', 'university', 'tuition', 'course', 'class', 'book', 'textbook'],
    category: 'Education',
    priceRange: {
      min: 20,
      max: 20000
    }
  }
];

/**
 * Categorizes a transaction based on its description and amount
 * @param description The transaction description
 * @param amount The transaction amount
 * @returns The determined category or 'Other' if no category matches
 */
export const categorizeTransaction = (description: string, amount: number = 0): string => {
  const lowerDesc = description.toLowerCase();
  
  // First try to match by both keywords and price range
  for (const rule of categoryRules) {
    const keywordMatch = rule.keywords.some(keyword => lowerDesc.includes(keyword.toLowerCase()));
    
    if (keywordMatch) {
      // If there's a price range defined, check if the amount falls within that range
      if (rule.priceRange) {
        const { min, max } = rule.priceRange;
        if ((min === undefined || amount >= min) && (max === undefined || amount <= max)) {
          return rule.category;
        }
      } else {
        return rule.category;
      }
    }
  }
  
  // If no match by keywords+price, try to categorize by price range only
  if (amount >= 500 && amount <= 5000) {
    return 'Housing';
  } else if (amount >= 200 && amount <= 1000) {
    return 'Major Expense';
  } else if (amount >= 50 && amount <= 200) {
    return 'Moderate Expense';
  } else if (amount > 0 && amount < 50) {
    return 'Minor Expense';
  }
  
  return 'Other';
};

/**
 * Categorizes multiple transactions at once
 * @param transactions Array of transactions to categorize
 * @returns New array with categorized transactions
 */
export const categorizeTransactions = (transactions: Transaction[]): Transaction[] => {
  return transactions.map(transaction => {
    if (!transaction.category) {
      return {
        ...transaction,
        category: categorizeTransaction(transaction.description, transaction.amount)
      };
    }
    return transaction;
  });
};

/**
 * Gets transaction summary by category
 * @param transactions Array of categorized transactions
 * @returns Object with categories as keys and total amounts as values
 */
export const getCategorySummary = (transactions: Transaction[]): Record<string, number> => {
  const summary: Record<string, number> = {};
  
  transactions.forEach(transaction => {
    const category = transaction.category || 'Other';
    const amount = transaction.amount;
    
    if (summary[category]) {
      summary[category] += transaction.type === 'expense' ? amount : 0;
    } else {
      summary[category] = transaction.type === 'expense' ? amount : 0;
    }
  });
  
  return summary;
};
