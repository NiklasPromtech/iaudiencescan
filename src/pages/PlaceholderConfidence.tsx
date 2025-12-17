import { useState, useEffect, useRef, useCallback } from "react";

interface FloatingElement {
  id: number;
  type: "token" | "chain" | "category" | "social";
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  isSignal: boolean;
}

const TOKENS = ["$BTC", "$ETH", "$SOL", "$DOGE", "$PEPE", "$ARB", "$OP"];
const CHAINS = ["Ethereum", "Solana", "Arbitrum", "Base", "Polygon"];
const CATEGORIES = ["DeFi", "Meme", "Gaming", "AI", "L2"];
const SOCIALS = ["X", "TG", "Reddit", "Discord"];

const PlaceholderConfidence = () => {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const [phase, setPhase] = useState<"chaos" | "filtering" | "locked">("chaos");
  const [filterProgress, setFilterProgress] = useState(0);
  const animationRef = useRef<number | null>(null);

  const generateElement = useCallback((id: number): FloatingElement => {
    const types: FloatingElement["type"][] = ["token", "chain", "category", "social"];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const labels = {
      token: TOKENS,
      chain: CHAINS,
      category: CATEGORIES,
      social: SOCIALS
    };
    
    const label = labels[type][Math.floor(Math.random() * labels[type].length)];

    return {
      id,
      type,
      label,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      opacity: 1,
      isSignal: Math.random() > 0.7,
    };
  }, []);

  // Initialize elements
  useEffect(() => {
    const initialElements: FloatingElement[] = [];
    for (let i = 0; i < 25; i++) {
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

          if (newX < 8 || newX > 92) newVx *= -1;
          if (newY < 8 || newY > 92) newVy *= -1;

          newX = Math.max(8, Math.min(92, newX));
          newY = Math.max(8, Math.min(92, newY));

          return { ...el, x: newX, y: newY, vx: newVx, vy: newVy };
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
    const timer = setTimeout(() => setPhase("filtering"), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Filter animation
  useEffect(() => {
    if (phase !== "filtering") return;

    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setFilterProgress(progress * 100);

      setElements((prev) =>
        prev.map((el) => {
          const elementProgress = el.x;
          if (progress * 100 > elementProgress && !el.isSignal) {
            return { ...el, opacity: Math.max(0, 1 - (progress * 100 - elementProgress) * 0.05) };
          }
          return el;
        })
      );

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setTimeout(() => setPhase("locked"), 300);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [phase]);

  // Lock-in animation
  useEffect(() => {
    if (phase !== "locked") return;

    const signalElements = elements.filter((el) => el.isSignal);
    const angleStep = (2 * Math.PI) / Math.max(signalElements.length, 1);

    setElements((prev) =>
      prev.map((el) => {
        if (!el.isSignal) return { ...el, opacity: 0 };
        
        const signalIndex = signalElements.findIndex((s) => s.id === el.id);
        const angle = signalIndex * angleStep - Math.PI / 2;
        const radius = 22;

        return {
          ...el,
          x: 50 + Math.cos(angle) * radius,
          y: 50 + Math.sin(angle) * radius,
          opacity: 1,
        };
      })
    );
  }, [phase]);

  const reset = () => {
    setPhase("chaos");
    setFilterProgress(0);
    const newElements: FloatingElement[] = [];
    for (let i = 0; i < 25; i++) {
      newElements.push(generateElement(i));
    }
    setElements(newElements);
    setTimeout(() => setPhase("filtering"), 3000);
  };

  const signalElements = elements.filter((el) => el.isSignal && el.opacity > 0);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-transparent to-transparent" />

      {/* Stage label */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
        <span className="text-white/30 text-xs uppercase tracking-[0.2em]">
          {phase === "chaos" && "Analyzing data"}
          {phase === "filtering" && "Filtering noise"}
          {phase === "locked" && "Signals identified"}
        </span>
      </div>

      {/* Floating elements */}
      {elements.map((el) => {
        if (el.opacity === 0) return null;

        return (
          <div
            key={el.id}
            className={`absolute transition-all ${
              phase === "locked" ? "duration-1000 ease-out" : "duration-75"
            }`}
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              transform: "translate(-50%, -50%)",
              opacity: el.opacity,
            }}
          >
            <div
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                el.isSignal && phase === "locked"
                  ? "bg-white/10 border border-purple-500/40 text-white ring-1 ring-purple-500/20"
                  : "bg-white/[0.06] border border-white/10 text-white/60"
              }`}
            >
              {el.label}
            </div>
          </div>
        );
      })}

      {/* Filter sweep line */}
      {phase === "filtering" && (
        <div
          className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/80 to-transparent"
          style={{ left: `${filterProgress}%` }}
        />
      )}

      {/* Locked state - center confidence + connection lines */}
      {phase === "locked" && (
        <>
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none animate-fade-in">
            {signalElements.map((el) => (
              <line
                key={`line-${el.id}`}
                x1="50%"
                y1="50%"
                x2={`${el.x}%`}
                y2={`${el.y}%`}
                stroke="rgba(168, 85, 247, 0.15)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}
          </svg>

          {/* Confidence card */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-scale-in">
            <div className="bg-white/[0.06] border border-white/10 rounded-2xl px-12 py-10 text-center backdrop-blur-sm">
              <div className="text-6xl font-bold text-white mb-2">87%</div>
              <div className="text-white/40 text-xs uppercase tracking-[0.15em]">
                Confidence
              </div>
            </div>
          </div>
        </>
      )}

      {/* Reset button */}
      <button
        onClick={reset}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/[0.06] hover:bg-white/10 text-white/50 hover:text-white/70 text-sm rounded-lg transition-all border border-white/5"
      >
        Reset
      </button>

      {/* Bottom caption */}
      {phase === "locked" && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/30 text-sm animate-fade-in">
          High-confidence signals identified
        </div>
      )}
    </div>
  );
};

export default PlaceholderConfidence;
