import { useState, useEffect } from 'react';
import { Banana } from 'lucide-react';
import { motion } from 'framer-motion';

interface Position {
  x: number;
  y: number;
}

interface MonkeyAssistantProps {
  onMonkeyClick: () => void;
}

export const MonkeyAssistant = ({ onMonkeyClick }: MonkeyAssistantProps) => {
  const [position, setPosition] = useState<Position>({ x: 100, y: 100 });

  useEffect(() => {
    const moveMonkey = () => {
      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 100;
      
      setPosition({
        x: Math.random() * maxX,
        y: Math.random() * maxY,
      });
    };

    const interval = setInterval(moveMonkey, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed z-50 cursor-pointer"
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{ duration: 2, ease: "easeInOut" }}
      onClick={onMonkeyClick}
    >
      <div className="relative group">
        <div className="bg-yellow-100 rounded-full p-4 shadow-lg transform transition-transform hover:scale-110">
          <div className="relative">
            <span className="text-4xl">🐒</span>
            <Banana className="absolute -top-2 -right-2 text-yellow-400 animate-bounce" size={20} />
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-sm whitespace-nowrap">
          Click me for financial advice!
        </div>
      </div>
    </motion.div>
  );
};