import { Card } from "@/components/ui/card";
import type { Transaction } from "@/types/transaction";

interface TransactionsListProps {
  transactions: Transaction[];
}

export const TransactionsList = ({ transactions }: TransactionsListProps) => {
  return (
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
  );
};