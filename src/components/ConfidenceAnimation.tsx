import { useState, useEffect, useRef, useCallback } from "react";

interface FloatingElement {
  id: number;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  isSignal: boolean;
}

const LABELS = ["$ETH", "$SOL", "$DOGE", "Ethereum", "DeFi", "Meme", "X", "TG", "$ARB", "Base", "Gaming", "AI"];

interface ConfidenceAnimationProps {
  className?: string;
  isInView?: boolean;
}

const ConfidenceAnimation = ({ className = "", isInView = true }: ConfidenceAnimationProps) => {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [phase, setPhase] = useState<"idle" | "chaos" | "filtering" | "locked">("idle");
  const [filterProgress, setFilterProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const animationRef = useRef<number | null>(null);

  const generateElement = useCallback((id: number): FloatingElement => {
    const label = LABELS[id % LABELS.length];
    return {
      id,
      label,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      opacity: 1,
      isSignal: Math.random() > 0.65,
    };
  }, []);

  // Initialize elements
  useEffect(() => {
    const initialElements: FloatingElement[] = [];
    for (let i = 0; i < 16; i++) {
      initialElements.push(generateElement(i));
    }
    setElements(initialElements);
  }, [generateElement]);

  // Start animation when in view
  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true);
      setPhase("chaos");
    }
  }, [isInView, hasStarted]);

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

          if (newX < 10 || newX > 90) newVx *= -1;
          if (newY < 10 || newY > 90) newVy *= -1;

          newX = Math.max(10, Math.min(90, newX));
          newY = Math.max(10, Math.min(90, newY));

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

  // Trigger filter after delay (only after chaos starts)
  useEffect(() => {
    if (phase !== "chaos") return;
    const timer = setTimeout(() => setPhase("filtering"), 2000);
    return () => clearTimeout(timer);
  }, [phase]);

  // Filter animation
  useEffect(() => {
    if (phase !== "filtering") return;

    const duration = 1500;
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
              phase === "locked" ? "duration-700 ease-out" : "duration-75"
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
