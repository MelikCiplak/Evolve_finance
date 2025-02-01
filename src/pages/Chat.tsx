import { ChatBot } from "@/components/ChatBot";

const Chat = () => {
  // For demo purposes, passing a default balance
  // In a real app, you'd get this from your global state/context
  return (
    <div className="min-h-screen bg-background p-6">
      <ChatBot balance={0} />
    </div>
  );
};

export default Chat;