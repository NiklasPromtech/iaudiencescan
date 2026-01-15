import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { Users, MapPin, Globe, Zap, Heart, Hash, TrendingUp, User, Eye, MousePointer, ThumbsUp, Repeat, UserPlus, MessageSquare } from "lucide-react";
import iconX from "@/assets/icon-x.jpg";
import iconTelegram from "@/assets/icon-telegram.jpg";
import iconReddit from "@/assets/icon-reddit.jpg";
import iconYoutube from "@/assets/icon-youtube.jpg";
import iconGoogleAds from "@/assets/icon-googleads.jpg";

// X Ads data interfaces
interface XAdsHandle {
  handle: string;
  user_id: number;
  impressions: number;
  engagements: number;
  clicks: number;
  likes: number;
  retweets: number;
  follows: number;
  replies: number;
}

interface XAdsData {
  account_id: string;
  adgroup_id: string;
  date_range: {
    start: string;
    end: string;
  };
  total_impressions: number;
  handles: XAdsHandle[];
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
  telegram: string;
  reddit: string;
  youtube: string;
  tags: string[];
  xAdsData?: XAdsHandle; // X Ads performance data
}

interface Edge {
  from: number;
  to: number;
  strength: number;
}

interface ColorConfig {
  background: string;
  accentPrimary: string;
  accentGlow: string;
  textPrimary: string;
  textSecondary: string;
  nodeBg: string;
}

const defaultColors: ColorConfig = {
  background: "#0f0f23",
  accentPrimary: "#a855f7",
  accentGlow: "#9333ea",
  textPrimary: "#ffffff",
  textSecondary: "#a1a1aa",
  nodeBg: "#1a1a2e",
};

interface HoverPanelProps {
  node: Node;
  position: { x: number; y: number };
  colors: ColorConfig;
}

