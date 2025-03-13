
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useBalance } from "@/context/BalanceContext";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
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

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey);
      toast.success("API key saved successfully!");
    } else {
      toast.error("Please enter a valid API key");
    }
  };

  const sendMessageToOpenAI = async (messageHistory: Message[]) => {
    if (!apiKey) {
      toast.error("Please enter your OpenAI API key first");
      return null;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are ${pokemonName}, a fiery Pokémon financial advisor. Your personality is energetic, helpful, and you often use fire-related metaphors. You provide financial advice with enthusiasm. Be concise in your responses.`
            },
            ...messageHistory.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from OpenAI');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      toast.error("Error: " + (error instanceof Error ? error.message : "Unknown error occurred"));
      return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input.trim()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Get all messages for context
    const messageHistory = [...messages, userMessage];
    
    try {
      const aiResponse = await sendMessageToOpenAI(messageHistory);
      
      if (aiResponse) {
        const aiMessage: Message = {
          role: 'assistant',
          content: aiResponse
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      toast.error("Failed to get response from AI");
    } finally {
      setIsLoading(false);
    }
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
      
      {!apiKey && (
        <div className="mx-4 my-2 p-4 bg-orange-100 dark:bg-orange-900 rounded-lg">
          <h3 className="font-bold mb-2">OpenAI API Key Required</h3>
          <p className="mb-2 text-sm">To use the AI chat feature, please enter your OpenAI API key below. The key is stored only in your browser's local storage.</p>
          <div className="flex gap-2">
            <Input 
              type="password" 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your OpenAI API key" 
              className="flex-1"
            />
            <Button onClick={saveApiKey}>Save Key</Button>
          </div>
        </div>
      )}
      
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
          {isLoading && (
            <div className="flex justify-start">
              <Avatar className="h-20 w-20 mr-2">
                <AvatarImage src={getPokemonImage(totalBalance)} alt={pokemonName} />
                <AvatarFallback>CH</AvatarFallback>
              </Avatar>
              <Card className="p-4 bg-gray-800 text-white">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-orange-600">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={`Ask ${pokemonName} about your finances...`}
            className="flex-1 bg-gray-800 text-white border-orange-600 focus:border-orange-400 resize-none min-h-[80px]"
          />
          <Button 
            onClick={handleSend}
            className="bg-orange-500 hover:bg-orange-600 self-end"
            disabled={isLoading || !apiKey}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
