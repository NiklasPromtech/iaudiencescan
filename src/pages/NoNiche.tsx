import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";

// Data
const categories = [
  'Meme', 'DeFi', 'Gaming', 'NFT', 'Layer2', 'DAO', 'Metaverse', 'Social', 'Privacy', 'Oracle',
  'DEX', 'Lending', 'Yield', 'Bridge', 'Staking', 'Governance', 'Identity', 'Storage', 'Compute', 'RWA',
  'AI Agents', 'Perpetuals', 'Options', 'Insurance', 'Prediction', 'Music', 'Sports', 'Art', 'Collectibles', 'Utility',
  'Infrastructure', 'Interop', 'Scaling', 'Security', 'Analytics', 'Data', 'Index', 'Derivatives', 'Synthetics', 'Stablecoins',
  'Cross-chain', 'Rollups', 'Sidechains', 'Validators', 'Nodes', 'Mining', 'Liquid Staking', 'Restaking', 'Points', 'Airdrops',
  'Launchpads', 'IDO', 'IEO', 'Fair Launch', 'Bonding', 'Vesting', 'Lockups', 'Emissions', 'Tokenomics', 'Burn',
  'Treasury', 'Grants', 'Ecosystem', 'Partnerships', 'Integrations', 'SDK', 'API', 'Wallets', 'Custody', 'MPC',
  'Multisig', 'Hardware', 'Mobile', 'Browser', 'Extension', 'Embedded', 'Smart', 'Exchange', 'CEX', 'Orderbook',
  'AMM', 'Aggregator', 'Router', 'Solver', 'Intent', 'RFQ', 'OTC', 'Social Fi', 'Fan Tokens', 'Creator'
];

const tokenColors = [
  '#F7931A', '#627EEA', '#00D395', '#8247E5', '#E84142', '#2775CA', '#26A17B', '#F0B90B',
  '#E6007A', '#00ADEF', '#FF007A', '#2D2D2D', '#6B8CEF', '#FF6B35', '#00D9FF', '#9945FF',
  '#14F195', '#DC1FFF', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6B6B', '#C9B037', '#845EC2'
];

const TARGET_CATEGORY = 'AI Agents';

type Phase = 
  | 'categories-scroll'    // Viewing scrolling categories
  | 'categories-zoom'      // Zooming through categories into tokens
  | 'tokens-scroll'        // Viewing scrolling tokens
  | 'tokens-zoom'          // Zooming through tokens into wallets
  | 'wallets-scroll'       // Viewing scrolling wallets
  | 'wallets-filter'       // Non-target wallets fading
  | 'locked';              // Final state

