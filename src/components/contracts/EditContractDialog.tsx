import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { TokenContract } from "@/hooks/use-dashboard-queries";

const CHAINS = [
  { value: "ethereum", label: "Ethereum", chainId: "eth-mainnet" },
  { value: "polygon", label: "Polygon", chainId: "matic-mainnet" },
  { value: "bsc", label: "BNB Smart Chain (BSC)", chainId: "bsc-mainnet" },
  { value: "avalanche", label: "Avalanche C-Chain", chainId: "avalanche-mainnet" },
  { value: "fantom", label: "Fantom", chainId: "fantom-mainnet" },
  { value: "arbitrum", label: "Arbitrum", chainId: "arbitrum-mainnet" },
  { value: "base", label: "Base", chainId: "base-mainnet" },
];

interface EditContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: TokenContract;
  onSuccess: () => void;
}

export const EditContractDialog = ({
  open,
  onOpenChange,
  contract,
  onSuccess,
}: EditContractDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(contract.name);
  const [contractAddress, setContractAddress] = useState(contract.contract_address);
  const [chain, setChain] = useState(contract.chain);
  const [startDate, setStartDate] = useState(contract.start_date || "");

  useEffect(() => {
    setName(contract.name);
    setContractAddress(contract.contract_address);
    setChain(contract.chain);
    setStartDate(contract.start_date || "");
  }, [contract]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !contractAddress.trim() || !chain) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const selectedChain = CHAINS.find(c => c.value === chain);
      const { error } = await supabase
        .from("website_tag_contracts")
        .update({
          name: name.trim(),
          contract_address: contractAddress.trim(),
          chain,
          chain_id: selectedChain?.chainId || null,
          start_date: startDate || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", contract.id);

      if (error) throw error;

      toast({
        title: "Contract Updated",
        description: "Token contract has been updated successfully",
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Failed to update contract:", error);
      toast({
        title: "Error",
        description: "Failed to update token contract",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Token Contract</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="e.g., My Token"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contract">Contract Address *</Label>
            <Input
              id="contract"
              placeholder="0x..."
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chain">Chain *</Label>
            <Select value={chain} onValueChange={setChain}>
              <SelectTrigger>
                <SelectValue placeholder="Select chain" />
              </SelectTrigger>
              <SelectContent>
                {CHAINS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date (optional)</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Only track activity from this date onwards
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
