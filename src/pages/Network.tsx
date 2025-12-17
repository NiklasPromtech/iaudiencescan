import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
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
      className="absolute z-50 bg-black/95 backdrop-blur-md border border-purple-500/40 rounded-xl p-4 shadow-2xl shadow-purple-900/30 pointer-events-none"
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
          className="w-10 h-10 rounded-full border border-purple-500/30"
        />
        <div>
          <div className="text-white font-bold text-base">{node.ticker || 'Unknown'}</div>
          <div className="text-white/40 text-[10px]">Derived from on-chain wallet overlap</div>
        </div>
      </div>

      {/* Score row */}
      <div className="flex items-center justify-between mb-3 py-2 border-t border-b border-purple-500/20">
        <span className="text-white/60 text-xs">Overlap strength</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i <= scoreDots ? 'bg-purple-500' : 'bg-purple-500/20'
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
          <div className="text-white/40 text-[10px] mb-2">Paid targeting signals</div>
          <div className="flex flex-wrap gap-1">
            {displayTags.map((tag, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full"
              >
                {tag}
              </span>
            ))}
            {remainingTags > 0 && (
              <span className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full">
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
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://token-analysis-final.nw.r.appspot.com/chart/${studyId}`
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setTokens(data.data?.token || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (studyId) fetchData();
  }, [studyId]);

  // Update meta tags when tokens load
  useEffect(() => {
    if (tokens.length > 0) {
      const primaryToken = tokens[0];
      updateMetaTags(primaryToken.ticker, tokens.length);
    }
  }, [tokens]);

  // Generate network graph with collision avoidance
  const { nodes, edges } = useMemo(() => {
    if (tokens.length === 0) return { nodes: [], edges: [] };

    const size = 1000;
    const padding = 100;
    const maxTokens = Math.min(tokens.length, 80);

    // Seeded random for consistent layout
    const seed = studyId?.split('').reduce((a, c) => a + c.charCodeAt(0), 0) || 1;
    const seededRandom = (i: number) => {
      const x = Math.sin(seed * i) * 10000;
      return x - Math.floor(x);
    };

    const generatedNodes: Node[] = [];

    // Place nodes with collision avoidance
    tokens.slice(0, maxTokens).forEach((token, index) => {
      const nodeSize = 24 + token.score * 36;
      let x: number, y: number;
      let attempts = 0;
      const maxAttempts = 50;

      // Try to find a non-overlapping position
      do {
        if (index === 0) {
          // Center token in middle
          x = size / 2;
          y = size / 2;
        } else {
          // Distribute using golden angle with jitter
          const golden = 0.618033988749895;
          const angle = index * golden * Math.PI * 2 + seededRandom(index * 7) * 0.5;
          const baseRadius = 80 + Math.sqrt(index / maxTokens) * (size / 2 - padding - 80);
          const jitter = (seededRandom(index * 13 + attempts) - 0.5) * 100;
          
          x = size / 2 + Math.cos(angle) * (baseRadius + jitter);
          y = size / 2 + Math.sin(angle) * (baseRadius + jitter);
        }

        // Clamp to bounds
        x = Math.max(padding, Math.min(size - padding, x));
        y = Math.max(padding, Math.min(size - padding, y));

        // Check for overlap with existing nodes
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

    // Generate random edges
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

    // Ensure center token has connections
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
    const rect = event.currentTarget.closest('svg')?.getBoundingClientRect();
    if (rect) {
      const svgSize = 1000;
      const scaleX = rect.width / svgSize;
      const scaleY = rect.height / svgSize;
      setHoverPosition({
        x: rect.left + node.x * scaleX,
        y: rect.top + node.y * scaleY,
      });
    }
    setHoveredNode(node);
  };

  const handleNodeLeave = () => {
    setHoveredNode(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/60 animate-pulse">Loading network...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  const size = 1000;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Static ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[180px]" />
      </div>

      {/* Hover Panel */}
      {hoveredNode && (
        <HoverPanel node={hoveredNode} position={hoverPosition} />
      )}

      <div className="relative w-full h-screen flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="max-w-full max-h-[95vh]"
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
                  stroke="#a855f7"
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
                    stroke="#a855f7"
                    strokeWidth={isCenter ? 3 : 2}
                    strokeOpacity={0.4 + node.score * 0.5}
                  />

                  {/* Background */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.size / 2}
                    fill="#0a0a0a"
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
        <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-xl px-5 py-3">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-white/70">
                <span className="text-purple-400 font-semibold">{nodes.length}</span> tokens
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-purple-500/60 rounded" />
              <span className="text-white/70">
                <span className="text-purple-400 font-semibold">{edges.length}</span> connections
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="absolute top-6 left-6">
          <h1 className="text-white/90 text-xl font-light tracking-wide">Token Network</h1>
          <p className="text-white/40 text-sm mt-1">Community overlap analysis</p>
        </div>
      </div>
    </div>
  );
};

export default Network;
