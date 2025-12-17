import { useState, useEffect, useRef, useCallback } from "react";

interface FloatingElement {
  id: number;
  type: "token" | "chain" | "category" | "social";
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
  isSignal: boolean; // true = will remain after filter
}

const TOKENS = ["$BTC", "$ETH", "$SOL", "$DOGE", "$SHIB", "$PEPE", "$ARB", "$OP", "$MATIC", "$AVAX", "$LINK", "$UNI", "$AAVE", "$CRV", "$MKR"];
const CHAINS = ["Ethereum", "Solana", "Arbitrum", "Polygon", "BSC", "Avalanche", "Optimism", "Base", "Fantom", "Cronos"];
const CATEGORIES = ["DeFi", "NFT", "GameFi", "Meme", "L1", "L2", "AI", "RWA", "Social", "Infrastructure", "DEX", "Lending"];
const SOCIALS = ["@whale_alert", "@token_trader", "@defi_degen", "@nft_flipper", "@crypto_chad", "@ape_in", "@moon_boy", "@diamond_hands", "@paper_hands", "@rugged_again"];

const SIGNAL_TOKENS = ["$ETH", "$SOL", "$ARB"];
const SIGNAL_CHAINS = ["Ethereum", "Arbitrum"];
const SIGNAL_CATEGORIES = ["DeFi", "L2"];
const SIGNAL_SOCIALS = ["@whale_alert", "@defi_degen"];

