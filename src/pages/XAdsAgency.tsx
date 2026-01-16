import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  ArrowLeft, Twitter, Calendar, DollarSign, Target, FileText, Loader2, 
  CheckCircle2, AlertCircle, Heart, Repeat, MessageCircle, Eye, 
  Bookmark, Quote, Image as ImageIcon, Users, Zap
} from "lucide-react";

// Tweet interface matching the actual API response
interface Tweet {
  id: string;
  text: string;
  created_at: string;
  author: {
    id: string;
    name: string;
    username: string;
    profile_image_url?: string;
  };
  metrics: {
    retweets: number;
    likes: number;
    replies: number;
    quotes: number;
    impressions: number;
    bookmarks: number;
  };
  media?: {
    type: string;
    url: string;
    width: number;
    height: number;
  }[];
  urls?: {
    url: string;
    expanded_url: string;
    display_url: string;
  }[];
}

interface TweetsResponse {
  success: boolean;
  account_id: string;
  promotable_user: {
    id: string;
    promotable_user_type: string;
  };
  tweets: Tweet[];
  count: number;
  already_promoted_count: number;
}

// Network token data interfaces
interface TokenData {
  logo: string;
  ticker: string;
  score: number;
  x: string;
  telegram: string;
  reddit: string;
  youtube: string;
  tags: string[];
}

interface Node {
  id: number;
  x: number;
  y: number;
  logo: string;
  ticker: string;
  score: number;
  size: number;
  socialX: string;
}

interface Edge {
  from: number;
  to: number;
  strength: number;
}

interface Objective {
  id: string;
  name: string;
  product_type: string;
}

const OBJECTIVES: Objective[] = [
  { id: "FOLLOWERS", name: "Followers", product_type: "PROMOTED_ACCOUNT" },
  { id: "REACH", name: "Reach", product_type: "PROMOTED_TWEETS" },
  { id: "ENGAGEMENTS", name: "Engagements", product_type: "PROMOTED_TWEETS" },
  { id: "VIDEO_VIEWS", name: "Video Views", product_type: "PROMOTED_TWEETS" },
  { id: "WEBSITE_CLICKS", name: "Website Clicks", product_type: "PROMOTED_TWEETS" },
  { id: "APP_INSTALLS", name: "App Installs", product_type: "PROMOTED_TWEETS" },
  { id: "APP_ENGAGEMENTS", name: "App Engagements", product_type: "PROMOTED_TWEETS" },
];

const colors = {
  background: "#0a0a0f",
  cardBg: "#12121a",
  accentPrimary: "#6366f1",
  accentSecondary: "#8b5cf6",
  accentGlow: "#9333ea",
  textPrimary: "#ffffff",
  textSecondary: "#94a3b8",
  border: "#1e1e2e",
  success: "#22c55e",
  error: "#ef4444",
  warning: "#f59e0b",
  nodeBg: "#1a1a2e",
};

