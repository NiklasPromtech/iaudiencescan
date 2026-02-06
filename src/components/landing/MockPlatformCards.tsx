import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Megaphone } from "lucide-react";
import { mockPlatformTokens } from "./mock-data";

const TokenAvatar = ({ symbol }: { symbol: string }) => (
  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
    {symbol.slice(0, 2)}
  </span>
);

export const MockPlatformCards = () => (
  <div className="grid sm:grid-cols-2 gap-5 text-left">
    {Object.values(mockPlatformTokens).map((platform) => (
      <div key={platform.label} className="rounded-xl border border-border bg-background overflow-hidden">
        <div className={`px-5 py-3 border-b border-border flex items-center justify-between`}>
          <div>
            <h4 className="text-sm font-semibold text-foreground">{platform.label}</h4>
            <p className="text-xs text-muted-foreground">{platform.count} communities found</p>
          </div>
          <Badge variant="outline" className={platform.color + " text-xs"}>
            {platform.count}
          </Badge>
        </div>
        <div className="divide-y divide-border">
          {platform.tokens.map((token) => (
            <div key={token.symbol} className="flex items-center gap-3 px-5 py-3">
              <TokenAvatar symbol={token.symbol} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{token.name}</p>
                <p className="text-xs text-muted-foreground truncate">{token.handle}</p>
              </div>
              <Badge variant="secondary" className="text-xs shrink-0">{token.marketCap}</Badge>
            </div>
          ))}
        </div>
        <div className="flex gap-2 px-5 py-3 border-t border-border bg-muted/30">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" disabled>
            <Copy className="w-3 h-3" /> Copy All
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" disabled>
            <Megaphone className="w-3 h-3" /> Create Campaign
          </Button>
        </div>
      </div>
    ))}
  </div>
);
