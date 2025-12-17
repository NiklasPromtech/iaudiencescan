import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const categories = ['Meme', 'AI Agents', 'DeFi', 'Gaming', 'RWA', 'NFT', 'Layer 2', 'Privacy', 'Oracle', 'DEX', 'Lending', 'Staking', 'Bridge', 'DAO', 'Metaverse', 'Storage', 'Identity', 'Insurance', 'Derivatives', 'Yield'];

const tokens = [
  { ticker: 'PEPE', logo: 'https://cryptologos.cc/logos/pepe-pepe-logo.png' },
  { ticker: 'SHIB', logo: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png' },
  { ticker: 'DOGE', logo: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png' },
  { ticker: 'BONK', logo: 'https://cryptologos.cc/logos/bonk-bonk-logo.png' },
  { ticker: 'WIF', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28752.png' },
  { ticker: 'FLOKI', logo: 'https://cryptologos.cc/logos/floki-inu-floki-logo.png' },
  { ticker: 'BABYDOGE', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/10407.png' },
  { ticker: 'ELON', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/9436.png' },
];

type Stage = 'categories' | 'tokens' | 'wallets' | 'locked';

const NoNiche = () => {
  const [stage, setStage] = useState<Stage>('categories');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const sequence = [
      { delay: 2000, next: 'tokens' as Stage },
      { delay: 4500, next: 'wallets' as Stage },
      { delay: 7000, next: 'locked' as Stage },
    ];

    const timeouts = sequence.map(({ delay, next }) =>
      setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setStage(next);
          setIsTransitioning(false);
        }, 400);
      }, delay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, []);

  // Generate random positions for elements
  const generatePositions = (count: number, seed: number) => {
    const positions: { x: number; y: number; scale: number }[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + seed;
      const radius = 20 + (((i * 7 + seed * 3) % 60));
      const x = 50 + Math.cos(angle) * radius * (0.8 + (i % 3) * 0.2);
      const y = 50 + Math.sin(angle) * radius * 0.6 * (0.8 + (i % 2) * 0.3);
      const scale = 0.5 + ((i * 13 + seed) % 50) / 100;
      positions.push({ x: Math.max(5, Math.min(95, x)), y: Math.max(10, Math.min(90, y)), scale });
    }
    return positions;
  };

  const categoryPositions = generatePositions(80, 1);
  const tokenPositions = generatePositions(60, 2);
  const walletPositions = generatePositions(200, 3);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
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
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
          No audience is too niche
        </h1>
        
        <p className="text-white/70 text-lg md:text-xl text-center max-w-2xl mb-8">
          From broad categories to specific wallets — zoom into any level of granularity.
        </p>

        {/* Stage indicator */}
        <div className="flex items-center gap-3 mb-8">
          {['categories', 'tokens', 'wallets', 'locked'].map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                stage === s ? 'bg-purple-500 scale-150' : 
                ['categories', 'tokens', 'wallets', 'locked'].indexOf(stage) > i ? 'bg-purple-500/50' : 'bg-white/20'
              }`} />
              {i < 3 && <div className={`w-8 h-px transition-all duration-500 ${
                ['categories', 'tokens', 'wallets', 'locked'].indexOf(stage) > i ? 'bg-purple-500/50' : 'bg-white/10'
              }`} />}
            </div>
          ))}
        </div>

        {/* Current stage label */}
        <div className="text-sm text-white/50 mb-6 h-6">
          {stage === 'categories' && '100+ Categories'}
          {stage === 'tokens' && '200+ Tokens in "Meme"'}
          {stage === 'wallets' && '10,000+ Wallets'}
          {stage === 'locked' && 'Your Target Audience'}
        </div>

        {/* Zoom container */}
        <div className={`relative w-full max-w-4xl h-[400px] md:h-[500px] rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden transition-all duration-500 ${isTransitioning ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>
          
          {/* Categories stage */}
          {stage === 'categories' && (
            <div className="absolute inset-0">
              {categoryPositions.map((pos, i) => (
                <div
                  key={i}
                  className={`absolute px-2 py-1 rounded-full text-[10px] md:text-xs whitespace-nowrap transition-all duration-700 ${
                    i === 0 ? 'bg-purple-500/30 border border-purple-500/50 text-white ring-2 ring-purple-500/30 animate-pulse' : 'bg-white/5 border border-white/10 text-white/40'
                  }`}
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: `translate(-50%, -50%) scale(${pos.scale})`,
                    animationDelay: `${i * 20}ms`,
                  }}
                >
                  {categories[i % categories.length]}
                </div>
              ))}
              {/* Zoom indicator on Meme */}
              <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-purple-500/50 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
            </div>
          )}

          {/* Tokens stage */}
          {stage === 'tokens' && (
            <div className="absolute inset-0">
              {tokenPositions.map((pos, i) => {
                const token = tokens[i % tokens.length];
                const isHighlighted = i < 8;
                return (
                  <div
                    key={i}
                    className={`absolute flex items-center gap-1 px-2 py-1 rounded-full text-[10px] md:text-xs whitespace-nowrap transition-all duration-500 ${
                      isHighlighted ? 'bg-purple-500/20 border border-purple-500/40 text-white' : 'bg-white/5 border border-white/10 text-white/30'
                    }`}
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: `translate(-50%, -50%) scale(${pos.scale})`,
                    }}
                  >
                    <img 
                      src={token.logo} 
                      alt={token.ticker}
                      className="w-3 h-3 md:w-4 md:h-4 rounded-full"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <span>${token.ticker}</span>
                  </div>
                );
              })}
              {/* Zoom indicator */}
              <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-purple-500/50 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
            </div>
          )}

          {/* Wallets stage */}
          {stage === 'wallets' && (
            <div className="absolute inset-0">
              {walletPositions.map((pos, i) => {
                // Different sizes based on wallet "value"
                const sizeClass = i % 10 === 0 ? 'w-4 h-4 md:w-6 md:h-6' : 
                                  i % 5 === 0 ? 'w-3 h-3 md:w-4 md:h-4' : 
                                  i % 3 === 0 ? 'w-2 h-2 md:w-3 md:h-3' : 'w-1.5 h-1.5 md:w-2 md:h-2';
                const isTarget = i % 10 === 0; // Large wallets are targets
                return (
                  <div
                    key={i}
                    className={`absolute rounded-full transition-all duration-300 ${
                      isTarget ? 'bg-purple-500 ring-2 ring-purple-500/50' : 'bg-white/20'
                    } ${sizeClass}`}
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                );
              })}
              {/* Size filter indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-2 rounded-full bg-black/50 border border-white/10">
                <span className="text-white/50 text-xs">Filter by size:</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/30" />
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                  <div className="w-4 h-4 rounded-full bg-purple-500 ring-2 ring-purple-500/50" />
                </div>
              </div>
            </div>
          )}

          {/* Locked stage */}
          {stage === 'locked' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Converging wallets animation */}
              <div className="relative w-48 h-48">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-4 md:w-5 md:h-5 rounded-full bg-purple-500"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      animation: `converge-${i % 4} 2s ease-out forwards`,
                      animationDelay: `${i * 50}ms`,
                    }}
                  />
                ))}
                {/* Center glow */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-purple-500/30 blur-xl animate-pulse" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-purple-500/50 blur-md" />
              </div>
              
              <div className="mt-8 text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Locked In
                </div>
                <div className="text-white/50 text-sm">
                  847 high-value wallets ready for research
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes converge-0 {
          0% { transform: translate(calc(-50% - 80px), calc(-50% - 80px)) scale(0.5); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes converge-1 {
          0% { transform: translate(calc(-50% + 80px), calc(-50% - 80px)) scale(0.5); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes converge-2 {
          0% { transform: translate(calc(-50% - 80px), calc(-50% + 80px)) scale(0.5); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes converge-3 {
          0% { transform: translate(calc(-50% + 80px), calc(-50% + 80px)) scale(0.5); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default NoNiche;
