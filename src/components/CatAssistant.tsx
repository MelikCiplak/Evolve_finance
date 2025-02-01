import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Position {
  x: number;
  y: number;
}

interface CatAssistantProps {
  onCatClick: () => void;
}

export const CatAssistant = ({ onCatClick }: CatAssistantProps) => {
  const [position, setPosition] = useState<Position>({ x: 100, y: 100 });

  useEffect(() => {
    const moveCat = () => {
      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 100;
      
      setPosition({
        x: Math.random() * maxX,
        y: Math.random() * maxY,
      });
    };

    const interval = setInterval(moveCat, 5000);
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
      onClick={onCatClick}
    >
      <div className="relative group">
        <div className="bg-black/50 backdrop-blur-lg rounded-full p-4 shadow-lg transform transition-transform hover:scale-110">
          <img 
            src="/lovable-uploads/c0b63c5c-e79a-457e-aa17-ffe98a941bd4.png" 
            alt="Cat Assistant" 
            className="w-12 h-12 invert"
          />
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-sm whitespace-nowrap text-black">
          Click me for financial advice!
        </div>
      </div>
    </motion.div>
  );
};