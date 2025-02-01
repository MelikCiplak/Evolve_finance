import { ChatBot } from "@/components/ChatBot";
import { Dashboard } from "@/components/Dashboard";

const Chat = () => {
  // For demo purposes, passing a default balance
  // In a real app, you'd get this from your global state/context
  return (
    <div className="min-h-screen bg-background">
      <Dashboard />
      <div className="p-6">
        <ChatBot balance={0} />
      </div>
    </div>
  );
};

export default Chat;