const HoverPanel = ({ node, position, colors }: HoverPanelProps) => {
  const hasSocials = node.socialX || node.telegram || node.reddit || node.youtube;
  const hasTags = node.tags && node.tags.length > 0;
  const displayTags = node.tags?.slice(0, 4) || [];
  const remainingTags = (node.tags?.length || 0) - 4;
  const scoreDots = Math.ceil(node.score * 5);
  const hasXAdsData = !!node.xAdsData;

  return (
    <div
      className="absolute z-50 backdrop-blur-md rounded-xl p-4 shadow-2xl pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)',
        marginTop: -16,
        maxWidth: 320,
        minWidth: 260,
        backgroundColor: `${colors.background}f2`,
        border: `1px solid ${colors.accentPrimary}66`,
        boxShadow: `0 25px 50px -12px ${colors.accentGlow}4d`,
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <img
          src={node.logo}
          alt={node.ticker}
          className="w-10 h-10 rounded-full"
          style={{ border: `1px solid ${colors.accentPrimary}4d` }}
        />
        <div>
          <div className="font-bold text-base" style={{ color: colors.textPrimary }}>{node.ticker || 'Unknown'}</div>
          <div className="text-[10px]" style={{ color: `${colors.textPrimary}66` }}>
            {node.socialX ? `@${node.socialX}` : 'Derived from on-chain wallet overlap'}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3 py-2" style={{ borderTop: `1px solid ${colors.accentPrimary}33`, borderBottom: `1px solid ${colors.accentPrimary}33` }}>
        <span className="text-xs" style={{ color: `${colors.textPrimary}99` }}>Overlap strength</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: i <= scoreDots ? colors.accentPrimary : `${colors.accentPrimary}33` }}
            />
          ))}
        </div>
      </div>

      {/* X Ads Performance Data */}
      {hasXAdsData && node.xAdsData && (
        <div 
          className="mb-3 p-3 rounded-lg"
          style={{ backgroundColor: `${colors.accentPrimary}1a`, border: `1px solid ${colors.accentPrimary}33` }}
        >
          <div className="text-[10px] font-semibold mb-2 flex items-center gap-1.5" style={{ color: colors.accentPrimary }}>
            <img src={iconX} alt="X" className="w-4 h-4 rounded" />
            X Ads Performance
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5">
              <Eye className="w-3 h-3" style={{ color: colors.textSecondary }} />
              <span className="text-[10px]" style={{ color: colors.textSecondary }}>Impressions</span>
              <span className="text-[10px] font-semibold ml-auto" style={{ color: colors.textPrimary }}>
                {node.xAdsData.impressions.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MousePointer className="w-3 h-3" style={{ color: colors.textSecondary }} />
              <span className="text-[10px]" style={{ color: colors.textSecondary }}>Clicks</span>
              <span className="text-[10px] font-semibold ml-auto" style={{ color: colors.textPrimary }}>
                {node.xAdsData.clicks.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3" style={{ color: colors.textSecondary }} />
              <span className="text-[10px]" style={{ color: colors.textSecondary }}>Engagements</span>
              <span className="text-[10px] font-semibold ml-auto" style={{ color: colors.textPrimary }}>
                {node.xAdsData.engagements.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ThumbsUp className="w-3 h-3" style={{ color: colors.textSecondary }} />
              <span className="text-[10px]" style={{ color: colors.textSecondary }}>Likes</span>
              <span className="text-[10px] font-semibold ml-auto" style={{ color: colors.textPrimary }}>
                {node.xAdsData.likes.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Repeat className="w-3 h-3" style={{ color: colors.textSecondary }} />
              <span className="text-[10px]" style={{ color: colors.textSecondary }}>Retweets</span>
              <span className="text-[10px] font-semibold ml-auto" style={{ color: colors.textPrimary }}>
                {node.xAdsData.retweets.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <UserPlus className="w-3 h-3" style={{ color: colors.textSecondary }} />
              <span className="text-[10px]" style={{ color: colors.textSecondary }}>Follows</span>
              <span className="text-[10px] font-semibold ml-auto" style={{ color: colors.textPrimary }}>
                {node.xAdsData.follows.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              <MessageSquare className="w-3 h-3" style={{ color: colors.textSecondary }} />
              <span className="text-[10px]" style={{ color: colors.textSecondary }}>Replies</span>
              <span className="text-[10px] font-semibold ml-auto" style={{ color: colors.textPrimary }}>
                {node.xAdsData.replies.toLocaleString()}
              </span>
            </div>
          </div>
          {/* CTR calculation */}
          <div className="mt-2 pt-2" style={{ borderTop: `1px solid ${colors.accentPrimary}26` }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px]" style={{ color: colors.textSecondary }}>CTR</span>
              <span className="text-xs font-semibold" style={{ color: colors.accentPrimary }}>
                {((node.xAdsData.clicks / node.xAdsData.impressions) * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px]" style={{ color: colors.textSecondary }}>Engagement Rate</span>
              <span className="text-xs font-semibold" style={{ color: colors.accentPrimary }}>
                {((node.xAdsData.engagements / node.xAdsData.impressions) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {(hasSocials || hasTags) && (
        <div className="flex items-center gap-2 mb-3">
          {node.socialX && <img src={iconX} alt="X" className="w-6 h-6 rounded" />}
          {node.telegram && <img src={iconTelegram} alt="Telegram" className="w-6 h-6 rounded" />}
          {node.reddit && <img src={iconReddit} alt="Reddit" className="w-6 h-6 rounded" />}
          {node.youtube && <img src={iconYoutube} alt="YouTube" className="w-6 h-6 rounded" />}
          {hasTags && <img src={iconGoogleAds} alt="Google Ads" className="w-6 h-6 rounded" />}
        </div>
      )}

      {hasTags && (
        <div>
          <div className="text-[10px] mb-2" style={{ color: `${colors.textPrimary}66` }}>Paid targeting signals</div>
          <div className="flex flex-wrap gap-1">
            {displayTags.map((tag, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${colors.accentPrimary}33`, color: colors.accentPrimary }}
              >
                {tag}
              </span>
            ))}
            {remainingTags > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colors.accentPrimary}1a`, color: colors.accentPrimary }}>
                +{remainingTags} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// X Ads Summary Component
const XAdsSummary = ({ xAdsData, colors }: { xAdsData: XAdsData; colors: ColorConfig }) => {
  const startDate = new Date(xAdsData.date_range.start).toLocaleDateString();
  const endDate = new Date(xAdsData.date_range.end).toLocaleDateString();
  
  const totalEngagements = xAdsData.handles.reduce((sum, h) => sum + h.engagements, 0);
  const totalClicks = xAdsData.handles.reduce((sum, h) => sum + h.clicks, 0);
  const totalLikes = xAdsData.handles.reduce((sum, h) => sum + h.likes, 0);
  const totalFollows = xAdsData.handles.reduce((sum, h) => sum + h.follows, 0);

  return (
    <div 
      className="rounded-xl p-4 backdrop-blur-md"
      style={{ 
        backgroundColor: `${colors.accentPrimary}0d`,
        border: `1px solid ${colors.accentPrimary}33` 
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <img src={iconX} alt="X" className="w-5 h-5 rounded" />
        <h3 className="font-semibold" style={{ color: colors.textPrimary }}>X Ads Campaign</h3>
      </div>
      <p className="text-xs mb-3" style={{ color: colors.textSecondary }}>
        {startDate} - {endDate}
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-lg p-3" style={{ backgroundColor: `${colors.background}99` }}>
          <Eye className="w-4 h-4 mb-1" style={{ color: colors.accentPrimary }} />
          <div className="text-[10px]" style={{ color: colors.textSecondary }}>Total Impressions</div>
          <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
            {xAdsData.total_impressions.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg p-3" style={{ backgroundColor: `${colors.background}99` }}>
          <Zap className="w-4 h-4 mb-1" style={{ color: colors.accentPrimary }} />
          <div className="text-[10px]" style={{ color: colors.textSecondary }}>Engagements</div>
          <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
            {totalEngagements.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg p-3" style={{ backgroundColor: `${colors.background}99` }}>
          <MousePointer className="w-4 h-4 mb-1" style={{ color: colors.accentPrimary }} />
          <div className="text-[10px]" style={{ color: colors.textSecondary }}>Clicks</div>
          <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
            {totalClicks.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg p-3" style={{ backgroundColor: `${colors.background}99` }}>
          <ThumbsUp className="w-4 h-4 mb-1" style={{ color: colors.accentPrimary }} />
          <div className="text-[10px]" style={{ color: colors.textSecondary }}>Likes</div>
          <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
            {totalLikes.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg p-3" style={{ backgroundColor: `${colors.background}99` }}>
          <UserPlus className="w-4 h-4 mb-1" style={{ color: colors.accentPrimary }} />
          <div className="text-[10px]" style={{ color: colors.textSecondary }}>Follows</div>
          <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
            {totalFollows.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg p-3" style={{ backgroundColor: `${colors.background}99` }}>
          <Users className="w-4 h-4 mb-1" style={{ color: colors.accentPrimary }} />
          <div className="text-[10px]" style={{ color: colors.textSecondary }}>Matched Handles</div>
          <div className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
            {xAdsData.handles.length}
          </div>
        </div>
      </div>
    </div>
  );
};

// Top Performers Component
const TopPerformers = ({ handles, colors }: { handles: XAdsHandle[]; colors: ColorConfig }) => {
  const sortedByImpressions = [...handles].sort((a, b) => b.impressions - a.impressions).slice(0, 5);
  const sortedByEngagement = [...handles].sort((a, b) => 
    (b.engagements / b.impressions) - (a.engagements / a.impressions)
  ).slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Top by Impressions */}
      <div 
        className="rounded-xl p-4 backdrop-blur-md"
        style={{ backgroundColor: `${colors.background}cc`, border: `1px solid ${colors.accentPrimary}26` }}
      >
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: colors.textPrimary }}>
          <Eye className="w-4 h-4" />
          Top by Impressions
        </h4>
        <div className="space-y-2">
          {sortedByImpressions.map((handle, i) => (
            <div key={i} className="flex items-center gap-2 py-1">
              <span className="text-xs font-mono w-4" style={{ color: colors.textSecondary }}>{i + 1}</span>
              <span className="text-xs flex-1" style={{ color: colors.textPrimary }}>{handle.handle}</span>
              <span className="text-xs font-semibold" style={{ color: colors.accentPrimary }}>
                {handle.impressions.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top by Engagement Rate */}
      <div 
        className="rounded-xl p-4 backdrop-blur-md"
        style={{ backgroundColor: `${colors.background}cc`, border: `1px solid ${colors.accentPrimary}26` }}
      >
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: colors.textPrimary }}>
          <TrendingUp className="w-4 h-4" />
          Top by Engagement Rate
        </h4>
        <div className="space-y-2">
          {sortedByEngagement.map((handle, i) => {
            const rate = ((handle.engagements / handle.impressions) * 100).toFixed(2);
            return (
              <div key={i} className="flex items-center gap-2 py-1">
                <span className="text-xs font-mono w-4" style={{ color: colors.textSecondary }}>{i + 1}</span>
                <span className="text-xs flex-1" style={{ color: colors.textPrimary }}>{handle.handle}</span>
                <span className="text-xs font-semibold" style={{ color: colors.accentPrimary }}>
                  {rate}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const XData = () => {
  const { studyId } = useParams<{ studyId: string }>();
  const [searchParams] = useSearchParams();
  
  // Get X Ads params
  const acId = searchParams.get('acId');
  const adId = searchParams.get('adId');
  
  // Network data state
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [networkLoading, setNetworkLoading] = useState(true);
  const [networkError, setNetworkError] = useState<string | null>(null);
  
  // X Ads data state
  const [xAdsData, setXAdsData] = useState<XAdsData | null>(null);
  const [xAdsLoading, setXAdsLoading] = useState(true);
  const [xAdsError, setXAdsError] = useState<string | null>(null);
  
  // UI state
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  
  const [colors] = useState<ColorConfig>(defaultColors);

  // Fetch network data
  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        const uid = searchParams.get('uid');
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

    if (studyId) fetchNetworkData();
  }, [studyId, searchParams]);

  // Fetch X Ads data
  useEffect(() => {
    const fetchXAdsData = async () => {
      if (!acId || !adId) {
        setXAdsError("Missing account ID or ad group ID");
        setXAdsLoading(false);
        return;
      }

      try {
        const apiUrl = `https://token-analysis-final.nw.r.appspot.com/x/data?acId=${acId}&adId=${adId}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch X Ads data");
        const data = await response.json();
        setXAdsData(data);
      } catch (err) {
        setXAdsError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setXAdsLoading(false);
      }
    };

    fetchXAdsData();
  }, [acId, adId]);

  // Create a map of X handles to ads data for quick lookup
  const xAdsHandleMap = useMemo(() => {
    if (!xAdsData) return new Map<string, XAdsHandle>();
    const map = new Map<string, XAdsHandle>();
    xAdsData.handles.forEach(handle => {
      // Normalize handle (remove @ if present)
      const normalizedHandle = handle.handle.replace(/^@/, '').toLowerCase();
      map.set(normalizedHandle, handle);
    });
    return map;
  }, [xAdsData]);

  // Generate nodes and edges for network visualization
  const { nodes, edges } = useMemo(() => {
    if (tokens.length === 0) return { nodes: [], edges: [] };

    const size = 1000;
    const padding = 100;
    const maxTokens = Math.min(tokens.length, 80);

    const seed = studyId?.split('').reduce((a, c) => a + c.charCodeAt(0), 0) || 1;
    const seededRandom = (i: number) => {
      const x = Math.sin(seed * i) * 10000;
      return x - Math.floor(x);
    };

    const generatedNodes: Node[] = [];

    tokens.slice(0, maxTokens).forEach((token, index) => {
      const nodeSize = 24 + token.score * 36;
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
          const baseRadius = 80 + Math.sqrt(index / maxTokens) * (size / 2 - padding - 80);
          const jitter = (seededRandom(index * 13 + attempts) - 0.5) * 100;
          
          x = size / 2 + Math.cos(angle) * (baseRadius + jitter);
          y = size / 2 + Math.sin(angle) * (baseRadius + jitter);
        }

        x = Math.max(padding, Math.min(size - padding, x));
        y = Math.max(padding, Math.min(size - padding, y));

        const hasOverlap = generatedNodes.some((other) => {
          const dx = x - other.x;
          const dy = y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = (nodeSize + other.size) / 2 + 15;
          return dist < minDist;
        });

        if (!hasOverlap || attempts >= maxAttempts) break;
        attempts++;
      } while (true);

      // Look up X Ads data for this token
      const tokenXHandle = token.x ? token.x.replace(/^@/, '').toLowerCase() : '';
      const xAdsHandleData = tokenXHandle ? xAdsHandleMap.get(tokenXHandle) : undefined;

      generatedNodes.push({
        id: index,
        x,
        y,
        logo: token.logo,
        ticker: token.ticker || '',
        score: token.score,
        size: nodeSize,
        socialX: token.x || '',
        telegram: token.telegram || '',
        reddit: token.reddit || '',
        youtube: token.youtube || '',
        tags: token.tags || [],
        xAdsData: xAdsHandleData,
      });
    });

    const generatedEdges: Edge[] = [];
    const edgeCount = Math.floor(maxTokens * 2);

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

    for (let i = 1; i < Math.min(6, maxTokens); i++) {
      const exists = generatedEdges.some(e => 
        (e.from === 0 && e.to === i) || (e.from === i && e.to === 0)
      );
      if (!exists) {
        generatedEdges.push({ from: 0, to: i, strength: generatedNodes[i].score });
      }
    }

    return { nodes: generatedNodes, edges: generatedEdges };
  }, [tokens, studyId, xAdsHandleMap]);

  const handleNodeHover = (node: Node, event: React.MouseEvent) => {
    const svgEl = event.currentTarget.closest('svg');
    const rect = svgEl?.getBoundingClientRect();
    if (rect) {
      const svgSize = 1000;
      const scale = Math.min(rect.width / svgSize, rect.height / svgSize);
      const offsetX = (rect.width - svgSize * scale) / 2;
      const offsetY = (rect.height - svgSize * scale) / 2;
      setHoverPosition({
        x: rect.left + offsetX + node.x * scale,
        y: rect.top + offsetY + node.y * scale,
      });
    }
    setHoveredNode(node);
  };

  const handleNodeLeave = () => {
    setHoveredNode(null);
  };

  // Count nodes with X Ads data
  const nodesWithXAdsData = nodes.filter(n => n.xAdsData).length;

  const isLoading = networkLoading || xAdsLoading;
  const size = 1000;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="animate-pulse" style={{ color: colors.textSecondary }}>Loading data...</div>
      </div>
    );
  }

  if (networkError && xAdsError) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-red-500">Error loading data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full blur-[200px]" 
          style={{ backgroundColor: `${colors.accentGlow}26` }}
        />
        <div 
          className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full blur-[180px]" 
          style={{ backgroundColor: `${colors.accentPrimary}1a` }}
        />
      </div>

      {/* Hover Panel */}
      {hoveredNode && (
        <HoverPanel node={hoveredNode} position={hoverPosition} colors={colors} />
      )}

      <div className="relative flex flex-col lg:flex-row min-h-screen">
        {/* Left Panel - Network Visualization */}
        <div className="lg:w-1/2 xl:w-3/5 flex items-center justify-center p-4 lg:p-0">
          <div className="relative w-full h-[50vh] lg:h-screen flex items-center justify-center">
            {networkError ? (
              <div className="text-center" style={{ color: colors.textSecondary }}>
                <p>Network data unavailable</p>
              </div>
            ) : (
              <svg
                viewBox={`0 0 ${size} ${size}`}
                className="w-auto h-full max-w-full"
                style={{ aspectRatio: '1 / 1' }}
              >
                <defs>
                  {nodes.map((node) => (
                    <clipPath key={`clip-${node.id}`} id={`clip-xdata-${node.id}`}>
                      <circle cx={node.x} cy={node.y} r={node.size / 2 - 2} />
                    </clipPath>
                  ))}
                </defs>

                {/* Edges */}
                <g className="edges">
                  {edges.map((edge, index) => {
                    const fromNode = nodes[edge.from];
                    const toNode = nodes[edge.to];
                    if (!fromNode || !toNode) return null;

                    const opacity = 0.15 + edge.strength * 0.4;
                    const strokeWidth = 0.5 + edge.strength * 1.5;

                    return (
                      <line
                        key={`edge-${index}`}
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke={colors.accentPrimary}
                        strokeWidth={strokeWidth}
                        strokeOpacity={opacity}
                        strokeLinecap="round"
                      />
                    );
                  })}
                </g>

                {/* Nodes */}
                <g className="nodes">
                  {nodes.map((node) => {
                    const isCenter = node.id === 0;
                    const hasXAds = !!node.xAdsData;

                    return (
                      <g
                        key={node.id}
                        onMouseEnter={(e) => handleNodeHover(node, e)}
                        onMouseLeave={handleNodeLeave}
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Highlight ring for nodes with X Ads data */}
                        {hasXAds && (
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.size / 2 + 6}
                            fill="none"
                            stroke="#1DA1F2"
                            strokeWidth={2}
                            strokeOpacity={0.6}
                            strokeDasharray="4 2"
                          />
                        )}

                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.size / 2 + 2}
                          fill="none"
                          stroke={hasXAds ? "#1DA1F2" : colors.accentPrimary}
                          strokeWidth={isCenter ? 3 : 2}
                          strokeOpacity={0.4 + node.score * 0.5}
                        />

                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.size / 2}
                          fill={colors.nodeBg}
                        />

                        <image
                          href={node.logo}
                          x={node.x - node.size / 2 + 2}
                          y={node.y - node.size / 2 + 2}
                          width={node.size - 4}
                          height={node.size - 4}
                          clipPath={`url(#clip-xdata-${node.id})`}
                          preserveAspectRatio="xMidYMid slice"
                        />
                      </g>
                    );
                  })}
                </g>
              </svg>
            )}

            {/* Stats overlay */}
            {!networkError && nodes.length > 0 && (
              <div 
                className="absolute bottom-4 left-4 backdrop-blur-md rounded-xl px-4 py-2"
                style={{ 
                  backgroundColor: `${colors.background}99`,
                  border: `1px solid ${colors.accentPrimary}4d`
                }}
              >
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accentPrimary }} />
                    <span style={{ color: colors.textSecondary }}>
                      <span className="font-semibold" style={{ color: colors.accentPrimary }}>{nodes.length}</span> tokens
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#1DA1F2" }} />
                    <span style={{ color: colors.textSecondary }}>
                      <span className="font-semibold" style={{ color: "#1DA1F2" }}>{nodesWithXAdsData}</span> with X data
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - X Ads Data */}
        <div className="lg:w-1/2 xl:w-2/5 overflow-y-auto max-h-screen p-6" style={{ borderLeft: `1px solid ${colors.accentPrimary}1a` }}>
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold mb-1 flex items-center gap-2" style={{ color: colors.textPrimary }}>
                <img src={iconX} alt="X" className="w-6 h-6 rounded" />
                X Ads Performance
              </h1>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Scan: {studyId} • Account: {acId} • Ad Group: {adId}
              </p>
            </div>

            {xAdsError ? (
              <div 
                className="rounded-xl p-4 text-center"
                style={{ backgroundColor: `${colors.background}cc`, border: `1px solid #ef444433` }}
              >
                <p style={{ color: '#ef4444' }}>{xAdsError}</p>
                <p className="text-xs mt-2" style={{ color: colors.textSecondary }}>
                  Make sure to provide acId and adId query parameters
                </p>
              </div>
            ) : xAdsData ? (
              <>
                {/* Campaign Summary */}
                <XAdsSummary xAdsData={xAdsData} colors={colors} />

                {/* Match Info */}
                <div 
                  className="rounded-xl p-4 backdrop-blur-md"
                  style={{ backgroundColor: `${colors.background}cc`, border: `1px solid ${colors.accentPrimary}26` }}
                >
                  <h4 className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                    Network Match
                  </h4>
                  <p className="text-xs" style={{ color: colors.textSecondary }}>
                    <span className="font-semibold" style={{ color: colors.accentPrimary }}>{nodesWithXAdsData}</span> tokens 
                    in your network have matching X handles with ad performance data. 
                    Hover over nodes with <span style={{ color: "#1DA1F2" }}>blue rings</span> to see their metrics.
                  </p>
                </div>

                {/* Top Performers */}
                <TopPerformers handles={xAdsData.handles} colors={colors} />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default XData;
