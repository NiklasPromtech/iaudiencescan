import { useState, useEffect, useRef } from "react";
import logoWhite from "@/assets/audiencescan-logo-white.png";

interface Token {
  name: string;
  symbol: string;
  logo: string;
}

const tokens: Token[] = [
  { name: "Dogecoin", symbol: "DOGE", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/74.png" },
  { name: "Shiba Inu", symbol: "SHIB", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png" },
  { name: "Pepe", symbol: "PEPE", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/24478.png" },
];

const Creation = () => {
  const [stage, setStage] = useState(0);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-advance through stages
  useEffect(() => {
    if (stage === 0) return; // Wait for token selection
    if (stage >= 6) return; // Final stage

    const timer = setTimeout(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setStage((prev) => prev + 1);
        setIsAnimating(false);
      }, 500);
    }, 4000);

    return () => clearTimeout(timer);
  }, [stage]);

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
    setIsAnimating(true);
    setTimeout(() => {
      setStage(1);
      setIsAnimating(false);
    }, 500);
  };

  const resetDemo = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setStage(0);
      setSelectedToken(null);
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
        {[0, 1, 2, 3, 4, 5, 6].map((s) => (
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
        {stage === 0 && <TokenSelectionStage tokens={tokens} onSelect={handleTokenSelect} />}
        {stage === 1 && selectedToken && <WalletExtractionStage token={selectedToken} />}
        {stage === 2 && selectedToken && <WalletAnalysisStage token={selectedToken} />}
        {stage === 3 && <TokenCompilationStage />}
        {stage === 4 && <DataEnrichmentStage />}
        {stage === 5 && <FinalDatasetStage />}
        {stage === 6 && <ValuePropositionStage onReset={resetDemo} />}
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
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in-scale { animation: fadeInScale 0.8s ease-out forwards; }
        .animate-pulse-slow { animation: pulse 3s ease-in-out infinite; }
        .animate-node-appear { animation: nodeAppear 0.6s ease-out forwards; }
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
      {/* Connection lines */}
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
      {/* Nodes */}
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

// Stage 0: Token Selection
const TokenSelectionStage = ({
  tokens,
  onSelect,
}: {
  tokens: Token[];
  onSelect: (token: Token) => void;
}) => (
  <div className="max-w-4xl mx-auto text-center">
    <p className="text-violet-400 text-sm md:text-base mb-4 tracking-widest uppercase animate-fade-in-up">
      Step 1
    </p>
    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in-up delay-100">
      Select a Token to Analyze
    </h1>
    <p className="text-lg md:text-xl text-white/60 mb-12 animate-fade-in-up delay-200">
      Choose from meme tokens to see how AudienceScan works
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
      {tokens.map((token, i) => (
        <button
          key={token.symbol}
          onClick={() => onSelect(token)}
          className={`group relative bg-white/5 border border-white/10 hover:border-violet-500/50 rounded-2xl p-8 transition-all duration-300 hover:bg-violet-500/10 animate-fade-in-up`}
          style={{ animationDelay: `${0.3 + i * 0.1}s`, opacity: 0 }}
        >
          <div className="absolute inset-0 bg-violet-500/0 group-hover:bg-violet-500/10 rounded-2xl transition-colors" />
          <img
            src={token.logo}
            alt={token.name}
            className="w-16 h-16 mx-auto mb-4 rounded-full"
          />
          <h3 className="text-xl font-bold mb-1">{token.name}</h3>
          <p className="text-white/50">${token.symbol}</p>
        </button>
      ))}
    </div>
  </div>
);

// Stage 1: Wallet Extraction
const WalletExtractionStage = ({ token }: { token: Token }) => (
  <div className="max-w-5xl mx-auto text-center">
    <p className="text-violet-400 text-sm md:text-base mb-4 tracking-widest uppercase animate-fade-in-up">
      Step 2
    </p>
    <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up delay-100">
      Extracting Verified Wallets
    </h2>
    <p className="text-lg text-white/60 mb-12 animate-fade-in-up delay-200">
      Scanning the ${token.symbol} contract for human-verified wallet transactions
    </p>

    <div className="relative max-w-3xl mx-auto animate-fade-in-scale delay-300">
      {/* Central Token */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-violet-500/20 border-2 border-violet-500 flex items-center justify-center mb-6 animate-pulse-slow">
          <img src={token.logo} alt={token.name} className="w-16 h-16 md:w-20 md:h-20 rounded-full" />
        </div>
        
        {/* Scanning Lines */}
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

      {/* Extracted Wallets */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-12">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-lg p-3 animate-fade-in-up"
            style={{ animationDelay: `${0.5 + i * 0.1}s`, opacity: 0 }}
          >
            <span className="material-icons-outlined text-violet-400 text-lg">account_balance_wallet</span>
            <p className="text-xs text-white/40 mt-1 font-mono">0x...{(Math.random() * 9999).toFixed(0).padStart(4, "0")}</p>
          </div>
        ))}
      </div>

      <p className="text-white/40 mt-8 animate-fade-in-up delay-800">
        <span className="text-violet-400 font-semibold">2,847</span> verified wallets found
      </p>
    </div>
  </div>
);

// Stage 2: Wallet Analysis
const WalletAnalysisStage = ({ token }: { token: Token }) => (
  <div className="max-w-5xl mx-auto text-center">
    <p className="text-violet-400 text-sm md:text-base mb-4 tracking-widest uppercase animate-fade-in-up">
      Step 3
    </p>
    <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up delay-100">
      Analyzing Wallet Activity
    </h2>
    <p className="text-lg text-white/60 mb-12 animate-fade-in-up delay-200">
      Examining each wallet's token transactions and volume
    </p>

    <div className="relative animate-fade-in-scale delay-300">
      {/* Wallet Grid with Activity */}
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
                    <span className="text-white/50">${Math.floor(Math.random() * 10000)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-white/40 mt-8 animate-fade-in-up delay-700">
        <span className="text-violet-400 font-semibold">47,293</span> transactions analyzed
      </p>
    </div>
  </div>
);

// Stage 3: Token Compilation
const TokenCompilationStage = () => (
  <div className="max-w-5xl mx-auto text-center">
    <p className="text-violet-400 text-sm md:text-base mb-4 tracking-widest uppercase animate-fade-in-up">
      Step 4
    </p>
    <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up delay-100">
      Compiling Token Overlaps
    </h2>
    <p className="text-lg text-white/60 mb-12 animate-fade-in-up delay-200">
      Identifying which tokens your audience also transacts
    </p>

    <div className="relative animate-fade-in-scale delay-300">
      {/* Token Network Visualization */}
      <div className="relative h-80 md:h-96">
        {/* Central Node */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-20 h-20 rounded-full bg-violet-600 border-2 border-white flex items-center justify-center">
            <span className="material-icons-outlined text-white text-3xl">hub</span>
          </div>
        </div>

        {/* Surrounding Tokens */}
        {[
          { x: 20, y: 20, size: "lg", label: "Arbitrum" },
          { x: 75, y: 15, size: "md", label: "Optimism" },
          { x: 85, y: 60, size: "lg", label: "Base" },
          { x: 70, y: 85, size: "sm", label: "Polygon" },
          { x: 25, y: 80, size: "md", label: "Avalanche" },
          { x: 10, y: 50, size: "sm", label: "Solana" },
        ].map((token, i) => (
          <div
            key={i}
            className="absolute animate-node-appear"
            style={{
              left: `${token.x}%`,
              top: `${token.y}%`,
              animationDelay: `${0.5 + i * 0.15}s`,
              opacity: 0,
            }}
          >
            {/* Connection Line */}
            <svg className="absolute inset-0 w-full h-full" style={{ left: 0, top: 0, overflow: "visible" }}>
              <line
                x1="0"
                y1="0"
                x2={`${50 - token.x}%`}
                y2={`${50 - token.y}%`}
                stroke="rgba(139, 92, 246, 0.4)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            </svg>
            
            <div
              className={`rounded-full bg-white/10 border border-violet-500/50 flex items-center justify-center ${
                token.size === "lg" ? "w-16 h-16" : token.size === "md" ? "w-12 h-12" : "w-10 h-10"
              }`}
            >
              <span className="text-white/80 text-xs font-medium">{token.label.slice(0, 3)}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-white/40 mt-4 animate-fade-in-up delay-800">
        <span className="text-violet-400 font-semibold">127</span> overlapping tokens discovered
      </p>
    </div>
  </div>
);

// Stage 4: Data Enrichment
const DataEnrichmentStage = () => (
  <div className="max-w-5xl mx-auto text-center">
    <p className="text-violet-400 text-sm md:text-base mb-4 tracking-widest uppercase animate-fade-in-up">
      Step 5
    </p>
    <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up delay-100">
      Enriching with Social Data
    </h2>
    <p className="text-lg text-white/60 mb-12 animate-fade-in-up delay-200">
      Adding social handles, platform tags, and community info
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {[
        { icon: "tag", title: "X (Twitter)", count: "12,847", desc: "Social handles matched" },
        { icon: "send", title: "Telegram", count: "8,293", desc: "Community channels found" },
        { icon: "forum", title: "Discord", count: "5,412", desc: "Server memberships" },
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

// Stage 5: Final Dataset
const FinalDatasetStage = () => (
  <div className="max-w-5xl mx-auto text-center">
    <p className="text-violet-400 text-sm md:text-base mb-4 tracking-widest uppercase animate-fade-in-up">
      Step 6
    </p>
    <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up delay-100">
      Your Actionable Dataset
    </h2>
    <p className="text-lg text-white/60 mb-12 animate-fade-in-up delay-200">
      Ready for strategy, paid ads, and KOL outreach
    </p>

    <div className="relative animate-fade-in-scale delay-300">
      {/* Dataset Preview Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden max-w-4xl mx-auto">
        <div className="grid grid-cols-4 gap-4 p-4 bg-violet-500/20 border-b border-white/10 text-sm font-medium">
          <span>Community</span>
          <span>Platform</span>
          <span>Overlap %</span>
          <span>Volume</span>
        </div>
        {[
          { community: "Arbitrum DAO", platform: "Telegram", overlap: "34%", volume: "$2.4M" },
          { community: "Base Builders", platform: "Discord", overlap: "28%", volume: "$1.8M" },
          { community: "DeFi Alpha", platform: "X", overlap: "22%", volume: "$1.2M" },
          { community: "NFT Collectors", platform: "Telegram", overlap: "18%", volume: "$890K" },
        ].map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-4 gap-4 p-4 border-b border-white/5 text-sm animate-fade-in-up"
            style={{ animationDelay: `${0.4 + i * 0.1}s`, opacity: 0 }}
          >
            <span className="text-white/80">{row.community}</span>
            <span className="text-white/60">{row.platform}</span>
            <span className="text-violet-400 font-medium">{row.overlap}</span>
            <span className="text-white/60">{row.volume}</span>
          </div>
        ))}
      </div>

      {/* Export Options */}
      <div className="flex flex-wrap justify-center gap-4 mt-8">
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

// Stage 6: Value Proposition
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
