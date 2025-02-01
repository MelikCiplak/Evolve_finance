import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface UFCFighterProps {
  balance: number;
}

interface FighterLevel {
  name: string;
  rank: string;
  minBalance: number;
  scale: string;
}

const fighterLevels: FighterLevel[] = [
  { name: "Amateur Fighter", rank: "Unranked", minBalance: 0, scale: "scale-75" },
  { name: "Rising Star", rank: "Top 15", minBalance: 1000, scale: "scale-90" },
  { name: "Contender", rank: "Top 5", minBalance: 10000, scale: "scale-100" },
  { name: "Champion", rank: "Champion", minBalance: 100000, scale: "scale-110" },
];

export const UFCFighter = ({ balance }: UFCFighterProps) => {
  const [currentLevel, setCurrentLevel] = useState<FighterLevel>(fighterLevels[0]);
  const [showLevelUpMessage, setShowLevelUpMessage] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const newLevel = fighterLevels
      .slice()
      .reverse()
      .find(level => balance >= level.minBalance);

    if (newLevel && newLevel.name !== currentLevel.name) {
      setCurrentLevel(newLevel);
      setShowLevelUpMessage(true);
      setTimeout(() => setShowLevelUpMessage(false), 3000);
    }
  }, [balance, currentLevel.name]);

  const getFinancialAdvice = () => {
    if (balance < 1000) {
      return "Focus on saving! Try to reach $1,000 to unlock the next rank. Set aside small amounts regularly and avoid unnecessary expenses.";
    } else if (balance < 10000) {
      return "Great progress! Consider diversifying your savings into different investment vehicles. Aim for $10,000 to reach contender status.";
    } else if (balance < 100000) {
      return "You're doing well! Look into long-term investment strategies and retirement planning. The championship belt awaits at $100,000!";
    } else {
      return "Champion status achieved! Focus on maintaining your wealth through diversified investments and smart financial planning.";
    }
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger onClick={() => setShowDialog(true)}>
              <div className={`relative ${currentLevel.scale} transition-all duration-500 cursor-pointer hover:scale-105`}>
                {/* Pixelated Fighter */}
                <div className="w-32 h-32 rounded-full bg-gradient-to-b from-gray-800 to-black border-4 border-primary flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0">
                    {/* Pixelated Head */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary/20">
                      {/* Eyes */}
                      <div className="absolute top-4 left-2 w-2 h-2 bg-primary"></div>
                      <div className="absolute top-4 right-2 w-2 h-2 bg-primary"></div>
                      {/* Mouth */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-2 bg-primary"></div>
                    </div>
                    
                    {/* Pixelated Body */}
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 w-16 h-20 bg-primary/20">
                      {/* Pixel Details */}
                      <div className="absolute top-0 left-0 w-4 h-4 bg-primary/30"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 bg-primary/30"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 bg-primary/30"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary/30"></div>
                    </div>
                    
                    {/* Pixelated Arms */}
                    <div className="absolute top-16 left-4 w-4 h-16 bg-primary/20"></div>
                    <div className="absolute top-16 right-4 w-4 h-16 bg-primary/20"></div>
                    
                    {/* Fighting Stance Animation */}
                    <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
                  </div>
                  
                  {/* Rank Badge */}
                  <div className="absolute -top-1 -right-1 bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    {currentLevel.rank}
                  </div>
                </div>
                
                {/* Level Up Animation */}
                {showLevelUpMessage && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full whitespace-nowrap animate-bounce">
                    Level Up! {currentLevel.name}
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-bold">{currentLevel.name}</p>
              {balance < 100000 && (
                <p className="text-sm text-muted-foreground">
                  Next rank at ${(fighterLevels.find(level => level.minBalance > balance)?.minBalance || 0).toLocaleString()}
                </p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your UFC Financial Coach - {currentLevel.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-lg">{getFinancialAdvice()}</p>
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <div>
                <p className="font-semibold">Current Balance</p>
                <p className="text-2xl font-bold">${balance.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-semibold">Current Rank</p>
                <p className="text-primary font-bold">{currentLevel.rank}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};