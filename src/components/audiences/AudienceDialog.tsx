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
import { WalletSelector } from "./WalletSelector";
import { Audience, createAudience, updateAudience, Website } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AudienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  audience: Audience | null;
  website: Website;
  onSuccess: () => void;
}

export function AudienceDialog({
  open,
  onOpenChange,
  audience,
  website,
  onSuccess,
}: AudienceDialogProps) {
  const [name, setName] = useState("");
  const [selectedWallets, setSelectedWallets] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
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
    }
  }, [open, audience]);

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
            <Label>Select Wallets</Label>
            <WalletSelector
              websiteId={website.id}
              selectedWallets={selectedWallets}
              onSelectionChange={setSelectedWallets}
            />
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
