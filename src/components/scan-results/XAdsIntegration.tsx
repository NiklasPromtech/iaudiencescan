import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Twitter, ExternalLink, Sparkles } from "lucide-react";
import { ScanResultsTopToken } from "@/lib/api";

interface XAdsIntegrationProps {
  tokens: ScanResultsTopToken[];
  scanId: string;
}

export const XAdsIntegration = ({ tokens, scanId }: XAdsIntegrationProps) => {
  const tokensWithTwitter = tokens.filter((t) => t.twitter && t.twitter.trim() !== "");

  if (tokensWithTwitter.length === 0) return null;

  return (
    <Card className="p-6 bg-gradient-to-br from-sky-500/5 to-sky-500/10 border-sky-500/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="h-12 w-12 rounded-full bg-sky-500/20 flex items-center justify-center shrink-0">
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
        <Button asChild className="shrink-0 gap-2 bg-sky-600 hover:bg-sky-700">
          <a href={`/xads/agency?scan=${scanId}`}>
            Create X Ads Campaign
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </Card>
  );
};
