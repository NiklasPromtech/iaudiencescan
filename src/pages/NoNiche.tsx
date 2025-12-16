import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const categories = ['Meme', 'AI Agents', 'DeFi', 'Gaming', 'RWA'];
const tokens = [
  { ticker: 'PEPE', logo: 'https://cryptologos.cc/logos/pepe-pepe-logo.png' },
  { ticker: 'SHIB', logo: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png' },
  { ticker: 'DOGE', logo: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png' },
  { ticker: 'BONK', logo: 'https://cryptologos.cc/logos/bonk-bonk-logo.png' },
  { ticker: 'WIF', logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28752.png' },
];
const wallets = ['0x1a2b...3c4d', '0x5e6f...7g8h', '0x9i0j...1k2l', '0x3m4n...5o6p', '0x7q8r...9s0t'];

const FloatingLabel = ({ 
  children, 
  index, 
  total,
  offsetY = -60 
}: { 
  children: React.ReactNode; 
  index: number; 
  total: number;
  offsetY?: number;
}) => {
  const angle = (index / total) * 360 + 90;
  const radius = 50 + (index % 2) * 20;
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * (radius * 0.4) + offsetY;
  
  return (
    <div
      className="absolute text-xs px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 whitespace-nowrap backdrop-blur-sm"
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
        animation: `float-${index % 5} ${6 + index}s ease-in-out infinite`,
      }}
    >
      {children}
    </div>
  );
};

const FloatingToken = ({ 
  token, 
  index, 
  total,
  offsetY = -60 
}: { 
  token: { ticker: string; logo: string }; 
  index: number; 
  total: number;
  offsetY?: number;
}) => {
  const angle = (index / total) * 360 + 90;
  const radius = 55 + (index % 2) * 15;
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * (radius * 0.4) + offsetY;
  
  return (
    <div
      className="absolute flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 whitespace-nowrap backdrop-blur-sm"
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
        animation: `float-${index % 5} ${6 + index}s ease-in-out infinite`,
      }}
    >
      <img 
        src={token.logo} 
        alt={token.ticker} 
        className="w-4 h-4 rounded-full"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
      ${token.ticker}
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
        
        <p className="text-white/70 text-lg md:text-xl text-center max-w-2xl mb-20">
          From broad categories to specific wallets — define your audience at any level of granularity.
        </p>

        {/* Three boxes with floating elements */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12">
          
          {/* Box 1: Categories */}
          <div className="relative flex flex-col items-center">
            {/* Floating area */}
            <div className="relative h-32 w-48">
              {categories.map((cat, i) => (
                <FloatingLabel key={cat} index={i} total={categories.length}>
                  {cat}
                </FloatingLabel>
              ))}
            </div>
            {/* Box */}
            <div className="w-48 h-20 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
              <span className="text-white/30 text-sm font-medium">Categories</span>
            </div>
          </div>

          {/* Box 2: Tokens */}
          <div className="relative flex flex-col items-center">
            {/* Floating area */}
            <div className="relative h-32 w-48">
              {tokens.map((token, i) => (
                <FloatingToken key={token.ticker} token={token} index={i} total={tokens.length} />
              ))}
            </div>
            {/* Box */}
            <div className="w-48 h-20 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
              <span className="text-white/30 text-sm font-medium">Tokens</span>
            </div>
          </div>

          {/* Box 3: Wallets */}
          <div className="relative flex flex-col items-center">
            {/* Floating area */}
            <div className="relative h-32 w-48">
              {wallets.map((wallet, i) => (
                <FloatingLabel key={wallet} index={i} total={wallets.length}>
                  {wallet}
                </FloatingLabel>
              ))}
            </div>
            {/* Box */}
            <div className="w-48 h-20 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
              <span className="text-white/30 text-sm font-medium">Wallets</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating animations */}
      <style>{`
        @keyframes float-0 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px) translateX(0px); }
          33% { transform: translate(-50%, -50%) translateY(-6px) translateX(3px); }
          66% { transform: translate(-50%, -50%) translateY(2px) translateX(-2px); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translate(-50%, -50%) translateY(-2px) translateX(2px); }
          50% { transform: translate(-50%, -50%) translateY(5px) translateX(-4px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(-50%, -50%) translateX(0px) translateY(3px); }
          50% { transform: translate(-50%, -50%) translateX(5px) translateY(-4px); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(-50%, -50%) translateY(4px) translateX(-2px); }
          50% { transform: translate(-50%, -50%) translateY(-5px) translateX(3px); }
        }
        @keyframes float-4 {
          0%, 100% { transform: translate(-50%, -50%) translateX(-3px) translateY(-2px); }
          50% { transform: translate(-50%, -50%) translateX(4px) translateY(4px); }
        }
      `}</style>
    </div>
  );
};

export default NoNiche;