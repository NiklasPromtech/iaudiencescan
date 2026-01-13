import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { ChevronRight, Palette, Copy, Check, Users, MapPin, Globe, Zap, Heart, Hash, TrendingUp, User } from "lucide-react";
import iconX from "@/assets/icon-x.jpg";
import iconTelegram from "@/assets/icon-telegram.jpg";
import iconReddit from "@/assets/icon-reddit.jpg";
import iconYoutube from "@/assets/icon-youtube.jpg";
import iconGoogleAds from "@/assets/icon-googleads.jpg";

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

// Cluster/Merge data interfaces
interface AffinityItem {
  screen_name: string;
  name: string;
  avatar: string;
  percentage: number;
}

interface HashtagItem {
  hashtag: string;
  value: number;
}

interface OtherSummaryItem {
  key: string;
  label: string;
  diff: number;
  pct?: number | string;
  count?: string;
  value: number;
}

interface ClusterSummary {
  bio?: [string, number][];
  isBioByPct?: boolean;
  affinity?: AffinityItem[];
  hashtags?: HashtagItem[];
  other?: OtherSummaryItem[];
}

interface Cluster {
  id: string;
  color?: string;
  isRoot?: boolean;
  title: string;
  size: number;
  sizePct: number;
  status: string;
  hidden?: boolean;
  isMerge?: boolean;
  contentProcessed?: boolean;
  summary?: ClusterSummary;
}

interface DemographicItem {
  key: string;
  label: string;
  value: number | string;
}

interface MergeData {
  id: string;
  title: string;
  createdAt: string;
  audienceNetwork: string;
  clusters: Cluster[];
  affinity: AffinityItem[];
  hashtags: HashtagItem[];
  bio: [string, number][];
  isBioByPct: boolean;
  demographic: {
    age: DemographicItem;
    city: DemographicItem;
    language: DemographicItem;
    interests: DemographicItem;
    country: DemographicItem;
    gender: DemographicItem;
  };
  brands?: AffinityItem[];
  people?: AffinityItem[];
  consume?: AffinityItem[];
}

interface HoverPanelProps {
  node: Node;
  position: { x: number; y: number };
  colors: ColorConfig;
}

const defaultColors: ColorConfig = {
  background: "#0f0f23",
  accentPrimary: "#a855f7",
  accentGlow: "#9333ea",
  textPrimary: "#ffffff",
  textSecondary: "#a1a1aa",
  nodeBg: "#1a1a2e",
};

