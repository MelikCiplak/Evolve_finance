import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBuddy() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m Chimchar, your fiery financial advisor! 🔥 I\'m here to help you manage your money and make smart financial decisions. What would you like to know about managing your finances?'
    }
  ]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input.trim()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        role: 'assistant',
        content: 'As your fiery financial companion, I want to help! While I can offer general guidance, remember that for specific investment decisions, it\'s best to consult with a qualified financial advisor. What else would you like to know? 🔥'
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
    
    setInput('');
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
          <Avatar className="h-8 w-8">
            <AvatarImage src="/lovable-uploads/697cab9d-b32f-42e8-b73a-a53f3675d7ba.png" alt="Chimchar" />
            <AvatarFallback>CH</AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-semibold text-white">Chimchar Finance</h1>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/lovable-uploads/697cab9d-b32f-42e8-b73a-a53f3675d7ba.png" alt="Chimchar" />
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
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Chimchar about your finances..."
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