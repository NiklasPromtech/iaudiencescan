import React, { useEffect, useRef, useState } from 'react';

type ItemType = 'category' | 'token' | 'wallet';

interface Asteroid {
  id: string;
  type: ItemType;
  label: string;
  x: number;
  y: number;
  z: number;
  size: number;
  rotation: number;
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
  '0x2b5...a4c', '0x8f1...d6e', '0x5c9...b3f', '0x7d4...e2a'
];

interface AsteroidFieldAnimationProps {
  className?: string;
}

const AsteroidFieldAnimation: React.FC<AsteroidFieldAnimationProps> = ({ className = '' }) => {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const zOffsetRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  const FIELD_DEPTH = 4000;
  const VELOCITY = 500;

  const generateAsteroid = (id: number, zOffset = 0): Asteroid => {
    const types: ItemType[] = ['category', 'token', 'wallet'];
    const type = types[Math.floor(Math.random() * types.length)];
    const items = type === 'category' ? CATEGORIES : type === 'token' ? TOKENS : WALLETS;
    const label = items[Math.floor(Math.random() * items.length)];
    
    const angle = Math.random() * Math.PI * 2;
    const distance = 15 + Math.random() * 65;
    
    return {
      id: `asteroid-${id}-${Date.now()}`,
      type,
      label,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      z: zOffset + Math.random() * FIELD_DEPTH,
      size: 0.6 + Math.random() * 0.6,
      rotation: Math.random() * 20 - 10,
    };
  };

  useEffect(() => {
    // Generate initial asteroids spread across the field
    const initial = Array.from({ length: 60 }, (_, i) => generateAsteroid(i));
    setAsteroids(initial);
  }, []);

  useEffect(() => {
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      zOffsetRef.current += VELOCITY * deltaTime;

      setAsteroids(prevAsteroids => {
        return prevAsteroids.map(asteroid => {
          const effectiveZ = asteroid.z - zOffsetRef.current;
          
          // Recycle asteroids that have passed
          if (effectiveZ < -300) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 15 + Math.random() * 65;
            const types: ItemType[] = ['category', 'token', 'wallet'];
            const type = types[Math.floor(Math.random() * types.length)];
            const items = type === 'category' ? CATEGORIES : type === 'token' ? TOKENS : WALLETS;
            
            return {
              ...asteroid,
              type,
              label: items[Math.floor(Math.random() * items.length)],
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              z: asteroid.z + FIELD_DEPTH,
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
    const z = asteroid.z - zOffsetRef.current;
    
    if (z < -200 || z > FIELD_DEPTH) return null;

    const scale = (600 / (600 + Math.max(0, z))) * asteroid.size;
    const opacity = z < 0 
      ? Math.max(0, 1 + z / 200) 
      : z > FIELD_DEPTH - 1000 
        ? Math.max(0, 1 - (z - (FIELD_DEPTH - 1000)) / 1000) 
        : 1;
    
    const blur = z < 0 ? Math.abs(z) / 100 : z > FIELD_DEPTH - 1500 ? (z - (FIELD_DEPTH - 1500)) / 600 : 0;

    const perspectiveFactor = 600 / (600 + Math.max(0, z));
    const screenX = 50 + asteroid.x * perspectiveFactor;
    const screenY = 50 + asteroid.y * perspectiveFactor;

    return {
      position: 'absolute' as const,
      left: `${screenX}%`,
      top: `${screenY}%`,
      transform: `translate(-50%, -50%) scale(${scale}) rotate(${asteroid.rotation}deg)`,
      opacity: Math.min(1, opacity),
      filter: blur > 0 ? `blur(${blur}px)` : 'none',
      zIndex: Math.floor(FIELD_DEPTH - z),
      willChange: 'transform, opacity',
    };
  };

  return (
    <div className={`w-full h-full overflow-hidden relative ${className}`}>
      {/* Black background container - 20px smaller */}
      <div 
        className="absolute bg-black border border-purple-500/30 animate-[glow-pulse_3s_ease-in-out_infinite]"
        style={{
          top: 20,
          left: 60,
          right: 60,
          bottom: 20,
          borderRadius: 8,
        }}
      />
      <style>{`
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.2), inset 0 0 15px rgba(168, 85, 247, 0.06);
          }
          50% {
            box-shadow: 0 0 40px rgba(168, 85, 247, 0.5), inset 0 0 25px rgba(168, 85, 247, 0.16);
          }
        }
      `}</style>
      <div className="absolute inset-0">
        {asteroids.map(asteroid => {
          const style = getAsteroidStyle(asteroid);
          if (!style) return null;
          
          return (
            <div key={asteroid.id} style={style}>
              <div 
                className={`
                  px-2.5 py-1 rounded-md text-xs font-medium text-center whitespace-nowrap 
                  border border-white/30 text-white/90 bg-white/10 backdrop-blur-sm
                  ${asteroid.type === 'wallet' ? 'font-mono text-[10px]' : ''}
                `}
              >
                {asteroid.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-2 h-2 rounded-full border border-white/20" />
      </div>
    </div>
  );
};

export default AsteroidFieldAnimation;
