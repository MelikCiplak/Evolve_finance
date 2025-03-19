
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchBalance } from '@/services/api';

interface BalanceContextType {
  totalBalance: number;
  setTotalBalance: (balance: number) => void;
  isLoading: boolean;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export function BalanceProvider({ children }: { children: ReactNode }) {
  const [totalBalance, setTotalBalance] = useState(99.00);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBalance = async () => {
      try {
        setIsLoading(true);
        const balance = await fetchBalance();
        setTotalBalance(balance);
      } catch (error) {
        console.error('Error loading balance:', error);
        // Use default balance as fallback
      } finally {
        setIsLoading(false);
      }
    };

    loadBalance();
  }, []);

  return (
    <BalanceContext.Provider value={{ totalBalance, setTotalBalance, isLoading }}>
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
}
