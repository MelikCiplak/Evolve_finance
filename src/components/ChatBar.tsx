import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export const ChatBar = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={() => navigate("/chat")}
        className="flex items-center gap-2"
        variant="outline"
      >
        <MessageCircle className="h-4 w-4" />
        Chat with AI
      </Button>
    </div>
  );
};