import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { listWebsites } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Check, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

async function generateKey(): Promise<string> {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `as_k_${hex}`;
}

async function hashKey(key: string): Promise<string> {
  const encoded = new TextEncoder().encode(key);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function CreateApiKeyDialog({ open, onOpenChange, onCreated }: Props) {
  const { toast } = useToast();
  const [label, setLabel] = useState("");
  const [websiteId, setWebsiteId] = useState("");
  const [creating, setCreating] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: websitesData } = useQuery({
    queryKey: ["websites"],
    queryFn: () => listWebsites({ status: "verified" }),
  });

  const websites = websitesData?.websites ?? [];

  const handleCreate = async () => {
    if (!websiteId) return;
    setCreating(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const key = await generateKey();
      const keyHash = await hashKey(key);
      const keyPrefix = key.slice(0, 12);

      const { error } = await (supabase as any)
        .from("api_keys")
        .insert({
          user_id: user.id,
          website_id: websiteId,
          key_hash: keyHash,
          key_prefix: keyPrefix,
          label: label || null,
        });

      if (error) throw error;

      setGeneratedKey(key);
      onCreated();
    } catch (err: any) {
      toast({
        title: "Failed to create key",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedKey) return;
    await navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setLabel("");
      setWebsiteId("");
      setGeneratedKey(null);
      setCopied(false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {generatedKey ? "API Key Created" : "Create API Key"}
          </DialogTitle>
          <DialogDescription>
            {generatedKey
              ? "Copy your key now — it won't be shown again."
              : "Generate a key for an AI assistant to access your data."}
          </DialogDescription>
        </DialogHeader>

        {generatedKey ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-muted rounded border border-border">
              <code className="flex-1 text-xs break-all font-mono text-foreground">
                {generatedKey}
              </code>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-start gap-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                Store this key securely. You won't be able to see it again.
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Website</Label>
              <Select value={websiteId} onValueChange={setWebsiteId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a website" />
                </SelectTrigger>
                <SelectContent>
                  {websites.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Label (optional)</Label>
              <Input
                placeholder="e.g. OpenClaw prod"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          {generatedKey ? (
            <Button onClick={() => handleClose(false)}>Done</Button>
          ) : (
            <Button
              onClick={handleCreate}
              disabled={!websiteId || creating}
            >
              {creating ? "Creating…" : "Create Key"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
