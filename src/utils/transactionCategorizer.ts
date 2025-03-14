
// Basic machine learning categorizer for transactions
// This is a simple rule-based system that could be replaced with a more sophisticated ML model in the future

type CategoryRule = {
  keywords: string[];
  category: string;
};

// Define category rules with keywords that suggest different spending categories
const categoryRules: CategoryRule[] = [
  {
    keywords: ['grocery', 'groceries', 'food', 'supermarket', 'market', 'fruit', 'vegetable', 'meat', 'dairy', 'bread', 'milk', 'egg'],
    category: 'Groceries'
  },
  {
    keywords: ['restaurant', 'cafe', 'coffee', 'dinner', 'lunch', 'breakfast', 'takeout', 'takeaway', 'delivery', 'uber eats', 'doordash'],
    category: 'Dining Out'
  },
  {
    keywords: ['rent', 'mortgage', 'housing', 'apartment', 'condo', 'house payment'],
    category: 'Housing'
  },
  {
    keywords: ['electricity', 'water', 'gas', 'internet', 'phone', 'utility', 'bill', 'subscription', 'netflix', 'spotify', 'hulu', 'disney'],
    category: 'Bills & Utilities'
  },
  {
    keywords: ['transport', 'transportation', 'gas', 'fuel', 'uber', 'lyft', 'taxi', 'bus', 'train', 'subway', 'transit', 'car', 'vehicle'],
    category: 'Transportation'
  },
  {
    keywords: ['health', 'medical', 'doctor', 'hospital', 'clinic', 'pharmacy', 'medicine', 'prescription', 'insurance'],
    category: 'Healthcare'
  },
  {
    keywords: ['entertainment', 'movie', 'game', 'gaming', 'concert', 'theatre', 'theater', 'show', 'event', 'ticket'],
    category: 'Entertainment'
  },
  {
    keywords: ['clothing', 'clothes', 'shoes', 'apparel', 'fashion', 'accessory', 'accessories', 'jewelry'],
    category: 'Shopping'
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
    category: 'Education'
  }
];

/**
 * Categorizes a transaction based on its description
 * @param description The transaction description
 * @returns The determined category or 'Other' if no category matches
 */
export const categorizeTransaction = (description: string): string => {
  const lowerDesc = description.toLowerCase();
  
  for (const rule of categoryRules) {
    if (rule.keywords.some(keyword => lowerDesc.includes(keyword.toLowerCase()))) {
      return rule.category;
    }
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
        category: categorizeTransaction(transaction.description)
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
