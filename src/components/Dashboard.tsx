import { useState } from "react";
import { toast } from "sonner";
import { BalanceCard } from "./BalanceCard";
import { TransactionsList } from "./TransactionsList";
import { TransactionDialogs } from "./TransactionDialogs";
import type { Transaction } from "@/types/transaction";
import { MessageCircle } from "lucide-react";
import { Card } from "./ui/card";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const Dashboard = () => {
  const navigate = useNavigate();
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
        <div className="relative flex justify-center items-center mb-12">
          <h2 className="text-4xl font-bold tracking-wider text-[#222222] opacity-80 hover:opacity-100 transition-opacity duration-300 absolute left-1/2 transform -translate-x-1/2" 
              style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                letterSpacing: '0.2em'
              }}>
            evolve
          </h2>
          
          <div className="ml-auto">
            <Card 
              className="glass-card px-5 py-2.5 flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate('/chat')}
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src="/lovable-uploads/697cab9d-b32f-42e8-b73a-a53f3675d7ba.png" alt="Chimchar" />
                <AvatarFallback>CH</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-white">ChatBuddy</span>
            </Card>
          </div>
        </div>

        <div className="mt-16">
          <BalanceCard 
            totalBalance={totalBalance}
            monthlyChange={monthlyChange}
            onClick={() => setShowTransactions(!showTransactions)}
          />
        </div>

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

      {/* Floating Chimchar Icon */}
      <div 
        className="fixed bottom-6 right-6 cursor-pointer transform hover:scale-110 transition-transform duration-200"
        onClick={() => {
          navigate('/chat');
          toast.success("Hey! I'm Chimchar, your financial buddy! 🔥");
        }}
      >
        <Avatar className="h-16 w-16 shadow-lg hover:shadow-xl transition-shadow ring-2 ring-orange-500 hover:ring-4">
          <AvatarImage 
            src="/lovable-uploads/697cab9d-b32f-42e8-b73a-a53f3675d7ba.png" 
            alt="Chimchar"
            className="animate-bounce"
          />
          <AvatarFallback className="bg-orange-500 text-white">CH</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};