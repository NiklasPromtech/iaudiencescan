import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

const categories = [
  'Meme', 'DeFi', 'Gaming', 'NFT', 'Layer2', 'DAO', 'Metaverse', 'Social', 'Privacy', 'Oracle',
  'DEX', 'Lending', 'Yield', 'Bridge', 'Staking', 'Governance', 'Identity', 'Storage', 'Compute', 'RWA',
  'AI Agents', 'Perpetuals', 'Options', 'Insurance', 'Prediction', 'Music', 'Sports', 'Art', 'Collectibles', 'Utility',
  'Infrastructure', 'Interop', 'Scaling', 'Security', 'Analytics', 'Data', 'Index', 'Derivatives', 'Synthetics', 'Stablecoins',
  'Cross-chain', 'Rollups', 'Sidechains', 'Validators', 'Nodes', 'Mining', 'Liquid Staking', 'Restaking', 'Points', 'Airdrops',
  'Launchpads', 'IDO', 'IEO', 'Fair Launch', 'Bonding', 'Vesting', 'Lockups', 'Emissions', 'Tokenomics', 'Burn',
  'Treasury', 'Grants', 'Ecosystem', 'Partnerships', 'Integrations', 'SDK', 'API', 'Wallets', 'Custody', 'MPC',
  'Multisig', 'Hardware', 'Mobile', 'Browser', 'Extension', 'Embedded', 'Smart', 'Exchange', 'CEX', 'Orderbook',
  'AMM', 'Aggregator', 'Router', 'Solver', 'Intent', 'RFQ', 'OTC', 'Social Fi', 'Fan Tokens', 'Creator',
  'Membership', 'Subscription', 'Tipping', 'Patronage', 'Royalties', 'Splits', 'Streaming', 'L1', 'Modular', 'Appchain'
];

const tokenColors = [
  '#F7931A', '#627EEA', '#00D395', '#8247E5', '#E84142', '#2775CA', '#26A17B', '#F0B90B',
  '#E6007A', '#00ADEF', '#FF007A', '#1A1A1A', '#6B8CEF', '#FF6B35', '#00D9FF', '#9945FF',
  '#14F195', '#DC1FFF', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6B6B', '#C9B037', '#845EC2',
  '#FF9671', '#FFC75F', '#F9F871', '#00C9A7', '#4FFBDF', '#B5DEFF', '#CAB8FF', '#FFEAA7'
];

type Stage = 'categories' | 'zoom-category' | 'tokens' | 'zoom-token' | 'wallets' | 'fade-wallets' | 'locked';

const TARGET_CATEGORY = 'AI Agents';
const TARGET_TOKEN_INDEX = 12; // Purple token

