import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const getFinancialAdvice = (message: string, balance: number): string => {
  // Simple rule-based responses
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("save") || lowerMessage.includes("saving")) {
    return `Based on your balance of $${balance}, I recommend setting aside 20% of your income each month. Start small and stay consistent!`;
  }
  
  if (lowerMessage.includes("invest") || lowerMessage.includes("investment")) {
    if (balance < 1000) {
      return "Before investing, let's focus on building an emergency fund. Try to save up to $1,000 first!";
    } else {
      return "Great! With your current balance, you could consider low-cost index funds or a high-yield savings account.";
    }
  }
  
  if (lowerMessage.includes("budget") || lowerMessage.includes("spending")) {
    return "I recommend using the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment.";
  }
  
  return "I'm Chimchar, your financial advisor! You can ask me about saving, investing, or budgeting. How can I help you today?";
};

export const ChatBot = ({ balance }: { balance: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm Chimchar, your financial advisor! How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    const assistantMessage: Message = {
      role: "assistant",
      content: getFinancialAdvice(input, balance),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 w-16 h-16 rounded-full hover:scale-110 transition-transform duration-200 focus:outline-none"
      >
        <img
          src="/lovable-uploads/1ec7a8b0-852e-4e7f-897d-51c39d1b66e7.png"
          alt="Chimchar"
          className="w-full h-full object-contain"
        />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <img
                src="/lovable-uploads/1ec7a8b0-852e-4e7f-897d-51c39d1b66e7.png"
                alt="Chimchar"
                className="w-8 h-8 object-contain"
              />
              Chimchar - Financial Advisor
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-[50vh] w-full pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
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
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              placeholder="Ask about saving, investing, or budgeting..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />
            <Button size="icon" onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};