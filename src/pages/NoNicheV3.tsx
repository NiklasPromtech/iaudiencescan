import React, { useEffect, useRef, useState } from 'react';

type LayerType = 'categories' | 'tokens' | 'wallets';

interface Asteroid {
  id: string;
  type: LayerType;
  label: string;
  x: number; // percentage from center
  y: number; // percentage from center
  z: number; // depth
  size: number; // scale multiplier
  rotation: number;
}

const CATEGORIES = [
  'Meme', 'AI Agents', 'DeFi', 'Gaming', 'RWA', 'NFT',
  'Layer 2', 'Privacy', 'DEX', 'Lending', 'Yield', 'DAO',
  'Metaverse', 'Social', 'Storage', 'Oracle', 'Bridge', 'Staking',
  'Infrastructure', 'Identity', 'Payments', 'Insurance', 'Derivatives', 'Options'
];

const TOKENS = [
  '$DOGE', '$SHIB', '$PEPE', '$BONK', '$WIF', '$FLOKI',
  '$RNDR', '$FET', '$AGIX', '$OCEAN', '$TAO', '$NEAR',
  '$ARB', '$OP', '$MATIC', '$SOL', '$AVAX', '$DOT',
  '$LINK', '$UNI', '$AAVE', '$MKR', '$CRV', '$SNX'
];

const WALLETS = [
  '0x7a2...f3e', '0x8b1...c4d', '0x3e9...a2b', '0x5f4...d8c',
  '0x1c6...e7f', '0x9d2...b5a', '0x4a8...c1e', '0x6e3...f9d',
  '0x2b5...a4c', '0x8f1...d6e', '0x5c9...b3f', '0x7d4...e2a',
  '0x3a7...c8b', '0x9e6...f1d', '0x4b2...a5e', '0x6f8...d3c',
  '0x1d5...e9a', '0x8c3...b7f', '0x2f7...c9a', '0x5e1...d4b',
  '0x9a3...f2e', '0x4c8...b6d', '0x7f2...a1c', '0x3d6...e8f'
];

const FIELD_DEPTH = 8000; // Total depth of each field
const FIELD_GAP = 4000; // Longer gap between fields for blackout effect
const VELOCITY = 600; // Speed through the tunnel

const NoNicheV3: React.FC = () => {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const zOffsetRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  // Generate asteroids for a field
  const generateField = (type: LayerType, startZ: number): Asteroid[] => {
    const items = type === 'categories' ? CATEGORIES : type === 'tokens' ? TOKENS : WALLETS;
    const asteroidCount = type === 'wallets' ? 60 : 40; // More wallets for denser field
    
    return Array.from({ length: asteroidCount }, (_, i) => {
      const item = items[i % items.length];
      const angle = Math.random() * Math.PI * 2;
      const distance = 20 + Math.random() * 60; // Distance from center (20-80%)
      
      return {
        id: `${type}-${i}-${startZ}`,
        type,
        label: item,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        z: startZ + Math.random() * FIELD_DEPTH,
        size: type === 'wallets' 
          ? 0.5 + Math.random() * 1.2 // Wallets: varying sizes 0.5-1.7
          : 0.8 + Math.random() * 0.4, // Others: 0.8-1.2
        rotation: Math.random() * 20 - 10, // -10 to 10 degrees
      };
    });
  };

  // Initialize all fields
  useEffect(() => {
    const categoriesField = generateField('categories', 0);
    const tokensField = generateField('tokens', FIELD_DEPTH + FIELD_GAP);
    const walletsField = generateField('wallets', (FIELD_DEPTH + FIELD_GAP) * 2);
    
    setAsteroids([...categoriesField, ...tokensField, ...walletsField]);
  }, []);

  // Animation loop
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      zOffsetRef.current += VELOCITY * deltaTime;

      const totalCycleLength = (FIELD_DEPTH + FIELD_GAP) * 3;

      // Recycle asteroids that have passed
      setAsteroids(prevAsteroids => {
        return prevAsteroids.map(asteroid => {
          const effectiveZ = asteroid.z - (zOffsetRef.current % totalCycleLength);
          
          if (effectiveZ < -500) {
            // Recycle to the back of its field
            const fieldIndex = asteroid.type === 'categories' ? 0 : asteroid.type === 'tokens' ? 1 : 2;
            const fieldStart = fieldIndex * (FIELD_DEPTH + FIELD_GAP);
            const angle = Math.random() * Math.PI * 2;
            const distance = 20 + Math.random() * 60;
            
            return {
              ...asteroid,
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              z: fieldStart + FIELD_DEPTH + Math.random() * 500,
              rotation: Math.random() * 20 - 10,
            };
          }
          return asteroid;
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

  const getAsteroidStyle = (asteroid: Asteroid) => {
    const totalCycleLength = (FIELD_DEPTH + FIELD_GAP) * 3;
    const z = asteroid.z - (zOffsetRef.current % totalCycleLength);
    
    // Don't render if too far or behind
    if (z < -200 || z > 5000) return null;

    const scale = (800 / (800 + Math.max(0, z))) * asteroid.size;
    const opacity = z < 0 
      ? Math.max(0, 1 + z / 200) 
      : z > 3000 
        ? Math.max(0, 1 - (z - 3000) / 2000) 
        : 1;
    
    const blur = z < 0 ? Math.abs(z) / 100 : z > 2500 ? (z - 2500) / 800 : 0;

    // Convert percentage position to screen position with perspective
    const perspectiveFactor = 800 / (800 + Math.max(0, z));
    const screenX = 50 + asteroid.x * perspectiveFactor;
    const screenY = 50 + asteroid.y * perspectiveFactor;

    return {
      position: 'absolute' as const,
      left: `${screenX}%`,
      top: `${screenY}%`,
      transform: `translate(-50%, -50%) scale(${scale}) rotate(${asteroid.rotation}deg)`,
      opacity: Math.min(1, opacity),
      filter: blur > 0 ? `blur(${blur}px)` : 'none',
      zIndex: Math.floor(5000 - z),
      willChange: 'transform, opacity',
    };
  };

  return (
    <div 
      className="w-full h-screen overflow-hidden relative"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Asteroids */}
      <div className="absolute inset-0">
        {asteroids.map(asteroid => {
          const style = getAsteroidStyle(asteroid);
          if (!style) return null;
          
          return (
            <div
              key={asteroid.id}
              style={style}
            >
              <div 
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium text-center whitespace-nowrap 
                  border border-white/30 text-white/90
                  ${asteroid.type === 'wallets' ? 'font-mono text-xs' : ''}
                `}
                style={{ backgroundColor: '#000000' }}
              >
                {asteroid.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Center focus gradient */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 10%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* Tunnel edge shadow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 200px 100px rgba(0,0,0,0.9)',
        }}
      />

      {/* Static label - top right */}
      <div className="absolute top-8 right-8 z-50">
        <div 
          className="px-4 py-2 rounded-lg text-sm font-semibold tracking-wide"
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.1)',
            color: '#ffffff',
            border: '1px solid rgba(255,255,255,0.3)'
          }}
        >
          Insights from any corner of web3
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
