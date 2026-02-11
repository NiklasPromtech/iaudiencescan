import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import {
  getScanResults,
  ScanResultsNetworkEdge,
  ScanResultsNetworkNodeNew,
  ScanResultsTopToken,
} from "@/lib/api";
import iconX from "@/assets/icon-x.jpg";
import iconTelegram from "@/assets/icon-telegram.jpg";
import iconReddit from "@/assets/icon-reddit.jpg";
import iconYoutube from "@/assets/icon-youtube.jpg";
import iconGoogleAds from "@/assets/icon-googleads.jpg";

// Dynamic meta tags for social sharing
const updateMetaTags = (ticker: string, tokenCount: number) => {
  const title = `${ticker} Token Network | AudienceScan`;
  const description = `Discover ${tokenCount} related tokens in the ${ticker} community network. On-chain audience intelligence for Web3 marketing.`;
  const imageUrl = `${window.location.origin}/og-network-preview.png`;
  
  // Update document title
  document.title = title;
  
  // Helper to update or create meta tag
  const setMetaTag = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };
  
  const setMetaName = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };
  
  // Open Graph tags
  setMetaTag('og:title', title);
  setMetaTag('og:description', description);
  setMetaTag('og:image', imageUrl);
  setMetaTag('og:type', 'website');
  setMetaTag('og:url', window.location.href);
  
  // Twitter Card tags
  setMetaName('twitter:card', 'summary_large_image');
  setMetaName('twitter:title', title);
  setMetaName('twitter:description', description);
  setMetaName('twitter:image', imageUrl);
};

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

interface HoverPanelProps {
  node: Node;
  position: { x: number; y: number };
}

