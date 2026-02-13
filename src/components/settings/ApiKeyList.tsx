import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Key, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useSelectedWebsite } from "@/hooks/use-selected-website";

interface ApiKey {
  id: string;
  key_prefix: string;
  label: string | null;
  website_id: string;
  created_at: string;
  last_used_at: string | null;
}

interface Props {
  refreshKey: number;
}

export function ApiKeyList({ refreshKey }: Props) {
  const { toast } = useToast();
  const { selectedWebsite } = useSelectedWebsite();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);

  const fetchKeys = async () => {
    if (!selectedWebsite) {
      setKeys([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("api_keys")
      .select("id, key_prefix, label, website_id, created_at, last_used_at")
      .is("revoked_at", null)
      .eq("website_id", selectedWebsite.id)
      .order("created_at", { ascending: false });

    if (!error && data) setKeys(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchKeys();
  }, [refreshKey, selectedWebsite?.id]);

  const handleRevoke = async (id: string) => {
    setRevoking(id);
    const { error } = await (supabase as any)
      .from("api_keys")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast({
        title: "Failed to revoke",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setKeys((prev) => prev.filter((k) => k.id !== id));
      toast({ title: "API key revoked" });
    }
    setRevoking(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (keys.length === 0) {
    return (
      <Card className="p-8 border border-border text-center">
        <Key className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-p2 text-muted-foreground">
          No API keys yet. Create one to get started.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {keys.map((k) => (
        <Card key={k.id} className="p-4 border border-border">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-muted">
              <Key className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <code className="text-p2 font-mono text-foreground">
                  {k.key_prefix}•••
                </code>
                {k.label && (
                  <Badge variant="secondary" className="text-xs">
                    {k.label}
                  </Badge>
                )}
              </div>
              <p className="text-p4 text-muted-foreground mt-0.5">
                Created {format(new Date(k.created_at), "MMM d, yyyy")}
                {k.last_used_at &&
                  ` · Last used ${format(new Date(k.last_used_at), "MMM d, yyyy")}`}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRevoke(k.id)}
              disabled={revoking === k.id}
              className="text-destructive hover:text-destructive"
            >
              {revoking === k.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