// Network Chart Component
const NetworkChart = ({ tokens, studyId }: { tokens: TokenData[]; studyId: string }) => {
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  const { nodes, edges } = useMemo(() => {
    if (tokens.length === 0) return { nodes: [], edges: [] };

    const size = 400;
    const padding = 40;
    const maxTokens = Math.min(tokens.length, 50);

    const seed = studyId?.split('').reduce((a, c) => a + c.charCodeAt(0), 0) || 1;
    const seededRandom = (i: number) => {
      const x = Math.sin(seed * i) * 10000;
      return x - Math.floor(x);
    };

    const generatedNodes: Node[] = [];

    tokens.slice(0, maxTokens).forEach((token, index) => {
      const nodeSize = 16 + token.score * 20;
      let x: number, y: number;
      let attempts = 0;
      const maxAttempts = 50;

      do {
        if (index === 0) {
          x = size / 2;
          y = size / 2;
        } else {
          const golden = 0.618033988749895;
          const angle = index * golden * Math.PI * 2 + seededRandom(index * 7) * 0.5;
          const baseRadius = 40 + Math.sqrt(index / maxTokens) * (size / 2 - padding - 40);
          const jitter = (seededRandom(index * 13 + attempts) - 0.5) * 50;
          
          x = size / 2 + Math.cos(angle) * (baseRadius + jitter);
          y = size / 2 + Math.sin(angle) * (baseRadius + jitter);
        }

        x = Math.max(padding, Math.min(size - padding, x));
        y = Math.max(padding, Math.min(size - padding, y));

        const hasOverlap = generatedNodes.some((other) => {
          const dx = x - other.x;
          const dy = y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = (nodeSize + other.size) / 2 + 8;
          return dist < minDist;
        });

        if (!hasOverlap || attempts >= maxAttempts) break;
        attempts++;
      } while (true);

      generatedNodes.push({
        id: index,
        x,
        y,
        logo: token.logo,
        ticker: token.ticker || '',
        score: token.score,
        size: nodeSize,
        socialX: token.x || '',
      });
    });

    const generatedEdges: Edge[] = [];
    const edgeCount = Math.floor(maxTokens * 1.5);

    for (let i = 0; i < edgeCount; i++) {
      const from = Math.floor(seededRandom(i * 3) * maxTokens);
      const to = Math.floor(seededRandom(i * 3 + 1) * maxTokens);
      
      if (from !== to) {
        const exists = generatedEdges.some(
          e => (e.from === from && e.to === to) || (e.from === to && e.to === from)
        );
        if (!exists) {
          const strength = (generatedNodes[from].score + generatedNodes[to].score) / 2;
          generatedEdges.push({ from, to, strength });
        }
      }
    }

    return { nodes: generatedNodes, edges: generatedEdges };
  }, [tokens, studyId]);

  return (
    <div className="relative w-full aspect-square">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        style={{ background: 'transparent' }}
      >
        {/* Edges */}
        {edges.map((edge, i) => {
          const fromNode = nodes[edge.from];
          const toNode = nodes[edge.to];
          if (!fromNode || !toNode) return null;
          return (
            <line
              key={i}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={colors.accentPrimary}
              strokeOpacity={0.15 + edge.strength * 0.2}
              strokeWidth={0.5 + edge.strength}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <g
            key={node.id}
            onMouseEnter={() => setHoveredNode(node)}
            onMouseLeave={() => setHoveredNode(null)}
            className="cursor-pointer"
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size / 2 + 2}
              fill={colors.accentPrimary}
              opacity={hoveredNode?.id === node.id ? 0.5 : 0.1}
            />
            <clipPath id={`clip-agency-${node.id}`}>
              <circle cx={node.x} cy={node.y} r={node.size / 2} />
            </clipPath>
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size / 2}
              fill={colors.nodeBg}
            />
            <image
              href={node.logo}
              x={node.x - node.size / 2}
              y={node.y - node.size / 2}
              width={node.size}
              height={node.size}
              clipPath={`url(#clip-agency-${node.id})`}
              style={{ pointerEvents: 'none' }}
            />
          </g>
        ))}
      </svg>

      {/* Hover tooltip */}
      {hoveredNode && (
        <div
          className="absolute z-10 px-2 py-1 rounded text-xs pointer-events-none"
          style={{
            left: hoveredNode.x,
            top: hoveredNode.y - 20,
            transform: 'translate(-50%, -100%)',
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.accentPrimary}`,
            color: colors.textPrimary,
          }}
        >
          <span className="font-semibold">{hoveredNode.ticker}</span>
          {hoveredNode.socialX && (
            <span className="ml-1 opacity-70">@{hoveredNode.socialX}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default function XAdsAgency() {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get("uid") || "";
  const title = searchParams.get("title") || "Campaign";
  const account = searchParams.get("account") || "";
  const studyId = searchParams.get("studyId") || "";

  // Tweet state
  const [tweetsResponse, setTweetsResponse] = useState<TweetsResponse | null>(null);
  const [tweetsLoading, setTweetsLoading] = useState(true);
  const [tweetsError, setTweetsError] = useState<string | null>(null);

  // Network data state
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [networkLoading, setNetworkLoading] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);

  // Selected tweets for campaign
  const [selectedTweetIds, setSelectedTweetIds] = useState<string[]>([]);

  // Campaign form state
  const [objective, setObjective] = useState<string>("FOLLOWERS");
  const [dailyBudget, setDailyBudget] = useState<number>(10);
  const [totalBudget, setTotalBudget] = useState<number | undefined>(undefined);
  const [bidAmount, setBidAmount] = useState<number>(0.5);
  const [startDate, setStartDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState<string>("");
  const [status, setStatus] = useState<"DRAFT" | "ACTIVE">("DRAFT");

  // Campaign creation state
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<any>(null);

  // Fetch tweets
  useEffect(() => {
    const fetchTweets = async () => {
      if (!account) {
        setTweetsError("No account ID provided");
        setTweetsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://token-analysis-final.nw.r.appspot.com/x/tweet/${account}`
        );
        const data = await response.json();

        if (!response.ok || data.error) {
          throw new Error(data.error || "Failed to fetch tweets");
        }

        setTweetsResponse(data);
      } catch (err) {
        setTweetsError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setTweetsLoading(false);
      }
    };

    fetchTweets();
  }, [account]);

  // Fetch network data if studyId is provided
  useEffect(() => {
    const fetchNetworkData = async () => {
      if (!studyId) return;
      
      setNetworkLoading(true);
      try {
        const apiUrl = uid 
          ? `https://token-analysis-final.nw.r.appspot.com/chart/${studyId}?uid=${uid}`
          : `https://token-analysis-final.nw.r.appspot.com/chart/${studyId}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch network data");
        const data = await response.json();
        setTokens(data.data?.token || []);
      } catch (err) {
        setNetworkError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setNetworkLoading(false);
      }
    };

    fetchNetworkData();
  }, [studyId, uid]);

  const tweets = tweetsResponse?.tweets || [];

  // Check if objective requires tweets
  const requiresTweets = objective !== "FOLLOWERS";

  // Toggle tweet selection
  const toggleTweetSelection = (tweetId: string) => {
    setSelectedTweetIds((prev) =>
      prev.includes(tweetId)
        ? prev.filter((id) => id !== tweetId)
        : [...prev, tweetId]
    );
  };

  // Create campaign
  const handleCreateCampaign = async () => {
    if (requiresTweets && selectedTweetIds.length === 0) {
      setCreateError("Please select at least one tweet for this objective");
      return;
    }

    setCreating(true);
    setCreateError(null);
    setCreateSuccess(null);

    try {
      const payload: any = {
        account_id: account,
        objective,
        daily_budget: dailyBudget,
        bid_amount: bidAmount,
        start_date: new Date(startDate).toISOString(),
        status,
      };

      if (totalBudget) {
        payload.total_budget = totalBudget;
      }

      if (endDate) {
        payload.end_date = new Date(endDate).toISOString();
      }

      if (requiresTweets) {
        payload.tweet_ids = selectedTweetIds;
      }

      const response = await fetch(
        "https://token-analysis-final.nw.r.appspot.com/x/create-adgroup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to create campaign");
      }

      setCreateSuccess(data);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setCreating(false);
    }
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-xl"
        style={{
          backgroundColor: `${colors.background}ee`,
          borderColor: colors.border,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" style={{ color: colors.textSecondary }} />
            </button>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${colors.accentPrimary}22` }}
              >
                <Twitter className="w-5 h-5" style={{ color: colors.accentPrimary }} />
              </div>
              <div>
                <h1
                  className="text-lg font-semibold"
                  style={{ color: colors.textPrimary }}
                >
                  {title || "X Ads Campaign"}
                </h1>
                <p className="text-xs" style={{ color: colors.textSecondary }}>
                  Account: {account}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Tweets List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Network Chart Section */}
            {studyId && (
              <div
                className="rounded-xl p-4"
                style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${colors.accentSecondary}22` }}
                  >
                    <Zap className="w-4 h-4" style={{ color: colors.accentSecondary }} />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: colors.textPrimary }}>
                      Blockchain Audience Network
                    </h3>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>
                      On-chain wallet overlap powering your targeting
                    </p>
                  </div>
                </div>
                
                {networkLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" style={{ color: colors.accentPrimary }} />
                  </div>
                ) : networkError ? (
                  <div className="text-center py-4">
                    <p className="text-sm" style={{ color: colors.error }}>{networkError}</p>
                  </div>
                ) : tokens.length > 0 ? (
                  <div className="max-w-md mx-auto">
                    <NetworkChart tokens={tokens} studyId={studyId} />
                    <div className="flex items-center justify-center gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" style={{ color: colors.accentPrimary }} />
                        <span className="text-xs" style={{ color: colors.textSecondary }}>
                          {tokens.length} tokens analyzed
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* Tweets Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: colors.textPrimary }}
                  >
                    Available Tweets
                  </h2>
                  {tweetsResponse && (
                    <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                      {tweetsResponse.count} tweets • {tweetsResponse.already_promoted_count} already promoted
                    </p>
                  )}
                </div>
                {selectedTweetIds.length > 0 && (
                  <span
                    className="text-sm px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: `${colors.accentPrimary}22`,
                      color: colors.accentPrimary,
                    }}
                  >
                    {selectedTweetIds.length} selected
                  </span>
                )}
              </div>

              {tweetsLoading ? (
                <div
                  className="rounded-xl p-12 text-center"
                  style={{ backgroundColor: colors.cardBg }}
                >
                  <Loader2
                    className="w-8 h-8 animate-spin mx-auto mb-3"
                    style={{ color: colors.accentPrimary }}
                  />
                  <p style={{ color: colors.textSecondary }}>Loading tweets...</p>
                </div>
              ) : tweetsError ? (
                <div
                  className="rounded-xl p-8 text-center"
                  style={{ backgroundColor: colors.cardBg }}
                >
                  <AlertCircle
                    className="w-8 h-8 mx-auto mb-3"
                    style={{ color: colors.error }}
                  />
                  <p style={{ color: colors.error }}>{tweetsError}</p>
                </div>
              ) : tweets.length === 0 ? (
                <div
                  className="rounded-xl p-8 text-center"
                  style={{ backgroundColor: colors.cardBg }}
                >
                  <Twitter
                    className="w-8 h-8 mx-auto mb-3"
                    style={{ color: colors.textSecondary }}
                  />
                  <p style={{ color: colors.textSecondary }}>No tweets found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tweets.map((tweet) => {
                    const isSelected = selectedTweetIds.includes(tweet.id);
                    return (
                      <div
                        key={tweet.id}
                        onClick={() => toggleTweetSelection(tweet.id)}
                        className="rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.01]"
                        style={{
                          backgroundColor: colors.cardBg,
                          border: `2px solid ${isSelected ? colors.accentPrimary : colors.border}`,
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-1 transition-colors ${
                              isSelected ? "" : "border"
                            }`}
                            style={{
                              backgroundColor: isSelected
                                ? colors.accentPrimary
                                : "transparent",
                              borderColor: isSelected ? colors.accentPrimary : colors.border,
                            }}
                          >
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            {/* Author info */}
                            <div className="flex items-center gap-2 mb-2">
                              {tweet.author.profile_image_url && (
                                <img
                                  src={tweet.author.profile_image_url}
                                  alt={tweet.author.name}
                                  className="w-6 h-6 rounded-full"
                                />
                              )}
                              <span
                                className="font-medium"
                                style={{ color: colors.textPrimary }}
                              >
                                {tweet.author.name}
                              </span>
                              <span
                                className="text-sm"
                                style={{ color: colors.textSecondary }}
                              >
                                @{tweet.author.username}
                              </span>
                            </div>

                            {/* Tweet text */}
                            <p
                              className="text-sm mb-3 whitespace-pre-wrap"
                              style={{ color: colors.textSecondary }}
                            >
                              {tweet.text}
                            </p>

                            {/* Media preview */}
                            {tweet.media && tweet.media.length > 0 && (
                              <div className="mb-3 flex gap-2 flex-wrap">
                                {tweet.media.slice(0, 2).map((m, i) => (
                                  <div
                                    key={i}
                                    className="relative rounded-lg overflow-hidden"
                                    style={{ 
                                      width: tweet.media!.length === 1 ? '100%' : '48%',
                                      maxHeight: 150 
                                    }}
                                  >
                                    <img
                                      src={m.url}
                                      alt="Tweet media"
                                      className="w-full h-full object-cover"
                                      style={{ maxHeight: 150 }}
                                    />
                                    {m.type !== 'photo' && (
                                      <div
                                        className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[10px]"
                                        style={{ backgroundColor: colors.cardBg, color: colors.textPrimary }}
                                      >
                                        {m.type}
                                      </div>
                                    )}
                                  </div>
                                ))}
                                {tweet.media.length > 2 && (
                                  <div
                                    className="flex items-center justify-center rounded-lg"
                                    style={{ 
                                      backgroundColor: `${colors.accentPrimary}22`,
                                      width: '48%',
                                      height: 80
                                    }}
                                  >
                                    <span style={{ color: colors.accentPrimary }}>
                                      +{tweet.media.length - 2} more
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Metrics */}
                            <div className="flex items-center gap-4 text-xs flex-wrap">
                              <span
                                className="flex items-center gap-1"
                                style={{ color: colors.textSecondary }}
                              >
                                <Heart className="w-3.5 h-3.5" />
                                {tweet.metrics?.likes?.toLocaleString() || 0}
                              </span>
                              <span
                                className="flex items-center gap-1"
                                style={{ color: colors.textSecondary }}
                              >
                                <Repeat className="w-3.5 h-3.5" />
                                {tweet.metrics?.retweets?.toLocaleString() || 0}
                              </span>
                              <span
                                className="flex items-center gap-1"
                                style={{ color: colors.textSecondary }}
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                {tweet.metrics?.replies?.toLocaleString() || 0}
                              </span>
                              <span
                                className="flex items-center gap-1"
                                style={{ color: colors.textSecondary }}
                              >
                                <Quote className="w-3.5 h-3.5" />
                                {tweet.metrics?.quotes?.toLocaleString() || 0}
                              </span>
                              <span
                                className="flex items-center gap-1"
                                style={{ color: colors.textSecondary }}
                              >
                                <Eye className="w-3.5 h-3.5" />
                                {tweet.metrics?.impressions?.toLocaleString() || 0}
                              </span>
                              <span
                                className="flex items-center gap-1"
                                style={{ color: colors.textSecondary }}
                              >
                                <Bookmark className="w-3.5 h-3.5" />
                                {tweet.metrics?.bookmarks?.toLocaleString() || 0}
                              </span>
                              <span style={{ color: colors.textSecondary }}>
                                {formatDate(tweet.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right: Campaign Creation Panel */}
          <div className="lg:col-span-1">
            <div
              className="sticky top-24 rounded-xl p-6 space-y-6"
              style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
            >
              <div>
                <h2
                  className="text-xl font-semibold mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Create Campaign
                </h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Configure and launch your X Ads campaign
                </p>
              </div>

              {/* Objective */}
              <div className="space-y-2">
                <label
                  className="text-sm font-medium flex items-center gap-2"
                  style={{ color: colors.textPrimary }}
                >
                  <Target className="w-4 h-4" style={{ color: colors.accentPrimary }} />
                  Objective
                </label>
                <select
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                  }}
                >
                  {OBJECTIVES.map((obj) => (
                    <option key={obj.id} value={obj.id}>
                      {obj.name} ({obj.product_type})
                    </option>
                  ))}
                </select>
                {requiresTweets && (
                  <p className="text-xs" style={{ color: colors.warning }}>
                    ⚠️ This objective requires tweet selection
                  </p>
                )}
              </div>

              {/* Daily Budget */}
              <div className="space-y-2">
                <label
                  className="text-sm font-medium flex items-center gap-2"
                  style={{ color: colors.textPrimary }}
                >
                  <DollarSign className="w-4 h-4" style={{ color: colors.accentPrimary }} />
                  Daily Budget ($)
                </label>
                <input
                  type="number"
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(parseFloat(e.target.value) || 0)}
                  min={1}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                  }}
                />
              </div>

              {/* Total Budget (Optional) */}
              <div className="space-y-2">
                <label
                  className="text-sm font-medium flex items-center gap-2"
                  style={{ color: colors.textPrimary }}
                >
                  <DollarSign className="w-4 h-4" style={{ color: colors.accentSecondary }} />
                  Total Budget ($)
                  <span className="text-xs" style={{ color: colors.textSecondary }}>
                    (optional)
                  </span>
                </label>
                <input
                  type="number"
                  value={totalBudget || ""}
                  onChange={(e) =>
                    setTotalBudget(e.target.value ? parseFloat(e.target.value) : undefined)
                  }
                  min={1}
                  placeholder="No limit"
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                  }}
                />
              </div>

              {/* Bid Amount */}
              <div className="space-y-2">
                <label
                  className="text-sm font-medium flex items-center gap-2"
                  style={{ color: colors.textPrimary }}
                >
                  <DollarSign className="w-4 h-4" style={{ color: colors.accentPrimary }} />
                  Bid Amount ($)
                </label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(parseFloat(e.target.value) || 0)}
                  min={0.01}
                  step={0.01}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                  }}
                />
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label
                  className="text-sm font-medium flex items-center gap-2"
                  style={{ color: colors.textPrimary }}
                >
                  <Calendar className="w-4 h-4" style={{ color: colors.accentPrimary }} />
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                  }}
                />
              </div>

              {/* End Date (Optional) */}
              <div className="space-y-2">
                <label
                  className="text-sm font-medium flex items-center gap-2"
                  style={{ color: colors.textPrimary }}
                >
                  <Calendar className="w-4 h-4" style={{ color: colors.accentSecondary }} />
                  End Date
                  <span className="text-xs" style={{ color: colors.textSecondary }}>
                    (optional)
                  </span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                  }}
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label
                  className="text-sm font-medium flex items-center gap-2"
                  style={{ color: colors.textPrimary }}
                >
                  <FileText className="w-4 h-4" style={{ color: colors.accentPrimary }} />
                  Status
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStatus("DRAFT")}
                    className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor:
                        status === "DRAFT" ? colors.accentPrimary : colors.background,
                      border: `1px solid ${status === "DRAFT" ? colors.accentPrimary : colors.border}`,
                      color: status === "DRAFT" ? "#fff" : colors.textSecondary,
                    }}
                  >
                    Draft
                  </button>
                  <button
                    onClick={() => setStatus("ACTIVE")}
                    className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor:
                        status === "ACTIVE" ? colors.success : colors.background,
                      border: `1px solid ${status === "ACTIVE" ? colors.success : colors.border}`,
                      color: status === "ACTIVE" ? "#fff" : colors.textSecondary,
                    }}
                  >
                    Active
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {createError && (
                <div
                  className="p-3 rounded-lg text-sm"
                  style={{ backgroundColor: `${colors.error}22`, color: colors.error }}
                >
                  {createError}
                </div>
              )}

              {/* Success Message */}
              {createSuccess && (
                <div
                  className="p-3 rounded-lg text-sm"
                  style={{ backgroundColor: `${colors.success}22`, color: colors.success }}
                >
                  <p className="font-medium mb-1">Campaign created successfully!</p>
                  <p className="text-xs opacity-80">
                    Campaign ID: {createSuccess.campaign_id || createSuccess.id || "N/A"}
                  </p>
                </div>
              )}

              {/* Create Button */}
              <button
                onClick={handleCreateCampaign}
                disabled={creating || (requiresTweets && selectedTweetIds.length === 0)}
                className="w-full py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentSecondary})`,
                  color: "#fff",
                }}
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Twitter className="w-4 h-4" />
                    Create Campaign
                  </>
                )}
              </button>

              {requiresTweets && selectedTweetIds.length === 0 && !creating && (
                <p className="text-xs text-center" style={{ color: colors.textSecondary }}>
                  Select tweets from the left to enable campaign creation
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
