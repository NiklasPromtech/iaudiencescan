import { useState, useEffect, useMemo } from "react";
import { Building2, Rocket, Coins, Wallet, Building, ArrowRight, Search, Target, X } from "lucide-react";
import AgencyHowPanel from "@/components/AgencyHowPanel";
import logoWhite from "@/assets/audiencescan-logo-white.png";
import logoSquareWhite from "@/assets/logo-square-white.png";
import iconX from "@/assets/icon-x.jpg";
import iconTelegram from "@/assets/icon-telegram.jpg";
import iconReddit from "@/assets/icon-reddit.jpg";
import iconYoutube from "@/assets/icon-youtube.jpg";
import iconGoogleAds from "@/assets/icon-googleads.jpg";
import xLogo from "@/assets/x-logo.png";
import telegramLogo from "@/assets/telegram-logo.png";

interface ScanOption {
  id: string;
  title: string;
  description: string;
  cta: string;
  icon: React.ReactNode;
  studyId: string;
}

interface WizardOption {
  id: string;
  icon: React.ReactNode;
  label: string;
  smallText: string;
  title: string;
  subline: string;
  cta: string;
  gradient: string;
  scanOptions: ScanOption[];
  explanationA: string;
  explanationB: string;
}

// Agency-specific options
interface AgencyTokenOption {
  id: string;
  title: string;
  studyId: string;
}

interface AgencyCategoryOption {
  id: string;
  title: string;
  studyId: string;
}

const agencyTokenOptions: AgencyTokenOption[] = [
  { id: "holders", title: "Wallets holding $100–$200 worth of the token", studyId: "K2rI6eC3DOjBwEUZbHnL" },
  { id: "transactors", title: "Wallets that recently transacted the token", studyId: "LLMHf63Un8Ei0lzOOFFz" },
];

const agencyCategoryOptions: AgencyCategoryOption[] = [
  { id: "meme", title: "Meme", studyId: "FnBmNZv2Ik2x8xJwHjRf" },
  { id: "ai-agents", title: "AI Agents", studyId: "K2rI6eC3DOjBwEUZbHnL" },
  { id: "real-estate", title: "Real Estate", studyId: "LLMHf63Un8Ei0lzOOFFz" },
  { id: "defi", title: "DeFi", studyId: "FnBmNZv2Ik2x8xJwHjRf" },
  { id: "gaming", title: "Gaming", studyId: "K2rI6eC3DOjBwEUZbHnL" },
];

