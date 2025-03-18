
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { BalanceCard } from "./BalanceCard";
import { TransactionsList } from "./TransactionsList";
import { TransactionDialogs } from "./TransactionDialogs";
import type { Transaction } from "@/types/transaction";
import { TrendingUp } from "lucide-react";
import { Card } from "./ui/card";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useBalance } from "@/context/BalanceContext";
import { MLTransactionCategorizer } from "@/utils/mlTransactionCategorizer";
import { fetchTransactions, addTransaction, fetchBalance } from "@/services/api";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { totalBalance, setTotalBalance } = useBalance();
  const [showTransactions, setShowTransactions] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const monthlyChange = 2.5;
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Try to fetch balance from API, fallback to default if fails
        let balance = 99;
        try {
          balance = await fetchBalance();
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
        setTotalBalance(balance);
        
        // Try to fetch transactions, fallback to default if fails
        let loadedTransactions: Transaction[] = [];
        try {
          loadedTransactions = await fetchTransactions();
          // Use ML categorization for transactions
          loadedTransactions = await MLTransactionCategorizer.categorizeTransactions(loadedTransactions);
        } catch (error) {
          console.error("Error loading transactions:", error);
          loadedTransactions = [{ 
            id: 1, 
            description: 'Initial Balance', 
            amount: 99, 
            date: new Date().toISOString().split('T')[0], 
            type: 'income',
            category: 'Income'
          }];
        }
        
        setTransactions(loadedTransactions);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data. Using default data instead.");
        
        setTransactions([{ 
          id: 1, 
          description: 'Initial Balance', 
          amount: 99, 
          date: new Date().toISOString().split('T')[0], 
          type: 'income',
          category: 'Income'
        }]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [setTotalBalance]);

  const getPokemonImage = (balance: number) => {
    if (balance >= 100000) {
      return "/lovable-uploads/67ddfc20-3fa2-488c-a3bc-9f8e662214d8.png"; // Infernape
    } else if (balance >= 10000) {
      return "/lovable-uploads/48c4589b-a4a3-402d-a2e6-9b1c95e7a9c2.png"; // Monferno
    } else {
      return "/lovable-uploads/697cab9d-b32f-42e8-b73a-a53f3675d7ba.png"; // Chimchar
    }
  };

  const getPokemonName = (balance: number) => {
    if (balance >= 100000) return "Infernape";
    if (balance >= 10000) return "Monferno";
    return "Chimchar";
  };

  const handleAddFunds = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await addTransaction({
        description: description || 'Added Funds',
        amount: numAmount,
        type: 'income'
      });
      
      const newBalance = totalBalance + numAmount;
      setTotalBalance(newBalance);
      
      if (totalBalance < 10000 && newBalance >= 10000) {
        toast.success("🎉 Congratulations! Your Chimchar has evolved into Monferno!", {
          duration: 5000
        });
      } else if (totalBalance < 100000 && newBalance >= 100000) {
        toast.success("🎉 Congratulations! Your Monferno has evolved into Infernape!", {
          duration: 5000
        });
      }
      
      const desc = description || 'Added Funds';
      
      // Use ML categorization for the new transaction
      const category = await MLTransactionCategorizer.categorizeTransaction(desc, numAmount);
      
      const newTransaction: Transaction = {
        id: Date.now(),
        description: desc,
        amount: numAmount,
        date: new Date().toISOString().split('T')[0],
        type: 'income',
        category
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setAmount("");
      setDescription("");
      setShowAddDialog(false);
      toast.success(`Successfully added $${numAmount.toLocaleString()}`);
      
      const updatedTransactions = await fetchTransactions();
      const categorizedTransactions = await MLTransactionCategorizer.categorizeTransactions(updatedTransactions);
      setTransactions(categorizedTransactions);
    } catch (error) {
      console.error("Error adding funds:", error);
      toast.error("Failed to add funds. Please try again.");
    }
  };

  const handleWithdraw = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (numAmount > totalBalance) {
      toast.error("Insufficient funds");
      return;
    }

    try {
      await addTransaction({
        description: description || 'Withdrawal',
        amount: numAmount,
        type: 'expense'
      });
      
      setTotalBalance(totalBalance - numAmount);
      
      const desc = description || 'Withdrawal';
      
      // Use ML categorization for the new transaction
      const category = await MLTransactionCategorizer.categorizeTransaction(desc, numAmount);
      
      const newTransaction: Transaction = {
        id: Date.now(),
        description: desc,
        amount: numAmount,
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        category
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setAmount("");
      setDescription("");
      setShowWithdrawDialog(false);
      toast.success(`Successfully withdrew $${numAmount.toLocaleString()}`);
      
      const updatedTransactions = await fetchTransactions();
      const categorizedTransactions = await MLTransactionCategorizer.categorizeTransactions(updatedTransactions);
      setTransactions(categorizedTransactions);
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      toast.error("Failed to withdraw funds. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="relative flex justify-center items-center mb-12">
          <h2 className="text-4xl font-bold text-white tracking-wider opacity-90 hover:opacity-100 transition-opacity duration-300 absolute left-1/2 transform -translate-x-1/2" 
              style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                letterSpacing: '0.2em'
              }}>
            evolve
          </h2>
          
          <div className="ml-auto flex space-x-4">
            <Card 
              className="glass-card px-5 py-2.5 flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate('/investments')}
            >
              <TrendingUp className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">Investments</span>
            </Card>
            
            <Card 
              className="glass-card px-5 py-2.5 flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate('/chat')}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={getPokemonImage(totalBalance)}
                  alt={getPokemonName(totalBalance)}
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
          description={description}
          setDescription={setDescription}
          handleAddFunds={handleAddFunds}
          handleWithdraw={handleWithdraw}
        />

        {showTransactions && (
          <TransactionsList transactions={transactions} />
        )}
      </div>

      <img 
        src={getPokemonImage(totalBalance)}
        alt={getPokemonName(totalBalance)}
        className="fixed bottom-6 right-6 w-40 h-40 cursor-pointer hover:scale-110 transition-transform duration-200 animate-slide"
        onClick={() => {
          navigate('/chat');
          toast.success(`Hey! I'm ${getPokemonName(totalBalance)}, your financial buddy! 🔥`);
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
