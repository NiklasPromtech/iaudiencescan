import { useState, useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";

interface QuestionData {
  question: string;
  insights: { label: string; value: string }[];
  summary: string;
}

const QUESTIONS: QuestionData[] = [
  {
    question: "Which communities overlap with $PEPE?",
    insights: [
      { label: "$DOGE", value: "78%" },
      { label: "$SHIB", value: "65%" },
      { label: "$FLOKI", value: "52%" },
      { label: "Meme", value: "High" },
      { label: "$BONK", value: "48%" },
    ],
    summary: "847,000 transactions across 3 chains",
  },
  {
    question: "What chains are $ARB holders most active on?",
    insights: [
      { label: "Arbitrum", value: "94%" },
      { label: "Ethereum", value: "76%" },
      { label: "Optimism", value: "41%" },
      { label: "Base", value: "28%" },
    ],
    summary: "1.2M wallet interactions analyzed",
  },
  {
    question: "Best platforms to reach DeFi users?",
    insights: [
      { label: "X/Twitter", value: "89%" },
      { label: "Telegram", value: "72%" },
      { label: "Discord", value: "58%" },
      { label: "Reddit", value: "34%" },
    ],
    summary: "Social coverage across 156 tokens",
  },
  {
    question: "How confident is the $SOL scan data?",
    insights: [
      { label: "Overall", value: "87%" },
      { label: "Data Integrity", value: "92%" },
      { label: "Behavior Quality", value: "78%" },
      { label: "Context", value: "91%" },
    ],
    summary: "High confidence - ready for campaigns",
  },
  {
    question: "Top categories for gaming token holders?",
    insights: [
      { label: "GameFi", value: "High" },
      { label: "NFT", value: "68%" },
      { label: "Metaverse", value: "54%" },
      { label: "DeFi", value: "42%" },
      { label: "L2", value: "31%" },
    ],
    summary: "Category affinity from 92K wallets",
  },
];

const getRandomQuestion = () => QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];

interface Particle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  opacity: number;
  angle: number;
  speed: number;
  orbitRadius: number;
}

