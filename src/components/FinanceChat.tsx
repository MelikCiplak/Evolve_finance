import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const FinanceChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Meow! I'm your feline financial assistant. How can I help you manage your money today? 😺",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: input },
      { role: "assistant", content: "Analyzing your question... 😺" },
    ];
    setMessages(newMessages);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages([
        ...newMessages.slice(0, -1),
        {
          role: "assistant",
          content: "Based on your question, I would recommend reviewing your budget and considering investment options. Would you like me to help you create a financial plan? 😺",
        },
      ]);
    }, 1000);
  };

  return (
    <Card className="glass-card h-full flex flex-col">
      <div className="p-4 border-b border-white/10 flex items-center gap-2">
        <img 
          src="/lovable-uploads/c0b63c5c-e79a-457e-aa17-ffe98a941bd4.png" 
          alt="Cat Assistant" 
          className="w-8 h-8 invert"
        />
        <h3 className="font-semibold">Feline Financial Assistant</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your feline friend..."
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};