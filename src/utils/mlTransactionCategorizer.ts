
import { Transaction } from "@/types/transaction";
import { categorizeTransaction as basicCategorizeTransaction } from "./transactionCategorizer";
import { nlpConfig } from "@/server/config";
import { redisClient, getCachedData, cacheData } from "@/server/db";

// Define the data structure for ML model predictions
interface CategoryPrediction {
  category: string;
  confidence: number;
}

// Enhanced transaction categorizer with ML capabilities
export class MLTransactionCategorizer {
  // Simple NLP feature extraction - creates a bag of words from the transaction description
  private static extractFeatures(description: string): Record<string, number> {
    const words = description.toLowerCase().split(/\W+/).filter(word => word.length > 2);
    const features: Record<string, number> = {};
    
    words.forEach(word => {
      features[word] = (features[word] || 0) + 1;
    });
    
    return features;
  }

  // Extract numeric features from the transaction amount
  private static extractAmountFeatures(amount: number): Record<string, number> {
    return {
      'amount': amount,
      'amount_log': Math.log(Math.max(amount, 1)),
      'amount_squared': amount * amount,
      'is_small': amount < 20 ? 1 : 0,
      'is_medium': amount >= 20 && amount < 100 ? 1 : 0,
      'is_large': amount >= 100 && amount < 500 ? 1 : 0,
      'is_very_large': amount >= 500 ? 1 : 0,
    };
  }

  // Predict category using a machine learning approach
  private static async predictCategory(description: string, amount: number): Promise<CategoryPrediction> {
    const cacheKey = `ml_category:${description}:${amount}`;
    
    // Try to get cached prediction first
    try {
      const cachedPrediction = await getCachedData(cacheKey);
      if (cachedPrediction) {
        console.log('Using cached ML prediction for:', description);
        return cachedPrediction;
      }
    } catch (error) {
      console.error('Error accessing cache:', error);
      // Continue with prediction if cache fails
    }
    
    // Extract text features
    const textFeatures = this.extractFeatures(description);
    
    // Extract amount features
    const amountFeatures = this.extractAmountFeatures(amount);
    
    // Combine features
    const features = {
      ...textFeatures,
      ...amountFeatures
    };
    
    // This would normally call a trained ML model
    // For now, we're implementing a simplified ML-like approach 
    // that uses both text patterns and amount ranges
    
    // Sample categories with confidence scores
    const possibleCategories: CategoryPrediction[] = [
      // Groceries prediction logic
      {
        category: 'Groceries',
        confidence: this.calculateGroceryConfidence(description, amount, features)
      },
      // Dining out prediction logic
      {
        category: 'Dining Out',
        confidence: this.calculateDiningConfidence(description, amount, features)
      },
      // Housing prediction logic
      {
        category: 'Housing',
        confidence: this.calculateHousingConfidence(description, amount, features)
      },
      // Bills & Utilities prediction logic
      {
        category: 'Bills & Utilities',
        confidence: this.calculateUtilitiesConfidence(description, amount, features)
      },
      // Transportation prediction logic
      {
        category: 'Transportation',
        confidence: this.calculateTransportationConfidence(description, amount, features)
      },
      // Shopping prediction logic
      {
        category: 'Shopping',
        confidence: this.calculateShoppingConfidence(description, amount, features)
      },
      // Income prediction logic
      {
        category: 'Income',
        confidence: this.calculateIncomeConfidence(description, amount, features)
      }
    ];
    
    // Sort predictions by confidence
    const sortedPredictions = possibleCategories.sort((a, b) => b.confidence - a.confidence);
    const topPrediction = sortedPredictions[0];
    
    // If confidence is too low, use 'Other' category
    if (topPrediction.confidence < nlpConfig.confidenceThreshold) {
      topPrediction.category = 'Other';
    }
    
    // Cache the prediction
    try {
      await cacheData(cacheKey, topPrediction, nlpConfig.cacheTime);
    } catch (error) {
      console.error('Error caching prediction:', error);
    }
    
    return topPrediction;
  }
  
  // Category-specific confidence calculation methods
  private static calculateGroceryConfidence(description: string, amount: number, features: Record<string, number>): number {
    let confidence = 0;
    
    // Keywords related to groceries
    const groceryKeywords = ['grocery', 'groceries', 'food', 'supermarket', 'market', 'fruit', 'vegetable', 'meat', 'dairy'];
    groceryKeywords.forEach(keyword => {
      if (description.toLowerCase().includes(keyword)) {
        confidence += 0.15;
      }
    });
    
    // Amount-based confidence
    if (amount >= 10 && amount <= 300) {
      confidence += 0.2;
    } else if (amount < 10 || amount > 400) {
      confidence -= 0.1;
    }
    
    return Math.min(Math.max(confidence, 0), 1);
  }
  
