import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Twitter, ExternalLink, Sparkles, Copy, CheckCircle } from "lucide-react";
import { ScanResultsTopToken } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface XAdsIntegrationProps {
  tokens: ScanResultsTopToken[];
  scanId: string;
}

export const XAdsIntegration = ({ tokens, scanId }: XAdsIntegrationProps) => {
  const [isCopying, setIsCopying] = useState(false);
  const tokensWithTwitter = tokens.filter((t) => t.twitter && t.twitter.trim() !== "");

  if (tokensWithTwitter.length === 0) return null;

  const handleCreateCampaign = async () => {
    setIsCopying(true);
    
    // Extract and format handles (ensure @ prefix)
    const handles = tokensWithTwitter
      .map((t) => t.twitter?.startsWith("@") ? t.twitter : `@${t.twitter}`)
      .join(", ");
    
    try {
      await navigator.clipboard.writeText(handles);
      
      toast({
        title: "✓ X handles copied!",
        description: `${tokensWithTwitter.length} handles are now in your clipboard. Opening X Ads Manager... Paste them under "Follower look-alikes" in your ad group targeting to reach users similar to these communities.`,
        duration: 6000,
      });
      
      // Small delay so user can see the toast before redirect
      setTimeout(() => {
        window.open("https://ads.x.com", "_blank");
        setIsCopying(false);
      }, 1000);
      
    } catch (err) {
      console.error("Failed to copy handles:", err);
      toast({
        title: "Failed to copy handles",
        description: "Please try again or copy them manually from the X/Twitter card below.",
        variant: "destructive",
      });
      setIsCopying(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-sky-500/5 to-sky-500/10 border-sky-500/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="shrink-0">
            <Twitter className="h-6 w-6 text-sky-500" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">X Ads Campaign Ready</h3>
              <Badge variant="secondary" className="bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Sparkles className="h-3 w-3 mr-1" />
                {tokensWithTwitter.length} targets
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm max-w-lg">
              Create a targeted X Ads campaign using these {tokensWithTwitter.length} community handles. 
              Target followers of these accounts to reach your ideal audience.
            </p>
          </div>
        </div>
        <Button 
          onClick={handleCreateCampaign}
          disabled={isCopying}
          className="shrink-0 gap-2 bg-sky-600 hover:bg-sky-700"
        >
          {isCopying ? (
            <>
              <Copy className="h-4 w-4 animate-pulse" />
              Copying...
            </>
          ) : (
            <>
              Create X Ads Campaign
              <ExternalLink className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