const wizardOptions: WizardOption[] = [
  {
    id: "agency",
    icon: <Building2 className="w-8 h-8" />,
    label: "Agency",
    smallText: "Win more Web3 pitches",
    title: "Validate your client's market",
    subline: "Use on-chain behavior to build pitches backed by real data.",
    cta: "Validate your client's market",
    gradient: "from-violet-600 to-purple-600",
    scanOptions: [], // Agency uses custom flow
    explanationA: "On-chain audience overlap for [Token Name]",
    explanationB: "On-chain audience overlap for competing tokens in [Category]",
  },
  {
    id: "launchpad",
    icon: <Rocket className="w-8 h-8" />,
    label: "Launchpads",
    smallText: "Attract the right token teams",
    title: "Show token teams you already understand their audience",
    subline: "Prove demand with real on-chain data.",
    cta: "Show audience demand to token teams",
    gradient: "from-violet-600 to-purple-600",
    scanOptions: [
      {
        id: "category-scan",
        title: "Scan tokens in your target category",
        description: "See which communities align with your launchpad's focus.",
        cta: "Scan by category",
        icon: <Search className="w-6 h-6" />,
        studyId: "LLMHf63Un8Ei0lzOOFFz",
      },
      {
        id: "competitor-launchpad",
        title: "Analyze a competing launchpad's tokens",
        description: "Understand the audience your competitors are attracting.",
        cta: "Scan competitor tokens",
        icon: <Target className="w-6 h-6" />,
        studyId: "K2rI6eC3DOjBwEUZbHnL",
      },
    ],
    explanationA: "On-chain audience overlap for [Category] tokens",
    explanationB: "On-chain audience overlap for competing launchpad tokens",
  },
  {
    id: "token",
    icon: <Coins className="w-8 h-8" />,
    label: "Token owners",
    smallText: "Grow token adoption",
    title: "Find the communities your users are already part of — and reach more like them",
    subline: "Your holders' wallets reveal your next audience.",
    cta: "Find where your next users are",
    gradient: "from-violet-600 to-purple-600",
    scanOptions: [
      {
        id: "own-token",
        title: "Scan your own token holders",
        description: "Discover which communities your existing users belong to.",
        cta: "Scan my token",
        icon: <Search className="w-6 h-6" />,
        studyId: "K2rI6eC3DOjBwEUZbHnL",
      },
      {
        id: "similar-token",
        title: "Scan a similar token's audience",
        description: "Find overlapping communities you haven't targeted yet.",
        cta: "Scan similar token",
        icon: <Target className="w-6 h-6" />,
        studyId: "LLMHf63Un8Ei0lzOOFFz",
      },
    ],
    explanationA: "On-chain audience overlap for your token holders",
    explanationB: "On-chain audience overlap for similar token holders",
  },
  {
    id: "wallet",
    icon: <Wallet className="w-8 h-8" />,
    label: "Web3 wallets",
    smallText: "Acquire more wallet users",
    title: "Use your existing users' wallets to find where similar users already are",
    subline: "Your user base is your targeting blueprint.",
    cta: "Upload wallets to find more users",
    gradient: "from-violet-600 to-purple-600",
    scanOptions: [
      {
        id: "upload-wallets",
        title: "Upload your user wallet list",
        description: "Analyze your existing users to find lookalike communities.",
        cta: "Upload wallet list",
        icon: <Search className="w-6 h-6" />,
        studyId: "LLMHf63Un8Ei0lzOOFFz",
      },
      {
        id: "competitor-wallet",
        title: "Scan a competing wallet's users",
        description: "See which communities your competitors' users belong to.",
        cta: "Scan competitor wallets",
        icon: <Target className="w-6 h-6" />,
        studyId: "K2rI6eC3DOjBwEUZbHnL",
      },
    ],
    explanationA: "On-chain audience overlap for your wallet users",
    explanationB: "On-chain audience overlap for competing wallet users",
  },
  {
    id: "cex",
    icon: <Building className="w-8 h-8" />,
    label: "CEX",
    smallText: "Identify your next token listing",
    title: "Identify high-signal tokens by analyzing where users of other CEXs transact",
    subline: "On-chain behavior reveals listing opportunities.",
    cta: "Discover listing opportunities",
    gradient: "from-violet-600 to-purple-600",
    scanOptions: [
      {
        id: "deposit-analysis",
        title: "Analyze deposit patterns to your exchange",
        description: "See which tokens your users are most actively transacting.",
        cta: "Analyze deposits",
        icon: <Search className="w-6 h-6" />,
        studyId: "K2rI6eC3DOjBwEUZbHnL",
      },
      {
        id: "competitor-cex",
        title: "Scan deposits to a competing exchange",
        description: "Discover tokens gaining traction on other platforms.",
        cta: "Scan competitor exchange",
        icon: <Target className="w-6 h-6" />,
        studyId: "LLMHf63Un8Ei0lzOOFFz",
      },
    ],
    explanationA: "On-chain audience overlap for your exchange deposits",
    explanationB: "On-chain audience overlap for competing exchange deposits",
  },
];

