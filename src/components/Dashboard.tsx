import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Wallet, TrendingUp, PiggyBank } from "lucide-react";
import { useState } from "react";
import { FinanceChat } from "./FinanceChat";
import { MonkeyAssistant } from "./MonkeyAssistant";

export const Dashboard = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Financial AI Assistant</h1>
            <p className="text-muted-foreground mt-2">Your personal finance companion</p>
          </div>
          <Button onClick={() => setShowChat(!showChat)} className="gap-2">
            <ArrowUpRight className="h-4 w-4" />
            {showChat ? "Close Assistant" : "Open Assistant"}
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card p-6 animate-in">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
                <h2 className="text-3xl font-bold mt-2">$24,563.00</h2>
                <p className="text-sm text-green-500 mt-1">+2.5% from last month</p>
              </div>
              <Wallet className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="glass-card p-6 animate-in">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Investments</p>
                <h2 className="text-3xl font-bold mt-2">$12,250.00</h2>
                <p className="text-sm text-green-500 mt-1">+5.2% this week</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="glass-card p-6 animate-in">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Savings Goal</p>
                <h2 className="text-3xl font-bold mt-2">$8,750.00</h2>
                <p className="text-sm text-muted-foreground mt-1">of $10,000</p>
              </div>
              <PiggyBank className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </div>

        <MonkeyAssistant onMonkeyClick={() => setShowChat(true)} />

        {showChat && (
          <div className="fixed bottom-6 right-6 w-96 h-[600px] animate-in">
            <FinanceChat />
          </div>
        )}
      </div>
    </div>
  );
};