const PlaceholderAI = () => {
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData>(getRandomQuestion);
  const [phase, setPhase] = useState<"typing" | "dissolving" | "processing" | "forming" | "complete">("typing");
  const [typedText, setTypedText] = useState("");
  const [particles, setParticles] = useState<Particle[]>([]);
  const [processingPulse, setProcessingPulse] = useState(0);
  const [insightOpacity, setInsightOpacity] = useState<number[]>([]);
  const [lineOpacity, setLineOpacity] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const animationRef = useRef<number | null>(null);

  // Initialize insight opacity array
  useEffect(() => {
    setInsightOpacity(currentQuestion.insights.map(() => 0));
  }, [currentQuestion]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(prev => !prev), 530);
    return () => clearInterval(interval);
  }, []);

  // Typing animation
  useEffect(() => {
    if (phase !== "typing") return;
    let charIndex = 0;
    const question = currentQuestion.question;
    const typeInterval = setInterval(() => {
      if (charIndex <= question.length) {
        setTypedText(question.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => setPhase("dissolving"), 600);
      }
    }, 40);
    return () => clearInterval(typeInterval);
  }, [phase, currentQuestion.question]);

  // Create particles when dissolving
  useEffect(() => {
    if (phase !== "dissolving") return;
    
    const newParticles: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2;
      newParticles.push({
        id: i,
        x: 50 + (Math.random() - 0.5) * 30,
        y: 45 + (Math.random() - 0.5) * 10,
        targetX: 50,
        targetY: 50,
        size: 2 + Math.random() * 3,
        opacity: 0.6 + Math.random() * 0.4,
        angle: angle,
        speed: 0.02 + Math.random() * 0.02,
        orbitRadius: 8 + Math.random() * 12,
      });
    }
    setParticles(newParticles);
    
    setTimeout(() => setPhase("processing"), 800);
  }, [phase]);

  // Processing animation - particles orbit center
  useEffect(() => {
    if (phase !== "processing") return;
    
    let startTime = Date.now();
    const duration = 2000;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setProcessingPulse(Math.sin(elapsed * 0.008) * 0.5 + 0.5);
      
      setParticles(prev => prev.map(p => {
        const newAngle = p.angle + p.speed;
        const shrinkingRadius = p.orbitRadius * (1 - progress * 0.7);
        return {
          ...p,
          angle: newAngle,
          x: 50 + Math.cos(newAngle) * shrinkingRadius,
          y: 50 + Math.sin(newAngle) * shrinkingRadius,
          opacity: p.opacity * (1 - progress * 0.3),
        };
      }));
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setPhase("forming");
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [phase]);

  // Forming animation - particles shoot out to insight positions
  useEffect(() => {
    if (phase !== "forming") return;
    
    const insights = currentQuestion.insights;
    const positions = insights.map((_, i) => {
      const angle = (i / insights.length) * Math.PI * 2 - Math.PI / 2;
      const radius = 32;
      return {
        x: 50 + Math.cos(angle) * radius,
        y: 50 + Math.sin(angle) * radius,
      };
    });
    
    setParticles(prev => prev.map((p, i) => ({
      ...p,
      targetX: positions[i % insights.length].x,
      targetY: positions[i % insights.length].y,
    })));
    
    let startTime = Date.now();
    const duration = 1200;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      
      setParticles(prev => prev.map(p => ({
        ...p,
        x: 50 + (p.targetX - 50) * eased,
        y: 50 + (p.targetY - 50) * eased,
        opacity: (1 - progress) * p.opacity,
      })));
      
      setInsightOpacity(insights.map((_, i) => {
        const delay = i * 0.15;
        const insightProgress = Math.max(0, Math.min(1, (progress - delay) / 0.4));
        return insightProgress;
      }));
      
      setLineOpacity(Math.max(0, (progress - 0.3) / 0.7));
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setPhase("complete");
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [phase, currentQuestion.insights]);

  const reset = () => {
    setCurrentQuestion(getRandomQuestion());
    setPhase("typing");
    setTypedText("");
    setParticles([]);
    setProcessingPulse(0);
    setLineOpacity(0);
  };

  // Calculate insight positions
  const insightPositions = currentQuestion.insights.map((_, i) => {
    const angle = (i / currentQuestion.insights.length) * Math.PI * 2 - Math.PI / 2;
    const radius = 32;
    return {
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius,
    };
  });

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-transparent to-transparent" />

      {/* Stage label */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
        <span className="text-white/30 text-xs uppercase tracking-[0.2em]">
          {phase === "typing" && "Ask anything"}
          {phase === "dissolving" && "Processing query"}
          {phase === "processing" && "Analyzing on-chain data"}
          {phase === "forming" && "Generating insights"}
          {phase === "complete" && "Insights ready"}
        </span>
      </div>

      {/* Main visualization area */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[500px] h-[500px]">
          
          {/* Query text - typing phase */}
          {(phase === "typing" || phase === "dissolving") && (
            <div 
              className={`absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 ${
                phase === "dissolving" ? "opacity-0 scale-95" : "opacity-100"
              }`}
            >
              <div className="bg-white/[0.06] border border-white/10 rounded-xl px-5 py-3 whitespace-nowrap">
                <span className="text-white/80 text-sm">
                  {typedText}
                  {phase === "typing" && (
                    <span className={`inline-block w-0.5 h-4 bg-purple-400 ml-0.5 align-middle ${cursorVisible ? 'opacity-100' : 'opacity-0'}`} />
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Particles */}
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute rounded-full bg-purple-400 pointer-events-none"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                opacity: p.opacity,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 6px rgba(168, 85, 247, 0.6)",
              }}
            />
          ))}

          {/* Central processing orb */}
          {(phase === "processing" || phase === "forming" || phase === "complete") && (
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
              style={{
                opacity: phase === "processing" ? 1 : phase === "forming" ? 1 - lineOpacity * 0.3 : 0.8,
              }}
            >
              <div 
                className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/30 to-purple-700/30 border border-purple-500/40 flex items-center justify-center backdrop-blur-sm"
                style={{
                  boxShadow: `0 0 ${20 + processingPulse * 20}px rgba(168, 85, 247, ${0.3 + processingPulse * 0.2})`,
                  transform: `scale(${1 + processingPulse * 0.1})`,
                }}
              >
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          )}

          {/* Connection lines */}
          {(phase === "forming" || phase === "complete") && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: lineOpacity }}>
              {insightPositions.map((pos, i) => (
                <line
                  key={`line-${i}`}
                  x1="50%"
                  y1="50%"
                  x2={`${pos.x}%`}
                  y2={`${pos.y}%`}
                  stroke="rgba(168, 85, 247, 0.25)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}
            </svg>
          )}

          {/* Insight nodes */}
          {(phase === "forming" || phase === "complete") && insightPositions.map((pos, i) => (
            <div
              key={currentQuestion.insights[i]?.label || i}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                opacity: insightOpacity[i] || 0,
                transform: `translate(-50%, -50%) scale(${0.8 + (insightOpacity[i] || 0) * 0.2})`,
              }}
            >
              <div className={`bg-white/[0.08] border rounded-xl px-4 py-2.5 text-center backdrop-blur-sm transition-all duration-500 ${
                phase === "complete" ? "border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]" : "border-white/10"
              }`}>
                <div className="text-white font-medium text-sm">{currentQuestion.insights[i]?.label}</div>
                <div className="text-purple-400 text-xs">{currentQuestion.insights[i]?.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom caption */}
      {phase === "complete" && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/30 text-sm animate-fade-in">
          {currentQuestion.summary}
        </div>
      )}

      {/* Reset button */}
      <button
        onClick={reset}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/[0.06] hover:bg-white/10 text-white/50 hover:text-white/70 text-sm rounded-lg transition-all border border-white/5"
      >
        Reset
      </button>
    </div>
  );
};

export default PlaceholderAI;
