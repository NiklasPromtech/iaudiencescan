import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletSelector } from "./WalletSelector";
import { Audience, createAudience, updateAudience, Website } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ClipboardPaste } from "lucide-react";

export interface AudienceDialogInitialFilters {
  dateRange?: {
    type: "preset" | "custom";
    days?: number;
    from?: Date;
    to?: Date;
    includeToday?: boolean;
  };
  filters?: Record<string, string[]>;
}

interface AudienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  audience: Audience | null;
  website: Website;
  onSuccess: () => void;
  onWalletClick?: (walletId: string) => void;
  initialFilters?: AudienceDialogInitialFilters;
}

export function AudienceDialog({
  open,
  onOpenChange,
  audience,
  website,
  onSuccess,
  onWalletClick,
  initialFilters,
}: AudienceDialogProps) {
  const [name, setName] = useState("");
  const [selectedWallets, setSelectedWallets] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [pasteResult, setPasteResult] = useState<{ valid: number; duplicates: number; invalid: number } | null>(null);
  const { toast } = useToast();

  const isEditing = !!audience;

  // Reset form when dialog opens/closes or audience changes
  useEffect(() => {
    if (open) {
      if (audience) {
        setName(audience.name);
        setSelectedWallets(audience.wallets || []);
      } else {
        setName("");
        setSelectedWallets([]);
      }
      setPasteText("");
      setPasteResult(null);
    }
  }, [open, audience]);

  const handleAddPastedWallets = () => {
    const lines = pasteText.split("\n").map((l) => l.trim()).filter(Boolean);
    let valid = 0;
    let duplicates = 0;
    let invalid = 0;
    const newWallets: string[] = [];
    const existing = new Set(selectedWallets.map((w) => w.toLowerCase()));

    for (const line of lines) {
      if (/^0x[a-fA-F0-9]{40}$/.test(line)) {
        if (existing.has(line.toLowerCase())) {
          duplicates++;
        } else {
          existing.add(line.toLowerCase());
          newWallets.push(line);
          valid++;
        }
      } else {
        invalid++;
      }
    }

    if (newWallets.length > 0) {
      setSelectedWallets((prev) => [...prev, ...newWallets]);
    }
    setPasteResult({ valid, duplicates, invalid });
    setPasteText("");
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your audience.",
        variant: "destructive",
      });
      return;
    }

    if (selectedWallets.length === 0) {
      toast({
        title: "No wallets selected",
        description: "Please select at least one wallet for your audience.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing && audience) {
        await updateAudience(audience.id, {
          name: name.trim(),
          wallets: selectedWallets,
        });
        toast({
          title: "Audience updated",
          description: `"${name}" has been updated successfully.`,
        });
      } else {
        await createAudience({
          name: name.trim(),
          website_id: website.id,
          wallets: selectedWallets,
        });
        toast({
          title: "Audience created",
          description: `"${name}" has been created with ${selectedWallets.length} wallets.`,
        });
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save audience:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save audience",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Audience" : "Create New Audience"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update your audience name or wallet selection."
              : "Create an audience by selecting wallets from your tracked visitors."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g., High-Value Traders"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Website</Label>
            <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md">
              {website.name} ({website.base_url})
            </div>
          </div>

          <div className="space-y-2">
            <Label>Select Wallets ({selectedWallets.length} selected)</Label>
            <Tabs defaultValue="visitors">
              <TabsList>
                <TabsTrigger value="visitors">From Visitors</TabsTrigger>
                <TabsTrigger value="paste">Paste Wallets</TabsTrigger>
              </TabsList>
              <TabsContent value="visitors">
                <WalletSelector
                  websiteId={website.id}
                  selectedWallets={selectedWallets}
                  onSelectionChange={setSelectedWallets}
                  onWalletClick={onWalletClick}
                  initialFilters={initialFilters}
                />
              </TabsContent>
              <TabsContent value="paste">
                <div className="space-y-3">
                  <Textarea
                    placeholder={"Paste wallet addresses, one per line:\n0x4fbB65ffF71703191A19089942cda010bbfc7De7\n0x1984829BB3439D04bD74F3c37cD35ff10a8625D7\n0x76e65da09d5466ec2C31ABFd258D149F282DBf14"}
                    value={pasteText}
                    onChange={(e) => { setPasteText(e.target.value); setPasteResult(null); }}
                    rows={8}
                    className="font-mono text-xs"
                  />
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleAddPastedWallets}
                      disabled={!pasteText.trim()}
                    >
                      <ClipboardPaste className="mr-2 h-4 w-4" />
                      Add Wallets
                    </Button>
                    {pasteResult && (
                      <p className="text-sm text-muted-foreground">
                        {pasteResult.valid > 0 && <span className="text-primary">{pasteResult.valid} added</span>}
                        {pasteResult.duplicates > 0 && <span className="ml-2 text-accent-foreground">{pasteResult.duplicates} skipped</span>}
                        {pasteResult.invalid > 0 && <span className="ml-2 text-destructive">{pasteResult.invalid} invalid</span>}
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Save Changes" : "Create Audience"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
