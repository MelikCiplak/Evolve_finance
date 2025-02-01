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

    const newBalance = totalBalance + numAmount;
    setTotalBalance(newBalance);
    
    // Check if evolution should occur
    if (totalBalance < 10000 && newBalance >= 10000) {
      toast.success("🎉 Congratulations! Your Chimchar has evolved into Monferno!", {
        duration: 5000
      });
    }

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
                <AvatarImage 
                  src={totalBalance >= 10000 
                    ? "/lovable-uploads/48c4589b-a4a3-402d-a2e6-9b1c95e7a9c2.png" 
                    : "/lovable-uploads/697cab9d-b32f-42e8-b73a-a53f3675d7ba.png"} 
                  alt={totalBalance >= 10000 ? "Monferno" : "Chimchar"} 
                />
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

      {/* Floating Pokemon Icon */}
      <img 
        src={totalBalance >= 10000 
          ? "/lovable-uploads/48c4589b-a4a3-402d-a2e6-9b1c95e7a9c2.png" 
          : "/lovable-uploads/697cab9d-b32f-42e8-b73a-a53f3675d7ba.png"}
        alt={totalBalance >= 10000 ? "Monferno" : "Chimchar"}
        className="fixed bottom-6 right-6 w-16 h-16 cursor-pointer hover:scale-110 transition-transform duration-200 animate-slide"
        onClick={() => {
          navigate('/chat');
          toast.success(`Hey! I'm ${totalBalance >= 10000 ? 'Monferno' : 'Chimchar'}, your financial buddy! 🔥`);
        }}
        style={{
          animation: 'slide 2s ease-in-out infinite alternate'
        }}
      />

      <style>
        {`
          @keyframes slide {
            from {
              transform: translateX(-20px);
            }
            to {
              transform: translateX(20px);
            }
          }
          .animate-slide {
            animation: slide 2s ease-in-out infinite alternate;
          }
        `}
      </style>
    </div>
  );
};