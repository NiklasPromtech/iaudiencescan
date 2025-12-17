import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, Copy, ExternalLink, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import logoWhite from "@/assets/audiencescan-logo-white.png";

interface ChainData {
  p: string;
  c: number;
}

interface SocialData {
  p: string;
  c: number;
}

interface CategoryData {
  n: string;
  c: number;
}

interface ConfidenceData {
  overall?: number;
  components?: {
    dataIntegrity?: number;
    behaviorQuality?: number;
    contextStrength?: number;
  };
}

interface TokenData {
  ticker: string;
  logo: string;
  x?: string;
  telegram?: string;
  reddit?: string;
  youtube?: string;
  discord?: string;
  tags?: string[];
  score?: number;
}

interface ApiResponse {
  data: {
    chain: ChainData[];
    social: SocialData[];
    categories: CategoryData[];
    confidence: ConfidenceData;
    token: TokenData[];
  };
}

const socialIcons: Record<string, string> = {
  twitter: "X",
  telegram: "send",
  discord: "forum",
  reddit: "reddit",
  youtube: "play_circle",
};

const chainColors: Record<string, string> = {
  ethereum: "#627EEA",
  "binance-smart-chain": "#F3BA2F",
  polygon: "#8247E5",
  avalanche: "#E84142",
  arbitrum: "#28A0F0",
  base: "#0052FF",
  optimism: "#FF0420",
  solana: "#9945FF",
};

const CopyButton = ({ text, label }: { text: string; label: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-sm transition-all"
    >
      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
      {copied ? "Copied!" : `Copy ${label}`}
    </button>
  );
};

