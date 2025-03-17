import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useBalance } from "@/context/BalanceContext";
import { getCategorySummary } from "@/utils/transactionCategorizer";
import { MLTransactionCategorizer } from "@/utils/mlTransactionCategorizer";
import { Transaction } from "@/types/transaction";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const mockTransactions: Transaction[] = [
  { id: 1, description: 'Grocery Store', amount: 45.99, date: new Date().toISOString().split('T')[0], type: 'expense', category: 'Groceries' },
  { id: 2, description: 'Coffee Shop', amount: 4.50, date: new Date().toISOString().split('T')[0], type: 'expense', category: 'Dining Out' },
  { id: 3, description: 'Gas Station', amount: 35.00, date: new Date().toISOString().split('T')[0], type: 'expense', category: 'Transportation' },
  { id: 4, description: 'Netflix Subscription', amount: 14.99, date: new Date().toISOString().split('T')[0], type: 'expense', category: 'Bills & Utilities' },
  { id: 5, description: 'Rent Payment', amount: 1200, date: new Date().toISOString().split('T')[0], type: 'expense', category: 'Housing' },
];

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

export default function ChatBuddy() {
  const { totalBalance } = useBalance();
  const pokemonName = getPokemonName(totalBalance);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I'm ${pokemonName}, your fiery financial advisor! 🔥 I'm here to help you manage your money and make smart financial decisions. What would you like to know about managing your finances?`
    }
  ]);
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const generateSmartResponse = async (userInput: string): Promise<string> => {
    const lowerInput = userInput.toLowerCase();
    
    const categorySummary = getCategorySummary(mockTransactions);
    const highestCategory = Object.entries(categorySummary)
      .sort((a, b) => b[1] - a[1])
      .filter(([category]) => category !== 'Income')[0];
    
    const userCategory = await MLTransactionCategorizer.categorizeTransaction(lowerInput);
    
    if (lowerInput.includes('category') || lowerInput.includes('spending') || lowerInput.includes('where') || lowerInput.includes('what am i spending')) {
      if (highestCategory) {
        return `Based on our ML analysis of your recent transactions, your highest spending category is ${highestCategory[0]} at $${highestCategory[1].toFixed(2)}. You might want to look at ways to reduce spending in this area if you're trying to save money. 🔥`;
      } else {
        return `I don't see any significant spending patterns yet. Keep tracking your expenses and I'll provide insights as patterns emerge! 🔥`;
      }
    } 
    else if (userCategory !== 'Other' && lowerInput.includes(userCategory.toLowerCase())) {
      const categorySpending = categorySummary[userCategory] || 0;
      if (categorySpending > 0) {
        return `I see you've spent $${categorySpending.toFixed(2)} on ${userCategory} recently. ${
          categorySpending > 100 ? "That's a significant amount! Consider setting a budget for this category." : "That seems reasonable, but always look for ways to save!"
        } 🔥`;
      } else {
        return `You haven't spent much on ${userCategory} recently. If you're planning a purchase in this category, make sure it fits within your overall budget! 🔥`;
      }
    }
    else if (lowerInput.includes('budget') || lowerInput.includes('save')) {
      return `To create a budget, first categorize your expenses (which I can help with!), then allocate specific amounts to each category. For your spending habits, I'd recommend focusing on reducing your ${highestCategory ? highestCategory[0] : 'highest spending category'} expenses. 🔥`;
    }
    else if (lowerInput.includes('invest') || lowerInput.includes('investment')) {
      return `Before investing, make sure you have an emergency fund covering 3-6 months of expenses. Then, consider starting with index funds or ETFs for diversification. As your balance grows, you can explore more sophisticated investment options! 🔥`;
    }
    else {
      const responses = [
        `That's a great question about ${userInput.trim()}! To manage your finances better, you should track your expenses and create a budget. Our ML system can help you categorize your spending automatically! 🔥`,
        `When it comes to ${userInput.trim()}, it's important to know where your money is going. Our ML analysis shows your highest spending category is ${highestCategory ? highestCategory[0] : 'still being determined'}. 🔥`,
        `About ${userInput.trim()} - it's important to have an emergency fund that covers 3-6 months of expenses. That's financial security! 🔥`,
        `Regarding ${userInput.trim()}, consider automating your savings. It's easier to save when you don't see the money first! My ML analysis shows you might want to cut back on ${highestCategory ? highestCategory[0] : 'unnecessary expenses'}. 🔥`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: input.trim()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    setTimeout(async () => {
      const aiResponse = await generateSmartResponse(userMessage.content);
      
      const aiMessage: Message = {
        role: 'assistant',
        content: aiResponse
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-orange-500 to-black">
      <div className="flex items-center p-4 border-b border-orange-600">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-2 text-white hover:text-orange-200"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Avatar className="h-20 w-20">
            <AvatarImage src={getPokemonImage(totalBalance)} alt={pokemonName} />
            <AvatarFallback>CH</AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-semibold text-white">{pokemonName} Finance</h1>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <Avatar className="h-20 w-20 mr-2">
                  <AvatarImage src={getPokemonImage(totalBalance)} alt={pokemonName} />
                  <AvatarFallback>CH</AvatarFallback>
                </Avatar>
              )}
              <Card
                className={`p-4 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-white'
                }`}
              >
                {message.content}
              </Card>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-orange-600">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
            placeholder={`Ask ${pokemonName} about your finances...`}
            className="flex-1 bg-gray-800 text-white border-orange-600 focus:border-orange-400"
          />
          <Button 
            onClick={handleSend}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