// Network Graph Component (embedded from Network page)
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
  const scoreDots = Math.ceil(node.score * 5);

  // If position is near top of screen, show panel below instead of above
  const showBelow = position.y < 250;

  return (
    <div
      className="fixed z-[100] bg-black/95 backdrop-blur-md border border-purple-500/40 rounded-xl p-4 shadow-2xl shadow-purple-900/30 pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: showBelow ? 'translate(-50%, 20px)' : 'translate(-50%, -100%)',
        marginTop: showBelow ? 0 : -16,
        maxWidth: 280,
        minWidth: 220,
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <img src={node.logo} alt={node.ticker} className="w-10 h-10 rounded-full border border-purple-500/30" />
        <div>
          <div className="text-white font-bold text-base">{node.ticker || 'Unknown'}</div>
          <div className="text-white/40 text-[10px]">Derived from on-chain wallet overlap</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3 py-2 border-t border-b border-purple-500/20">
        <span className="text-white/60 text-xs">Overlap strength</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i <= scoreDots ? 'bg-purple-500' : 'bg-purple-500/20'}`} />
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
          <div className="text-white/40 text-[10px] mb-2">Paid targeting signals</div>
          <div className="flex flex-wrap gap-1">
            {displayTags.map((tag, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full">{tag}</span>
            ))}
            {remainingTags > 0 && (
              <span className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full">+{remainingTags} more</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface NetworkGraphProps {
  studyId: string;
  onNodeHover?: (node: Node, position: { x: number; y: number }) => void;
  onNodeLeave?: () => void;
  onLoadingChange?: (loading: boolean) => void;
  skipMinLoadTime?: boolean;
  enableBreathing?: boolean;
}

const NetworkGraph = ({ studyId, onNodeHover, onNodeLeave, onLoadingChange, skipMinLoadTime = false, enableBreathing = false }: NetworkGraphProps) => {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    setLoading(true);
    setShowChart(false);
    onLoadingChange?.(true);
    
    const startTime = Date.now();
    const minLoadTime = skipMinLoadTime ? 0 : 750; // Skip minimum loading time if specified
    
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://token-analysis-final.nw.r.appspot.com/chart/${studyId}`
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setTokens(data);
      } catch {
        // Silently fail
      } finally {
        // Ensure minimum load time for better UX (unless skipped)
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, minLoadTime - elapsed);
        
        setTimeout(() => {
          setLoading(false);
          onLoadingChange?.(false);
          // Additional delay before showing chart for smooth animation
          setTimeout(() => setShowChart(true), skipMinLoadTime ? 0 : 100);
        }, remainingDelay);
      }
    };
    fetchData();
  }, [studyId, onLoadingChange, skipMinLoadTime]);

  const { nodes, edges } = useMemo(() => {
    if (tokens.length === 0) return { nodes: [], edges: [] };

    const size = 600;
    const padding = 60;
    const maxTokens = Math.min(tokens.length, 50);

    const seed = studyId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const seededRandom = (i: number) => {
      const x = Math.sin(seed * i) * 10000;
      return x - Math.floor(x);
    };

    const generatedNodes: Node[] = [];

    tokens.slice(0, maxTokens).forEach((token, index) => {
      const nodeSize = 16 + token.score * 24;
      let x: number, y: number;
      let attempts = 0;

      do {
        if (index === 0) {
          x = size / 2;
          y = size / 2;
        } else {
          const golden = 0.618033988749895;
          const angle = index * golden * Math.PI * 2 + seededRandom(index * 7) * 0.5;
          const baseRadius = 50 + Math.sqrt(index / maxTokens) * (size / 2 - padding - 50);
          const jitter = (seededRandom(index * 13 + attempts) - 0.5) * 60;
          x = size / 2 + Math.cos(angle) * (baseRadius + jitter);
          y = size / 2 + Math.sin(angle) * (baseRadius + jitter);
        }
        x = Math.max(padding, Math.min(size - padding, x));
        y = Math.max(padding, Math.min(size - padding, y));

        const hasOverlap = generatedNodes.some((other) => {
          const dx = x - other.x;
          const dy = y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          return dist < (nodeSize + other.size) / 2 + 8;
        });

        if (!hasOverlap || attempts >= 30) break;
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
    const edgeCount = Math.floor(maxTokens * 1.5);

    for (let i = 0; i < edgeCount; i++) {
      const from = Math.floor(seededRandom(i * 3) * maxTokens);
      const to = Math.floor(seededRandom(i * 3 + 1) * maxTokens);
      if (from !== to) {
        const exists = generatedEdges.some(
          e => (e.from === from && e.to === to) || (e.from === to && e.to === from)
        );
        if (!exists) {
          generatedEdges.push({ from, to, strength: (generatedNodes[from].score + generatedNodes[to].score) / 2 });
        }
      }
    }

    for (let i = 1; i < Math.min(5, maxTokens); i++) {
      if (!generatedEdges.some(e => (e.from === 0 && e.to === i) || (e.from === i && e.to === 0))) {
        generatedEdges.push({ from: 0, to: i, strength: generatedNodes[i].score });
      }
    }

    return { nodes: generatedNodes, edges: generatedEdges };
  }, [tokens, studyId]);

  const handleNodeHover = (node: Node, event: React.MouseEvent) => {
    if (!onNodeHover) return;
    const rect = event.currentTarget.closest('svg')?.getBoundingClientRect();
    if (rect) {
      const svgSize = 600;
      const scaleX = rect.width / svgSize;
      const scaleY = rect.height / svgSize;
      onNodeHover(node, {
        x: rect.left + node.x * scaleX,
        y: rect.top + node.y * scaleY,
      });
    }
  };

  if (loading || nodes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
          <p className="text-white/40 text-sm animate-pulse">Loading network data...</p>
        </div>
      </div>
    );
  }

  return (
    <svg 
      width="100%" 
      height="100%" 
      viewBox="0 0 600 600" 
      className={`transition-all duration-700 ease-out ${showChart ? 'opacity-90 scale-100' : 'opacity-0 scale-95'}`}
    >
      <defs>
        {nodes.map((node) => (
          <clipPath key={`clip-${node.id}`} id={`wizard-clip-${studyId}-${node.id}`}>
            <circle cx={node.x} cy={node.y} r={node.size / 2 - 1} />
          </clipPath>
        ))}
      </defs>

      {edges.map((edge, index) => {
        const fromNode = nodes[edge.from];
        const toNode = nodes[edge.to];
        if (!fromNode || !toNode) return null;
        return (
          <line
            key={index}
            x1={fromNode.x}
            y1={fromNode.y}
            x2={toNode.x}
            y2={toNode.y}
            stroke="#a855f7"
            strokeWidth={0.5 + edge.strength}
            strokeOpacity={0.15 + edge.strength * 0.3}
          />
        );
      })}

      {nodes.map((node) => {
        // Create staggered animation delay based on node position
        const animationDelay = enableBreathing ? `${(node.id * 0.3) % 4}s` : '0s';
        const animationDuration = enableBreathing ? `${4 + (node.id % 3)}s` : '0s';
        const isCentralNode = node.id === 0;
        
        return (
          <g 
            key={node.id}
            onMouseEnter={(e) => handleNodeHover(node, e)}
            onMouseLeave={onNodeLeave}
            style={{ 
              cursor: 'pointer',
              transformOrigin: `${node.x}px ${node.y}px`,
              animation: enableBreathing 
                ? isCentralNode
                  ? `nodeBreathing ${animationDuration} ease-in-out ${animationDelay} infinite, centralNodeGlow 3s ease-in-out infinite`
                  : `nodeBreathing ${animationDuration} ease-in-out ${animationDelay} infinite`
                : 'none',
            }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size / 2 + 1}
              fill="none"
              stroke="#a855f7"
              strokeWidth={isCentralNode ? 2 : 1.5}
              strokeOpacity={0.4 + node.score * 0.4}
            />
            <circle cx={node.x} cy={node.y} r={node.size / 2} fill="#0a0a0a" />
            <image
              href={node.logo}
              x={node.x - node.size / 2 + 1}
              y={node.y - node.size / 2 + 1}
              width={node.size - 2}
              height={node.size - 2}
              clipPath={`url(#wizard-clip-${studyId}-${node.id})`}
              preserveAspectRatio="xMidYMid slice"
            />
          </g>
        );
      })}
    </svg>
  );
};

const baseWords = ["defensible", "data-backed", "proven", "real"];
const WORD_HEIGHT = 56;

const WizardV2 = () => {
  // Note: V2 doesn't have a mobile version yet - no redirect
  const [selectedOption, setSelectedOption] = useState<WizardOption | null>(null);
  const [selectedScan, setSelectedScan] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [showInfoBox, setShowInfoBox] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [fallingCards, setFallingCards] = useState<number | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [shimmerIndex, setShimmerIndex] = useState<number | null>(null);
  
  // Agency-specific state
  const [agencyHasToken, setAgencyHasToken] = useState<boolean | null>(null);
  const [agencySelectedOption, setAgencySelectedOption] = useState<string | null>(null);
  const [expandedReassurance, setExpandedReassurance] = useState<string | null>(null);
  const [agencyHowPanelOpen, setAgencyHowPanelOpen] = useState(false);

  const handleLaunchApp = () => {
    setIsLaunching(true);
    // Wait for smooth fade to complete, then navigate
    setTimeout(() => {
      window.open("https://app.audiencescan.io", "_blank");
      setTimeout(() => setIsLaunching(false), 300);
    }, 800);
  };

  // Continuous random word cycling every 3 seconds with bigger jumps
  useEffect(() => {
    if (selectedOption) return;

    const interval = setInterval(() => {
      setCurrentWordIndex(prev => {
        // Jump 2-4 positions (wrapping around)
        const jumpAmount = 2 + Math.floor(Math.random() * 3); // 2, 3, or 4
        return (prev + jumpAmount) % baseWords.length;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedOption]);

  // Random shimmer effect on buttons
  useEffect(() => {
    if (selectedOption) return;

    const triggerShimmer = () => {
      const randomIndex = Math.floor(Math.random() * wizardOptions.length);
      setShimmerIndex(randomIndex);
      // Remove shimmer class after animation completes (matches 2.4s animation)
      setTimeout(() => setShimmerIndex(null), 2400);
    };

    // Initial shimmer after a short delay
    const initialTimeout = setTimeout(triggerShimmer, 1500);
    
    // Continue shimmer cycle every 5 seconds
    const interval = setInterval(triggerShimmer, 5000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [selectedOption]);

  const handleSelect = (option: WizardOption, clickedIndex: number) => {
    setFallingCards(clickedIndex);
    // Wait for fall animation to complete before transitioning
    setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setSelectedOption(option);
        setSelectedScan(null);
        setIsTransitioning(false);
        setFallingCards(null);
      }, 300);
    }, 400);
  };

  const handleBack = () => {
    setIsTransitioning(true);
    setChartLoading(false);
    setTimeout(() => {
      // Always go back to main wizard
      setSelectedScan(null);
      setSelectedOption(null);
      setAgencyHasToken(null);
      setAgencySelectedOption(null);
      setExpandedReassurance(null);
      setIsTransitioning(false);
    }, 300);
  };

  const handleScanSelect = (scanId: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedScan(scanId);
      setIsTransitioning(false);
    }, 300);
  };

  // Get current study ID for agency flow
  const getAgencyStudyId = () => {
    if (!agencySelectedOption) return "FnBmNZv2Ik2x8xJwHjRf";
    if (agencyHasToken) {
      return agencyTokenOptions.find(o => o.id === agencySelectedOption)?.studyId || "FnBmNZv2Ik2x8xJwHjRf";
    } else {
      return agencyCategoryOptions.find(o => o.id === agencySelectedOption)?.studyId || "FnBmNZv2Ik2x8xJwHjRf";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between">
        <img src={logoWhite} alt="AudienceScan" className="h-7 opacity-80" />
        <button
          onClick={handleLaunchApp}
          className="px-5 py-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 rounded-full text-sm transition-all hover:scale-105"
        >
          Launch App
        </button>
      </header>

      {/* Smooth white transition overlay */}
      <div 
        className={`fixed inset-0 bg-white z-[100] pointer-events-none transition-opacity ease-in-out ${
          isLaunching ? 'opacity-100 duration-700' : 'opacity-0 duration-300'
        }`}
      />

      <div
        className={`min-h-screen transition-all ease-in-out ${
          isLaunching ? "opacity-0 duration-500" : isTransitioning ? "opacity-0 scale-98 duration-300" : "opacity-100 scale-100 duration-300"
        }`}
      >
        {!selectedOption ? (
          <>
          {/* Agency-Focused Landing Page */}
          <div className="min-h-screen flex flex-col">
            {/* Hero area with network preview */}
            <div className="flex-1 flex items-center justify-center pt-20 pb-8 px-6">
              <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
                {/* Left: Text */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <p className="text-purple-400 text-sm tracking-widest uppercase font-medium">
                      Web3 audience research at your fingertips
                    </p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                      Win Web3 pitches with{" "}
                      <span className="inline-block align-bottom overflow-hidden whitespace-nowrap" style={{ height: WORD_HEIGHT }}>
                        <span
                          className="flex flex-col"
                          style={{
                            transform: `translateY(-${currentWordIndex * WORD_HEIGHT}px)`,
                            transition: "transform 800ms cubic-bezier(0.22, 1, 0.36, 1)",
                          }}
                        >
                          {baseWords.map((word, i) => (
                            <span
                              key={i}
                              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
                              style={{ height: WORD_HEIGHT, lineHeight: `${WORD_HEIGHT}px` }}
                            >
                              {word}
                            </span>
                          ))}
                        </span>
                      </span>{" "}
                      audience proof
                    </h1>
                    <p className="text-white/50 text-lg max-w-md">
                      Built by a Web3 agency that got tired of guessing.
                    </p>
                  </div>
                </div>

                {/* Right: Network preview */}
                <div className="relative aspect-square max-w-[650px] mx-auto w-full lg:scale-110 lg:-mr-12">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-pink-600/10 rounded-full blur-3xl" />
                  <NetworkGraph studyId="FnBmNZv2Ik2x8xJwHjRf" skipMinLoadTime enableBreathing />
                </div>
              </div>
            </div>
          </div>

          {/* Credibility Block */}
          <div className="py-16 px-6 bg-white/[0.02]">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Does this actually work?
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                <span className="text-white font-semibold">$8M+</span> in ad spend deployed using AudienceScan data across{" "}
                <span className="text-white font-semibold">314 campaigns</span>.
              </p>
              <p className="text-white/40 text-sm">
                Used by agencies running campaigns for BitMEX, OKX, PrimeXBT, Flare Network, and more.
              </p>
            </div>
          </div>

          {/* How Agencies Use This */}
          <div className="py-16 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
                How agencies use AudienceScan
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3" style={{ animation: 'fadeInUp 0.5s 0.1s ease-out backwards' }}>
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-400" />
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Prove audience relevance before pitching
                  </p>
                </div>
                <div className="space-y-3" style={{ animation: 'fadeInUp 0.5s 0.2s ease-out backwards' }}>
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Search className="w-5 h-5 text-purple-400" />
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Identify KOLs and paid ad audiences using real wallet behavior
                  </p>
                </div>
                <div className="space-y-3" style={{ animation: 'fadeInUp 0.5s 0.3s ease-out backwards' }}>
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-purple-400" />
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Drop defensible charts directly into pitch decks
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Extends Beyond Agencies - Non-clickable */}
          <div className="py-12 px-6 border-t border-white/[0.06]">
            <div className="max-w-4xl mx-auto">
              <p className="text-white/30 text-xs uppercase tracking-widest mb-4">
                Extends beyond agencies
              </p>
              <p className="text-white/40 text-sm mb-4">
                Also used by Web3 teams including:
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-white/30 text-sm">
                <span>Token owners (adoption analysis)</span>
                <span>•</span>
                <span>Launchpads (ecosystem overlap)</span>
                <span>•</span>
                <span>Web3 wallets (user acquisition insights)</span>
                <span>•</span>
                <span>Centralized exchanges (listing demand signals)</span>
              </div>
            </div>
          </div>

          {/* Minimal Footer */}
          <footer className="py-6 px-6 border-t border-white/[0.06]">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/30">
              <div className="flex items-center gap-2">
                <img src={logoSquareWhite} alt="AudienceScan" className="h-4 w-4 opacity-50" />
                <span>© 2024 AudienceScan</span>
              </div>
              <div className="flex gap-4">
                <span>Privacy</span>
                <span>Terms</span>
              </div>
            </div>
          </footer>
          </>
        ) : selectedOption.id === "agency" ? (
          // Agency-specific flow with question-based navigation
          <div className="min-h-screen flex">
            {/* Left side - Content */}
            <div className="w-full lg:w-[440px] xl:w-[520px] flex-shrink-0 flex flex-col justify-between px-6 lg:px-10 pt-24 pb-12 relative z-10 min-h-screen">
              <button
                onClick={handleBack}
                className="absolute top-24 left-6 lg:left-10 text-white/40 hover:text-white text-sm flex items-center gap-2 transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back
              </button>

              {/* Top content */}
              <div className="space-y-8 mt-12">
                {/* Header - Main CTA */}
                <div className="space-y-2">
                  <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold leading-tight">
                    {selectedOption.title}
                  </h1>
                  <p className="text-white/50 text-base">
                    {selectedOption.subline}
                  </p>
                </div>

                {/* Question: Does your client have a token? */}
                <div className="space-y-4" style={{ animation: 'fadeInUp 0.4s ease-out backwards' }}>
                  <p className="text-white/80 text-base font-medium">
                    Does your client already have a token?
                  </p>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setAgencyHasToken(true);
                        setAgencySelectedOption(null);
                      }}
                      className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-300 ${
                        agencyHasToken === true
                          ? 'bg-purple-500/20 border-purple-500/60 text-white'
                          : 'bg-white/[0.02] border-white/[0.08] text-white/70 hover:border-purple-500/40 hover:bg-white/[0.04]'
                      }`}
                    >
                      Yes, they have a token
                    </button>
                    <button
                      onClick={() => {
                        setAgencyHasToken(false);
                        setAgencySelectedOption(null);
                      }}
                      className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-300 ${
                        agencyHasToken === false
                          ? 'bg-purple-500/20 border-purple-500/60 text-white'
                          : 'bg-white/[0.02] border-white/[0.08] text-white/70 hover:border-purple-500/40 hover:bg-white/[0.04]'
                      }`}
                    >
                      No, they don't
                    </button>
                  </div>
                </div>

                {/* Conditional content based on answer */}
                {agencyHasToken === true && (
                  <div className="space-y-3" style={{ animation: 'fadeInUp 0.4s ease-out backwards' }}>
                    <div>
                      <p className="text-white/80 text-sm font-medium">
                        Analyze on-chain behavior of their token
                      </p>
                      <p className="text-white/40 text-xs mt-1">
                        Wallets that hold or transact
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {agencyTokenOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setAgencySelectedOption(option.id)}
                          className={`py-2.5 px-4 rounded-lg border text-sm transition-all duration-300 ${
                            agencySelectedOption === option.id
                              ? 'bg-purple-500/20 border-purple-500/60 text-white'
                              : 'bg-white/[0.02] border-white/[0.08] text-white/70 hover:border-purple-500/40 hover:bg-white/[0.04]'
                          }`}
                        >
                          {option.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {agencyHasToken === false && (
                  <div className="space-y-3" style={{ animation: 'fadeInUp 0.4s ease-out backwards' }}>
                    <div>
                      <p className="text-white/80 text-sm font-medium">
                        Find competitors by category
                      </p>
                      <p className="text-white/40 text-xs mt-1">
                        Identify relevant tokens in their vertical
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {agencyCategoryOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setAgencySelectedOption(option.id)}
                          className={`py-2.5 px-4 rounded-lg border text-sm transition-all duration-300 ${
                            agencySelectedOption === option.id
                              ? 'bg-purple-500/20 border-purple-500/60 text-white'
                              : 'bg-white/[0.02] border-white/[0.08] text-white/70 hover:border-purple-500/40 hover:bg-white/[0.04]'
                          }`}
                        >
                          {option.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reassurance sections - Secondary, muted */}
                {agencyHasToken !== null && (
                  <div className="space-y-2 pt-4 border-t border-white/[0.06]" style={{ animation: 'fadeInUp 0.5s 0.2s ease-out backwards' }}>
                    <p className="text-white/30 text-[10px] uppercase tracking-wider mb-3">
                      If you're hesitant
                    </p>
                    
                    {/* How agencies use this data */}
                    <button
                      onClick={() => setAgencyHowPanelOpen(true)}
                      className="w-full text-left group"
                    >
                      <div className="flex items-center justify-between py-2">
                        <span className="text-white/50 text-sm group-hover:text-white/70 transition-colors">
                          How agencies use this data
                        </span>
                        <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white/50 transition-all" />
                      </div>
                    </button>
                    
                    {/* Does this actually work? */}
                    <button
                      onClick={() => setExpandedReassurance(expandedReassurance === 'proof' ? null : 'proof')}
                      className="w-full text-left group"
                    >
                      <div className="flex items-center justify-between py-2">
                        <span className="text-white/50 text-sm group-hover:text-white/70 transition-colors">
                          Does this actually work?
                        </span>
                        <ArrowRight className={`w-4 h-4 text-white/30 transition-transform duration-300 ${expandedReassurance === 'proof' ? 'rotate-90' : ''}`} />
                      </div>
                      {expandedReassurance === 'proof' && (
                        <div className="pb-3 text-white/40 text-xs leading-relaxed space-y-2" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                          <p><span className="text-white/60">$8M+</span> in ad budget deployed using AudienceScan data across <span className="text-white/60">314 campaigns</span>.</p>
                          <p>Agencies we've worked with include teams managing campaigns for BitMEX, OKX, PrimeXBT, Flare Network, and more.</p>
                        </div>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom CTA */}
              <div className="mt-8">
                <button
                  onClick={handleLaunchApp}
                  disabled={!agencySelectedOption}
                  className={`inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r ${selectedOption.gradient} rounded-xl text-white font-semibold transition-all duration-300 ${
                    agencySelectedOption 
                      ? 'hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 opacity-100' 
                      : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  <span>✓</span>
                  {selectedOption.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-white/30 text-xs mt-3">
                  No guesses. Based on real on-chain transactions.
                </p>
              </div>
            </div>

            {/* Right side - Chart (dominant) */}
            <div className="hidden lg:flex flex-1 items-center justify-center relative min-h-screen">
              {/* Background glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${selectedOption.gradient} opacity-10`} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-purple-600/20 via-transparent to-transparent rounded-full blur-3xl" />
              
              {/* Chart - oversized */}
              <div className={`relative w-[110%] h-[110%] max-w-[900px] max-h-[900px] transition-opacity duration-500 ${!agencySelectedOption ? 'opacity-50' : 'opacity-100'}`}>
                <NetworkGraph 
                  studyId={getAgencyStudyId()}
                  onNodeHover={(node, position) => {
                    setHoveredNode(node);
                    setHoverPosition(position);
                  }}
                  onNodeLeave={() => setHoveredNode(null)}
                  onLoadingChange={setChartLoading}
                />
                
                {/* Loading overlay */}
                {chartLoading && agencySelectedOption && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-full">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
                      <p className="text-white/60 text-sm">Loading scan data...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Overlay prompt when no option selected */}
              {!agencySelectedOption && !chartLoading && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/60 backdrop-blur-sm px-6 py-4 rounded-xl border border-white/10">
                    <p className="text-white/70 text-sm">
                      Answer the question to see real data
                    </p>
                  </div>
                </div>
              )}

              {/* Info box when option selected - dismissable */}
              {agencySelectedOption && showInfoBox && (
                <div className="absolute bottom-24 right-8 max-w-[280px] animate-fade-in">
                  <div className="bg-black/70 backdrop-blur-md px-5 py-4 rounded-xl border border-purple-500/20 relative">
                    <button
                      onClick={() => setShowInfoBox(false)}
                      className="absolute top-2 right-2 text-white/40 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="text-purple-400 text-xs font-medium uppercase tracking-wider mb-2 pr-4">
                      How this data is used
                    </p>
                    <p className="text-white/70 text-sm leading-relaxed">
                      Each node represents a token community with wallet overlap. Use these insights to target ads, find KOLs, or craft outreach to communities already engaged with similar projects.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Label */}
              <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 text-xs">
                Derived from real on-chain wallet activity
              </p>
            </div>

            {/* Mobile chart (below content) */}
            <div className="lg:hidden fixed inset-0 pointer-events-none opacity-20">
              <div className={`absolute inset-0 bg-gradient-to-br ${selectedOption.gradient} opacity-20`} />
              <NetworkGraph studyId={getAgencyStudyId()} />
            </div>

            {/* Hover Panel */}
            {hoveredNode && <HoverPanel node={hoveredNode} position={hoverPosition} />}
            
            {/* Agency How Panel */}
            <AgencyHowPanel 
              open={agencyHowPanelOpen} 
              onClose={() => setAgencyHowPanelOpen(false)} 
            />
          </div>
        ) : (
          // Other roles - Original detail screen
          <div className="min-h-screen flex">
            {/* Left side - Content */}
            <div className="w-full lg:w-[400px] xl:w-[480px] flex-shrink-0 flex flex-col justify-between px-6 lg:px-10 pt-24 pb-12 relative z-10 min-h-screen">
              <button
                onClick={handleBack}
                className="absolute top-24 left-6 lg:left-10 text-white/40 hover:text-white text-sm flex items-center gap-2 transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back
              </button>

              {/* Top content */}
              <div className="space-y-8 mt-12">
                {/* Header */}
                <div className="space-y-3">
                  <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold leading-tight">
                    {selectedOption.title}
                  </h1>
                  <p className="text-white/50 text-base">
                    {selectedOption.subline}
                  </p>
                </div>

                {/* Scan Selection */}
                <div className="space-y-3">
                  <p className="text-white/40 text-xs uppercase tracking-wider">
                    Choose what you want to validate
                  </p>
                  
                  <div className="space-y-3">
                    {selectedOption.scanOptions.map((scan, index) => (
                      <button
                        key={scan.id}
                        onClick={() => setSelectedScan(scan.id)}
                        className={`group relative w-full bg-white/[0.02] hover:bg-white/[0.06] border rounded-xl p-5 text-left transition-all duration-300 ${
                          selectedScan === scan.id 
                            ? 'border-purple-500/60 bg-purple-500/10' 
                            : 'border-white/[0.06] hover:border-purple-500/40'
                        }`}
                        style={{
                          animation: `fadeInUp 0.4s ${index * 0.1}s ease-out backwards`,
                        }}
                      >
                        <div className="relative flex items-start gap-4">
                          <div className={`text-purple-400 mt-0.5 transition-transform duration-300 ${selectedScan === scan.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                            {scan.icon}
                          </div>
                          <div className="flex-1 space-y-1">
                            <h3 className="text-white font-semibold text-sm">
                              {scan.title}
                            </h3>
                            <p className="text-white/40 text-xs leading-relaxed">
                              {scan.description}
                            </p>
                          </div>
                          <ArrowRight className={`w-4 h-4 mt-1 transition-all duration-300 ${
                            selectedScan === scan.id 
                              ? 'text-purple-400 translate-x-0.5' 
                              : 'text-white/0 group-hover:text-purple-400 group-hover:translate-x-0.5'
                          }`} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div>
                <button
                  onClick={handleLaunchApp}
                  className={`inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r ${selectedOption.gradient} rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20`}
                >
                  <span>✓</span>
                  {selectedOption.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-white/30 text-xs mt-3">
                  No guesses. Based on real on-chain transactions.
                </p>
              </div>
            </div>

            {/* Right side - Chart (dominant) */}
            <div className="hidden lg:flex flex-1 items-center justify-center relative min-h-screen">
              {/* Background glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${selectedOption.gradient} opacity-10`} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-purple-600/20 via-transparent to-transparent rounded-full blur-3xl" />
              
              {/* Chart - oversized */}
              <div className={`relative w-[110%] h-[110%] max-w-[900px] max-h-[900px] transition-opacity duration-500 ${!selectedScan ? 'opacity-50' : 'opacity-100'}`}>
                <NetworkGraph 
                  studyId={
                    selectedScan 
                      ? selectedOption.scanOptions.find(s => s.id === selectedScan)?.studyId || "FnBmNZv2Ik2x8xJwHjRf"
                      : "FnBmNZv2Ik2x8xJwHjRf"
                  }
                  onNodeHover={(node, position) => {
                    setHoveredNode(node);
                    setHoverPosition(position);
                  }}
                  onNodeLeave={() => setHoveredNode(null)}
                  onLoadingChange={setChartLoading}
                />
                
                {/* Loading overlay */}
                {chartLoading && selectedScan && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-full">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
                      <p className="text-white/60 text-sm">Loading scan data...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Overlay prompt when no scan selected */}
              {!selectedScan && !chartLoading && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/60 backdrop-blur-sm px-6 py-4 rounded-xl border border-white/10">
                    <p className="text-white/70 text-sm">
                      Select an option to see real data
                    </p>
                  </div>
                </div>
              )}

              {/* Info box when scan selected - dismissable */}
              {selectedScan && showInfoBox && (
                <div className="absolute bottom-24 right-8 max-w-[280px] animate-fade-in">
                  <div className="bg-black/70 backdrop-blur-md px-5 py-4 rounded-xl border border-purple-500/20 relative">
                    <button
                      onClick={() => setShowInfoBox(false)}
                      className="absolute top-2 right-2 text-white/40 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="text-purple-400 text-xs font-medium uppercase tracking-wider mb-2 pr-4">
                      How this data is used
                    </p>
                    <p className="text-white/70 text-sm leading-relaxed">
                      Each node represents a token community with wallet overlap. Use these insights to target ads, find KOLs, or craft outreach to communities already engaged with similar projects.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Label */}
              <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 text-xs">
                Derived from real on-chain wallet activity
              </p>
            </div>

            {/* Mobile chart (below content) */}
            <div className="lg:hidden fixed inset-0 pointer-events-none opacity-20">
              <div className={`absolute inset-0 bg-gradient-to-br ${selectedOption.gradient} opacity-20`} />
              <NetworkGraph 
                studyId={
                  selectedScan 
                    ? selectedOption.scanOptions.find(s => s.id === selectedScan)?.studyId || "FnBmNZv2Ik2x8xJwHjRf"
                    : "FnBmNZv2Ik2x8xJwHjRf"
                } 
              />
            </div>

            {/* Hover Panel */}
            {hoveredNode && <HoverPanel node={hoveredNode} position={hoverPosition} />}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .scale-98 { transform: scale(0.98); }
      `}</style>
    </div>
  );
};

export default WizardV2;