const Confidence = () => {
  const { studyId } = useParams<{ studyId: string }>();
  const [data, setData] = useState<ApiResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!studyId) return;
      try {
        const response = await fetch(
          `https://token-analysis-final.nw.r.appspot.com/chart/${studyId}`
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const result: ApiResponse = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [studyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-white/60">Loading scan data...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500">Error: {error || "No data"}</div>
      </div>
    );
  }

  const topChains = data.chain.slice(0, 10);
  const topSocials = data.social.slice(0, 5);
  const topCategories = data.categories.slice(0, 15);
  const maxChainCount = Math.max(...topChains.map((c) => c.c));
  const maxCategoryCount = Math.max(...topCategories.map((c) => c.c));

  // Extract copyable data - ALL available data for wide targeting
  const xHandles = data.token?.filter(t => t.x).map(t => `@${t.x}`) || [];
  const telegramChannels = data.token?.filter(t => t.telegram).map(t => t.telegram) || [];
  const redditCommunities = data.token?.filter(t => t.reddit).map(t => `r/${t.reddit}`) || [];
  const allTags = [...new Set(data.token?.flatMap(t => t.tags || []))];
  const categoryKeywords = data.categories.map(c => c.n);

  const confidenceLevel = data.confidence?.overall 
    ? data.confidence.overall >= 0.8 ? "high" 
    : data.confidence.overall >= 0.5 ? "medium" 
    : "low"
    : "unknown";

  const confidenceMessage = {
    high: "This scan has high confidence. You can proceed with campaigns across all channels.",
    medium: "This scan has moderate confidence. Start with lower-risk channels like X ads before scaling.",
    low: "This scan has lower confidence. Consider running smaller test campaigns first.",
    unknown: "Confidence data unavailable. Proceed with caution.",
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
        rel="stylesheet"
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between bg-gradient-to-b from-black via-black/80 to-transparent">
        <img src={logoWhite} alt="AudienceScan" className="h-8" />
        <a
          href="https://app.audiencescan.io"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-full text-sm font-medium transition-colors"
        >
          Launch App
        </a>
      </header>

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[180px]" />
      </div>

      {/* Content */}
      <main className="relative z-10 pt-24 pb-16 px-6 max-w-7xl mx-auto">
        {/* Overall Confidence */}
        <section className="mb-16 text-center">
          <p className="text-purple-400 text-sm tracking-widest uppercase mb-4">
            Scan Confidence
          </p>
          <div className="inline-flex items-center justify-center w-40 h-40 rounded-full border-4 border-purple-500/30 bg-purple-500/10 mb-6">
            <div className="text-center">
              <span className="text-5xl font-bold text-white">
                {data.confidence?.overall
                  ? Math.round(data.confidence.overall * 100)
                  : "N/A"}
              </span>
              <span className="text-2xl text-purple-400">%</span>
            </div>
          </div>
          <h1 className="text-3xl font-semibold mb-2">Overall Confidence Score</h1>
          <p className="text-white/50 max-w-md mx-auto mb-4">
            Based on data integrity, behavior quality, and context strength
          </p>
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
            confidenceLevel === "high" ? "bg-green-500/20 text-green-400 border border-green-500/30" :
            confidenceLevel === "medium" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" :
            "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}>
            {confidenceMessage[confidenceLevel]}
          </div>
        </section>

        {/* Confidence Components */}
        {data.confidence?.components && (
          <section className="mb-16">
            <h2 className="text-xl font-semibold mb-6 text-center">
              Confidence Components
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { label: "Data Integrity", value: data.confidence.components.dataIntegrity, icon: "verified" },
                { label: "Behavior Quality", value: data.confidence.components.behaviorQuality, icon: "psychology" },
                { label: "Context Strength", value: data.confidence.components.contextStrength, icon: "hub" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
                >
                  <span className="material-icons-outlined text-purple-400 text-3xl mb-3">
                    {item.icon}
                  </span>
                  <div className="text-3xl font-bold mb-1">
                    {item.value ? Math.round(item.value * 100) : "N/A"}%
                  </div>
                  <p className="text-white/50 text-sm">{item.label}</p>
                  <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-500"
                      style={{ width: `${(item.value || 0) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ACTION SECTION - What to do with this data */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2 flex items-center justify-center gap-2">
              <span className="material-icons-outlined text-purple-400">rocket_launch</span>
              Start Your Campaigns
            </h2>
            <p className="text-white/50 max-w-lg mx-auto">
              Copy the data below directly into your advertising platforms. Each section includes ready-to-use targeting data.
            </p>
          </div>

          <Accordion type="multiple" className="space-y-4 max-w-4xl mx-auto">
            {/* X (Twitter) Ads */}
            {xHandles.length > 0 && (
              <AccordionItem value="x-ads" className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    <span className="material-icons-outlined text-purple-400">X</span>
                    <div className="text-left">
                      <h3 className="font-semibold">X (Twitter) Ads</h3>
                      <p className="text-sm text-white/50">{xHandles.length} communities to target</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-sm text-white/70 mb-3">Community handles for targeting:</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {xHandles.slice(0, 10).map(handle => (
                          <span key={handle} className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-sm">
                            {handle}
                          </span>
                        ))}
                        {xHandles.length > 10 && (
                          <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/50">
                            +{xHandles.length - 10} more
                          </span>
                        )}
                      </div>
                      <CopyButton text={xHandles.join("\n")} label="All X Handles" />
                    </div>
                    <div className="space-y-2 text-sm text-white/60">
                      <p className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-purple-400 flex-shrink-0" />
                        Go to <a href="https://ads.x.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">ads.x.com</a> → Create Campaign → Followers targeting
                      </p>
                      <p className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-purple-400 flex-shrink-0" />
                        Paste handles into "Look-alike followers" section
                      </p>
                      <p className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-purple-400 flex-shrink-0" />
                        Optimize for Profile Views or Followers for brand awareness
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Telegram Ads */}
            {telegramChannels.length > 0 && (
              <AccordionItem value="telegram-ads" className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    <span className="material-icons-outlined text-purple-400">send</span>
                    <div className="text-left">
                      <h3 className="font-semibold">Telegram Ads</h3>
                      <p className="text-sm text-white/50">{telegramChannels.length} channels to target</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-sm text-white/70 mb-3">Telegram channels for targeting:</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {telegramChannels.slice(0, 10).map(channel => (
                          <span key={channel} className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-sm">
                            @{channel}
                          </span>
                        ))}
                        {telegramChannels.length > 10 && (
                          <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/50">
                            +{telegramChannels.length - 10} more
                          </span>
                        )}
                      </div>
                      <CopyButton text={telegramChannels.join("\n")} label="All Telegram Channels" />
                    </div>
                    <div className="space-y-2 text-sm text-white/60">
                      <p className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-purple-400 flex-shrink-0" />
                        Go to <a href="https://ads.telegram.org" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">ads.telegram.org</a> → Create Ad
                      </p>
                      <p className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-purple-400 flex-shrink-0" />
                        Add channels one by one (Telegram limitation)
                      </p>
                      <p className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-purple-400 flex-shrink-0" />
                        Pro tip: Send users to a Telegram bot for better conversion tracking
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Reddit Ads */}
            {redditCommunities.length > 0 && (
              <AccordionItem value="reddit-ads" className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    <span className="material-icons-outlined text-purple-400">reddit</span>
                    <div className="text-left">
                      <h3 className="font-semibold">Reddit Ads</h3>
                      <p className="text-sm text-white/50">{redditCommunities.length} subreddits to target</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-sm text-white/70 mb-3">Reddit communities for targeting:</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {redditCommunities.slice(0, 10).map(sub => (
                          <span key={sub} className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-sm">
                            {sub}
                          </span>
                        ))}
                        {redditCommunities.length > 10 && (
                          <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/50">
                            +{redditCommunities.length - 10} more
                          </span>
                        )}
                      </div>
                      <CopyButton text={redditCommunities.join("\n")} label="All Subreddits" />
                    </div>
                    <div className="space-y-2 text-sm text-white/60">
                      <p className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-purple-400 flex-shrink-0" />
                        Go to <a href="https://ads.reddit.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">ads.reddit.com</a> → Create Campaign
                      </p>
                      <p className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-purple-400 flex-shrink-0" />
                        Select "Community targeting" and paste subreddits
                      </p>
                      <p className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-purple-400 flex-shrink-0" />
                        Optimize for clicks to drive engagement
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Google/DV360 Ads */}
            {allTags.length > 0 && (
              <AccordionItem value="google-ads" className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    <span className="material-icons-outlined text-purple-400">ads_click</span>
                    <div className="text-left">
                      <h3 className="font-semibold">Google / DV360 Ads</h3>
                      <p className="text-sm text-white/50">{allTags.length} keywords for targeting</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-sm text-white/70 mb-3">Token tags for keyword targeting:</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {allTags.slice(0, 12).map(tag => (
                          <span key={tag} className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                        {allTags.length > 12 && (
                          <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/50">
                            +{allTags.length - 12} more
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <CopyButton text={allTags.join("\n")} label="All Tags" />
                        <CopyButton text={categoryKeywords.join("\n")} label="Categories" />
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-white/60">
                      <p className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-purple-400 flex-shrink-0" />
                        Go to <a href="https://ads.google.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">ads.google.com</a> or DV360 → Custom intent audiences
                      </p>
                      <p className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-purple-400 flex-shrink-0" />
                        Paste tags as keywords for custom audience creation
                      </p>
                      <p className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-purple-400 flex-shrink-0" />
                        Set to Desktop only for better wallet user targeting
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* DM Outreach */}
            <AccordionItem value="dm-outreach" className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-white/5">
                <div className="flex items-center gap-3">
                  <span className="material-icons-outlined text-purple-400">chat</span>
                  <div className="text-left">
                    <h3 className="font-semibold">Direct Outreach</h3>
                    <p className="text-sm text-white/50">X DMs & Telegram DMs via tools</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <span className="material-icons-outlined text-sm">X</span>
                        X DMs via Drippi
                      </h4>
                      <p className="text-sm text-white/50 mb-3">Use X handles to scrape followers for outreach</p>
                      <a
                        href="https://www.drippiai.link/onboarding?&inviterUid=rhsjratWHLVB6BYKS4qx8j6HO662&inviterName=AudienceScan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm transition-colors"
                      >
                        Open Drippi <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <span className="material-icons-outlined text-sm">send</span>
                        TG DMs via Enreach
                      </h4>
                      <p className="text-sm text-white/50 mb-3">AI-powered Telegram outreach automation</p>
                      <a
                        href="https://enreach.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm transition-colors"
                      >
                        Open Enreach <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Full Playbook Link */}
          <div className="mt-8 text-center">
            <Link
              to="/strategy-playbook"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <span className="material-icons-outlined">menu_book</span>
              View full 10-step Strategy Playbook
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Social Presence */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="material-icons-outlined text-purple-400">share</span>
            Social Presence
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {topSocials.map((social) => (
              <div
                key={social.p}
                className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 flex items-center gap-3"
              >
                <span className="material-icons-outlined text-2xl text-purple-400">
                  {socialIcons[social.p] || "public"}
                </span>
                <div>
                  <p className="capitalize font-medium">{social.p === "twitter" ? "X (Twitter)" : social.p}</p>
                  <p className="text-white/50 text-sm">{social.c.toFixed(1)}% coverage</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Chain Distribution */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="material-icons-outlined text-purple-400">link</span>
            Chain Distribution
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="space-y-4">
              {topChains.map((chain) => {
                const percentage = (chain.c / maxChainCount) * 100;
                const color = chainColors[chain.p] || "#a855f7";
                return (
                  <div key={chain.p} className="flex items-center gap-4">
                    <div className="w-32 text-sm text-white/70 capitalize truncate">
                      {chain.p.replace(/-/g, " ")}
                    </div>
                    <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: color,
                          opacity: 0.8,
                        }}
                      />
                    </div>
                    <div className="w-16 text-right text-sm text-white/50">
                      {chain.c.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="material-icons-outlined text-purple-400">category</span>
            Top Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {topCategories.map((category) => {
              const intensity = (category.c / maxCategoryCount) * 0.8 + 0.2;
              return (
                <div
                  key={category.n}
                  className="px-4 py-2 rounded-full border transition-all hover:scale-105"
                  style={{
                    backgroundColor: `rgba(168, 85, 247, ${intensity * 0.3})`,
                    borderColor: `rgba(168, 85, 247, ${intensity * 0.5})`,
                  }}
                >
                  <span className="text-sm font-medium">{category.n}</span>
                  <span className="text-xs text-white/50 ml-2">{category.c.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Stats */}
        <section className="text-center">
          <div className="inline-flex gap-8 bg-white/5 border border-white/10 rounded-2xl px-8 py-4">
            <div>
              <p className="text-2xl font-bold text-purple-400">{data.token?.length || 0}</p>
              <p className="text-white/50 text-sm">Tokens Analyzed</p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-2xl font-bold text-purple-400">{data.chain?.length || 0}</p>
              <p className="text-white/50 text-sm">Chains Detected</p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-2xl font-bold text-purple-400">{data.categories?.length || 0}</p>
              <p className="text-white/50 text-sm">Categories Found</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Confidence;
