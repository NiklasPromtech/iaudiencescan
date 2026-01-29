import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Twitter, 
  MessageCircle, 
  Copy, 
  Check, 
  ExternalLink,
  Globe,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Rocket
} from "lucide-react";
import { toast } from "sonner";
import { toast as shadcnToast } from "@/hooks/use-toast";
import { ScanResultsTopToken } from "@/lib/api";

type Platform = "twitter" | "telegram" | "reddit" | "discord";

interface PlatformConfig {
  icon: React.ReactNode;
  label: string;
  color: string;
  bgColor: string;
  tip: string;
  getHandle: (token: ScanResultsTopToken) => string | null | undefined;
  getUrl: (handle: string) => string;
  adPlatformUrl?: string;
  adButtonLabel?: string;
  adPasteInstructions?: string;
}

const PLATFORM_CONFIGS: Record<Platform, PlatformConfig> = {
  twitter: {
    icon: <Twitter className="h-5 w-5" />,
    label: "X / Twitter",
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
    tip: "Add these accounts to your X Ads audience targeting, or engage with their posts to reach their followers.",
    getHandle: (t) => t.twitter,
    getUrl: (handle) => `https://x.com/${handle}`,
    adPlatformUrl: "https://ads.x.com",
    adButtonLabel: "Create X Ads Campaign",
    adPasteInstructions: "Paste them under \"Follower look-alikes\" in your ad group targeting to reach users similar to these communities.",
  },
  telegram: {
    icon: <MessageCircle className="h-5 w-5" />,
    label: "Telegram",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    tip: "Use the TG Ads Assistant extension to bulk-add these communities to your Telegram Ads targeting.",
    getHandle: (t) => t.telegram,
    getUrl: (handle) => `https://t.me/${handle}`,
    adPlatformUrl: "https://ads.telegram.org",
    adButtonLabel: "Create Telegram Ad",
    adPasteInstructions: "Paste them in the channel targeting section to reach users in these communities.",
  },
  reddit: {
    icon: <Globe className="h-5 w-5" />,
    label: "Reddit",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    tip: "Engage authentically in these subreddits. Share valuable insights, not just promotional content.",
    getHandle: (t) => t.reddit,
    getUrl: (handle) => `https://reddit.com/r/${handle}`,
    adPlatformUrl: "https://ads.reddit.com",
    adButtonLabel: "Create Reddit Ad",
    adPasteInstructions: "Paste them in the subreddit targeting section to reach users in these communities.",
  },
  discord: {
    icon: <MessageCircle className="h-5 w-5" />,
    label: "Discord",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    tip: "Join these servers to understand the community, participate in discussions, and find collaboration opportunities.",
    getHandle: (t) => t.discord,
    getUrl: (handle) => `https://discord.gg/${handle}`,
    // No ad platform for Discord
  },
};

interface PlatformTargetingCardProps {
  platform: Platform;
  tokens: ScanResultsTopToken[];
}