const NoNiche = () => {
  const [phase, setPhase] = useState<Phase>('categories-scroll');
  const [isRestarting, setIsRestarting] = useState(false);

  // Generate category rows - place AI Agents strategically in center row
  const categoryRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < 10; i++) {
      const words: string[] = [];
      for (let j = 0; j < 50; j++) {
        // Put "AI Agents" in the center of row 5 (index 4)
        if (i === 4 && j === 24) {
          words.push(TARGET_CATEGORY);
        } else if (i === 4 && j === 49) {
          // Duplicate for seamless loop
          words.push(TARGET_CATEGORY);
        } else {
          words.push(categories[(i * 10 + j) % categories.length]);
        }
      }
      rows.push({ words, direction: i % 2 === 0 ? 'left' : 'right' });
    }
    return rows;
  }, []);

  // Generate token rows
  const tokenRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < 10; i++) {
      const tokens = [];
      for (let j = 0; j < 40; j++) {
        tokens.push({
          color: tokenColors[(i * 7 + j * 3) % tokenColors.length],
          isTarget: i === 4 && (j === 19 || j === 39) // Center of middle row
        });
      }
      rows.push({ tokens, direction: i % 2 === 0 ? 'left' : 'right' });
    }
    return rows;
  }, []);

  // Generate wallet rows with random "keep" flags
  const walletRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < 20; i++) {
      const wallets = [];
      for (let j = 0; j < 60; j++) {
        wallets.push({ 
          id: `${i}-${j}`, 
          keep: Math.random() > 0.92 
        });
      }
      rows.push({ wallets, direction: i % 2 === 0 ? 'left' : 'right' });
    }
    return rows;
  }, []);

  const keptWalletCount = useMemo(() => 
    walletRows.reduce((acc, row) => acc + row.wallets.filter(w => w.keep).length, 0),
    [walletRows]
  );

  // Phase progression
  useEffect(() => {
    if (isRestarting) return;

    const timings: Record<Phase, number> = {
      'categories-scroll': 3500,
      'categories-zoom': 2000,
      'tokens-scroll': 3000,
      'tokens-zoom': 2000,
      'wallets-scroll': 2500,
      'wallets-filter': 2000,
      'locked': 4000,
    };

    const nextPhase: Record<Phase, Phase> = {
      'categories-scroll': 'categories-zoom',
      'categories-zoom': 'tokens-scroll',
      'tokens-scroll': 'tokens-zoom',
      'tokens-zoom': 'wallets-scroll',
      'wallets-scroll': 'wallets-filter',
      'wallets-filter': 'locked',
      'locked': 'categories-scroll',
    };

    const timer = setTimeout(() => {
      if (phase === 'locked') {
        // Restart sequence
        setIsRestarting(true);
        setTimeout(() => {
          setPhase('categories-scroll');
          setIsRestarting(false);
        }, 500);
      } else {
        setPhase(nextPhase[phase]);
      }
    }, timings[phase]);

    return () => clearTimeout(timer);
  }, [phase, isRestarting]);

  // Determine layer visibility and animation states
  const showCategories = phase === 'categories-scroll' || phase === 'categories-zoom';
  const showTokens = phase === 'categories-zoom' || phase === 'tokens-scroll' || phase === 'tokens-zoom';
  const showWallets = phase === 'tokens-zoom' || phase === 'wallets-scroll' || phase === 'wallets-filter' || phase === 'locked';

  const categoriesZooming = phase === 'categories-zoom';
  const tokensZooming = phase === 'tokens-zoom';
  const walletsFiltering = phase === 'wallets-filter';
  const isLocked = phase === 'locked';

  return (
    <div className={`min-h-screen bg-black text-white overflow-hidden transition-opacity duration-500 ${isRestarting ? 'opacity-0' : 'opacity-100'}`}>
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

      {/* Main container - all layers stacked */}
      <div className="relative w-full h-screen">
        
        {/* ===== CATEGORIES LAYER ===== */}
        <div 
          className={`absolute inset-0 flex flex-col justify-center will-change-transform transition-opacity duration-500 ${
            showCategories ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } ${categoriesZooming ? 'animate-zoom-through' : ''}`}
          style={{
            transformOrigin: '50% 50%',
            zIndex: showCategories ? 30 : 0,
          }}
        >
          {categoryRows.map((row, rowIndex) => {
            // Rows closer to center (row 4-5) should have parallax during zoom
            const distanceFromCenter = Math.abs(rowIndex - 4.5);
            const parallaxDelay = distanceFromCenter * 0.05;
            
            return (
              <div 
                key={rowIndex}
                className="flex whitespace-nowrap py-1.5"
                style={{
                  animation: `slide-${row.direction} 50s linear infinite`,
                  animationDelay: `-${rowIndex * 2}s`,
                  transitionDelay: categoriesZooming ? `${parallaxDelay}s` : '0s',
                }}
              >
                {row.words.map((word, wordIndex) => {
                  const isTarget = word === TARGET_CATEGORY;
                  return (
                    <span 
                      key={wordIndex}
                      className={`px-3 py-1.5 mx-1 text-sm font-medium rounded-full transition-all duration-300 ${
                        isTarget 
                          ? 'text-purple-200 bg-purple-500/40 border border-purple-400/60 shadow-lg shadow-purple-500/20' 
                          : 'text-white/40 hover:text-white/60'
                      } ${isTarget && !categoriesZooming ? 'animate-subtle-pulse' : ''}`}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
            );
          })}
          
          {/* Vignette overlay during zoom */}
          {categoriesZooming && (
            <div className="absolute inset-0 pointer-events-none animate-vignette-in" />
          )}
        </div>

        {/* ===== TOKENS LAYER ===== */}
        <div 
          className={`absolute inset-0 flex flex-col justify-center will-change-transform transition-opacity duration-700 ${
            showTokens ? (phase === 'categories-zoom' ? 'animate-fade-in-delayed' : 'opacity-100') : 'opacity-0 pointer-events-none'
          } ${tokensZooming ? 'animate-zoom-through' : ''}`}
          style={{
            transformOrigin: '50% 50%',
            zIndex: showTokens && !showCategories ? 20 : (showTokens ? 15 : 0),
          }}
        >
          {tokenRows.map((row, rowIndex) => {
            const distanceFromCenter = Math.abs(rowIndex - 4.5);
            const parallaxDelay = distanceFromCenter * 0.05;
            
            return (
              <div 
                key={rowIndex}
                className="flex whitespace-nowrap py-2.5"
                style={{
                  animation: `slide-${row.direction} 45s linear infinite`,
                  animationDelay: `-${rowIndex * 3}s`,
                  transitionDelay: tokensZooming ? `${parallaxDelay}s` : '0s',
                }}
              >
                {row.tokens.map((token, tokenIndex) => (
                  <div 
                    key={tokenIndex}
                    className={`w-11 h-11 mx-1.5 rounded-full flex-shrink-0 transition-all duration-300 ${
                      token.isTarget && !tokensZooming ? 'animate-subtle-pulse ring-2 ring-white/40' : ''
                    }`}
                    style={{ 
                      background: `radial-gradient(circle at 30% 30%, ${token.color}, ${token.color}99 50%, ${token.color}66)`,
                      boxShadow: token.isTarget 
                        ? `0 0 30px ${token.color}, 0 0 60px ${token.color}66`
                        : `0 0 15px ${token.color}40`,
                    }}
                  />
                ))}
              </div>
            );
          })}
          
          {/* Vignette overlay during zoom */}
          {tokensZooming && (
            <div className="absolute inset-0 pointer-events-none animate-vignette-in" />
          )}
        </div>

        {/* ===== WALLETS LAYER ===== */}
        <div 
          className={`absolute inset-0 flex flex-col justify-center will-change-transform transition-opacity duration-700 ${
            showWallets ? (phase === 'tokens-zoom' ? 'animate-fade-in-delayed' : 'opacity-100') : 'opacity-0 pointer-events-none'
          } ${isLocked ? 'animate-fade-out' : ''}`}
          style={{
            zIndex: showWallets && !showTokens ? 10 : (showWallets ? 5 : 0),
          }}
        >
          {!isLocked && (
            <div className="flex flex-col gap-0.5">
              {walletRows.map((row, rowIndex) => (
                <div 
                  key={rowIndex}
                  className="flex whitespace-nowrap"
                  style={{
                    animation: `slide-${row.direction} 70s linear infinite`,
                    animationDelay: `-${rowIndex * 2}s`,
                  }}
                >
                  {row.wallets.map((wallet) => (
                    <span 
                      key={wallet.id}
                      className={`material-icons-outlined mx-0.5 flex-shrink-0 transition-all ${
                        walletsFiltering 
                          ? (wallet.keep 
                              ? 'text-purple-400 scale-110 duration-1000' 
                              : 'text-white/5 scale-75 duration-700')
                          : (wallet.keep 
                              ? 'text-purple-400' 
                              : 'text-white/25')
                      }`}
                      style={{ 
                        fontSize: '22px',
                        transitionDelay: walletsFiltering && wallet.keep ? '0.5s' : '0s',
                      }}
                    >
                      account_balance_wallet
                    </span>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ===== LOCKED STATE ===== */}
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-40">
            {/* Arranged wallets */}
            <div className="flex flex-wrap justify-center gap-4 max-w-2xl px-8 mb-10">
              {Array.from({ length: Math.min(keptWalletCount, 35) }).map((_, index) => (
                <span 
                  key={index}
                  className="material-icons-outlined text-purple-400"
                  style={{ 
                    fontSize: '32px',
                    filter: 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.7))',
                    animation: `pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
                    animationDelay: `${index * 30}ms`,
                    opacity: 0,
                  }}
                >
                  account_balance_wallet
                </span>
              ))}
            </div>
            
            {/* Text */}
            <div 
              className="text-center"
              style={{
                animation: 'fade-slide-up 0.8s ease-out forwards',
                animationDelay: '0.8s',
                opacity: 0,
              }}
            >
              <p className="text-white/50 text-sm tracking-[0.2em] uppercase mb-3">
                {keptWalletCount * 14} wallets locked in
              </p>
              <p className="text-white text-3xl font-light tracking-wide">
                Ready for research
              </p>
            </div>
          </div>
        )}

        {/* ===== STAGE INDICATOR ===== */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-50">
          {[
            { phases: ['categories-scroll', 'categories-zoom'], label: 'Categories' },
            { phases: ['tokens-scroll', 'tokens-zoom'], label: 'Tokens' },
            { phases: ['wallets-scroll', 'wallets-filter'], label: 'Wallets' },
            { phases: ['locked'], label: 'Locked' },
          ].map((stage, i) => {
            const isActive = stage.phases.includes(phase);
            return (
              <div 
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  isActive 
                    ? 'bg-purple-500 w-10' 
                    : 'bg-white/15 w-1.5'
                }`}
              />
            );
          })}
        </div>

        {/* Stage label */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50">
          <p className="text-white/30 text-xs tracking-widest uppercase">
            {(phase === 'categories-scroll' || phase === 'categories-zoom') && '100+ Categories'}
            {(phase === 'tokens-scroll' || phase === 'tokens-zoom') && '200+ Tokens'}
            {(phase === 'wallets-scroll' || phase === 'wallets-filter') && '10,000+ Wallets'}
            {phase === 'locked' && 'Your Audience'}
          </p>
        </div>
      </div>

      {/* ===== GLOBAL STYLES ===== */}
      <style>{`
        /* Scrolling animations */
        @keyframes slide-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes slide-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        /* The core zoom-through effect */
        @keyframes zoom-through {
          0% { 
            transform: scale(1);
            opacity: 1;
            filter: blur(0px);
          }
          60% {
            opacity: 1;
            filter: blur(0px);
          }
          85% {
            opacity: 0.3;
            filter: blur(2px);
          }
          100% { 
            transform: scale(50);
            opacity: 0;
            filter: blur(4px);
          }
        }
        .animate-zoom-through {
          animation: zoom-through 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Delayed fade in for layer beneath */
        @keyframes fade-in-delayed {
          0% { opacity: 0; transform: scale(0.9); }
          50% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-delayed {
          animation: fade-in-delayed 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* Subtle pulse for target elements */
        @keyframes subtle-pulse {
          0%, 100% { 
            transform: scale(1);
            filter: brightness(1);
          }
          50% { 
            transform: scale(1.05);
            filter: brightness(1.2);
          }
        }
        .animate-subtle-pulse {
          animation: subtle-pulse 2s ease-in-out infinite;
        }

        /* Vignette effect during zoom */
        @keyframes vignette-in {
          0% { 
            box-shadow: inset 0 0 0 0 rgba(0,0,0,0);
          }
          100% { 
            box-shadow: inset 0 0 200px 100px rgba(0,0,0,0.8);
          }
        }
        .animate-vignette-in {
          animation: vignette-in 2s ease-out forwards;
        }

        /* Pop in for locked wallets */
        @keyframes pop-in {
          0% { 
            opacity: 0; 
            transform: scale(0) translateY(20px); 
          }
          70% { 
            transform: scale(1.2) translateY(-5px); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }

        /* Fade slide up for text */
        @keyframes fade-slide-up {
          0% { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        /* Fade out */
        @keyframes fade-out {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-fade-out {
          animation: fade-out 0.5s ease-out forwards;
        }

        /* Material icons */
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
