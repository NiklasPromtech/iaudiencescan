import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Megaphone } from "lucide-react";
import { mockPlatformTokens } from "./mock-data";
import { toast } from "@/hooks/use-toast";

const TokenAvatar = ({ symbol, logo }: { symbol: string; logo?: string }) => {
  const [imgError, setImgError] = React.useState(false);
  if (logo && !imgError) {
    return <img src={logo} alt={symbol} className="w-8 h-8 rounded-full shrink-0 object-cover" onError={() => setImgError(true)} />;
  }
  return (
    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
      {symbol.slice(0, 2)}
    </span>
  );
};

interface MockPlatformCardsProps {
  limit?: number;
  platforms?: string[];
}

export const MockPlatformCards = ({ limit, platforms }: MockPlatformCardsProps) => {
  const entries = platforms
    ? platforms.filter((k) => k in mockPlatformTokens).map((k) => mockPlatformTokens[k as keyof typeof mockPlatformTokens])
    : Object.values(mockPlatformTokens);

  const handleSignupPrompt = () => {
    toast({
      title: "Sign up to export your targeting list",
      description: "Create a free account to copy all handles and create campaigns.",
    });
  };

  return (
    <div className={`grid ${entries.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-5 text-left`}>
      {entries.map((platform) => {
        const tokens = limit ? platform.tokens.slice(0, limit) : platform.tokens;
        return (
          <div key={platform.label} className="rounded-lg border border-border bg-background overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-foreground">{platform.label}</h4>
                <p className="text-xs text-muted-foreground">{platform.count} communities found</p>
              </div>
              <Badge variant="outline" className={platform.color + " text-xs"}>
                {platform.count}
              </Badge>
            </div>
            <div className="divide-y divide-border">
              {tokens.map((token) => (
                <div key={token.symbol} className="flex items-center gap-3 px-5 py-3">
                  <TokenAvatar symbol={token.symbol} logo={token.logo} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{token.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{token.handle}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">{token.marketCap}</Badge>
                </div>
              ))}
            </div>
            <div className="flex gap-2 px-5 py-3 border-t border-border bg-muted/30">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleSignupPrompt}>
                <Copy className="w-3 h-3" /> Copy All
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleSignupPrompt}>
                <Megaphone className="w-3 h-3" /> Create Campaign
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
