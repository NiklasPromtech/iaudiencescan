import React, { useEffect, useRef, useState } from 'react';

type LayerType = 'categories' | 'tokens' | 'wallets';

interface Layer {
  id: number;
  type: LayerType;
  baseZ: number;
}

const CATEGORIES = [
  'Meme', 'AI Agents', 'DeFi', 'Gaming', 'RWA', 'NFT',
  'Layer 2', 'Privacy', 'DEX', 'Lending', 'Yield', 'DAO',
  'Metaverse', 'Social', 'Storage', 'Oracle', 'Bridge', 'Staking'
];

const TOKENS = [
  'DOGE', 'SHIB', 'PEPE', 'BONK', 'WIF', 'FLOKI',
  'RNDR', 'FET', 'AGIX', 'OCEAN', 'TAO', 'NEAR',
  'ARB', 'OP', 'MATIC', 'SOL', 'AVAX', 'DOT'
];

const NoNicheV3: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
  const zOffsetRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  const LAYER_SPACING = 1200;
  const VELOCITY = 400; // pixels per second
  const RECYCLE_Z = -800; // when layer passes this, recycle it
  const FAR_Z = 4800; // recycled layers go here

  // Initialize layers
  useEffect(() => {
    const initialLayers: Layer[] = [];
    const types: LayerType[] = ['categories', 'tokens', 'wallets'];
    
    for (let i = 0; i < 9; i++) {
      initialLayers.push({
        id: i,
        type: types[i % 3],
        baseZ: i * LAYER_SPACING,
      });
    }
    
    setLayers(initialLayers);
  }, []);

  // Animation loop
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      zOffsetRef.current += VELOCITY * deltaTime;

      // Recycle layers that have passed the camera
      setLayers(prevLayers => {
        return prevLayers.map(layer => {
          const currentZ = layer.baseZ - zOffsetRef.current;
          if (currentZ < RECYCLE_Z) {
            // Find the furthest layer to position behind it
            const maxBaseZ = Math.max(...prevLayers.map(l => l.baseZ));
            return {
              ...layer,
              baseZ: maxBaseZ + LAYER_SPACING,
            };
          }
          return layer;
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const getLayerOpacity = (z: number): number => {
    // Fade in as approaching, fade out after passing
    if (z < -200) return 0;
    if (z < 200) return Math.max(0, (z + 200) / 400);
    if (z > 3000) return Math.max(0, 1 - (z - 3000) / 1000);
    return 1;
  };

  const getLayerScale = (z: number): number => {
    // Perspective-like scaling
    const scale = 1000 / (1000 + Math.max(0, z));
    return Math.min(3, Math.max(0.1, scale));
  };

  const getLayerBlur = (z: number): number => {
    if (z < 0) return Math.abs(z) / 100;
    if (z > 2000) return (z - 2000) / 500;
    return 0;
  };

  const renderCategoriesLayer = (layer: Layer) => {
    const z = layer.baseZ - zOffsetRef.current;
    const opacity = getLayerOpacity(z);
    const scale = getLayerScale(z);
    const blur = getLayerBlur(z);

    return (
      <div
        key={`cat-${layer.id}`}
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translateZ(${-z}px) scale(${scale})`,
          opacity,
          filter: blur > 0 ? `blur(${blur}px)` : 'none',
          willChange: 'transform, opacity',
        }}
      >
        <div className="grid grid-cols-6 gap-4 max-w-4xl">
          {CATEGORIES.map((cat, idx) => {
            const isCenter = idx === 7; // AI Agents position
            return (
              <div
                key={cat}
                className={`
                  px-4 py-3 rounded-xl text-sm font-medium text-center
                  transition-all duration-300
                  ${isCenter 
                    ? 'bg-purple-500 text-white shadow-[0_0_40px_rgba(168,85,247,0.6)] scale-110' 
                    : 'bg-white/10 text-white/70 border border-white/20'
                  }
                `}
              >
                {cat}
                {isCenter && (
                  <div className="absolute inset-0 rounded-xl bg-purple-400/30 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTokensLayer = (layer: Layer) => {
    const z = layer.baseZ - zOffsetRef.current;
    const opacity = getLayerOpacity(z);
    const scale = getLayerScale(z);
    const blur = getLayerBlur(z);

    return (
      <div
        key={`tok-${layer.id}`}
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translateZ(${-z}px) scale(${scale})`,
          opacity,
          filter: blur > 0 ? `blur(${blur}px)` : 'none',
          willChange: 'transform, opacity',
        }}
      >
        <div className="grid grid-cols-6 gap-6 max-w-4xl">
          {TOKENS.map((token, idx) => {
            const isCenter = idx === 8;
            return (
              <div
                key={token}
                className={`
                  w-16 h-16 rounded-full flex items-center justify-center
                  text-xs font-bold transition-all duration-300
                  ${isCenter 
                    ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-[0_0_50px_rgba(139,92,246,0.7)] scale-125' 
                    : 'bg-white/5 text-white/60 border border-white/10'
                  }
                `}
              >
                {token}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWalletsLayer = (layer: Layer) => {
    const z = layer.baseZ - zOffsetRef.current;
    const opacity = getLayerOpacity(z);
    const scale = getLayerScale(z);
    const blur = getLayerBlur(z);

    return (
      <div
        key={`wal-${layer.id}`}
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translateZ(${-z}px) scale(${scale})`,
          opacity,
          filter: blur > 0 ? `blur(${blur}px)` : 'none',
          willChange: 'transform, opacity',
        }}
      >
        <div className="grid grid-cols-12 gap-3 max-w-5xl">
          {Array.from({ length: 60 }).map((_, idx) => {
            const isHighlighted = [14, 25, 31, 42, 48].includes(idx);
            return (
              <div
                key={idx}
                className={`
                  w-8 h-8 rounded-lg flex items-center justify-center
                  transition-all duration-300
                  ${isHighlighted 
                    ? 'bg-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.5)]' 
                    : 'bg-white/5 border border-white/10'
                  }
                `}
              >
                <span 
                  className="material-icons text-sm"
                  style={{ 
                    color: isHighlighted ? 'white' : 'rgba(255,255,255,0.3)',
                    fontSize: '14px'
                  }}
                >
                  account_balance_wallet
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderLayer = (layer: Layer) => {
    switch (layer.type) {
      case 'categories':
        return renderCategoriesLayer(layer);
      case 'tokens':
        return renderTokensLayer(layer);
      case 'wallets':
        return renderWalletsLayer(layer);
    }
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      {/* 3D Container */}
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{
          perspective: '1000px',
          perspectiveOrigin: 'center center',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Render all layers */}
        {layers.map(layer => renderLayer(layer))}
      </div>

      {/* Center focus indicator */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 15%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)',
        }}
      />

      {/* Tunnel edge glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 200px 100px rgba(0,0,0,0.9)',
        }}
      />

      {/* Info overlay */}
      <div className="absolute bottom-6 left-6 z-10">
        <div className="text-white/50 text-sm font-medium">
          Infinite Tunnel v3
        </div>
        <div className="text-white/30 text-xs mt-1">
          Categories → Tokens → Wallets
        </div>
      </div>

      {/* Center crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-4 h-4 border-2 border-purple-500/30 rounded-full" />
      </div>
    </div>
  );
};

export default NoNicheV3;
