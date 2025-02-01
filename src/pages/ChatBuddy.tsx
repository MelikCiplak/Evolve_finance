import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBuddy() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your financial ChatBuddy. I can help you with budgeting, investing, and general financial advice. How can I assist you today?'
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
        content: 'I understand your question about finances. As an AI assistant, I aim to provide helpful guidance, but remember that for specific financial decisions, it\'s best to consult with a qualified financial advisor.'
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
    
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="flex items-center p-4 border-b border-gray-800">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold text-white">ChatBuddy</h1>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <Card
              key={index}
              className={`p-4 max-w-[80%] ${
                message.role === 'user'
                  ? 'ml-auto bg-[#9b87f5] text-white'
                  : 'bg-gray-800 text-white'
              }`}
            >
              {message.content}
            </Card>
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your finances..."
            className="flex-1"
          />
          <Button onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}