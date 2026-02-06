import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Audience, SUPPORTED_CHAINS, SupportedChain, createScan } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Search, Users, Loader2, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AudienceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  audience: Audience | null;
  onScanSuccess: (scanId: string) => void;
}

export function AudienceDetailDialog({
  open,
  onOpenChange,
  audience,
  onScanSuccess,
}: AudienceDetailDialogProps) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedWallets, setSelectedWallets] = useState<Set<string>>(new Set());
  const [chain, setChain] = useState<SupportedChain>("eth-mainnet");
  const [loading, setLoading] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSearch("");
      setSelectedWallets(new Set());
      setChain("eth-mainnet");
    }
  }, [open]);

  const wallets = audience?.wallets || [];
  
  const filteredWallets = wallets.filter((wallet) =>
    wallet.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleWallet = (wallet: string) => {
    setSelectedWallets((prev) => {
      const next = new Set(prev);
      if (next.has(wallet)) {
        next.delete(wallet);
      } else {
        next.add(wallet);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedWallets.size === filteredWallets.length) {
      setSelectedWallets(new Set());
    } else {
      setSelectedWallets(new Set(filteredWallets));
    }
  };

  const walletsToScan = selectedWallets.size > 0 
    ? Array.from(selectedWallets) 
    : wallets;

  const handleStartScan = async () => {
    if (!audience) return;

    setLoading(true);
    try {
      const response = await createScan({
        wallets: walletsToScan,
        chain,
        name: `Scan from "${audience.name}"${selectedWallets.size > 0 ? ` (${selectedWallets.size} selected)` : ""}`,
        audience_id: audience.id,
        website_id: audience.website_id,
      });

      toast({
        title: "Scan started",
        description: `Scanning ${walletsToScan.length} wallets on ${SUPPORTED_CHAINS.find(c => c.value === chain)?.label}`,
      });

      onScanSuccess(response.scan_id);
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to create scan:", err);
      toast({
        title: "Failed to start scan",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const truncateAddress = (address: string) => {
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {audience?.name}
          </DialogTitle>
          <DialogDescription>
            {audience?.wallet_count} wallets · Created{" "}
            {audience && formatDistanceToNow(new Date(audience.created_at), { addSuffix: true })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-hidden">
          {/* Search and Select Controls */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search wallets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="shrink-0"
            >
              {selectedWallets.size === filteredWallets.length && filteredWallets.length > 0
                ? "Deselect All"
                : "Select All"}
            </Button>
          </div>

          {/* Selection Info */}
          {selectedWallets.size > 0 && (
            <div className="text-sm text-muted-foreground bg-primary/5 border border-primary/20 rounded-md px-3 py-2">
              <span className="font-medium text-primary">{selectedWallets.size}</span> of{" "}
              {wallets.length} wallets selected for scan
            </div>
          )}

          {/* Wallet List */}
          <ScrollArea className="h-[300px] border border-border rounded-md">
            <div className="p-2 space-y-1">
              {filteredWallets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {search ? "No wallets match your search" : "No wallets in this group"}
                </div>
              ) : (
                filteredWallets.map((wallet) => (
                  <label
                    key={wallet}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={selectedWallets.has(wallet)}
                      onCheckedChange={() => handleToggleWallet(wallet)}
                    />
                    <code className="text-sm font-mono text-foreground flex-1">
                      {truncateAddress(wallet)}
                    </code>
                    <a
                      href={`https://etherscan.io/address/${wallet}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </label>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Chain Selection */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Scan on:</span>
            <Select value={chain} onValueChange={(v) => setChain(v as SupportedChain)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_CHAINS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex-row justify-between sm:justify-between gap-2 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Will scan{" "}
            <Badge variant="secondary" className="font-mono">
              {walletsToScan.length}
            </Badge>{" "}
            wallets
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleStartScan} disabled={loading || wallets.length === 0}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Find More Users
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