export const PlatformTargetingCard = ({ platform, tokens }: PlatformTargetingCardProps) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const config = PLATFORM_CONFIGS[platform];

  const tokensWithPlatform = tokens.filter((t) => {
    const handle = config.getHandle(t);
    return handle && handle.trim() !== "";
  });

  if (tokensWithPlatform.length === 0) return null;

  const visibleTokens = expanded ? tokensWithPlatform : tokensWithPlatform.slice(0, 5);

  const copyAllHandles = () => {
    const handles = tokensWithPlatform
      .map((t) => config.getHandle(t))
      .filter(Boolean)
      .join("\n");
    navigator.clipboard.writeText(handles);
    setCopied(true);
    toast.success(`Copied ${tokensWithPlatform.length} ${config.label} handles`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateCampaign = async () => {
    if (!config.adPlatformUrl) return;
    
    setIsCreatingCampaign(true);
    
    // Format handles appropriately for the platform
    const handles = tokensWithPlatform
      .map((t) => {
        const handle = config.getHandle(t);
        if (!handle) return null;
        // Add @ prefix for Twitter handles
        if (platform === "twitter") {
          return handle.startsWith("@") ? handle : `@${handle}`;
        }
        // Add r/ prefix for Reddit
        if (platform === "reddit") {
          return handle.startsWith("r/") ? handle : `r/${handle}`;
        }
        return handle;
      })
      .filter(Boolean)
      .join(", ");
    
    try {
      await navigator.clipboard.writeText(handles);
      
      shadcnToast({
        title: `✓ ${tokensWithPlatform.length} ${config.label} handles copied!`,
        description: `Opening ${config.label} Ads... ${config.adPasteInstructions}`,
        duration: 6000,
      });
      
      // Short delay so user can see the toast before redirect
      setTimeout(() => {
        window.open(config.adPlatformUrl, "_blank");
        setIsCreatingCampaign(false);
      }, 1000);
      
    } catch (err) {
      console.error("Failed to copy handles:", err);
      shadcnToast({
        title: "Failed to copy handles",
        description: "Please try again or copy them manually using the Copy All button.",
        variant: "destructive",
      });
      setIsCreatingCampaign(false);
    }
  };

  const formatMarketCap = (cap: number | null | undefined) => {
    if (!cap) return null;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(1)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(1)}M`;
    if (cap >= 1e3) return `$${(cap / 1e3).toFixed(0)}K`;
    return `$${cap.toFixed(0)}`;
  };

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className={`p-4 ${config.bgColor} border-b border-border`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={config.color}>{config.icon}</div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground">{config.label}</h3>
              <p className="text-sm text-muted-foreground">
                {tokensWithPlatform.length} communities found
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={copyAllHandles}
              className="gap-2"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copy All
            </Button>
            {config.adPlatformUrl && (
              <Button
                size="sm"
                onClick={handleCreateCampaign}
                disabled={isCreatingCampaign}
                className="gap-2"
              >
                {isCreatingCampaign ? (
                  <>
                    <Copy className="h-4 w-4 animate-pulse" />
                    Copying...
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4" />
                    {config.adButtonLabel}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tip */}
      <div className="px-4 py-3 bg-muted/30 border-b border-border flex gap-2 text-sm">
        <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
        <span className="text-muted-foreground">{config.tip}</span>
      </div>

      {/* Telegram Extension CTA */}
      {platform === "telegram" && (
        <div className="px-4 py-3 bg-blue-500/5 border-b border-border">
          <a
            href="https://chromewebstore.google.com/detail/tg-ads-assistant/mkeadhmjcphanpkfflgogkgpdbkogodp"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            Install TG Ads Assistant to bulk-add communities →
          </a>
        </div>
      )}

      {/* Token List */}
      <ScrollArea className={expanded && tokensWithPlatform.length > 5 ? "h-64" : undefined}>
        <div className="divide-y divide-border">
          {visibleTokens.map((token) => {
            const handle = config.getHandle(token);
            if (!handle) return null;

            return (
              <div
                key={token.token_address}
                className="px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {token.token_logo_url ? (
                    <img
                      src={token.token_logo_url}
                      alt={token.token_symbol}
                      className="h-8 w-8 rounded-full shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <span className="text-xs font-medium text-muted-foreground">
                        {token.token_symbol?.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{token.token_name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {platform === "twitter" ? "@" : ""}{handle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {token.market_cap_usd && (
                    <Badge variant="secondary" className="text-xs">
                      {formatMarketCap(token.market_cap_usd)}
                    </Badge>
                  )}
                  <a
                    href={config.getUrl(handle)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md hover:bg-muted transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Expand/Collapse */}
      {tokensWithPlatform.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-3 border-t border-border text-sm text-muted-foreground hover:bg-muted/30 transition-colors flex items-center justify-center gap-1"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              View all {tokensWithPlatform.length} communities
            </>
          )}
        </button>
      )}
    </Card>
  );
};