const HoverPanel = ({ node, position }: HoverPanelProps) => {
  const hasSocials = node.socialX || node.telegram || node.reddit || node.youtube;
  const hasTags = node.tags && node.tags.length > 0;
  const displayTags = node.tags?.slice(0, 4) || [];
  const remainingTags = (node.tags?.length || 0) - 4;

  // Score visualization (1-5 dots)
  const scoreDots = Math.ceil(node.score * 5);

  return (
    <div
      className="absolute z-50 bg-white/95 backdrop-blur-md border border-orange-500/40 rounded-lg p-4 shadow-2xl shadow-orange-900/20 pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)',
        marginTop: -16,
        maxWidth: 280,
        minWidth: 220,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={node.logo}
          alt={node.ticker}
          className="w-10 h-10 rounded-full border border-orange-500/30"
        />
        <div>
          <div className="text-foreground font-bold text-base">{node.ticker || 'Unknown'}</div>
          <div className="text-muted-foreground text-[10px]">Derived from on-chain wallet overlap</div>
        </div>
      </div>

      {/* Score row */}
      <div className="flex items-center justify-between mb-3 py-2 border-t border-b border-orange-500/20">
        <span className="text-muted-foreground text-xs">Overlap strength</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i <= scoreDots ? 'bg-orange-500' : 'bg-orange-500/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Action signals */}
      {(hasSocials || hasTags) && (
        <div className="flex items-center gap-2 mb-3">
          {node.socialX && (
            <div className="group relative">
              <img src={iconX} alt="X" className="w-6 h-6 rounded" />
            </div>
          )}
          {node.telegram && (
            <div className="group relative">
              <img src={iconTelegram} alt="Telegram" className="w-6 h-6 rounded" />
            </div>
          )}
          {node.reddit && (
            <div className="group relative">
              <img src={iconReddit} alt="Reddit" className="w-6 h-6 rounded" />
            </div>
          )}
          {node.youtube && (
            <div className="group relative">
              <img src={iconYoutube} alt="YouTube" className="w-6 h-6 rounded" />
            </div>
          )}
          {hasTags && (
            <div className="group relative">
              <img src={iconGoogleAds} alt="Google Ads" className="w-6 h-6 rounded" />
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {hasTags && (
        <div>
          <div className="text-muted-foreground text-[10px] mb-2">Paid targeting signals</div>
          <div className="flex flex-wrap gap-1">
            {displayTags.map((tag, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 bg-amber-900/15 text-amber-900 rounded-full"
              >
                {tag}
              </span>
            ))}
            {remainingTags > 0 && (
              <span className="text-[10px] px-2 py-0.5 bg-amber-900/10 text-amber-800 rounded-full">
                +{remainingTags} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Network = () => {
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();
  const [networkNodes, setNetworkNodes] = useState<ScanResultsNetworkNodeNew[]>([]);
  const [networkEdges, setNetworkEdges] = useState<ScanResultsNetworkEdge[]>([]);
  const [topTokens, setTopTokens] = useState<ScanResultsTopToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchData = async () => {
      if (!studyId) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getScanResults(studyId);
        setNetworkNodes(data.network?.nodes || []);
        setNetworkEdges(data.network?.edges || []);
        setTopTokens(data.top_tokens || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studyId]);

  // Update meta tags when nodes load
  useEffect(() => {
    if (networkNodes.length > 0) {
      const primary = [...networkNodes].sort(
        (a, b) => (b.unique_wallets ?? 0) - (a.unique_wallets ?? 0)
      )[0];
      updateMetaTags(primary?.token_symbol || primary?.token_name || "Token", networkNodes.length);
    }
  }, [networkNodes]);

  // Generate network graph with collision avoidance
  const { nodes, edges } = useMemo(() => {
    if (networkNodes.length === 0) return { nodes: [], edges: [] };

    const size = 1000;
    const padding = 100;
    const maxTokens = Math.min(networkNodes.length, 80);

    // Prefer a stable "center" node (highest overlap)
    const selectedNodes = [...networkNodes]
      .sort((a, b) => (b.unique_wallets ?? 0) - (a.unique_wallets ?? 0))
      .slice(0, maxTokens);

    const socialsByAddress = new Map(
      topTokens.map((t) => [t.token_address.toLowerCase(), t])
    );

    const maxUniqueWallets = Math.max(
      ...selectedNodes.map((n) => n.unique_wallets ?? 0),
      1
    );

    const scoreFor = (n: ScanResultsNetworkNodeNew) => {
      const v = (n.unique_wallets ?? 0) + 1;
      const m = maxUniqueWallets + 1;
      return Math.log10(v) / Math.log10(m);
    };

    // Seeded random for consistent layout
    const seed = studyId?.split("").reduce((a, c) => a + c.charCodeAt(0), 0) || 1;
    const seededRandom = (i: number) => {
      const x = Math.sin(seed * i) * 10000;
      return x - Math.floor(x);
    };

    const generatedNodes: Node[] = [];

    // Place nodes with collision avoidance
    selectedNodes.forEach((token, index) => {
      const score = scoreFor(token);
      const nodeSize = 24 + score * 36;

      let x: number, y: number;
      let attempts = 0;
      const maxAttempts = 50;

      do {
        if (index === 0) {
          x = size / 2;
          y = size / 2;
        } else {
          const golden = 0.618033988749895;
          const angle =
            index * golden * Math.PI * 2 + seededRandom(index * 7) * 0.5;
          const baseRadius =
            80 + Math.sqrt(index / maxTokens) * (size / 2 - padding - 80);
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

      const social = socialsByAddress.get(token.token_address.toLowerCase());

      generatedNodes.push({
        id: index,
        x,
        y,
        logo: token.token_logo_url || "/placeholder.svg",
        ticker: token.token_symbol || token.token_name || "Unknown",
        score,
        size: nodeSize,
        socialX: social?.twitter || "",
        telegram: social?.telegram || "",
        reddit: social?.reddit || "",
        youtube: "",
        tags: [],
      });
    });

    const addressToIndex = new Map<string, number>();
    selectedNodes.forEach((n, i) => addressToIndex.set(n.token_address.toLowerCase(), i));

    const normalizedEdges = (networkEdges || [])
      .map((e) => ({
        source: e.source.toLowerCase(),
        target: e.target.toLowerCase(),
        weight: e.weight ?? 0,
      }))
      .filter(
        (e) =>
          e.source !== e.target &&
          addressToIndex.has(e.source) &&
          addressToIndex.has(e.target)
      );

    const maxWeight = Math.max(...normalizedEdges.map((e) => e.weight), 1);

    const generatedEdges: Edge[] = normalizedEdges.map((e) => ({
      from: addressToIndex.get(e.source)!,
      to: addressToIndex.get(e.target)!,
      strength: e.weight / maxWeight,
    }));

    return { nodes: generatedNodes, edges: generatedEdges };
  }, [networkNodes, networkEdges, topTokens, studyId]);

  const handleNodeHover = (node: Node, event: React.MouseEvent) => {
    const svgEl = event.currentTarget.closest('svg');
    const rect = svgEl?.getBoundingClientRect();
    if (rect) {
      const svgSize = 1000;
      // Account for preserveAspectRatio="xMidYMid meet" letterboxing
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading network...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  const size = 1000;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center overflow-hidden">
      {/* Back button — icon-only, bottom-left to avoid overlapping chart content */}
      <button
        onClick={() => navigate(-1)}
        className="fixed bottom-6 left-6 z-50 w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground bg-white/90 backdrop-blur border border-border rounded-full shadow-sm transition-colors"
        title="Go back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      {/* Static ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-orange-400/10 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-orange-300/10 rounded-full blur-[180px]" />
      </div>

      {/* Hover Panel */}
      {hoveredNode && (
        <HoverPanel node={hoveredNode} position={hoverPosition} />
      )}

      <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-auto h-[95vh] max-w-full"
          style={{ aspectRatio: '1 / 1' }}
        >
          <defs>
            {/* Clip paths */}
            {nodes.map((node) => (
              <clipPath key={`clip-${node.id}`} id={`clip-${node.id}`}>
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
                  stroke="#f97316"
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
                  {/* Ring */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size / 2 + 2}
                    fill="none"
                    stroke={node.score > 0.5 ? "#f97316" : "#78716c"}
                    strokeWidth={isCenter ? 3 : 2}
                    strokeOpacity={0.4 + node.score * 0.5}
                  />

                  {/* Background */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size / 2}
                    fill="#ffffff"
                  />

                  {/* Logo */}
                  <image
                    href={node.logo}
                    x={node.x - node.size / 2 + 2}
                    y={node.y - node.size / 2 + 2}
                    width={node.size - 4}
                    height={node.size - 4}
                    clipPath={`url(#clip-${node.id})`}
                    preserveAspectRatio="xMidYMid slice"
                  />
                </g>
              );
            })}
          </g>
        </svg>

        {/* Stats */}
        <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-md border border-orange-500/30 rounded-lg px-5 py-3 shadow-lg">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-muted-foreground">
                <span className="text-orange-600 font-semibold">{nodes.length}</span> tokens
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-orange-500/60 rounded" />
              <span className="text-muted-foreground">
                <span className="text-orange-600 font-semibold">{edges.length}</span> connections
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="absolute top-6 left-6">
          <h1 className="text-foreground text-xl font-light tracking-wide">Token Network</h1>
          <p className="text-muted-foreground text-sm mt-1">Community overlap analysis</p>
        </div>
      </div>
    </div>
  );
};

export default Network;
