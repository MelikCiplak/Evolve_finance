
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

interface TransactionDialogsProps {
  showAddDialog: boolean;
  showWithdrawDialog: boolean;
  setShowAddDialog: (show: boolean) => void;
  setShowWithdrawDialog: (show: boolean) => void;
  amount: string;
  setAmount: (amount: string) => void;
  handleAddFunds: () => void;
  handleWithdraw: () => void;
}

export const TransactionDialogs = ({
  showAddDialog,
  showWithdrawDialog,
  setShowAddDialog,
  setShowWithdrawDialog,
  amount,
  setAmount,
  handleAddFunds,
  handleWithdraw
}: TransactionDialogsProps) => {
  const [description, setDescription] = useState("");
  
  return (
    <div className="flex gap-4 justify-center">
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogTrigger asChild>
          <Button className="w-32" variant="outline">
            <Plus className="mr-2" /> Add Funds
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Funds</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Description (e.g., Paycheck, Gift)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button onClick={() => {
              handleAddFunds();
              setDescription("");
            }} className="w-full">
              Add Funds
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogTrigger asChild>
          <Button className="w-32" variant="outline">
            <Minus className="mr-2" /> Withdraw
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Description (e.g., Groceries, Rent)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button onClick={() => {
              handleWithdraw();
              setDescription("");
            }} className="w-full">
              Withdraw
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
