import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Audience, createScan, SUPPORTED_CHAINS, SupportedChain } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search } from "lucide-react";

interface CreateScanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  audience: Audience | null;
  onSuccess: (scanId: string) => void;
}

export function CreateScanDialog({
  open,
  onOpenChange,
  audience,
  onSuccess,
}: CreateScanDialogProps) {
  const { toast } = useToast();
  const [chain, setChain] = useState<SupportedChain>("eth-mainnet");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!audience) return;

    setLoading(true);
    try {
      const response = await createScan({
        wallets: audience.wallets,
        chain,
        name: `Scan from "${audience.name}"`,
        audience_id: audience.id,
        website_id: audience.website_id,
      });

      toast({
        title: "Scan started",
        description: `Scanning ${audience.wallet_count} wallets on ${SUPPORTED_CHAINS.find(c => c.value === chain)?.label}`,
      });

      onSuccess(response.scan_id);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Find More Users
          </DialogTitle>
          <DialogDescription>
            Scan the wallets in "{audience?.name}" to find similar users and their on-chain behavior.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Audience</Label>
            <div className="text-sm text-muted-foreground bg-muted rounded-md px-3 py-2">
              {audience?.name} · {audience?.wallet_count} wallets
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chain">Blockchain</Label>
            <Select value={chain} onValueChange={(v) => setChain(v as SupportedChain)}>
              <SelectTrigger id="chain">
                <SelectValue placeholder="Select a chain" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_CHAINS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select the blockchain to analyze wallet activity
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !audience}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Start Scan
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
