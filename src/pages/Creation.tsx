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
  { name: "Shiba Inu", symbol: "SHIB", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png" },
  { name: "Pepe", symbol: "PEPE", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/24478.png" },
];

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
    }, 4000));
    
    // Auto-select "Shiba Inu" after tokens are visible (2s after token UI appears)
    timers.push(setTimeout(() => {
      setAutoSelectStep(3);
      setSelectedToken(memeTokens[1]); // Shiba Inu
    }, 6500));
    
    // Move to next stage after selection animation plays (2s after selection)
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
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in-scale { animation: fadeInScale 0.8s ease-out forwards; }
        .animate-pulse-slow { animation: pulse 3s ease-in-out infinite; }
        .animate-node-appear { animation: nodeAppear 0.6s ease-out forwards; }
        .animate-highlight { animation: highlightPulse 1.5s ease-in-out infinite; }
        .animate-select-glow { animation: selectGlow 0.6s ease-out forwards; }
        .animate-checkmark { animation: checkmarkPop 0.4s ease-out forwards; }
        .animate-ripple { animation: ripple 0.8s ease-out forwards; }
        .animate-shrink-out { animation: shrinkOut 0.4s ease-out forwards; }
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
}: {
  autoSelectStep: number;
  selectedCategory: string | null;
  selectedToken: Token | null;
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
      // Category Selection
      <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto relative">
        {categories.map((category, i) => {
          const isSelected = selectedCategory === category;
          const hasSelection = selectedCategory !== null;
          
          return (
            <div
              key={category}
              className={`relative px-6 py-3 rounded-full border text-sm md:text-base transition-all duration-500 animate-fade-in-up ${
                isSelected
                  ? "bg-violet-600 border-violet-400 text-white scale-125 z-20 shadow-2xl animate-select-glow"
                  : hasSelection
                  ? "bg-white/5 border-white/5 text-white/30 scale-90 animate-shrink-out"
                  : "bg-white/5 border-white/10 text-white/70"
              }`}
              style={{ 
                animationDelay: isSelected ? "0s" : `${0.3 + i * 0.05}s`, 
                opacity: isSelected ? 1 : 0,
                boxShadow: isSelected ? "0 0 60px 20px rgba(139, 92, 246, 0.4)" : "none"
              }}
            >
              {/* Ripple effect on selection */}
              {isSelected && (
                <>
                  <div className="absolute inset-0 rounded-full bg-violet-500/30 animate-ripple" />
                  <div className="absolute inset-0 rounded-full bg-violet-500/20 animate-ripple" style={{ animationDelay: "0.2s" }} />
                </>
              )}
              
              {/* Checkmark icon */}
              {isSelected && (
                <span 
                  className="absolute -right-2 -top-2 w-6 h-6 bg-white rounded-full flex items-center justify-center animate-checkmark shadow-lg"
                >
                  <span className="material-icons-outlined text-violet-600 text-sm">check</span>
                </span>
              )}
              
              <span className="relative z-10 font-medium">{category}</span>
            </div>
          );
        })}
        <div
          className={`px-6 py-3 rounded-full border border-white/10 bg-white/5 text-white/40 text-sm animate-fade-in-up transition-all duration-500 ${
            selectedCategory ? "opacity-30 scale-90" : ""
          }`}
          style={{ animationDelay: "0.7s", opacity: 0 }}
        >
          +392 more...
        </div>
      </div>
    ) : (
      // Token Selection
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {memeTokens.map((token, i) => {
          const isSelected = selectedToken?.symbol === token.symbol;
          const hasSelection = selectedToken !== null;
          
          return (
            <div
              key={token.symbol}
              className={`relative rounded-2xl p-8 transition-all duration-700 ${
                isSelected
                  ? "bg-violet-600/30 border-2 border-violet-400 scale-110 z-20"
                  : hasSelection
                  ? "bg-white/5 border border-white/5 scale-75 opacity-30 blur-[1px]"
                  : "bg-white/5 border border-white/10 hover:border-white/30 animate-fade-in-up"
              }`}
              style={{ 
                animationDelay: hasSelection ? "0s" : `${0.1 + i * 0.1}s`, 
                opacity: hasSelection ? undefined : 0,
                boxShadow: isSelected ? "0 0 100px 40px rgba(139, 92, 246, 0.5), 0 0 200px 80px rgba(139, 92, 246, 0.2)" : "none",
                transform: isSelected ? "scale(1.15)" : hasSelection ? "scale(0.75)" : undefined,
              }}
            >
              {/* Ripple effects on selection */}
              {isSelected && (
                <>
                  <div className="absolute inset-0 rounded-2xl bg-violet-500/30 animate-ripple" />
                  <div className="absolute inset-0 rounded-2xl bg-violet-500/20 animate-ripple" style={{ animationDelay: "0.15s" }} />
                  <div className="absolute inset-0 rounded-2xl bg-violet-500/10 animate-ripple" style={{ animationDelay: "0.3s" }} />
                </>
              )}
              
              {/* Glowing border animation */}
              {isSelected && (
                <div className="absolute inset-0 rounded-2xl border-2 border-violet-400 animate-highlight" />
              )}
              
              {/* Large checkmark badge */}
              {isSelected && (
                <div 
                  className="absolute -right-4 -top-4 w-12 h-12 bg-white rounded-full flex items-center justify-center animate-checkmark shadow-2xl z-30"
                  style={{ boxShadow: "0 0 30px 10px rgba(255, 255, 255, 0.3)" }}
                >
                  <span className="material-icons-outlined text-violet-600 text-2xl">check</span>
                </div>
              )}
              
              <div className="relative z-10">
                <div className={`mx-auto mb-4 rounded-full transition-all duration-700 ${
                  isSelected ? "w-24 h-24 ring-4 ring-violet-300 ring-offset-4 ring-offset-black" : "w-16 h-16"
                }`}>
                  <img
                    src={token.logo}
                    alt={token.name}
                    className={`w-full h-full rounded-full transition-all duration-700 ${isSelected ? "shadow-2xl" : ""}`}
                  />
                </div>
                <h3 className={`font-bold mb-1 transition-all duration-500 ${isSelected ? "text-2xl text-white" : "text-xl"}`}>
                  {token.name}
                </h3>
                <p className={`transition-all duration-500 ${isSelected ? "text-violet-300 text-lg" : "text-white/50"}`}>
                  ${token.symbol}
                </p>
                
                {/* Selected label */}
                {isSelected && (
                  <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-violet-500/40 border border-violet-400/50 rounded-full animate-fade-in-up">
                    <span className="material-icons-outlined text-violet-200 text-lg animate-pulse-slow">trending_up</span>
                    <span className="text-base text-violet-100 font-semibold">Analyzing...</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
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

      {/* Wallet Grid Preview */}
      <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mt-8">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-violet-500/20 border border-violet-500/30 rounded-lg flex items-center justify-center animate-fade-in-up"
            style={{ animationDelay: `${0.6 + i * 0.03}s`, opacity: 0 }}
          >
            <span className="material-icons-outlined text-violet-400/60 text-sm">account_balance_wallet</span>
          </div>
        ))}
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
      Focusing on normal wallet behavior (2-3 transactions)
    </p>

    <div className="relative animate-fade-in-scale delay-300">
      {/* Filter Visualization */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
        {/* Before */}
        <div className="text-center">
          <div className="w-32 h-32 rounded-full bg-white/5 border border-white/20 flex items-center justify-center mb-4">
            <p className="text-3xl font-bold text-white/60">851</p>
          </div>
          <p className="text-white/40 text-sm">All Wallets</p>
        </div>

        {/* Arrow with filter */}
        <div className="flex flex-col items-center gap-2 py-4 md:py-0">
          <span className="material-icons-outlined text-violet-400 text-3xl md:rotate-0 rotate-90">arrow_forward</span>
          <div className="bg-violet-500/20 border border-violet-500/50 rounded-lg px-4 py-2">
            <p className="text-sm text-violet-300">2-3 txs filter</p>
          </div>
        </div>

        {/* After */}
        <div className="text-center">
          <div className="w-32 h-32 rounded-full bg-violet-500/20 border-2 border-violet-500 flex items-center justify-center mb-4 animate-pulse-slow">
            <p className="text-3xl font-bold text-violet-400">70</p>
          </div>
          <p className="text-white/60 text-sm">Filtered Wallets</p>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto animate-fade-in-up delay-500">
        <div className="flex items-start gap-4">
          <span className="material-icons-outlined text-violet-400 text-2xl">info</span>
          <div className="text-left">
            <p className="text-white/80 mb-2">Why filter by transaction count?</p>
            <p className="text-white/50 text-sm">
              Wallets with 2-3 transactions represent typical user behavior. 
              Wallets with 15+ transactions are often bots or traders, not your target audience.
            </p>
          </div>
        </div>
      </div>

      {/* Sample size note */}
      <p className="text-white/40 mt-8 animate-fade-in-up delay-600">
        Scanning <span className="text-violet-400 font-semibold">100 wallets</span> as a representative sample
      </p>
    </div>
  </div>
);

// Stage 3: Transaction Analysis
const TransactionAnalysisStage = () => (
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
          <p className="text-4xl font-bold text-violet-400 mb-2">750</p>
          <p className="text-white/50 text-sm">Transactions Analyzed</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 animate-fade-in-up delay-800">
          <p className="text-4xl font-bold text-violet-400 mb-2">130</p>
          <p className="text-white/50 text-sm">Tokens Found</p>
        </div>
      </div>
    </div>
  </div>
);

// Stage 4: Token Compilation
const TokenCompilationStage = () => (
  <div className="max-w-5xl mx-auto text-center">
    <p className="text-violet-400 text-sm md:text-base mb-4 tracking-widest uppercase animate-fade-in-up">
      Step 5
    </p>
    <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up delay-100">
      Token Overlap Results
    </h2>
    <p className="text-lg text-white/60 mb-12 animate-fade-in-up delay-200">
      Ranked by how many wallets also transact each token
    </p>

    <div className="relative animate-fade-in-scale delay-300">
      {/* Token Network Visualization */}
      <div className="relative h-64 md:h-80 max-w-3xl mx-auto mb-8">
        {/* Central Node */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-violet-600 border-2 border-white flex items-center justify-center">
            <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png" alt="SHIB" className="w-10 h-10 md:w-12 md:h-12 rounded-full" />
          </div>
        </div>

        {/* Surrounding Tokens */}
        {overlapResults.slice(0, 8).map((token, i) => {
          const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
          const radius = 35;
          const x = 50 + Math.cos(angle) * radius;
          const y = 50 + Math.sin(angle) * radius;
          const size = token.score > 0.6 ? "w-12 h-12" : token.score > 0.4 ? "w-10 h-10" : "w-8 h-8";
          
          return (
            <div
              key={i}
              className="absolute animate-node-appear"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                animationDelay: `${0.3 + i * 0.1}s`,
                opacity: 0,
              }}
            >
              <div className={`${size} rounded-full bg-white/10 border border-violet-500/50 flex items-center justify-center overflow-hidden`}>
                <img src={token.logo} alt={token.symbol} className="w-full h-full object-cover" />
              </div>
            </div>
          );
        })}

        {/* Connection Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 10 }}>
          {overlapResults.slice(0, 8).map((token, i) => {
            const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
            const radius = 35;
            const x = 50 + Math.cos(angle) * radius;
            const y = 50 + Math.sin(angle) * radius;
            
            return (
              <line
                key={i}
                x1="50%"
                y1="50%"
                x2={`${x}%`}
                y2={`${y}%`}
                stroke={`rgba(139, 92, 246, ${token.score * 0.6})`}
                strokeWidth={token.score > 0.5 ? 2 : 1}
                strokeDasharray="4 4"
                style={{
                  animation: `flowLine 1s ${0.3 + i * 0.1}s ease-out forwards`,
                  strokeDashoffset: 100,
                }}
              />
            );
          })}
        </svg>
      </div>

      <p className="text-white/40 animate-fade-in-up delay-700">
        <span className="text-violet-400 font-semibold">130</span> overlapping tokens discovered
      </p>
    </div>
  </div>
);

// Stage 5: Data Enrichment
const DataEnrichmentStage = () => (
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
      {[
        { icon: "tag", title: "X (Twitter)", count: "89", desc: "Handles found" },
        { icon: "send", title: "Telegram", count: "67", desc: "Channels found" },
        { icon: "forum", title: "Reddit", count: "43", desc: "Communities found" },
      ].map((platform, i) => (
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
      Get the insights you need to build winning Web3 marketing strategies, 
      starting from just <span className="text-violet-400 font-semibold">$199/month</span>
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
