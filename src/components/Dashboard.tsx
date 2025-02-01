import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useState } from "react";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

export const Dashboard = () => {
  const [showTransactions, setShowTransactions] = useState(false);
  
  // Mock data - in a real app this would come from an API
  const monthlyChange = 2.5;
  const totalBalance = 24563.00;
  const transactions: Transaction[] = [
    { id: 1, description: 'Salary', amount: 5000, date: '2024-04-01', type: 'income' },
    { id: 2, description: 'Rent', amount: 1500, date: '2024-04-02', type: 'expense' },
    { id: 3, description: 'Groceries', amount: 200, date: '2024-04-03', type: 'expense' },
    { id: 4, description: 'Freelance Work', amount: 1000, date: '2024-04-04', type: 'income' },
  ];

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