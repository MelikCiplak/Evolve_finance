import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface BalanceCardProps {
  totalBalance: number;
  monthlyChange: number;
  onClick: () => void;
}

export const BalanceCard = ({ totalBalance, monthlyChange, onClick }: BalanceCardProps) => {
  return (
    <Card 
      className="glass-card p-8 cursor-pointer hover:scale-[1.02] transition-transform"
      onClick={onClick}
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
  );
};