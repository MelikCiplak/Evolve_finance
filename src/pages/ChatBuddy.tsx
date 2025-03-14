
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useBalance } from "@/context/BalanceContext";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

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
    // Scroll to bottom whenever messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input.trim()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        `That's a great question about ${input.trim()}! To manage your finances better, you should track your expenses and create a budget. 🔥`,
        `Interesting point about ${input.trim()}! I'd recommend setting aside some savings each month. Even small amounts add up over time! 🔥`,
        `When it comes to ${input.trim()}, remember that investing early can help your money grow through compound interest. 🔥`,
        `About ${input.trim()} - it's important to have an emergency fund that covers 3-6 months of expenses. That's financial security! 🔥`,
        `Regarding ${input.trim()}, consider automating your savings. It's easier to save when you don't see the money first! 🔥`
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage: Message = {
        role: 'assistant',
        content: randomResponse
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
