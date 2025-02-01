import { useState } from "react";
import { toast } from "sonner";
import { BalanceCard } from "./BalanceCard";
import { TransactionsList } from "./TransactionsList";
import { TransactionDialogs } from "./TransactionDialogs";
import type { Transaction } from "@/types/transaction";

export const Dashboard = () => {
  const [showTransactions, setShowTransactions] = useState(false);
  const [amount, setAmount] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  
  const [totalBalance, setTotalBalance] = useState(99.00);
  const monthlyChange = 2.5;
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, description: 'Initial Balance', amount: 99, date: new Date().toISOString().split('T')[0], type: 'income' },
  ]);

  const handleAddFunds = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setTotalBalance(prev => prev + numAmount);
    const newTransaction: Transaction = {
      id: transactions.length + 1,
      description: 'Added Funds',
      amount: numAmount,
      date: new Date().toISOString().split('T')[0],
      type: 'income'
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setAmount("");
    setShowAddDialog(false);
    toast.success(`Successfully added $${numAmount.toLocaleString()}`);
  };

  const handleWithdraw = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (numAmount > totalBalance) {
      toast.error("Insufficient funds");
      return;
    }

    setTotalBalance(prev => prev - numAmount);
    const newTransaction: Transaction = {
      id: transactions.length + 1,
      description: 'Withdrawal',
      amount: numAmount,
      date: new Date().toISOString().split('T')[0],
      type: 'expense'
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setAmount("");
    setShowWithdrawDialog(false);
    toast.success(`Successfully withdrew $${numAmount.toLocaleString()}`);
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <BalanceCard 
          totalBalance={totalBalance}
          monthlyChange={monthlyChange}
          onClick={() => setShowTransactions(!showTransactions)}
        />

        <TransactionDialogs 
          showAddDialog={showAddDialog}
          showWithdrawDialog={showWithdrawDialog}
          setShowAddDialog={setShowAddDialog}
          setShowWithdrawDialog={setShowWithdrawDialog}
          amount={amount}
          setAmount={setAmount}
          handleAddFunds={handleAddFunds}
          handleWithdraw={handleWithdraw}
        />

        {showTransactions && (
          <TransactionsList transactions={transactions} />
        )}
      </div>
    </div>
  );
};