const NoNiche = () => {
  const [stage, setStage] = useState<Stage>('categories');

  // Generate rows for categories
  const categoryRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < 10; i++) {
      const words = [];
      for (let j = 0; j < 40; j++) {
        words.push(categories[(i * 20 + j) % categories.length]);
      }
      rows.push({ words, direction: i % 2 === 0 ? 'left' : 'right' });
    }
    return rows;
  }, []);

  // Generate rows for tokens
  const tokenRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < 10; i++) {
      const tokens = [];
      for (let j = 0; j < 40; j++) {
        tokens.push({ color: tokenColors[(i * 20 + j) % tokenColors.length], id: `${i}-${j}` });
      }
      rows.push({ tokens, direction: i % 2 === 0 ? 'left' : 'right' });
    }
    return rows;
  }, []);

  // Generate wallet icons
  const walletRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < 25; i++) {
      const wallets = [];
      for (let j = 0; j < 80; j++) {
        wallets.push({ id: `${i}-${j}`, keep: Math.random() > 0.92 });
      }
      rows.push({ wallets, direction: i % 2 === 0 ? 'left' : 'right' });
    }
    return rows;
  }, []);

  const keptWallets = useMemo(() => 
    walletRows.flatMap(r => r.wallets.filter(w => w.keep)).slice(0, 40),
    [walletRows]
  );

  useEffect(() => {
    const timings: Record<Stage, { duration: number; next: Stage }> = {
      'categories': { duration: 3000, next: 'zoom-category' },
      'zoom-category': { duration: 1500, next: 'tokens' },
      'tokens': { duration: 3000, next: 'zoom-token' },
      'zoom-token': { duration: 1500, next: 'wallets' },
      'wallets': { duration: 2500, next: 'fade-wallets' },
      'fade-wallets': { duration: 1500, next: 'locked' },
      'locked': { duration: 4000, next: 'categories' },
    };

    const { duration, next } = timings[stage];
    const timer = setTimeout(() => setStage(next), duration);
    return () => clearTimeout(timer);
  }, [stage]);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      
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

      {/* Main animation container */}
      <div className="relative w-full h-screen overflow-hidden">
        
        {/* Categories Stage */}
        {stage === 'categories' && (
          <div className="absolute inset-0 flex flex-col justify-center">
            {categoryRows.map((row, rowIndex) => (
              <div 
                key={rowIndex}
                className="flex whitespace-nowrap py-1.5"
                style={{
                  animation: `slide-${row.direction} 40s linear infinite`,
                }}
              >
                {row.words.map((word, wordIndex) => (
                  <span 
                    key={wordIndex}
                    className={`px-3 py-1.5 mx-1 text-sm font-medium rounded-full transition-all ${
                      word === TARGET_CATEGORY 
                        ? 'text-purple-300 bg-purple-500/30 border border-purple-500/50 animate-pulse' 
                        : 'text-white/40'
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Zoom into Category - Card expands to fill screen */}
        {stage === 'zoom-category' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="flex items-center justify-center text-purple-300 bg-purple-500/30 border border-purple-500/50 rounded-2xl font-medium"
              style={{
                animation: 'expand-card 1.5s ease-in forwards',
              }}
            >
              <span className="text-4xl md:text-6xl font-bold text-white/90">{TARGET_CATEGORY}</span>
            </div>
          </div>
        )}

        {/* Tokens Stage */}
        {stage === 'tokens' && (
          <div className="absolute inset-0 flex flex-col justify-center">
            {tokenRows.map((row, rowIndex) => (
              <div 
                key={rowIndex}
                className="flex whitespace-nowrap py-2"
                style={{
                  animation: `slide-${row.direction} 35s linear infinite`,
                }}
              >
                {row.tokens.map((token, tokenIndex) => {
                  const isTarget = rowIndex === 5 && tokenIndex === TARGET_TOKEN_INDEX;
                  return (
                    <div 
                      key={token.id}
                      className={`w-10 h-10 mx-1.5 rounded-full flex-shrink-0 ${isTarget ? 'animate-pulse ring-2 ring-white/50' : ''}`}
                      style={{ 
                        background: `linear-gradient(135deg, ${token.color}, ${token.color}88)`,
                        boxShadow: isTarget ? `0 0 20px ${token.color}` : `0 0 12px ${token.color}50`
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Zoom into Token - Circle expands to fill screen */}
        {stage === 'zoom-token' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="rounded-full"
              style={{
                background: `linear-gradient(135deg, ${tokenColors[TARGET_TOKEN_INDEX]}, ${tokenColors[TARGET_TOKEN_INDEX]}88)`,
                animation: 'expand-circle 1.5s ease-in forwards',
              }}
            />
          </div>
        )}

        {/* Wallets Stage */}
        {(stage === 'wallets' || stage === 'fade-wallets') && (
          <div className="absolute inset-0 flex flex-col justify-center overflow-hidden">
            <div className="flex flex-col gap-1">
              {walletRows.map((row, rowIndex) => (
                <div 
                  key={rowIndex}
                  className="flex whitespace-nowrap transition-opacity duration-1000"
                  style={{
                    animation: `slide-${row.direction} 60s linear infinite`,
                    opacity: stage === 'fade-wallets' ? 0.1 : 1,
                  }}
                >
                  {row.wallets.map((wallet) => (
                    <span 
                      key={wallet.id}
                      className={`material-icons-outlined mx-0.5 flex-shrink-0 transition-all duration-1000 ${
                        wallet.keep && stage === 'fade-wallets'
                          ? 'text-purple-400 opacity-100 scale-125' 
                          : wallet.keep 
                            ? 'text-purple-400' 
                            : stage === 'fade-wallets' 
                              ? 'text-white/5' 
                              : 'text-white/30'
                      }`}
                      style={{ fontSize: '20px' }}
                    >
                      account_balance_wallet
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked Stage */}
        {stage === 'locked' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Single row of kept wallets */}
            <div className="flex flex-wrap justify-center gap-4 max-w-3xl px-8 mb-8">
              {keptWallets.map((wallet, index) => (
                <span 
                  key={wallet.id}
                  className="material-icons-outlined text-purple-400 animate-fade-in"
                  style={{ 
                    fontSize: '28px',
                    animationDelay: `${index * 40}ms`,
                    filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))'
                  }}
                >
                  account_balance_wallet
                </span>
              ))}
            </div>
            
            <div className="text-center animate-fade-in" style={{ animationDelay: '800ms' }}>
              <p className="text-white/50 text-sm tracking-widest uppercase mb-2">
                {keptWallets.length * 21} wallets locked in
              </p>
              <p className="text-white text-2xl font-medium">
                Ready for research
              </p>
            </div>
          </div>
        )}

        {/* Stage indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
          {['categories', 'tokens', 'wallets', 'locked'].map((s) => {
            const isActive = 
              (s === 'categories' && (stage === 'categories' || stage === 'zoom-category')) ||
              (s === 'tokens' && (stage === 'tokens' || stage === 'zoom-token')) ||
              (s === 'wallets' && (stage === 'wallets' || stage === 'fade-wallets')) ||
              (s === 'locked' && stage === 'locked');
            
            return (
              <div 
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive ? 'bg-purple-500 w-8' : 'bg-white/20 w-2'
                }`}
              />
            );
          })}
        </div>

        {/* Stage label */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/40 text-sm">
          {(stage === 'categories' || stage === 'zoom-category') && '100 Categories'}
          {(stage === 'tokens' || stage === 'zoom-token') && '200 Tokens'}
          {(stage === 'wallets' || stage === 'fade-wallets') && '10,000+ Wallets'}
          {stage === 'locked' && 'Target Audience'}
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes slide-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes slide-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes expand-card {
          0% { 
            width: 120px; 
            height: 40px; 
            font-size: 14px;
            border-radius: 9999px;
          }
          100% { 
            width: 200vw; 
            height: 200vh; 
            font-size: 0px;
            border-radius: 0;
            background: rgba(168, 85, 247, 0.1);
          }
        }
        @keyframes expand-circle {
          0% { 
            width: 40px; 
            height: 40px; 
          }
          100% { 
            width: 300vw; 
            height: 300vw; 
          }
        }
        .material-icons-outlined {
          font-family: 'Material Icons Outlined';
          font-weight: normal;
          font-style: normal;
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

export default NoNiche;
