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
  '$DOGE', '$SHIB', '$PEPE', '$BONK', '$WIF', '$FLOKI',
  '$RNDR', '$FET', '$AGIX', '$OCEAN', '$TAO', '$NEAR',
  '$ARB', '$OP', '$MATIC', '$SOL', '$AVAX', '$DOT'
];

const WALLETS = [
  '0x7a2...f3e', '0x8b1...c4d', '0x3e9...a2b', '0x5f4...d8c',
  '0x1c6...e7f', '0x9d2...b5a', '0x4a8...c1e', '0x6e3...f9d',
  '0x2b5...a4c', '0x8f1...d6e', '0x5c9...b3f', '0x7d4...e2a',
  '0x3a7...c8b', '0x9e6...f1d', '0x4b2...a5e', '0x6f8...d3c',
  '0x1d5...e9a', '0x8c3...b7f'
];

const LABEL_MAP: Record<LayerType, string> = {
  categories: 'Categories',
  tokens: 'Tokens',
  wallets: 'Wallets'
};

const NoNicheV3: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [currentLayerType, setCurrentLayerType] = useState<LayerType>('categories');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const zOffsetRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const prevLayerTypeRef = useRef<LayerType>('categories');

  const LAYER_SPACING = 1200;
  const VELOCITY = 400;
  const RECYCLE_Z = -800;

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

  // Trigger pulse on layer type change
  useEffect(() => {
    if (prevLayerTypeRef.current !== currentLayerType) {
      setIsTransitioning(true);
      const timeout = setTimeout(() => setIsTransitioning(false), 500);
      prevLayerTypeRef.current = currentLayerType;
      return () => clearTimeout(timeout);
    }
  }, [currentLayerType]);

  // Animation loop
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      zOffsetRef.current += VELOCITY * deltaTime;

      setLayers(prevLayers => {
        let closestLayer: Layer | null = null;
        let closestZ = Infinity;
        
        prevLayers.forEach(layer => {
          const z = layer.baseZ - zOffsetRef.current;
          if (z > -200 && z < closestZ) {
            closestZ = z;
            closestLayer = layer;
          }
        });
        
        if (closestLayer) {
          setCurrentLayerType(closestLayer.type);
        }

        return prevLayers.map(layer => {
          const currentZ = layer.baseZ - zOffsetRef.current;
          if (currentZ < RECYCLE_Z) {
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
    if (z < -200) return 0;
    if (z < 200) return Math.max(0, (z + 200) / 400);
    if (z > 3000) return Math.max(0, 1 - (z - 3000) / 1000);
    return 1;
  };

  const getLayerScale = (z: number): number => {
    const scale = 1000 / (1000 + Math.max(0, z));
    return Math.min(3, Math.max(0.1, scale));
  };

  const getLayerBlur = (z: number): number => {
    if (z < 0) return Math.abs(z) / 100;
    if (z > 2000) return (z - 2000) / 500;
    return 0;
  };

  const getItems = (type: LayerType): string[] => {
    switch (type) {
      case 'categories': return CATEGORIES;
      case 'tokens': return TOKENS;
      case 'wallets': return WALLETS;
    }
  };

  const renderLayer = (layer: Layer) => {
    const z = layer.baseZ - zOffsetRef.current;
    const opacity = getLayerOpacity(z);
    const scale = getLayerScale(z);
    const blur = getLayerBlur(z);
    const items = getItems(layer.type);

    return (
      <div
        key={`layer-${layer.id}`}
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translateZ(${-z}px) scale(${scale})`,
          opacity,
          filter: blur > 0 ? `blur(${blur}px)` : 'none',
          willChange: 'transform, opacity',
        }}
      >
        <div className="grid grid-cols-6 gap-4 max-w-4xl">
          {items.map((item) => (
            <div
              key={item}
              className="px-4 py-2 rounded-lg text-sm font-medium text-center whitespace-nowrap border border-white/30 text-white/80"
              style={{ backgroundColor: '#000000' }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="w-full h-screen overflow-hidden relative"
      style={{ backgroundColor: '#000000' }}
    >
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
        {layers.map(layer => renderLayer(layer))}
      </div>

      {/* Center focus gradient */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 15%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)',
        }}
      />

      {/* Tunnel edge shadow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 200px 100px rgba(0,0,0,0.9)',
        }}
      />

      {/* Layer type indicator - top right, single word with background */}
      <div className="absolute top-8 right-8 z-10">
        <div 
          className={`
            px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider
            transition-all duration-300
            ${isTransitioning 
              ? 'shadow-[0_0_20px_rgba(255,255,255,0.6)] scale-105' 
              : 'shadow-[0_0_10px_rgba(255,255,255,0.2)]'
            }
          `}
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.1)',
            color: '#ffffff',
            border: '1px solid rgba(255,255,255,0.3)'
          }}
        >
          {LABEL_MAP[currentLayerType]}
        </div>
      </div>

      {/* Center crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div 
          className="w-4 h-4 rounded-full"
          style={{ border: '1px solid rgba(255,255,255,0.2)' }}
        />
      </div>
    </div>
  );
};

export default NoNicheV3;