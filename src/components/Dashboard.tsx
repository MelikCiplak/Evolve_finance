import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowUpRight, ArrowDownRight, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

export const Dashboard = () => {
  const [showTransactions, setShowTransactions] = useState(false);
  const [amount, setAmount] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  
  // Mock data - in a real app this would come from an API
  const [totalBalance, setTotalBalance] = useState(24563.00);
  const monthlyChange = 2.5;
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, description: 'Salary', amount: 5000, date: '2024-04-01', type: 'income' },
    { id: 2, description: 'Rent', amount: 1500, date: '2024-04-02', type: 'expense' },
    { id: 3, description: 'Groceries', amount: 200, date: '2024-04-03', type: 'expense' },
    { id: 4, description: 'Freelance Work', amount: 1000, date: '2024-04-04', type: 'income' },
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
        <Card 
          className="glass-card p-8 cursor-pointer hover:scale-[1.02] transition-transform"
          onClick={() => setShowTransactions(!showTransactions)}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Balance</p>
              <h2 className="text-5xl font-bold mt-2 text-white">${totalBalance.toLocaleString()}</h2>
              <div className="flex items-center mt-4 gap-1">
                {monthlyChange >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <p className={`text-sm ${monthlyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {monthlyChange}% from last month
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex gap-4 justify-center">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="w-32" variant="outline">
                <Plus className="mr-2" /> Add Funds
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Funds</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Button onClick={handleAddFunds} className="w-full">
                  Add Funds
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
            <DialogTrigger asChild>
              <Button className="w-32" variant="outline">
                <Minus className="mr-2" /> Withdraw
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Withdraw Funds</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Button onClick={handleWithdraw} className="w-full">
                  Withdraw
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {showTransactions && (
          <Card className="glass-card p-6 animate-in">
            <h3 className="text-xl font-semibold mb-4 text-white">Recent Transactions</h3>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-900"
                >
                  <div>
                    <p className="font-medium text-white">{transaction.description}</p>
                    <p className="text-sm text-gray-400">{transaction.date}</p>
                  </div>
                  <p className={`font-mono font-medium ${
                    transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};