
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BalanceProvider } from "./context/BalanceContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ChatBuddy from "./pages/ChatBuddy";
import Investments from "./pages/Investments";

// Create a simple QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BalanceProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/chat" element={<ChatBuddy />} />
              <Route path="/investments" element={<Investments />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </BalanceProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
