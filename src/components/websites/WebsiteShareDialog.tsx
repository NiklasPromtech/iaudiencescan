import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Mail, 
  Trash2, 
  UserPlus, 
  Users, 
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { 
  shareWebsite, 
  listWebsiteShares, 
  revokeWebsiteShare, 
  sendInviteEmail,
  WebsiteShare 
} from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";

interface WebsiteShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  websiteId: string;
  websiteName: string;
}

export function WebsiteShareDialog({
  open,
  onOpenChange,
  websiteId,
  websiteName,
}: WebsiteShareDialogProps) {
  const [email, setEmail] = useState("");
  const [shares, setShares] = useState<WebsiteShare[]>([]);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const fetchShares = async () => {
    setLoading(true);
    try {
      const response = await listWebsiteShares(websiteId);
      setShares(response.shares || []);
    } catch (error) {
      console.error("Failed to fetch shares:", error);
      toast.error("Failed to load shared users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchShares();
      setEmail("");
    }
  }, [open, websiteId]);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSharing(true);
    try {
      const response = await shareWebsite(websiteId, email.trim());
      if (response.has_account) {
        toast.success(`Shared access with ${email.trim()}`);
      } else {
        toast.success(`Invite sent to ${email.trim()}`, {
          description: "They'll get access once they create an account",
        });
        // Send invite email in the background
        const { data: { user } } = await supabase.auth.getUser();
        const inviterName = user?.email || "Someone";
        sendInviteEmail(email.trim(), websiteName, inviterName).catch(() => {});
      }
      setEmail("");
      fetchShares();
    } catch (error: any) {
      toast.error(error.message || "Failed to share website");
    } finally {
      setSharing(false);
    }
  };

  const handleRevoke = async (share: WebsiteShare) => {
    setRevokingId(share.id);
    try {
      await revokeWebsiteShare(websiteId, share.id);
      toast.success(`Removed access for ${share.email}`);
      setShares(shares.filter((s) => s.id !== share.id));
    } catch (error: any) {
      toast.error(error.message || "Failed to revoke access");
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Share Access
          </DialogTitle>
          <DialogDescription>
            Invite others to view analytics for <strong>{websiteName}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleShare} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="share-email">Email address</Label>
            <div className="flex gap-2">
              <Input
                id="share-email"
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={sharing}
              />
              <Button type="submit" disabled={sharing || !email.trim()}>
                {sharing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </form>

        <div className="space-y-3">
          <Label className="text-muted-foreground">People with access</Label>
          
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : shares.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-border rounded-lg">
              <Mail className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No one else has access yet
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[200px] overflow-auto">
              {shares.map((share) => (
                <div
                  key={share.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{share.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {share.user_id ? "Accepted" : "Pending invite"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRevoke(share)}
                    disabled={revokingId === share.id}
                  >
                    {revokingId === share.id ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>
            Shared users can view all analytics data for this website. They cannot modify settings or share with others.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
