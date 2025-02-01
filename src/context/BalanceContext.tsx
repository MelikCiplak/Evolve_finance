import { createContext, useContext, useState, ReactNode } from 'react';

interface BalanceContextType {
  totalBalance: number;
  setTotalBalance: (balance: number) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export function BalanceProvider({ children }: { children: ReactNode }) {
  const [totalBalance, setTotalBalance] = useState(99.00);

  return (
    <BalanceContext.Provider value={{ totalBalance, setTotalBalance }}>
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