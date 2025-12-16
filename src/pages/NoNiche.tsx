import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// Sample token data for the animation
const CATEGORIES = ["Meme Coins", "AI Agents", "DeFi", "Gaming", "RWA"];
const TOKENS = [
  { ticker: "DOGE", logo: "https://cryptologos.cc/logos/dogecoin-doge-logo.png" },
  { ticker: "SHIB", logo: "https://cryptologos.cc/logos/shiba-inu-shib-logo.png" },
  { ticker: "PEPE", logo: "https://cryptologos.cc/logos/pepe-pepe-logo.png" },
];
const COMMUNITIES = [
  { ticker: "FLOKI", logo: "https://cryptologos.cc/logos/floki-inu-floki-logo.png" },
  { ticker: "BONK", logo: "https://cryptologos.cc/logos/bonk-bonk-logo.png" },
  { ticker: "WIF", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/28752.png" },
  { ticker: "WOJAK", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/24614.png" },
  { ticker: "TURBO", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/24911.png" },
];

// Option A: Three Panel Static Flow
const OptionA = () => {
  const [visiblePanels, setVisiblePanels] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisiblePanels(1), 300),
      setTimeout(() => setVisiblePanels(2), 800),
      setTimeout(() => setVisiblePanels(3), 1300),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full">
      <h3 className="text-white/50 text-sm mb-4 text-center">Option A: Three-Panel Illustrative Flow</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Panel 1: Category */}
        <div 
          className={`bg-white/[0.03] border border-white/10 rounded-2xl p-6 transition-all duration-700 ${
            visiblePanels >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="text-white/40 text-xs uppercase tracking-wider mb-3">Define Audience</div>
          <div className="space-y-2">
            {CATEGORIES.map((cat, i) => (
              <div 
                key={cat}
                className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                  i === 0 
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                    : 'bg-white/[0.02] text-white/40'
                }`}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2: Token */}
        <div 
          className={`bg-white/[0.03] border border-white/10 rounded-2xl p-6 transition-all duration-700 ${
            visiblePanels >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="text-white/40 text-xs uppercase tracking-wider mb-3">Select Token</div>
          <div className="flex flex-col items-center gap-3">
            {TOKENS.map((token, i) => (
              <div 
                key={token.ticker}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all duration-300 ${
                  i === 0 
                    ? 'bg-purple-500/20 border border-purple-500/30' 
                    : 'bg-white/[0.02]'
                }`}
              >
                <img 
                  src={token.logo} 
                  alt={token.ticker} 
                  className="w-8 h-8 rounded-full"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <span className={i === 0 ? 'text-purple-300' : 'text-white/40'}>{token.ticker}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 3: Communities */}
        <div 
          className={`bg-white/[0.03] border border-white/10 rounded-2xl p-6 transition-all duration-700 ${
            visiblePanels >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="text-white/40 text-xs uppercase tracking-wider mb-3">Overlapping Communities</div>
          <div className="relative h-40 flex items-center justify-center">
            {/* Overlapping token circles */}
            <div className="relative">
              {COMMUNITIES.map((token, i) => (
                <div
                  key={token.ticker}
                  className="absolute w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden"
                  style={{
                    left: `${i * 24}px`,
                    top: `${Math.sin(i * 0.8) * 20}px`,
                    zIndex: COMMUNITIES.length - i,
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  <img 
                    src={token.logo} 
                    alt={token.ticker} 
                    className="w-8 h-8 rounded-full"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="text-center text-white/60 text-sm mt-2">
            5 related communities found
          </div>
        </div>
      </div>
    </div>
  );
};

// Option B: Auto-Play Sequence
const OptionB = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const sequence = [
      setTimeout(() => setStep(1), 500),
      setTimeout(() => setStep(2), 2000),
      setTimeout(() => setStep(3), 3500),
    ];
    return () => sequence.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full">
      <h3 className="text-white/50 text-sm mb-4 text-center">Option B: Single Auto-Play Sequence</h3>
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 min-h-[320px] flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Step indicator */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
          {[1, 2, 3].map((s) => (
            <div 
              key={s}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                step >= s ? 'bg-purple-500' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Category Selection */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${
          step === 1 ? 'opacity-100 scale-100' : step < 1 ? 'opacity-0 scale-95' : 'opacity-0 scale-105'
        }`}>
          <div className="text-white/40 text-xs uppercase tracking-wider mb-4">Select Category</div>
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat, i) => (
              <div 
                key={cat}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-500 ${
                  i === 0 
                    ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50 scale-110' 
                    : 'bg-white/[0.05] text-white/30'
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Token Selection */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${
          step === 2 ? 'opacity-100 scale-100' : step < 2 ? 'opacity-0 scale-95' : 'opacity-0 scale-105'
        }`}>
          <div className="text-white/40 text-xs uppercase tracking-wider mb-4">Select Token</div>
          <div className="flex gap-4">
            {TOKENS.map((token, i) => (
              <div 
                key={token.ticker}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-500 ${
                  i === 0 
                    ? 'bg-purple-500/20 border border-purple-500/40 scale-110' 
                    : 'bg-white/[0.03] opacity-50'
                }`}
              >
                <img 
                  src={token.logo} 
                  alt={token.ticker} 
                  className="w-12 h-12 rounded-full"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <span className={`text-sm ${i === 0 ? 'text-purple-300' : 'text-white/40'}`}>
                  {token.ticker}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3: Community Results */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${
          step === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <div className="text-white/40 text-xs uppercase tracking-wider mb-4">Overlapping Communities</div>
          
          {/* Central selected token */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-purple-500/30 border-2 border-purple-500/50 flex items-center justify-center z-10 relative">
              <img 
                src={TOKENS[0].logo} 
                alt={TOKENS[0].ticker} 
                className="w-10 h-10 rounded-full"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            
            {/* Orbiting community tokens */}
            {COMMUNITIES.map((token, i) => {
              const angle = (i / COMMUNITIES.length) * Math.PI * 2 - Math.PI / 2;
              const radius = 70;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <div
                  key={token.ticker}
                  className="absolute w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center"
                  style={{
                    left: `calc(50% + ${x}px - 20px)`,
                    top: `calc(50% + ${y}px - 20px)`,
                    opacity: step === 3 ? 1 : 0,
                    transform: step === 3 ? 'scale(1)' : 'scale(0)',
                    transition: `all 0.5s ease-out ${i * 0.1}s`,
                  }}
                >
                  <img 
                    src={token.logo} 
                    alt={token.ticker} 
                    className="w-6 h-6 rounded-full"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              );
            })}
            
            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ width: '200px', height: '200px', left: '-68px', top: '-68px' }}>
              {COMMUNITIES.map((_, i) => {
                const angle = (i / COMMUNITIES.length) * Math.PI * 2 - Math.PI / 2;
                const radius = 70;
                const x = Math.cos(angle) * radius + 100;
                const y = Math.sin(angle) * radius + 100;
                
                return (
                  <line
                    key={i}
                    x1="100"
                    y1="100"
                    x2={x}
                    y2={y}
                    stroke="rgba(168, 85, 247, 0.3)"
                    strokeWidth="1"
                    style={{
                      opacity: step === 3 ? 1 : 0,
                      transition: `opacity 0.5s ease-out ${i * 0.1}s`,
                    }}
                  />
                );
              })}
            </svg>
          </div>
          
          <div className="mt-8 text-center">
            <div className="text-purple-300 font-medium">5 overlapping communities</div>
            <div className="text-white/40 text-sm">Found from DOGE holder behavior</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NoNiche = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back link */}
      <div className="fixed top-6 left-6 z-50">
        <Link 
          to="/wizard/v2" 
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Wizard</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-24">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
          No audience is too niche
        </h1>
        
        <p className="text-white/70 text-lg md:text-xl text-center max-w-2xl mb-16">
          Need to know about meme coin fans? Or the competitors in a specific token category? Get the granularity of insight you need to understand every web3 audience under the sun.
        </p>

        {/* Option A */}
        <div className="w-full max-w-4xl mb-16">
          <OptionA />
        </div>

        {/* Divider */}
        <div className="w-full max-w-4xl border-t border-white/10 my-8" />

        {/* Option B */}
        <div className="w-full max-w-4xl">
          <OptionB />
        </div>
      </div>
    </div>
  );
};

export default NoNiche;
