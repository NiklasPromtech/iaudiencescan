import { useState, useEffect, useMemo, useRef } from "react";
import { Building2, Rocket, Coins, Wallet, Building, ArrowRight } from "lucide-react";
import logoWhite from "@/assets/audiencescan-logo-white.png";

interface WizardOption {
  id: string;
  icon: React.ReactNode;
  label: string;
  smallText: string;
  title: string;
  cta: string;
  gradient: string;
}

const wizardOptions: WizardOption[] = [
  {
    id: "agency",
    icon: <Building2 className="w-8 h-8" />,
    label: "Agency",
    smallText: "Win more Web3 pitches",
    title: "Build Web3 pitches and GTMs backed by real on-chain behavior",
    cta: "Validate your next Web3 pitch",
    gradient: "from-violet-600 to-purple-600",
  },
  {
    id: "launchpad",
    icon: <Rocket className="w-8 h-8" />,
    label: "Launchpads",
    smallText: "Attract the right token teams",
    title: "Show token teams you already understand their audience",
    cta: "Show audience demand to token teams",
    gradient: "from-purple-600 to-fuchsia-600",
  },
  {
    id: "token",
    icon: <Coins className="w-8 h-8" />,
    label: "Token owners",
    smallText: "Grow token adoption",
    title: "Find the communities your users are already part of — and reach more like them",
    cta: "Find where your next users are",
    gradient: "from-fuchsia-600 to-pink-600",
  },
  {
    id: "wallet",
    icon: <Wallet className="w-8 h-8" />,
    label: "Web3 wallets",
    smallText: "Acquire more wallet users",
    title: "Use your existing users' wallets to find where similar users already are",
    cta: "Upload wallets to find more users",
    gradient: "from-pink-600 to-rose-600",
  },
  {
    id: "cex",
    icon: <Building className="w-8 h-8" />,
    label: "CEX",
    smallText: "Identify your next token listing",
    title: "Identify high-signal tokens by analyzing where users of other CEXs transact",
    cta: "Discover listing opportunities",
    gradient: "from-rose-600 to-orange-600",
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
}

interface Edge {
  from: number;
  to: number;
  strength: number;
}

const NetworkGraph = ({ studyId }: { studyId: string }) => {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        setLoading(false);
      }
    };
    fetchData();
  }, [studyId]);

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

  if (loading || nodes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-32 h-32 rounded-full border border-purple-500/30 animate-pulse" />
      </div>
    );
  }

  return (
    <svg width="100%" height="100%" viewBox="0 0 600 600" className="opacity-80">
      <defs>
        {nodes.map((node) => (
          <clipPath key={`clip-${node.id}`} id={`wizard-clip-${node.id}`}>
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

      {nodes.map((node) => (
        <g key={node.id}>
          <circle
            cx={node.x}
            cy={node.y}
            r={node.size / 2 + 1}
            fill="none"
            stroke="#a855f7"
            strokeWidth={node.id === 0 ? 2 : 1.5}
            strokeOpacity={0.4 + node.score * 0.4}
          />
          <circle cx={node.x} cy={node.y} r={node.size / 2} fill="#0a0a0a" />
          <image
            href={node.logo}
            x={node.x - node.size / 2 + 1}
            y={node.y - node.size / 2 + 1}
            width={node.size - 2}
            height={node.size - 2}
            clipPath={`url(#wizard-clip-${node.id})`}
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
      ))}
    </svg>
  );
};
const scrollingWords = [
  "confident", "smarter", "defensible", "data-backed", "signal-driven",
  "confident", "smarter", "defensible", "data-backed", "signal-driven",
  "confident", "smarter", "defensible", "data-backed", "signal-driven",
  "confident", "smarter"
];
const WORD_HEIGHT = 56;
const FINAL_WORD_INDEX = scrollingWords.length - 2; // Second to last (confident)

const Wizard = () => {
  const [selectedOption, setSelectedOption] = useState<WizardOption | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isScrolling, setIsScrolling] = useState(true);
  const [hasSettled, setHasSettled] = useState(false);
  const scrollStarted = useRef(false);

  // Scroll animation for the headline
  useEffect(() => {
    if (scrollStarted.current || selectedOption) return;
    scrollStarted.current = true;

    const targetOffset = FINAL_WORD_INDEX * WORD_HEIGHT;
    const totalDuration = 3500;
    const startTime = Date.now();

    const animateScroll = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      
      // Easing: starts fast, slows down at end (easeOutCubic)
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      setScrollOffset(easeOutCubic * targetOffset);
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        setIsScrolling(false);
        setHasSettled(true);
      }
    };
    
    requestAnimationFrame(animateScroll);
  }, [selectedOption]);

  const handleSelect = (option: WizardOption) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedOption(option);
      setIsTransitioning(false);
    }, 300);
  };

  const handleBack = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedOption(null);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between">
        <img src={logoWhite} alt="AudienceScan" className="h-7 opacity-80" />
        <a
          href="https://app.audiencescan.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 rounded-full text-sm transition-all"
        >
          Launch App
        </a>
      </header>

      <div
        className={`min-h-screen transition-all duration-300 ${
          isTransitioning ? "opacity-0 scale-98" : "opacity-100 scale-100"
        }`}
      >
        {!selectedOption ? (
          // Selection Screen
          <div className="min-h-screen flex flex-col">
            {/* Hero area with network preview */}
            <div className="flex-1 flex items-center justify-center pt-20 pb-8 px-6">
              <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
                {/* Left: Text */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <p className="text-purple-400 text-sm tracking-widest uppercase font-medium">
                      On-chain audience intelligence
                    </p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                      Make{" "}
                      <span className="inline-block align-bottom overflow-hidden" style={{ height: WORD_HEIGHT }}>
                        <span
                          className="flex flex-col transition-transform"
                          style={{
                            transform: `translateY(-${scrollOffset}px)`,
                            transitionDuration: isScrolling ? "0ms" : "300ms",
                          }}
                        >
                          {scrollingWords.map((word, i) => (
                            <span
                              key={i}
                              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
                              style={{ height: WORD_HEIGHT, lineHeight: `${WORD_HEIGHT}px` }}
                            >
                              {word}
                            </span>
                          ))}
                        </span>
                      </span>
                      <br />
                      growth decisions
                    </h1>
                    <p className="text-white/50 text-lg max-w-md">
                      Select your role to see how on-chain data reveals your next audience.
                    </p>
                  </div>
                </div>

                {/* Right: Network preview */}
                <div className="relative aspect-square max-w-[500px] mx-auto w-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-pink-600/10 rounded-full blur-3xl" />
                  <NetworkGraph studyId="FnBmNZv2Ik2x8xJwHjRf" />
                </div>
              </div>
            </div>

            {/* Bottom: Options */}
            <div className="px-6 pb-12">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {wizardOptions.map((option, index) => (
                    <button
                      key={option.id}
                      onClick={() => handleSelect(option)}
                      className="group relative bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-purple-500/40 rounded-2xl p-5 text-left transition-all duration-300"
                      style={{
                        animation: `fadeInUp 0.5s ${index * 0.05}s ease-out backwards`,
                      }}
                    >
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                      
                      <div className="relative">
                        <div className="text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                          {option.icon}
                        </div>
                        <h3 className="text-white font-semibold text-base mb-1">
                          {option.label}
                        </h3>
                        <p className="text-white/40 text-xs">
                          {option.smallText}
                        </p>
                        <ArrowRight className="absolute top-0 right-0 w-4 h-4 text-white/0 group-hover:text-purple-400 transition-all duration-300 group-hover:translate-x-0.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Result Screen
          <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
            <button
              onClick={handleBack}
              className="absolute top-24 left-6 text-white/40 hover:text-white text-sm flex items-center gap-2 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back
            </button>

            <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Network */}
              <div className="relative aspect-square max-w-[500px] mx-auto w-full order-2 lg:order-1">
                <div className={`absolute inset-0 bg-gradient-to-br ${selectedOption.gradient} opacity-20 rounded-full blur-3xl`} />
                <NetworkGraph studyId="FnBmNZv2Ik2x8xJwHjRf" />
              </div>

              {/* Right: Content */}
              <div className="space-y-8 order-1 lg:order-2">
                <div className="space-y-6">
                  <div className={`inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r ${selectedOption.gradient} rounded-full`}>
                    <span className="text-white/90">{selectedOption.icon}</span>
                    <span className="text-white text-sm font-medium">
                      {selectedOption.smallText}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                    {selectedOption.title}
                  </h1>
                </div>

                <a
                  href="https://app.audiencescan.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${selectedOption.gradient} rounded-xl text-white font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20`}
                >
                  {selectedOption.cta}
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
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

export default Wizard;
