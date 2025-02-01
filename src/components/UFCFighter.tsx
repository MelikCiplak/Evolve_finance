import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className={`relative ${currentLevel.scale} transition-all duration-500`}>
              {/* Fighter Avatar */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-b from-gray-800 to-black border-4 border-primary flex items-center justify-center relative overflow-hidden">
                {/* Fighter Body */}
                <div className="absolute inset-0">
                  {/* Head */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary/20 border-2 border-primary" />
                  
                  {/* Torso */}
                  <div className="absolute top-16 left-1/2 -translate-x-1/2 w-16 h-20 bg-primary/20 rounded-t-xl border-2 border-primary" />
                  
                  {/* Arms */}
                  <div className="absolute top-16 left-6 w-4 h-16 bg-primary/20 rounded-full border-2 border-primary transform rotate-12" />
                  <div className="absolute top-16 right-6 w-4 h-16 bg-primary/20 rounded-full border-2 border-primary transform -rotate-12" />
                  
                  {/* Fighting Stance Glow */}
                  <div className="absolute inset-0 bg-primary/5 animate-pulse" />
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
  );
};