const PlaceholderConfidence = () => {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const [phase, setPhase] = useState<"chaos" | "filtering" | "locked">("chaos");
  const [filterProgress, setFilterProgress] = useState(0);
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const generateElement = useCallback((id: number): FloatingElement => {
    const types: FloatingElement["type"][] = ["token", "chain", "category", "social"];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let label = "";
    let isSignal = false;
    
    switch (type) {
      case "token":
        label = TOKENS[Math.floor(Math.random() * TOKENS.length)];
        isSignal = SIGNAL_TOKENS.includes(label);
        break;
      case "chain":
        label = CHAINS[Math.floor(Math.random() * CHAINS.length)];
        isSignal = SIGNAL_CHAINS.includes(label);
        break;
      case "category":
        label = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        isSignal = SIGNAL_CATEGORIES.includes(label);
        break;
      case "social":
        label = SOCIALS[Math.floor(Math.random() * SOCIALS.length)];
        isSignal = SIGNAL_SOCIALS.includes(label);
        break;
    }

    return {
      id,
      type,
      label,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      size: 0.7 + Math.random() * 0.6,
      opacity: 0.4 + Math.random() * 0.6,
      isSignal,
    };
  }, []);

  // Initialize elements
  useEffect(() => {
    const initialElements: FloatingElement[] = [];
    for (let i = 0; i < 60; i++) {
      initialElements.push(generateElement(i));
    }
    setElements(initialElements);
  }, [generateElement]);

  // Animation loop for chaos phase
  useEffect(() => {
    if (phase !== "chaos") return;

    const animate = () => {
      setElements((prev) =>
        prev.map((el) => {
          let newX = el.x + el.vx;
          let newY = el.y + el.vy;
          let newVx = el.vx;
          let newVy = el.vy;

          // Bounce off edges
          if (newX < 0 || newX > 100) newVx *= -1;
          if (newY < 0 || newY > 100) newVy *= -1;

          newX = Math.max(0, Math.min(100, newX));
          newY = Math.max(0, Math.min(100, newY));

          return {
            ...el,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: el.rotation + el.rotationSpeed,
          };
        })
      );
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [phase]);

  // Trigger filter after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("filtering");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Filter animation
  useEffect(() => {
    if (phase !== "filtering") return;

    let progress = 0;
    const filterInterval = setInterval(() => {
      progress += 2;
      setFilterProgress(progress);
      
      if (progress >= 100) {
        clearInterval(filterInterval);
        setTimeout(() => setPhase("locked"), 500);
      }
    }, 30);

    return () => clearInterval(filterInterval);
  }, [phase]);

  // Lock-in animation - move signal elements to final positions
  useEffect(() => {
    if (phase !== "locked") return;

    const signalElements = elements.filter((el) => el.isSignal);
    const positions = [
      { x: 50, y: 30 },  // Top center
      { x: 30, y: 50 },  // Left
      { x: 70, y: 50 },  // Right
      { x: 35, y: 70 },  // Bottom left
      { x: 65, y: 70 },  // Bottom right
      { x: 50, y: 50 },  // Center
      { x: 25, y: 35 },  // Top left
      { x: 75, y: 35 },  // Top right
    ];

    setElements((prev) =>
      prev.map((el, i) => {
        if (!el.isSignal) return el;
        const signalIndex = signalElements.findIndex((s) => s.id === el.id);
        const pos = positions[signalIndex % positions.length];
        return {
          ...el,
          x: pos.x,
          y: pos.y,
          rotation: 0,
          opacity: 1,
        };
      })
    );
  }, [phase]);

  const getElementColor = (type: FloatingElement["type"]) => {
    switch (type) {
      case "token": return "from-purple-500 to-purple-700";
      case "chain": return "from-blue-500 to-blue-700";
      case "category": return "from-emerald-500 to-emerald-700";
      case "social": return "from-pink-500 to-pink-700";
    }
  };

  const getElementIcon = (type: FloatingElement["type"]) => {
    switch (type) {
      case "token": return "toll";
      case "chain": return "hub";
      case "category": return "category";
      case "social": return "alternate_email";
    }
  };

  const reset = () => {
    setPhase("chaos");
    setFilterProgress(0);
    const newElements: FloatingElement[] = [];
    for (let i = 0; i < 60; i++) {
      newElements.push(generateElement(i));
    }
    setElements(newElements);
    
    setTimeout(() => {
      setPhase("filtering");
    }, 3000);
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-black text-white overflow-hidden relative"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent" />
      
      {/* Phase indicator */}
      <div className="absolute top-8 left-8 z-20">
        <div className="text-xs uppercase tracking-widest text-white/40 mb-2">Phase</div>
        <div className="text-2xl font-bold capitalize">
          {phase === "chaos" && "Analyzing Data..."}
          {phase === "filtering" && "Filtering Noise..."}
          {phase === "locked" && "Signal Locked"}
        </div>
      </div>

      {/* Reset button */}
      <button
        onClick={reset}
        className="absolute top-8 right-8 z-20 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-sm"
      >
        Reset Animation
      </button>

      {/* Filter sweep line */}
      {phase === "filtering" && (
        <div 
          className="absolute top-0 h-full w-1 bg-gradient-to-b from-transparent via-purple-500 to-transparent z-10 transition-all duration-75"
          style={{ 
            left: `${filterProgress}%`,
            boxShadow: "0 0 40px 20px rgba(168, 85, 247, 0.4)",
          }}
        />
      )}

      {/* Floating elements */}
      <div className="absolute inset-0">
        {elements.map((el) => {
          // Calculate opacity based on phase and filter progress
          let displayOpacity = el.opacity;
          
          if (phase === "filtering") {
            const elementX = el.x;
            if (elementX < filterProgress) {
              // Element has been scanned
              displayOpacity = el.isSignal ? 1 : 0;
            }
          }
          
          if (phase === "locked") {
            displayOpacity = el.isSignal ? 1 : 0;
          }

          if (displayOpacity === 0) return null;

          return (
            <div
              key={el.id}
              className={`absolute transition-all ${phase === "locked" ? "duration-1000" : "duration-100"}`}
              style={{
                left: `${el.x}%`,
                top: `${el.y}%`,
                transform: `translate(-50%, -50%) rotate(${el.rotation}deg) scale(${el.size})`,
                opacity: displayOpacity,
              }}
            >
              <div 
                className={`
                  px-3 py-2 rounded-lg bg-gradient-to-br ${getElementColor(el.type)}
                  flex items-center gap-2 whitespace-nowrap
                  ${phase === "locked" && el.isSignal ? "ring-2 ring-white/30 shadow-lg shadow-purple-500/30" : ""}
                `}
              >
                <span className="material-symbols-rounded text-sm text-white/70">
                  {getElementIcon(el.type)}
                </span>
                <span className="text-sm font-medium">{el.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Locked state overlay - clean chart structure */}
      {phase === "locked" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Central confidence score */}
          <div 
            className="absolute flex flex-col items-center animate-[fade-in_0.8s_ease-out_0.5s_both]"
            style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-2xl shadow-purple-500/50">
              <div className="text-center">
                <div className="text-4xl font-bold">87%</div>
                <div className="text-xs text-white/60 uppercase tracking-wider">Confidence</div>
              </div>
            </div>
          </div>

          {/* Connection lines to signal elements - SVG */}
          <svg className="absolute inset-0 w-full h-full animate-[fade-in_1s_ease-out_1s_both]">
            {elements
              .filter((el) => el.isSignal)
              .map((el) => (
                <line
                  key={`line-${el.id}`}
                  x1="50%"
                  y1="50%"
                  x2={`${el.x}%`}
                  y2={`${el.y}%`}
                  stroke="rgba(168, 85, 247, 0.3)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}
          </svg>
        </div>
      )}

      {/* Bottom text */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-20">
        <p className="text-white/40 text-sm max-w-md">
          {phase === "chaos" && "Processing on-chain data across multiple sources..."}
          {phase === "filtering" && "Removing low-confidence signals and noise..."}
          {phase === "locked" && "High-confidence signals identified and ready for targeting"}
        </p>
      </div>
    </div>
  );
};

export default PlaceholderConfidence;
