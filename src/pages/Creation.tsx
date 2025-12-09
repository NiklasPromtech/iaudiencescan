import { useState, useEffect, useRef } from "react";
import logoWhite from "@/assets/audiencescan-logo-white.png";

interface Token {
  name: string;
  symbol: string;
  logo: string;
}

interface OverlapToken {
  score: number;
  symbol: string;
  name: string;
  logo: string;
  twitter?: string;
  telegram?: string;
  reddit?: string;
}

const categories = [
  "Meme Tokens",
  "AI Agents",
  "Real Estate",
  "DeFi",
  "Gaming",
  "Layer 2",
  "NFT",
  "Privacy",
];

const memeTokens: Token[] = [
  { name: "Dogecoin", symbol: "DOGE", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/74.png" },
  { name: "Pepe", symbol: "PEPE", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/24478.png" },
  { name: "Bonk", symbol: "BONK", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/23095.png" },
  { name: "Pudgy Penguins", symbol: "PENGU", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/34466.png" },
  { name: "FLOKI", symbol: "FLOKI", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/10804.png" },
  { name: "Fartcoin", symbol: "FARTCOIN", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/33597.png" },
  { name: "Shiba Inu", symbol: "SHIB", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png" },
  { name: "BUILDon", symbol: "B", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/36532.png" },
  { name: "ApeCoin", symbol: "APE", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/18876.png" },
];

const SHIB_INDEX = 6; // Index of Shiba Inu in the array

const overlapResults: OverlapToken[] = [
  { score: 1.0, symbol: "WETH", name: "Wrapped Ether", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/2396.png" },
  { score: 0.8523, symbol: "UNI", name: "Uniswap", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png", twitter: "Uniswap", reddit: "Uniswap" },
  { score: 0.6818, symbol: "USDC", name: "USD Coin", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png", twitter: "circle" },
  { score: 0.6341, symbol: "USDT", name: "Tether USD", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png", twitter: "tether_to", telegram: "OfficialTether" },
  { score: 0.5743, symbol: "SHIB", name: "SHIBA INU", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png", twitter: "shibtoken", reddit: "SHIBArmy", telegram: "ShibaInu_Dogecoinkiller" },
  { score: 0.4773, symbol: "KITE", name: "Kite", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/38828.png", twitter: "GoKiteAI" },
  { score: 0.4091, symbol: "MOVE", name: "Movement", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/32452.png", twitter: "movementfdn", telegram: "movementlabsxyz" },
  { score: 0.4091, symbol: "ENA", name: "ENA", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/30171.png", twitter: "ethena_labs", telegram: "ethena_labs" },
  { score: 0.4091, symbol: "SUPER", name: "SuperFarm", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/8290.png", twitter: "SuperVerse", telegram: "SuperVerseDAO" },
  { score: 0.375, symbol: "VRA", name: "VERA", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/3816.png", twitter: "verasitytech", telegram: "VRAchannel", reddit: "Verasity" },
  { score: 0.3409, symbol: "MUBI", name: "MUBI", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/28412.png", twitter: "Multibit_Bridge", telegram: "multibitprotocol" },
  { score: 0.2727, symbol: "TURBO", name: "Turbo", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/24911.png", twitter: "TurboToadToken", reddit: "TurboToadX" },
];

const Creation = () => {
  const [stage, setStage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [autoSelectStep, setAutoSelectStep] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-selection animation for category and token
  useEffect(() => {
    if (stage !== 0) return;
    
    const timers: NodeJS.Timeout[] = [];
    
    // Auto-select "Meme Tokens" category after 2s
    timers.push(setTimeout(() => {
      setAutoSelectStep(1);
      setSelectedCategory("Meme Tokens");
    }, 2000));
    
    // Move to token selection after 3.5s (give time for category selection animation)
    timers.push(setTimeout(() => {
      setAutoSelectStep(2);
      // Start the scroll animation
      setIsScrolling(true);
    }, 4000));
    
    // Animate the scroll wheel to land on Shiba Inu
    timers.push(setTimeout(() => {
      const ITEM_HEIGHT = 80; // Height of each token row
      const targetOffset = SHIB_INDEX * ITEM_HEIGHT;
      const totalDuration = 2000; // 2 seconds total animation
      const startTime = Date.now();
      
      const animateScroll = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / totalDuration, 1);
        
        // Easing function: starts fast, slows down at the end (easeOutCubic)
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        
        const currentOffset = easeOutCubic * targetOffset;
        setScrollOffset(currentOffset);
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          // Animation complete, select Shiba Inu
          setAutoSelectStep(3);
          setSelectedToken(memeTokens[SHIB_INDEX]);
          setIsScrolling(false);
        }
      };
      
      requestAnimationFrame(animateScroll);
    }, 4500));
    
    // Move to next stage after selection animation plays
    timers.push(setTimeout(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setStage(1);
        setIsAnimating(false);
      }, 500);
    }, 8500));
    
    return () => timers.forEach(clearTimeout);
  }, [stage]);

  // Auto-advance through remaining stages
  useEffect(() => {
    if (stage === 0 || stage >= 7) return;

    const timer = setTimeout(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setStage((prev) => prev + 1);
        setIsAnimating(false);
      }, 500);
    }, 4500);

    return () => clearTimeout(timer);
  }, [stage]);

  const resetDemo = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setStage(0);
      setSelectedCategory(null);
      setSelectedToken(null);
      setAutoSelectStep(0);
      setScrollOffset(0);
      setIsScrolling(false);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between">
        <img src={logoWhite} alt="AudienceScan" className="h-8" />
        <div className="flex items-center gap-4">
          {stage > 0 && (
            <button
              onClick={resetDemo}
              className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              Reset
            </button>
          )}
          <a
            href="https://app.audiencescan.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-violet-600 hover:bg-violet-500 rounded-full text-sm font-medium transition-colors"
          >
            Launch App
          </a>
        </div>
      </header>

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 60%)",
          }}
        />
        <NetworkBackground stage={stage} />
      </div>

      {/* Progress Indicator */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((s) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              stage >= s ? "bg-violet-500 scale-125" : "bg-white/20"
            }`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div
        ref={containerRef}
        className={`min-h-screen flex items-center justify-center px-6 py-24 transition-opacity duration-500 ${
          isAnimating ? "opacity-0" : "opacity-100"
        }`}
      >
        {stage === 0 && (
          <CategoryTokenSelectionStage 
            autoSelectStep={autoSelectStep}
            selectedCategory={selectedCategory}
            selectedToken={selectedToken}
            scrollOffset={scrollOffset}
            isScrolling={isScrolling}
          />
        )}
        {stage === 1 && selectedToken && <WalletDiscoveryStage token={selectedToken} />}
        {stage === 2 && <WalletFilteringStage />}
        {stage === 3 && <TransactionAnalysisStage />}
        {stage === 4 && <TokenCompilationStage />}
        {stage === 5 && <DataEnrichmentStage />}
        {stage === 6 && <FinalDatasetStage />}
        {stage === 7 && <ValuePropositionStage onReset={resetDemo} />}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes flowLine {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes nodeAppear {
          0% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes scanLine {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        @keyframes dataFlow {
          0% { transform: translateX(-100%); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes countUp {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes highlightPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.6); }
          50% { box-shadow: 0 0 30px 15px rgba(139, 92, 246, 0.3); }
        }
        @keyframes selectGlow {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
          50% { transform: scale(1.15); box-shadow: 0 0 40px 20px rgba(139, 92, 246, 0.5); }
          100% { transform: scale(1.1); box-shadow: 0 0 30px 10px rgba(139, 92, 246, 0.3); }
        }
        @keyframes checkmarkPop {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; }
          50% { transform: scale(1.3) rotate(0deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes shrinkOut {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.3; }
        }
        @keyframes bounceSelect {
          0% { transform: scale(1); }
          30% { transform: scale(1.08); }
          50% { transform: scale(0.98); }
          70% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
        @keyframes pulseRing {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.1); }
        }
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeSlideUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in-scale { animation: fadeInScale 0.8s ease-out forwards; }
        .animate-pulse-slow { animation: pulse 3s ease-in-out infinite; }
        .animate-node-appear { animation: nodeAppear 0.6s ease-out forwards; }
        .animate-highlight { animation: highlightPulse 1.5s ease-in-out infinite; }
        .animate-select-glow { animation: selectGlow 0.6s ease-out forwards; }
        .animate-checkmark { animation: checkmarkPop 0.4s ease-out forwards; }
        .animate-ripple { animation: ripple 0.8s ease-out forwards; }
        .animate-shrink-out { animation: shrinkOut 0.4s ease-out forwards; }
        .animate-bounce-select { animation: bounceSelect 0.5s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
        .delay-400 { animation-delay: 0.4s; opacity: 0; }
        .delay-500 { animation-delay: 0.5s; opacity: 0; }
        .delay-600 { animation-delay: 0.6s; opacity: 0; }
        .delay-700 { animation-delay: 0.7s; opacity: 0; }
        .delay-800 { animation-delay: 0.8s; opacity: 0; }
        .material-icons-outlined {
          font-family: 'Material Icons Outlined';
          font-weight: normal;
          font-style: normal;
          font-size: 24px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          -webkit-font-feature-settings: 'liga';
          font-feature-settings: 'liga';
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
    </div>
  );
};

// Network Background Animation
const NetworkBackground = ({ stage }: { stage: number }) => {
  const [nodes, setNodes] = useState<{ x: number; y: number; delay: number }[]>([]);

  useEffect(() => {
    const newNodes = Array.from({ length: 30 + stage * 10 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setNodes(newNodes);
  }, [stage]);

  return (
    <svg className="absolute inset-0 w-full h-full opacity-30">
      {nodes.map((node, i) =>
        nodes.slice(i + 1, i + 4).map((target, j) => (
          <line
            key={`${i}-${j}`}
            x1={`${node.x}%`}
            y1={`${node.y}%`}
            x2={`${target.x}%`}
            y2={`${target.y}%`}
            stroke="rgba(139, 92, 246, 0.3)"
            strokeWidth="1"
            style={{
              animation: `flowLine 2s ${node.delay}s ease-out forwards`,
              strokeDasharray: 100,
              strokeDashoffset: 100,
            }}
          />
        ))
      )}
      {nodes.map((node, i) => (
        <circle
          key={i}
          cx={`${node.x}%`}
          cy={`${node.y}%`}
          r="3"
          fill="rgba(139, 92, 246, 0.6)"
          style={{
            animation: `nodeAppear 0.5s ${node.delay}s ease-out forwards`,
            opacity: 0,
          }}
        />
      ))}
    </svg>
  );
};

// Stage 0: Category and Token Selection with Auto-Animation
const CategoryTokenSelectionStage = ({
  autoSelectStep,
  selectedCategory,
  selectedToken,
  scrollOffset,
  isScrolling,
}: {
  autoSelectStep: number;
  selectedCategory: string | null;
  selectedToken: Token | null;
  scrollOffset: number;
  isScrolling: boolean;
}) => (
  <div className="max-w-5xl mx-auto text-center">
    <p className="text-violet-400 text-sm md:text-base mb-4 tracking-widest uppercase animate-fade-in-up">
      Step 1
    </p>
    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in-up delay-100">
      {autoSelectStep < 2 ? "Select a Token Category" : "Select a Token"}
    </h1>
    <p className="text-lg md:text-xl text-white/60 mb-12 animate-fade-in-up delay-200">
      {autoSelectStep < 2 
        ? "Choose from 400+ token categories" 
        : `Pick a ${selectedCategory?.toLowerCase() || "meme"} token to analyze`}
    </p>

    {autoSelectStep < 2 ? (
      // Category Selection - with fade-in animation starting from hidden
      <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
        {categories.map((category, i) => {
          const isSelected = selectedCategory === category;
          const hasSelection = selectedCategory !== null;
          
          return (
            <div
              key={category}
              className={`px-5 py-2.5 md:px-6 md:py-3 rounded-full border text-sm md:text-base whitespace-nowrap relative animate-fade-in-up ${
                isSelected
                  ? "bg-violet-600 border-violet-400 text-white"
                  : "bg-white/5 border-white/10 text-white/70"
              }`}
              style={{
                opacity: 0,
                animationDelay: `${0.3 + i * 0.05}s`,
                animationFillMode: "forwards",
                ...(hasSelection && !isSelected ? { opacity: 0.3 } : {}),
                transform: isSelected ? "scale(1.1)" : hasSelection ? "scale(0.95)" : "scale(1)",
                boxShadow: isSelected ? "0 0 30px 10px rgba(139, 92, 246, 0.4)" : "none",
                transition: "transform 0.4s ease, box-shadow 0.4s ease",
              }}
            >
              {isSelected && (
                <span className="absolute -right-2 -top-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="material-icons-outlined text-violet-600 text-sm">check</span>
                </span>
              )}
              <span className="font-medium">{category}</span>
            </div>
          );
        })}
      </div>
    ) : (
      // Token Selection - iOS-style vertical scroll picker wheel
      <div 
        className="relative w-full max-w-md mx-auto animate-fade-in"
        style={{ 
          opacity: 0,
          animationDelay: '0.3s',
          animationFillMode: 'forwards'
        }}
      >
        {/* Gradient overlays for depth effect */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black via-black/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none" />
        
        {/* Selection highlight bar */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full max-w-sm h-20 bg-violet-600/20 border-y-2 border-violet-400/50 z-5 rounded-lg" />
        
        {/* Scroll wheel container */}
        <div className="h-[280px] overflow-hidden relative">
          <div 
            className="absolute w-full transition-transform"
            style={{ 
              transform: `translateY(${100 - scrollOffset}px)`,
              transitionDuration: isScrolling ? '0ms' : '300ms',
              transitionTimingFunction: 'ease-out'
            }}
          >
            {memeTokens.map((token, i) => {
              const ITEM_HEIGHT = 80;
              const itemCenter = i * ITEM_HEIGHT + ITEM_HEIGHT / 2;
              const viewCenter = scrollOffset + 140; // 140 = half of 280px container
              const distanceFromCenter = Math.abs(itemCenter - viewCenter);
              const isSelected = selectedToken?.symbol === token.symbol;
              const isNearCenter = distanceFromCenter < ITEM_HEIGHT;
              
              // Calculate opacity and scale based on distance from center
              const maxDistance = ITEM_HEIGHT * 2;
              const normalizedDistance = Math.min(distanceFromCenter, maxDistance) / maxDistance;
              const opacity = 1 - normalizedDistance * 0.7;
              const scale = 1 - normalizedDistance * 0.15;
              
              return (
                <div
                  key={token.symbol}
                  className="flex items-center gap-4 px-6 py-4 transition-all duration-150"
                  style={{
                    height: `${ITEM_HEIGHT}px`,
                    opacity: opacity,
                    transform: `scale(${scale})`,
                  }}
                >
                  <div 
                    className={`w-12 h-12 rounded-full overflow-hidden border-2 flex-shrink-0 transition-all duration-300 ${
                      isSelected ? 'border-violet-400 shadow-lg shadow-violet-500/50' : 'border-white/20'
                    }`}
                  >
                    <img
                      src={token.logo}
                      alt={token.name}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className={`font-bold text-lg transition-colors duration-300 ${
                      isSelected ? 'text-white' : 'text-white/80'
                    }`}>
                      {token.name}
                    </h3>
                    <p className="text-white/50 text-sm">
                      ${token.symbol}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                        <span className="material-icons-outlined text-white text-sm">check</span>
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Selected token info below wheel */}
        {selectedToken && (
          <div className="mt-6 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/20 border border-violet-400/30 rounded-full">
              <span className="text-sm text-violet-200 font-medium">Analyzing {selectedToken.name}...</span>
            </div>
          </div>
        )}
      </div>
    )}
  </div>
);

// Stage 1: Wallet Discovery
const WalletDiscoveryStage = ({ token }: { token: Token }) => (
  <div className="max-w-5xl mx-auto text-center">
    <p className="text-violet-400 text-sm md:text-base mb-4 tracking-widest uppercase animate-fade-in-up">
      Step 2
    </p>
    <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up delay-100">
      Scanning Token Contract
    </h2>
    <p className="text-lg text-white/60 mb-12 animate-fade-in-up delay-200">
      Analyzing the last 1,000 transactions for relevance
    </p>

    <div className="relative max-w-3xl mx-auto animate-fade-in-scale delay-300">
      {/* Central Token */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-violet-500/20 border-2 border-violet-500 flex items-center justify-center mb-6 animate-pulse-slow">
          <img src={token.logo} alt={token.name} className="w-16 h-16 md:w-20 md:h-20 rounded-full" />
        </div>
        
        {/* Scanning Rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full border border-violet-500/30"
              style={{
                animation: `pulse 2s ${i * 0.5}s ease-out infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-8 mt-12 max-w-md mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 animate-fade-in-up delay-400">
          <p className="text-4xl font-bold text-violet-400 mb-2">1,000</p>
          <p className="text-white/50 text-sm">Transactions Scanned</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 animate-fade-in-up delay-500">
          <p className="text-4xl font-bold text-violet-400 mb-2">851</p>
          <p className="text-white/50 text-sm">Wallets Found</p>
        </div>
      </div>

      {/* Wallet Grid Preview - pyramid layout with fading opacity */}
      <div className="flex flex-col items-center gap-2 mt-8">
        {/* Row 1: 15 wallets */}
        <div className="flex gap-2 justify-center">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={`r1-${i}`}
              className="w-8 h-8 md:w-10 md:h-10 bg-violet-500/20 border border-violet-500/30 rounded flex items-center justify-center animate-fade-in-up"
              style={{ animationDelay: `${0.3 + Math.random() * 2}s`, opacity: 0 }}
            >
              <span className="material-icons-outlined text-violet-400 text-xs">account_balance_wallet</span>
            </div>
          ))}
        </div>
        {/* Row 2: 12 wallets */}
        <div className="flex gap-2 justify-center">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`r2-${i}`}
              className="w-8 h-8 md:w-10 md:h-10 bg-violet-500/15 border border-violet-500/25 rounded flex items-center justify-center animate-fade-in-up"
              style={{ animationDelay: `${0.5 + Math.random() * 2}s`, opacity: 0 }}
            >
              <span className="material-icons-outlined text-violet-400/70 text-xs">account_balance_wallet</span>
            </div>
          ))}
        </div>
        {/* Row 3: 10 wallets */}
        <div className="flex gap-2 justify-center">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`r3-${i}`}
              className="w-8 h-8 md:w-10 md:h-10 bg-violet-500/10 border border-violet-500/20 rounded flex items-center justify-center animate-fade-in-up"
              style={{ animationDelay: `${0.7 + Math.random() * 2}s`, opacity: 0 }}
            >
              <span className="material-icons-outlined text-violet-400/50 text-xs">account_balance_wallet</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Stage 2: Wallet Filtering
const WalletFilteringStage = () => (
  <div className="max-w-5xl mx-auto text-center">
    <p className="text-violet-400 text-sm md:text-base mb-4 tracking-widest uppercase animate-fade-in-up">
      Step 3
    </p>
    <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up delay-100">
      Filtering for Relevance
    </h2>
    <p className="text-lg text-white/60 mb-12 animate-fade-in-up delay-200">
      Selecting wallets by transfer volume
    </p>

    <div className="relative animate-fade-in-scale delay-300">
      {/* Filter Selection */}
      <div className="flex flex-col items-center gap-6 mb-12">
        {/* Filter Type Selection */}
        <div className="flex flex-wrap justify-center gap-3">
          <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/40 text-sm">
            Transaction Count
          </div>
          <div className="px-4 py-2 rounded-lg bg-violet-500/20 border-2 border-violet-500 text-violet-300 text-sm font-medium flex items-center gap-2">
            <span className="material-icons-outlined text-base">attach_money</span>
            Transaction Volume
          </div>
          <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/40 text-sm">
            Token Holdings
          </div>
        </div>

        {/* Volume Range Selection */}
        <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-6 animate-fade-in-up delay-400">
          <p className="text-white/60 text-sm mb-3">Selected range:</p>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-violet-600/30 border border-violet-400 rounded-lg">
              <span className="text-violet-200 font-mono font-bold">$100</span>
            </div>
            <span className="text-violet-400">to</span>
            <div className="px-4 py-2 bg-violet-600/30 border border-violet-400 rounded-lg">
              <span className="text-violet-200 font-mono font-bold">$500</span>
            </div>
            <span className="text-white/50 text-sm">USD</span>
          </div>
        </div>
      </div>

      {/* Before/After Visualization */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
        {/* Before */}
        <div className="text-center">
          <div className="w-28 h-28 rounded-full bg-white/5 border border-white/20 flex items-center justify-center mb-3">
            <p className="text-2xl font-bold text-white/60">851</p>
          </div>
          <p className="text-white/40 text-sm">All Wallets</p>
        </div>

        {/* Arrow */}
        <div className="flex items-center gap-2 py-4 md:py-0">
          <span className="material-icons-outlined text-violet-400 text-2xl md:rotate-0 rotate-90">arrow_forward</span>
        </div>

        {/* After */}
        <div className="text-center">
          <div className="w-28 h-28 rounded-full bg-violet-500/20 border-2 border-violet-500 flex items-center justify-center mb-3 animate-pulse-slow">
            <p className="text-2xl font-bold text-violet-400">70</p>
          </div>
          <p className="text-white/60 text-sm">Filtered Wallets</p>
        </div>
      </div>

    </div>
  </div>
);

// Easing count-up hook
const useCountUp = (target: number, duration: number = 2500, delay: number = 500) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const startTime = Date.now() + delay;
    
    const animate = () => {
      const now = Date.now();
      if (now < startTime) {
        requestAnimationFrame(animate);
        return;
      }
      
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic: starts fast, slows down at the end
      const eased = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(eased * target));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [target, duration, delay]);
  
  return count;
};

// Stage 3: Transaction Analysis
const TransactionAnalysisStage = () => {
  const transactionsCount = useCountUp(750, 2500, 800);
  const tokensCount = useCountUp(130, 2500, 1000);
  
  return (
    <div className="max-w-5xl mx-auto text-center">
      <p className="text-violet-400 text-sm md:text-base mb-4 tracking-widest uppercase animate-fade-in-up">
        Step 4
      </p>
      <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up delay-100">
        Analyzing Wallet Activity
      </h2>
      <p className="text-lg text-white/60 mb-12 animate-fade-in-up delay-200">
        Examining token transactions and volume for each wallet
      </p>

      <div className="relative animate-fade-in-scale delay-300">
        {/* Wallet Analysis Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="relative bg-gradient-to-br from-violet-500/10 to-purple-600/10 border border-violet-500/30 rounded-xl p-4 animate-fade-in-up overflow-hidden"
              style={{ animationDelay: `${0.3 + i * 0.1}s`, opacity: 0 }}
            >
              {/* Scanning Effect */}
              <div
                className="absolute inset-0 bg-gradient-to-b from-violet-500/20 via-transparent to-transparent"
                style={{
                  animation: `scanLine 1.5s ${i * 0.2}s ease-in-out infinite`,
                }}
              />
              
              <div className="relative z-10">
                <span className="material-icons-outlined text-white/60 text-2xl">account_balance_wallet</span>
                <p className="text-xs text-white/40 font-mono mt-2">0x...{(1000 + i * 123).toString(16)}</p>
                <div className="mt-3 space-y-1">
                  {[0, 1, 2].map((j) => (
                    <div key={j} className="flex items-center gap-2 text-xs">
                      <div className="w-4 h-4 rounded-full bg-violet-500/40" />
                      <span className="text-white/50">${["UNI", "WETH", "USDC"][j]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-8 mt-12 max-w-lg mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 animate-fade-in-up delay-700">
            <p className="text-4xl font-bold text-violet-400 mb-2">{transactionsCount}</p>
            <p className="text-white/50 text-sm">Transactions Analyzed</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 animate-fade-in-up delay-800">
            <p className="text-4xl font-bold text-violet-400 mb-2">{tokensCount}</p>
            <p className="text-white/50 text-sm">Tokens Found</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// All 100 token logos for the network visualization
const tokenLogos = [
  "https://s2.coinmarketcap.com/static/img/coins/128x128/2396.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/7083.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/3408.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/825.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/5994.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/38828.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/32452.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/30171.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/8290.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/3816.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/28412.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/24911.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/21416.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/5692.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/36281.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/27772.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/4943.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/7737.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/7672.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/23246.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/2348.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/34812.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/1455.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/36510.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/38371.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/33038.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/5864.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/4705.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/1975.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/1966.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/3155.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/10821.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/24594.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/31632.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/5617.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/28230.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/21846.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/21707.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/19269.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/3029.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/26997.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/37456.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/2539.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/18934.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/31185.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/32257.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/23711.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/33981.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/3717.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/21106.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/1727.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/24478.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/6210.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/21159.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/29471.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/7278.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/31494.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/8425.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/9481.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/18679.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/9543.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/10804.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/5338.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/1697.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/33251.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/2394.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/28081.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/5176.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/10603.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/6958.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/29420.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/17799.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/9263.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/7080.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/7725.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/11865.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/2341.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/6719.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/28695.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/35364.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/8071.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/2092.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/13198.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/6950.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/2765.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/3589.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/6747.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/7129.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/11821.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/25147.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/4195.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/5616.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/33979.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/9194.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/30494.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/33695.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/23494.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/33652.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/3783.png",
  "https://s2.coinmarketcap.com/static/img/coins/128x128/35934.png",
];

// Stage 4: Token Compilation - Pure SVG with all 100 tokens, exploding size
const TokenCompilationStage = () => {
  const size = 700;
  const center = size / 2;
  
  // Ring configurations: [count, radius, tokenSize, opacity] - expanded radii for larger chart
  const rings: [number, number, number, number][] = [
    [8, 90, 22, 1],       // Ring 1: 8 tokens
    [12, 145, 18, 0.9],   // Ring 2: 12 tokens
    [18, 200, 15, 0.75],  // Ring 3: 18 tokens
    [22, 255, 13, 0.6],   // Ring 4: 22 tokens
    [28, 305, 11, 0.45],  // Ring 5: 28 tokens
    [12, 340, 9, 0.3],    // Ring 6: 12 tokens (fills to 100)
  ];
  
  let tokenIndex = 0;
  const tokens: { x: number; y: number; r: number; logo: string; opacity: number }[] = [];
  
  rings.forEach(([count, radius, tokenSize, opacity]) => {
    for (let i = 0; i < count && tokenIndex < tokenLogos.length; i++) {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      tokens.push({
        x: center + Math.cos(angle) * radius,
        y: center + Math.sin(angle) * radius,
        r: tokenSize,
        logo: tokenLogos[tokenIndex],
        opacity,
      });
      tokenIndex++;
    }
  });

  return (
    <div className="max-w-5xl mx-auto text-center relative">
      {/* Text content on top */}
      <div className="relative z-10">
        <p className="text-violet-400 text-sm md:text-base mb-4 tracking-widest uppercase animate-fade-in-up">
          Step 5
        </p>
        <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up delay-100">
          Token Overlap Results
        </h2>
        <p className="text-lg text-white/60 mb-8 animate-fade-in-up delay-200">
          Ranked by how many wallets also transact each token
        </p>
      </div>

      {/* Single large chart */}
      <div className="relative z-10 flex justify-center animate-fade-in-scale delay-300">
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          className="w-[95vw] h-[95vw] max-w-[650px] max-h-[650px]"
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            {tokens.map((token, i) => (
              <clipPath key={`clip-${i}`} id={`token-clip-${i}`}>
                <circle cx={token.x} cy={token.y} r={token.r - 1} />
              </clipPath>
            ))}
            <clipPath id="center-clip">
              <circle cx={center} cy={center} r={28} />
            </clipPath>
          </defs>

          {/* Connection lines */}
          {tokens.map((token, i) => (
            <line
              key={`line-${i}`}
              x1={center}
              y1={center}
              x2={token.x}
              y2={token.y}
              stroke={`rgba(139, 92, 246, ${token.opacity * 0.3})`}
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          ))}

          {/* Token circles with images */}
          {tokens.map((token, i) => (
            <g key={`token-${i}`} style={{ opacity: token.opacity }}>
              <circle
                cx={token.x}
                cy={token.y}
                r={token.r}
                fill="rgba(255, 255, 255, 0.1)"
                stroke={`rgba(139, 92, 246, ${token.opacity * 0.6})`}
                strokeWidth="1"
              />
              <image
                href={token.logo}
                x={token.x - token.r + 1}
                y={token.y - token.r + 1}
                width={(token.r - 1) * 2}
                height={(token.r - 1) * 2}
                clipPath={`url(#token-clip-${i})`}
              />
            </g>
          ))}

          {/* Central SHIB node */}
          <g filter="url(#glow)">
            <circle cx={center} cy={center} r={32} fill="#7c3aed" stroke="white" strokeWidth="2" />
            <image
              href="https://s2.coinmarketcap.com/static/img/coins/128x128/5994.png"
              x={center - 24}
              y={center - 24}
              width="48"
              height="48"
              clipPath="url(#center-clip)"
            />
          </g>
        </svg>
      </div>

    </div>
  );
};

// Stage 5: Data Enrichment
const DataEnrichmentStage = () => {
  const handlesCount = useCountUp(89, 2500, 600);
  const channelsCount = useCountUp(67, 2500, 800);
  const communitiesCount = useCountUp(43, 2500, 1000);
  
  const platforms = [
    { icon: "tag", title: "X (Twitter)", count: handlesCount, desc: "Handles found" },
    { icon: "send", title: "Telegram", count: channelsCount, desc: "Channels found" },
    { icon: "forum", title: "Reddit", count: communitiesCount, desc: "Communities found" },
  ];

  return (
    <div className="max-w-5xl mx-auto text-center">
      <p className="text-violet-400 text-sm md:text-base mb-4 tracking-widest uppercase animate-fade-in-up">
        Step 6
      </p>
      <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up delay-100">
        Enriching with Social Data
      </h2>
      <p className="text-lg text-white/60 mb-12 animate-fade-in-up delay-200">
        Adding social handles and community tags
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {platforms.map((platform, i) => (
          <div
            key={i}
            className="relative bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 animate-fade-in-up overflow-hidden"
            style={{ animationDelay: `${0.3 + i * 0.15}s`, opacity: 0 }}
          >
            {/* Data Flow Animation */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-purple-500/20 to-violet-500/10"
              style={{
                animation: `dataFlow 2s ${i * 0.3}s ease-in-out infinite`,
              }}
            />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
                <span className="material-icons-outlined text-violet-400 text-2xl">{platform.icon}</span>
              </div>
              <h3 className="text-lg font-semibold mb-1">{platform.title}</h3>
              <p className="text-3xl font-bold text-violet-400 mb-1">{platform.count}</p>
              <p className="text-sm text-white/50">{platform.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Stage 6: Final Dataset
const FinalDatasetStage = () => (
  <div className="max-w-5xl mx-auto text-center">
    <p className="text-violet-400 text-sm md:text-base mb-4 tracking-widest uppercase animate-fade-in-up">
      Step 7
    </p>
    <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up delay-100">
      Your Actionable Dataset
    </h2>
    <p className="text-lg text-white/60 mb-8 animate-fade-in-up delay-200">
      Ready for strategy, paid ads, and KOL outreach
    </p>

    <div className="relative animate-fade-in-scale delay-300">
      {/* Dataset Preview Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden max-w-4xl mx-auto">
        <div className="grid grid-cols-5 gap-2 p-3 bg-violet-500/20 border-b border-white/10 text-xs md:text-sm font-medium">
          <span>Score</span>
          <span>Token</span>
          <span className="hidden md:block">Name</span>
          <span>Twitter</span>
          <span>Telegram</span>
        </div>
        {overlapResults.slice(0, 6).map((token, i) => (
          <div
            key={i}
            className="grid grid-cols-5 gap-2 p-3 border-b border-white/5 text-xs md:text-sm animate-fade-in-up items-center"
            style={{ animationDelay: `${0.4 + i * 0.08}s`, opacity: 0 }}
          >
            <span className="text-violet-400 font-medium">{(token.score * 100).toFixed(0)}%</span>
            <div className="flex items-center gap-2">
              <img src={token.logo} alt={token.symbol} className="w-5 h-5 rounded-full" />
              <span className="text-white/80">{token.symbol}</span>
            </div>
            <span className="text-white/60 hidden md:block truncate">{token.name}</span>
            <span className="text-white/50 truncate">{token.twitter ? `@${token.twitter}` : "-"}</span>
            <span className="text-white/50 truncate">{token.telegram || "-"}</span>
          </div>
        ))}
      </div>

      {/* Export Options */}
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        {["DV360", "X Ads", "Telegram Ads", "KOL Outreach"].map((option, i) => (
          <div
            key={i}
            className="px-4 py-2 bg-white/5 border border-violet-500/30 rounded-full text-sm text-white/70 animate-fade-in-up"
            style={{ animationDelay: `${0.8 + i * 0.1}s`, opacity: 0 }}
          >
            <span className="material-icons-outlined text-violet-400 text-sm mr-2 align-middle">file_download</span>
            {option}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Stage 7: Value Proposition
const ValuePropositionStage = ({ onReset }: { onReset: () => void }) => (
  <div className="max-w-4xl mx-auto text-center">
    <div className="mb-8 animate-fade-in-up">
      <span className="material-icons-outlined text-violet-400" style={{ fontSize: "64px" }}>
        auto_awesome
      </span>
    </div>
    
    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up delay-100">
      On-Chain Intelligence<br />
      <span className="text-violet-400">Affordable Pricing</span>
    </h2>
    
    <p className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto animate-fade-in-up delay-200">
      Start with a <span className="text-violet-400 font-semibold">free trial</span>, then just <span className="text-violet-400 font-semibold">$199/month</span>
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-400">
      <a
        href="https://app.audiencescan.xyz"
        target="_blank"
        rel="noopener noreferrer"
        className="px-8 py-4 bg-violet-600 hover:bg-violet-500 rounded-full text-lg font-medium transition-colors inline-flex items-center justify-center gap-2"
      >
        Start Your First Scan
        <span className="material-icons-outlined">arrow_forward</span>
      </a>
      <button
        onClick={onReset}
        className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-lg font-medium transition-colors"
      >
        Watch Again
      </button>
    </div>

    {/* Trust Indicators */}
    <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in-up delay-600">
      {[
        { value: "$8M+", label: "Ad Budget Deployed" },
        { value: "314", label: "Campaigns Activated" },
        { value: "250+", label: "Scans Completed" },
      ].map((stat, i) => (
        <div key={i} className="text-center">
          <p className="text-2xl md:text-3xl font-bold text-violet-400">{stat.value}</p>
          <p className="text-sm text-white/50">{stat.label}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Creation;
