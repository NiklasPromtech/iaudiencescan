import { useEffect, useState, useRef } from 'react';

type Stage = 'categories' | 'tokens' | 'wallets';

const CATEGORIES = [
  'Meme', 'DeFi', 'AI Agents', 'Gaming', 'RWA', 'NFT', 'Layer 2', 'Privacy',
  'Governance', 'Staking', 'Yield', 'DEX', 'Lending', 'Bridge', 'Oracle',
  'Storage', 'Identity', 'Social', 'Music', 'Sports', 'Metaverse', 'DAO',
  'Insurance', 'Derivatives', 'Payments', 'Infrastructure', 'Analytics', 'Security'
];

const TOKENS = [
  'DOGE', 'SHIB', 'PEPE', 'FLOKI', 'BONK', 'WIF', 'BRETT', 'POPCAT',
  'MOG', 'TURBO', 'NEIRO', 'MEME', 'BABYDOGE', 'ELON', 'SAMO', 'KISHU',
  'AKITA', 'HOGE', 'PIT', 'SAITAMA', 'LEASH', 'BONE', 'RYOSHI', 'TSUKA'
];

const NoNicheV2 = () => {
  const [stage, setStage] = useState<Stage>('categories');
  const [isZooming, setIsZooming] = useState(false);
  const [scale, setScale] = useState(1);
  const animationRef = useRef<number | null>(null);

  const ZOOM_DURATION = 3000; // 3 seconds
  const MAX_SCALE = 2000; // Deep zoom

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    // Start zooming immediately - no pause
    const startZoom = () => {
      setIsZooming(true);

      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / ZOOM_DURATION, 1);
        
        // Exponential scale = constant perceived velocity
        const newScale = Math.pow(MAX_SCALE, progress);
        setScale(newScale);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Transition to next stage immediately
          setIsZooming(false);
          setScale(1);
          setStage(prev => {
            if (prev === 'categories') return 'tokens';
            if (prev === 'tokens') return 'wallets';
            return 'categories';
          });
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start immediately - no hold time
    startZoom();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [stage]);

  const renderCategories = () => {
    const rows = 7;
    const cols = 9;
    const centerRow = 3;
    const centerCol = 4;
    const targetIndex = centerRow * cols + centerCol;

    return (
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: rows * cols }).map((_, i) => {
            const isTarget = i === targetIndex;
            const categoryIndex = i % CATEGORIES.length;
            
            return (
              <div
                key={i}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
                  transition-all duration-300
                  ${isTarget 
                    ? 'bg-white text-black border-2 border-white' 
                    : 'bg-white/10 text-white/60 border border-white/20'
                  }
                `}
              >
                {CATEGORIES[categoryIndex]}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTokens = () => {
    const rows = 7;
    const cols = 9;
    const centerRow = 3;
    const centerCol = 4;
    const targetIndex = centerRow * cols + centerCol;

    return (
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: rows * cols }).map((_, i) => {
            const isTarget = i === targetIndex;
            const tokenIndex = i % TOKENS.length;
            
            return (
              <div
                key={i}
                className={`
                  w-16 h-16 rounded-full flex items-center justify-center
                  text-xs font-bold transition-all duration-300
                  ${isTarget 
                    ? 'bg-black text-white border-2 border-black' 
                    : 'bg-black/10 text-black/60 border border-black/20'
                  }
                `}
              >
                {TOKENS[tokenIndex]}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWallets = () => {
    const rows = 9;
    const cols = 13;
    const centerRow = 4;
    const centerCol = 6;
    const targetIndex = centerRow * cols + centerCol;

    return (
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: rows * cols }).map((_, i) => {
            const isTarget = i === targetIndex;
            
            return (
              <div
                key={i}
                className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  transition-all duration-300
                  ${isTarget 
                    ? 'bg-white text-black' 
                    : 'bg-white/10 text-white/40'
                  }
                `}
              >
                <span className="material-icons text-lg">account_balance_wallet</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Background changes based on stage for seamless transitions
  const bgColor = stage === 'tokens' ? 'bg-white' : 'bg-black';

  return (
    <div className={`w-full h-screen ${bgColor} overflow-hidden relative transition-colors duration-0`}>
      {/* Stage indicator */}
      <div className="absolute top-6 left-6 z-10 flex gap-2">
        {(['categories', 'tokens', 'wallets'] as Stage[]).map((s) => (
          <div
            key={s}
            className={`
              px-3 py-1 rounded-full text-xs font-medium capitalize
              ${stage === s 
                ? (stage === 'tokens' ? 'bg-black text-white' : 'bg-white text-black')
                : (stage === 'tokens' ? 'bg-black/10 text-black/50' : 'bg-white/10 text-white/50')
              }
            `}
          >
            {s}
          </div>
        ))}
      </div>

      {/* Render current stage */}
      <div className="w-full h-full">
        {stage === 'categories' && renderCategories()}
        {stage === 'tokens' && renderTokens()}
        {stage === 'wallets' && renderWallets()}
      </div>

      {/* Vignette overlay during zoom */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: stage === 'tokens' 
            ? 'radial-gradient(circle at center, transparent 20%, white 80%)'
            : 'radial-gradient(circle at center, transparent 20%, black 80%)',
          opacity: isZooming ? 0.7 : 0,
        }}
      />
    </div>
  );
};

export default NoNicheV2;
