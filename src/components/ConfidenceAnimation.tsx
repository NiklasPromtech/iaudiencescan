import { useState, useEffect, useRef, useCallback } from "react";

interface FloatingElement {
  id: number;
  label: string;
  x: number;
  y: number;
  opacity: number;
  isSignal: boolean;
}

const LABELS = ["$ETH", "$SOL", "$DOGE", "Ethereum", "DeFi", "Meme", "X", "TG", "$ARB", "Base", "Gaming", "AI", "$PEPE", "$SHIB", "NFT", "Layer2", "$BTC", "$LINK", "$UNI", "$AVAX"];

interface ConfidenceAnimationProps {
  className?: string;
  isInView?: boolean;
}

const ConfidenceAnimation = ({ className = "", isInView = true }: ConfidenceAnimationProps) => {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [phase, setPhase] = useState<"idle" | "filtering" | "locked">("idle");
  const [filterProgress, setFilterProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const animationRef = useRef<number | null>(null);

  const generateElement = useCallback((id: number, forceNonSignal: boolean = false): FloatingElement => {
    const label = LABELS[id % LABELS.length];
    // Distribute elements across the container with some randomness
    const cols = 10;
    const rows = 7;
    const col = id % cols;
    const row = Math.floor(id / cols) % rows;
    
    return {
      id,
      label,
      x: 5 + (col * 10) + (Math.random() - 0.5) * 8,
      y: 8 + (row * 14) + (Math.random() - 0.5) * 10,
      opacity: 1,
      isSignal: forceNonSignal ? false : Math.random() > 0.85, // ~15% are signals from first batch
    };
  }, []);

  // Initialize elements - first 35 can be signals, next 35 are all noise
  useEffect(() => {
    const initialElements: FloatingElement[] = [];
    // First batch - some can be signals
    for (let i = 0; i < 35; i++) {
      initialElements.push(generateElement(i, false));
    }
    // Second batch - all noise (will be filtered out)
    for (let i = 35; i < 70; i++) {
      initialElements.push(generateElement(i, true));
    }
    setElements(initialElements);
  }, [generateElement]);

  // Start animation when in view - go directly to filtering
  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true);
      // Small delay before filtering starts so user can see all the cards
      setTimeout(() => setPhase("filtering"), 300);
    }
  }, [isInView, hasStarted]);

  // Filter animation
  useEffect(() => {
    if (phase !== "filtering") return;

    const duration = 4000; // Slow sweep for dramatic effect
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setFilterProgress(progress * 100);

      setElements((prev) =>
        prev.map((el) => {
          const elementProgress = el.x;
          if (progress * 100 > elementProgress && !el.isSignal) {
            return { ...el, opacity: Math.max(0, 1 - (progress * 100 - elementProgress) * 0.08) };
          }
          return el;
        })
      );

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setTimeout(() => setPhase("locked"), 200);
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
        const radius = 28;

        return {
          ...el,
          x: 50 + Math.cos(angle) * radius,
          y: 50 + Math.sin(angle) * radius,
          opacity: 1,
        };
      })
    );

    // Animate confidence score
    let startTime: number | null = null;
    const mainDuration = 1800;
    const finalDuration = 1500;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animateScore = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed < mainDuration) {
        const progress = elapsed / mainDuration;
        const easedProgress = easeOutCubic(progress);
        setConfidenceScore(Math.floor(easedProgress * 99));
      } else {
        const finalElapsed = elapsed - mainDuration;
        const finalProgress = Math.min(finalElapsed / finalDuration, 1);
        setConfidenceScore(99 + Math.floor(finalProgress));
        
        if (finalProgress >= 1) {
          setIsComplete(true);
          return;
        }
      }

      animationRef.current = requestAnimationFrame(animateScore);
    };

    animationRef.current = requestAnimationFrame(animateScore);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [phase]);

  const signalElements = elements.filter((el) => el.isSignal && el.opacity > 0);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Floating elements */}
      {elements.map((el) => {
        if (el.opacity === 0) return null;

        return (
          <div
            key={el.id}
            className={`absolute transition-all ${
              phase === "locked" ? "duration-700 ease-out" : "duration-100"
            }`}
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              transform: "translate(-50%, -50%)",
              opacity: el.opacity,
            }}
          >
            <div
              className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                el.isSignal && phase === "locked"
                  ? "bg-white/10 border border-purple-500/40 text-white ring-1 ring-purple-500/20"
                  : "bg-white/[0.06] border border-white/10 text-white/50"
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
          className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/60 to-transparent"
          style={{ left: `${filterProgress}%` }}
        />
      )}

      {/* Locked state */}
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
                stroke={isComplete ? "rgba(168, 85, 247, 0.35)" : "rgba(168, 85, 247, 0.12)"}
                strokeWidth={isComplete ? "1.5" : "1"}
                strokeDasharray="3 3"
                className="transition-all duration-500"
              />
            ))}
          </svg>

          {/* Confidence card */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-scale-in">
            <div 
              className={`bg-white/[0.08] border rounded-xl px-6 py-4 text-center backdrop-blur-sm transition-all duration-500 ${
                isComplete 
                  ? "border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.12)]" 
                  : "border-white/10"
              }`}
            >
              <div className={`text-3xl font-bold mb-1 tabular-nums transition-colors duration-500 ${
                isComplete ? "text-purple-300" : "text-white"
              }`}>
                {confidenceScore}%
              </div>
              <div className={`text-[10px] uppercase tracking-[0.15em] transition-colors duration-500 ${
                isComplete ? "text-purple-400/60" : "text-white/40"
              }`}>
                Confidence
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ConfidenceAnimation;