const HoverPanel = ({ node, position, colors }: HoverPanelProps) => {
  const hasSocials = node.socialX || node.telegram || node.reddit || node.youtube;
  const hasTags = node.tags && node.tags.length > 0;
  const displayTags = node.tags?.slice(0, 4) || [];
  const remainingTags = (node.tags?.length || 0) - 4;
  const scoreDots = Math.ceil(node.score * 5);

  return (
    <div
      className="absolute z-50 backdrop-blur-md rounded-xl p-4 shadow-2xl pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)',
        marginTop: -16,
        maxWidth: 280,
        minWidth: 220,
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
          <div className="text-[10px]" style={{ color: `${colors.textPrimary}66` }}>Derived from on-chain wallet overlap</div>
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

// Cluster Card Component
const ClusterCard = ({ cluster, colors }: { cluster: Cluster; colors: ColorConfig }) => {
  const isGenerated = cluster.status === "GENERATED";
  const clusterColor = cluster.color || colors.accentPrimary;

  return (
    <div
      className="rounded-xl p-4 backdrop-blur-md transition-all hover:scale-[1.02]"
      style={{
        backgroundColor: `${colors.background}cc`,
        border: `1px solid ${clusterColor}4d`,
        boxShadow: `0 4px 20px -4px ${clusterColor}26`,
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: clusterColor }}
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate" style={{ color: colors.textPrimary }}>
            {cluster.title}
          </h4>
          <p className="text-xs" style={{ color: colors.textSecondary }}>
            {cluster.size.toLocaleString()} users ({cluster.sizePct}%)
          </p>
        </div>
        {cluster.isRoot && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
            Root
          </span>
        )}
      </div>

      {isGenerated && cluster.summary && (
        <div className="space-y-3">
          {/* Bio keywords */}
          {cluster.summary.bio && cluster.summary.bio.length > 0 && (
            <div>
              <div className="text-[10px] mb-1.5" style={{ color: colors.textSecondary }}>Bio Keywords</div>
              <div className="flex flex-wrap gap-1">
                {cluster.summary.bio.slice(0, 3).map(([word, score], i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${clusterColor}26`, color: clusterColor }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Top affinity */}
          {cluster.summary.affinity && cluster.summary.affinity.length > 0 && (
            <div>
              <div className="text-[10px] mb-1.5" style={{ color: colors.textSecondary }}>Top Affinity</div>
              <div className="flex items-center gap-2">
                <img
                  src={cluster.summary.affinity[0].avatar}
                  alt={cluster.summary.affinity[0].name}
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-xs truncate" style={{ color: colors.textPrimary }}>
                  @{cluster.summary.affinity[0].screen_name}
                </span>
                <span className="text-[10px] ml-auto" style={{ color: clusterColor }}>
                  {cluster.summary.affinity[0].percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          )}

          {/* Demographics */}
          {cluster.summary.other && cluster.summary.other.length > 0 && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {cluster.summary.other.map((item, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  {item.key === 'age' && <User className="w-3 h-3" style={{ color: colors.textSecondary }} />}
                  {item.key === 'gender' && <Users className="w-3 h-3" style={{ color: colors.textSecondary }} />}
                  {item.key === 'countries' && <Globe className="w-3 h-3" style={{ color: colors.textSecondary }} />}
                  {item.key === 'interests' && <Heart className="w-3 h-3" style={{ color: colors.textSecondary }} />}
                  <span className="truncate" style={{ color: colors.textSecondary }}>{item.label}</span>
                  <span style={{ color: clusterColor }}>{item.value}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!isGenerated && (
        <div className="text-xs py-2" style={{ color: colors.textSecondary }}>
          Status: {cluster.status}
        </div>
      )}
    </div>
  );
};

// Demographic Stats Component
const DemographicStats = ({ demographic, colors }: { demographic: MergeData['demographic']; colors: ColorConfig }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
    {[
      { icon: User, label: 'Age', value: demographic.age.label },
      { icon: Users, label: 'Gender', value: `${demographic.gender.value}% ${demographic.gender.label}` },
      { icon: Globe, label: 'Country', value: demographic.country.label },
      { icon: MapPin, label: 'City', value: demographic.city.label },
      { icon: Zap, label: 'Language', value: demographic.language.label },
      { icon: Heart, label: 'Interest', value: demographic.interests.label },
    ].map((item, i) => (
      <div
        key={i}
        className="rounded-lg p-3 backdrop-blur-sm"
        style={{ backgroundColor: `${colors.accentPrimary}0d`, border: `1px solid ${colors.accentPrimary}26` }}
      >
        <item.icon className="w-4 h-4 mb-1" style={{ color: colors.accentPrimary }} />
        <div className="text-[10px]" style={{ color: colors.textSecondary }}>{item.label}</div>
        <div className="text-sm font-medium truncate" style={{ color: colors.textPrimary }}>{item.value}</div>
      </div>
    ))}
  </div>
);

// Affinity List Component
const AffinityList = ({ items, title, colors }: { items: AffinityItem[]; title: string; colors: ColorConfig }) => (
  <div className="rounded-xl p-4 backdrop-blur-md" style={{ backgroundColor: `${colors.background}cc`, border: `1px solid ${colors.accentPrimary}26` }}>
    <h4 className="text-sm font-semibold mb-3" style={{ color: colors.textPrimary }}>{title}</h4>
    <div className="space-y-2">
      {items.slice(0, 4).map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <img src={item.avatar} alt={item.name} className="w-6 h-6 rounded-full" />
          <div className="flex-1 min-w-0">
            <div className="text-xs truncate" style={{ color: colors.textPrimary }}>{item.name}</div>
            <div className="text-[10px]" style={{ color: colors.textSecondary }}>@{item.screen_name}</div>
          </div>
          <span className="text-xs" style={{ color: colors.accentPrimary }}>{(item.percentage / 100).toFixed(1)}%</span>
        </div>
      ))}
    </div>
  </div>
);

// Hashtags Component
const HashtagsList = ({ hashtags, colors }: { hashtags: HashtagItem[]; colors: ColorConfig }) => (
  <div className="rounded-xl p-4 backdrop-blur-md" style={{ backgroundColor: `${colors.background}cc`, border: `1px solid ${colors.accentPrimary}26` }}>
    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: colors.textPrimary }}>
      <Hash className="w-4 h-4" />
      Top Hashtags
    </h4>
    <div className="flex flex-wrap gap-1.5">
      {hashtags.slice(0, 8).map((item, i) => (
        <span
          key={i}
          className="text-xs px-2 py-1 rounded-full"
          style={{ backgroundColor: `${colors.accentPrimary}1a`, color: colors.accentPrimary }}
        >
          #{item.hashtag}
        </span>
      ))}
    </div>
  </div>
);

// Bio Keywords Component
const BioKeywords = ({ bio, colors }: { bio: [string, number][]; colors: ColorConfig }) => (
  <div className="rounded-xl p-4 backdrop-blur-md" style={{ backgroundColor: `${colors.background}cc`, border: `1px solid ${colors.accentPrimary}26` }}>
    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: colors.textPrimary }}>
      <TrendingUp className="w-4 h-4" />
      Bio Keywords
    </h4>
    <div className="flex flex-wrap gap-1.5">
      {bio.slice(0, 12).map(([word, score], i) => (
        <span
          key={i}
          className="text-xs px-2 py-1 rounded-full"
          style={{ 
            backgroundColor: `${colors.accentPrimary}${Math.min(Math.round(score * 10) + 10, 40).toString(16)}`,
            color: colors.textPrimary
          }}
        >
          {word}
        </span>
      ))}
    </div>
  </div>
);

const Merge = () => {
  const { studyId } = useParams<{ studyId: string }>();
  const [searchParams] = useSearchParams();
  
  // Network data state
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [networkLoading, setNetworkLoading] = useState(true);
  const [networkError, setNetworkError] = useState<string | null>(null);
  
  // Merge/Cluster data state
  const [mergeData, setMergeData] = useState<MergeData | null>(null);
  const [mergeLoading, setMergeLoading] = useState(true);
  const [mergeError, setMergeError] = useState<string | null>(null);
  
  // UI state
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<'clusters' | 'insights'>('clusters');
  
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

  // Fetch merge/cluster data
  useEffect(() => {
    const fetchMergeData = async () => {
      try {
        const uid = searchParams.get('uid');
        const apiUrl = uid 
          ? `https://token-analysis-final.nw.r.appspot.com/merge/${studyId}?uid=${uid}`
          : `https://token-analysis-final.nw.r.appspot.com/merge/${studyId}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch merge data");
        const data = await response.json();
        setMergeData(data);
      } catch (err) {
        setMergeError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setMergeLoading(false);
      }
    };

    if (studyId) fetchMergeData();
  }, [studyId, searchParams]);

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
  }, [tokens, studyId]);

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

  const generatedClusters = mergeData?.clusters.filter(c => c.status === 'GENERATED' && !c.isRoot) || [];
  const rootCluster = mergeData?.clusters.find(c => c.isRoot);

  const isLoading = networkLoading || mergeLoading;
  const size = 1000;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="animate-pulse" style={{ color: colors.textSecondary }}>Loading data...</div>
      </div>
    );
  }

  if (networkError && mergeError) {
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
                    <clipPath key={`clip-${node.id}`} id={`clip-merge-${node.id}`}>
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

                    return (
                      <g
                        key={node.id}
                        onMouseEnter={(e) => handleNodeHover(node, e)}
                        onMouseLeave={handleNodeLeave}
                        style={{ cursor: 'pointer' }}
                      >
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.size / 2 + 2}
                          fill="none"
                          stroke={colors.accentPrimary}
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
                          clipPath={`url(#clip-merge-${node.id})`}
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
                    <div className="w-4 h-0.5 rounded" style={{ backgroundColor: `${colors.accentPrimary}99` }} />
                    <span style={{ color: colors.textSecondary }}>
                      <span className="font-semibold" style={{ color: colors.accentPrimary }}>{edges.length}</span> connections
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Cluster/Merge Data */}
        <div className="lg:w-1/2 xl:w-2/5 overflow-y-auto max-h-screen p-6" style={{ borderLeft: `1px solid ${colors.accentPrimary}1a` }}>
          {mergeError ? (
            <div className="text-center py-12" style={{ color: colors.textSecondary }}>
              <p>Merge data unavailable</p>
            </div>
          ) : mergeData ? (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                  {mergeData.title}
                </h1>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  {new Date(mergeData.createdAt).toLocaleDateString()} • {mergeData.audienceNetwork.toUpperCase()} Network
                </p>
              </div>

              {/* Root Cluster Summary */}
              {rootCluster && (
                <div 
                  className="rounded-xl p-4 backdrop-blur-md"
                  style={{ 
                    backgroundColor: `${colors.accentPrimary}0d`,
                    border: `1px solid ${colors.accentPrimary}33` 
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold" style={{ color: colors.textPrimary }}>{rootCluster.title}</h3>
                    <span className="text-sm" style={{ color: colors.accentPrimary }}>
                      {rootCluster.size.toLocaleString()} users
                    </span>
                  </div>
                  {mergeData.demographic && (
                    <DemographicStats demographic={mergeData.demographic} colors={colors} />
                  )}
                </div>
              )}

              {/* Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('clusters')}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: activeTab === 'clusters' ? colors.accentPrimary : `${colors.accentPrimary}1a`,
                    color: activeTab === 'clusters' ? '#fff' : colors.textPrimary,
                  }}
                >
                  Clusters ({generatedClusters.length})
                </button>
                <button
                  onClick={() => setActiveTab('insights')}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: activeTab === 'insights' ? colors.accentPrimary : `${colors.accentPrimary}1a`,
                    color: activeTab === 'insights' ? '#fff' : colors.textPrimary,
                  }}
                >
                  Insights
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'clusters' && (
                <div className="space-y-4">
                  {generatedClusters.map((cluster) => (
                    <ClusterCard key={cluster.id} cluster={cluster} colors={colors} />
                  ))}
                  {generatedClusters.length === 0 && (
                    <p className="text-center py-8" style={{ color: colors.textSecondary }}>
                      No generated clusters yet
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'insights' && (
                <div className="space-y-4">
                  {/* Bio Keywords */}
                  {mergeData.bio && mergeData.bio.length > 0 && (
                    <BioKeywords bio={mergeData.bio} colors={colors} />
                  )}

                  {/* Hashtags */}
                  {mergeData.hashtags && mergeData.hashtags.length > 0 && (
                    <HashtagsList hashtags={mergeData.hashtags} colors={colors} />
                  )}

                  {/* Affinity Lists */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {mergeData.brands && mergeData.brands.length > 0 && (
                      <AffinityList items={mergeData.brands} title="Top Brands" colors={colors} />
                    )}
                    {mergeData.people && mergeData.people.length > 0 && (
                      <AffinityList items={mergeData.people} title="Top People" colors={colors} />
                    )}
                    {mergeData.consume && mergeData.consume.length > 0 && (
                      <AffinityList items={mergeData.consume} title="Media Consumption" colors={colors} />
                    )}
                  </div>

                  {/* Global Affinity */}
                  {mergeData.affinity && mergeData.affinity.length > 0 && (
                    <AffinityList items={mergeData.affinity} title="Overall Affinity" colors={colors} />
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Merge;
