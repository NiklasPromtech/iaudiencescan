import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { ChevronRight, Palette, Copy, Check } from "lucide-react";
import iconX from "@/assets/icon-x.jpg";
import iconTelegram from "@/assets/icon-telegram.jpg";
import iconReddit from "@/assets/icon-reddit.jpg";
import iconYoutube from "@/assets/icon-youtube.jpg";
import iconGoogleAds from "@/assets/icon-googleads.jpg";

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

interface HoverPanelProps {
  node: Node;
  position: { x: number; y: number };
  colors: ColorConfig;
}

const defaultColors: ColorConfig = {
  background: "#ffffff",
  accentPrimary: "#a855f7",
  accentGlow: "#9333ea",
  textPrimary: "#000000",
  textSecondary: "#a1a1aa",
  nodeBg: "#0a0a0a",
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

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorPicker = ({ label, value, onChange }: ColorPickerProps) => (
  <div className="flex items-center justify-between gap-3">
    <label className="text-black/70 text-sm whitespace-nowrap">{label}</label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded cursor-pointer border-0"
        style={{ backgroundColor: '#f5f5f5' }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-20 px-2 py-1 rounded text-xs font-mono"
        style={{ backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0', color: '#000' }}
      />
    </div>
  </div>
);

const NetworkAgency = () => {
  const { studyId } = useParams<{ studyId: string }>();
  const [searchParams] = useSearchParams();
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [panelOpen, setPanelOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Check if URL has color params (hide editor if so)
  const hasColorParams = searchParams.has('bg') || searchParams.has('accent') || searchParams.has('text');
  
  // Dynamic title and subtitle from URL params with state
  const [title, setTitle] = useState(searchParams.get('title') || 'Token Network');
  const [subtitle, setSubtitle] = useState(searchParams.get('subtitle') || 'Token overlap analysis');
  
  // Initialize colors from URL params or defaults
  const getInitialColors = (): ColorConfig => {
    const bg = searchParams.get('bg');
    const accent = searchParams.get('accent');
    const glow = searchParams.get('glow');
    const text = searchParams.get('text');
    const textSec = searchParams.get('textSec');
    const nodeBg = searchParams.get('nodeBg');
    
    return {
      background: bg ? `#${bg}` : defaultColors.background,
      accentPrimary: accent ? `#${accent}` : defaultColors.accentPrimary,
      accentGlow: glow ? `#${glow}` : defaultColors.accentGlow,
      textPrimary: text ? `#${text}` : defaultColors.textPrimary,
      textSecondary: textSec ? `#${textSec}` : defaultColors.textSecondary,
      nodeBg: nodeBg ? `#${nodeBg}` : defaultColors.nodeBg,
    };
  };
  
  const [colors, setColors] = useState<ColorConfig>(getInitialColors);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const uid = searchParams.get('uid');
        const apiUrl = uid 
          ? `https://token-analysis-final.nw.r.appspot.com/chart/${studyId}?uid=${uid}`
          : `https://token-analysis-final.nw.r.appspot.com/chart/${studyId}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setTokens(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (studyId) fetchData();
  }, [studyId, searchParams]);

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

  const updateColor = (key: keyof ColorConfig, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  const resetColors = () => {
    setColors(defaultColors);
    setTitle('Token Network');
    setSubtitle('Token overlap analysis');
  };
  
  const generateShareUrl = () => {
    const baseUrl = `${window.location.origin}/network/agency/${studyId}`;
    const params = new URLSearchParams();
    const uid = searchParams.get('uid');
    if (uid) params.set('uid', uid);
    params.set('bg', colors.background.replace('#', ''));
    params.set('accent', colors.accentPrimary.replace('#', ''));
    params.set('glow', colors.accentGlow.replace('#', ''));
    params.set('text', colors.textPrimary.replace('#', ''));
    params.set('textSec', colors.textSecondary.replace('#', ''));
    params.set('nodeBg', colors.nodeBg.replace('#', ''));
    // Always include title and subtitle in share URL
    params.set('title', title);
    params.set('subtitle', subtitle);
    return `${baseUrl}?${params.toString()}`;
  };
  
  const copyShareUrl = async () => {
    const url = generateShareUrl();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="animate-pulse" style={{ color: `${colors.textSecondary}99` }}>Loading network...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  const size = 1000;

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: colors.background }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
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

      {/* Color Panel Toggle Button - Invisible (but clickable) when URL has color params */}
      <button
        onClick={() => setPanelOpen(!panelOpen)}
        className="fixed top-1/2 -translate-y-1/2 z-50 p-3 rounded-l-xl transition-all duration-300"
        style={{
          right: panelOpen ? 320 : 0,
          backgroundColor: 'rgba(168, 85, 247, 0.2)',
          border: '1px solid rgba(168, 85, 247, 0.4)',
          borderRight: 'none',
          opacity: hasColorParams && !panelOpen ? 0 : 1,
        }}
      >
        {panelOpen ? (
          <ChevronRight className="w-5 h-5 text-purple-400" />
        ) : (
          <Palette className="w-5 h-5 text-purple-400" />
        )}
      </button>

      {/* Color Panel */}
      <div
        className="fixed top-0 right-0 h-full w-80 z-40 transition-transform duration-300 backdrop-blur-xl overflow-y-auto"
        style={{
          transform: panelOpen ? 'translateX(0)' : 'translateX(100%)',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderLeft: '1px solid rgba(168, 85, 247, 0.2)',
        }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-black">Customize Colors</h2>
            <button
              onClick={resetColors}
              className="text-xs px-3 py-1 rounded-full transition-colors bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20"
            >
              Reset
            </button>
          </div>

          <div className="space-y-5">
            <ColorPicker label="Background" value={colors.background} onChange={(v) => updateColor('background', v)} />
            <ColorPicker label="Accent Primary" value={colors.accentPrimary} onChange={(v) => updateColor('accentPrimary', v)} />
            <ColorPicker label="Accent Glow" value={colors.accentGlow} onChange={(v) => updateColor('accentGlow', v)} />
            <ColorPicker label="Text Primary" value={colors.textPrimary} onChange={(v) => updateColor('textPrimary', v)} />
            <ColorPicker label="Text Secondary" value={colors.textSecondary} onChange={(v) => updateColor('textSecondary', v)} />
            <ColorPicker label="Node Background" value={colors.nodeBg} onChange={(v) => updateColor('nodeBg', v)} />
          </div>

          <div className="mt-6 pt-6 border-t border-purple-500/20">
            <p className="text-xs mb-3 text-black/40">Customize Text</p>
            <div className="space-y-3">
              <div>
                <label className="text-black/70 text-sm block mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0', color: '#000' }}
                  placeholder="Token Network"
                />
              </div>
              <div>
                <label className="text-black/70 text-sm block mb-1">Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm"
                  style={{ backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0', color: '#000' }}
                  placeholder="Token overlap analysis"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-purple-500/20">
            <p className="text-xs mb-2 text-black/40">Preview your brand colors</p>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(colors).map(([key, value]) => (
                <div
                  key={key}
                  className="w-8 h-8 rounded-lg border border-white/10"
                  style={{ backgroundColor: value }}
                  title={key}
                />
              ))}
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-purple-500/20">
            <p className="text-xs mb-3 text-black/40">Export shareable link</p>
            <button
              onClick={copyShareUrl}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200"
              style={{ 
                backgroundColor: copied ? '#22c55e' : '#a855f7', 
                color: '#fff',
              }}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Share URL
                </>
              )}
            </button>
            <p className="text-[10px] mt-2 text-black/30">
              Agencies can embed this URL with your brand colors
            </p>
          </div>
        </div>
      </div>

      <div className="relative w-full h-screen flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="max-w-full max-h-[95vh]"
        >
          <defs>
            {nodes.map((node) => (
              <clipPath key={`clip-${node.id}`} id={`clip-agency-${node.id}`}>
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
                    clipPath={`url(#clip-agency-${node.id})`}
                    preserveAspectRatio="xMidYMid slice"
                  />
                </g>
              );
            })}
          </g>
        </svg>

        {/* Stats */}
        <div 
          className="absolute bottom-6 left-6 backdrop-blur-md rounded-xl px-5 py-3"
          style={{ 
            backgroundColor: `${colors.background}99`,
            border: `1px solid ${colors.accentPrimary}4d`
          }}
        >
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.accentPrimary }} />
              <span style={{ color: `${colors.textPrimary}b3` }}>
                <span className="font-semibold" style={{ color: colors.accentPrimary }}>{nodes.length}</span> tokens
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 rounded" style={{ backgroundColor: `${colors.accentPrimary}99` }} />
              <span style={{ color: `${colors.textPrimary}b3` }}>
                <span className="font-semibold" style={{ color: colors.accentPrimary }}>{edges.length}</span> connections
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="absolute top-6 left-6">
          <h1 className="text-xl font-light tracking-wide" style={{ color: `${colors.textPrimary}e6` }}>{title}</h1>
          <p className="text-sm mt-1" style={{ color: `${colors.textPrimary}66` }}>{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default NetworkAgency;
