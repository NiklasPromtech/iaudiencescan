import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  ArrowLeft, Twitter, Calendar, DollarSign, Target, Loader2, 
  AlertCircle, Users, Zap, ExternalLink
} from "lucide-react";

// Network token data interfaces

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

  // Network data state
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [networkLoading, setNetworkLoading] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);

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

  // Campaign creation state
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<any>(null);

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

  // Create campaign (always as DRAFT)
  const handleCreateCampaign = async () => {
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
        status: "DRAFT", // Always create as draft
      };

      if (totalBudget) {
        payload.total_budget = totalBudget;
      }

      if (endDate) {
        payload.end_date = new Date(endDate).toISOString();
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Network Chart */}
          <div className="space-y-6">
            {/* Network Chart Section */}
            {studyId && (
              <div
                className="rounded-xl p-6"
                style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${colors.accentSecondary}22` }}
                  >
                    <Zap className="w-5 h-5" style={{ color: colors.accentSecondary }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg" style={{ color: colors.textPrimary }}>
                      Blockchain Audience Network
                    </h3>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      On-chain wallet overlap powering your targeting
                    </p>
                  </div>
                </div>
                
                {networkLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: colors.accentPrimary }} />
                  </div>
                ) : networkError ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" style={{ color: colors.error }} />
                    <p className="text-sm" style={{ color: colors.error }}>{networkError}</p>
                  </div>
                ) : tokens.length > 0 ? (
                  <div>
                    <NetworkChart tokens={tokens} studyId={studyId} />
                    <div className="flex items-center justify-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" style={{ color: colors.accentPrimary }} />
                        <span className="text-sm" style={{ color: colors.textSecondary }}>
                          {tokens.length} tokens analyzed
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Zap className="w-8 h-8 mx-auto mb-2" style={{ color: colors.textSecondary }} />
                    <p className="text-sm" style={{ color: colors.textSecondary }}>No network data available</p>
                  </div>
                )}
              </div>
            )}

            {/* Info Card when no studyId */}
            {!studyId && (
              <div
                className="rounded-xl p-6"
                style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${colors.accentPrimary}22` }}
                  >
                    <Twitter className="w-5 h-5" style={{ color: colors.accentPrimary }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg" style={{ color: colors.textPrimary }}>
                      Create X Ads Campaign
                    </h3>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      Set up a draft campaign for your account
                    </p>
                  </div>
                </div>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Configure your campaign settings on the right. Once created as a draft, 
                  you'll be able to add tweets and activate it directly in X Ads Manager.
                </p>
              </div>
            )}
          </div>

          {/* Right: Campaign Creation Panel */}
          <div>
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
                  Create a draft campaign, then add tweets in X Ads Manager
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

              {/* Error Message */}
              {createError && (
                <div
                  className="p-3 rounded-lg text-sm"
                  style={{ backgroundColor: `${colors.error}22`, color: colors.error }}
                >
                  {createError}
                </div>
              )}

              {/* Success Message with X Ads Link */}
              {createSuccess && (
                <div
                  className="p-4 rounded-lg space-y-3"
                  style={{ backgroundColor: `${colors.success}22`, border: `1px solid ${colors.success}` }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.success }}
                    >
                      <Twitter className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: colors.success }}>
                        Draft Campaign Created!
                      </p>
                      <p className="text-xs" style={{ color: colors.textSecondary }}>
                        Campaign: {createSuccess.campaign?.name || createSuccess.campaign?.id || "N/A"}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Your campaign has been created as a draft. Add tweets and activate it in X Ads Manager.
                  </p>
                  
                  <a
                    href={`https://ads.x.com/campaign_form/${account}/campaign/${createSuccess.campaign?.id}/adgroup/${createSuccess.line_item?.id}/creative_form/0/edit`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                    style={{
                      backgroundColor: colors.textPrimary,
                      color: colors.background,
                    }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Add Tweets in X Ads Manager
                  </a>
                </div>
              )}

              {/* Create Button */}
              {!createSuccess && (
                <button
                  onClick={handleCreateCampaign}
                  disabled={creating}
                  className="w-full py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentSecondary})`,
                    color: "#fff",
                  }}
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating Draft...
                    </>
                  ) : (
                    <>
                      <Twitter className="w-4 h-4" />
                      Create Draft Campaign
                    </>
                  )}
                </button>
              )}

              {!createSuccess && (
                <p className="text-xs text-center" style={{ color: colors.textSecondary }}>
                  Campaign will be created as a draft. Add tweets and activate in X Ads Manager.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