  private static calculateDiningConfidence(description: string, amount: number, features: Record<string, number>): number {
    let confidence = 0;
    
    const diningKeywords = ['restaurant', 'cafe', 'coffee', 'dinner', 'lunch', 'breakfast', 'takeout', 'bar', 'grill'];
    diningKeywords.forEach(keyword => {
      if (description.toLowerCase().includes(keyword)) {
        confidence += 0.15;
      }
    });
    
    // Amount-based confidence
    if (amount >= 5 && amount <= 200) {
      confidence += 0.2;
    } else if (amount > 300) {
      confidence -= 0.2;
    }
    
    return Math.min(Math.max(confidence, 0), 1);
  }
  
  private static calculateHousingConfidence(description: string, amount: number, features: Record<string, number>): number {
    let confidence = 0;
    
    const housingKeywords = ['rent', 'mortgage', 'housing', 'apartment', 'condo', 'lease'];
    housingKeywords.forEach(keyword => {
      if (description.toLowerCase().includes(keyword)) {
        confidence += 0.2;
      }
    });
    
    // Amount-based confidence - housing payments are typically large
    if (amount >= 500 && amount <= 5000) {
      confidence += 0.3;
    } else if (amount < 300) {
      confidence -= 0.3;
    }
    
    return Math.min(Math.max(confidence, 0), 1);
  }
  
  private static calculateUtilitiesConfidence(description: string, amount: number, features: Record<string, number>): number {
    let confidence = 0;
    
    const utilityKeywords = ['electric', 'water', 'gas', 'internet', 'phone', 'utility', 'cable', 'bill', 'subscription'];
    utilityKeywords.forEach(keyword => {
      if (description.toLowerCase().includes(keyword)) {
        confidence += 0.15;
      }
    });
    
    // Amount-based confidence
    if (amount >= 10 && amount <= 300) {
      confidence += 0.2;
    } else if (amount > 500) {
      confidence -= 0.2;
    }
    
    return Math.min(Math.max(confidence, 0), 1);
  }
  
  private static calculateTransportationConfidence(description: string, amount: number, features: Record<string, number>): number {
    let confidence = 0;
    
    const transportKeywords = ['gas', 'fuel', 'uber', 'lyft', 'taxi', 'bus', 'train', 'transit', 'car', 'auto'];
    transportKeywords.forEach(keyword => {
      if (description.toLowerCase().includes(keyword)) {
        confidence += 0.15;
      }
    });
    
    // Amount-based confidence
    if (amount >= 5 && amount <= 150) {
      confidence += 0.2;
    } else if (amount > 300) {
      confidence -= 0.1;
    }
    
    return Math.min(Math.max(confidence, 0), 1);
  }
  
  private static calculateShoppingConfidence(description: string, amount: number, features: Record<string, number>): number {
    let confidence = 0;
    
    const shoppingKeywords = ['shop', 'store', 'buy', 'purchase', 'mall', 'clothing', 'clothes', 'shoes', 'apparel'];
    shoppingKeywords.forEach(keyword => {
      if (description.toLowerCase().includes(keyword)) {
        confidence += 0.15;
      }
    });
    
    // Amount-based confidence
    if (amount >= 20 && amount <= 500) {
      confidence += 0.2;
    } else if (amount < 5) {
      confidence -= 0.2;
    }
    
    return Math.min(Math.max(confidence, 0), 1);
  }
  
  private static calculateIncomeConfidence(description: string, amount: number, features: Record<string, number>): number {
    let confidence = 0;
    
    const incomeKeywords = ['salary', 'income', 'payment', 'paycheck', 'deposit', 'wage', 'earnings'];
    incomeKeywords.forEach(keyword => {
      if (description.toLowerCase().includes(keyword)) {
        confidence += 0.2;
      }
    });
    
    // Income is typically larger amounts
    if (amount >= 500) {
      confidence += 0.2;
    }
    
    return Math.min(Math.max(confidence, 0), 1);
  }

  // Public method to categorize a transaction
  public static async categorizeTransaction(description: string, amount: number = 0): Promise<string> {
    try {
      const prediction = await this.predictCategory(description, amount);
      console.log(`ML prediction for '${description}': ${prediction.category} (confidence: ${prediction.confidence.toFixed(2)})`);
      return prediction.category;
    } catch (error) {
      console.error('Error in ML categorization:', error);
      // Fallback to basic categorization
      return basicCategorizeTransaction(description, amount);
    }
  }

  // Public method to categorize multiple transactions
  public static async categorizeTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    const categorizedTransactions = [];
    
    for (const transaction of transactions) {
      if (!transaction.category) {
        const category = await this.categorizeTransaction(transaction.description, transaction.amount);
        categorizedTransactions.push({
          ...transaction,
          category
        });
      } else {
        categorizedTransactions.push(transaction);
      }
    }
    
    return categorizedTransactions;
  }
}
