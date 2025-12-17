import { useState, useEffect, useRef } from "react";
import { Sparkles, Bot, User } from "lucide-react";

interface QuestionData {
  question: string;
  response: string;
  insights: { label: string; value: string }[];
}

const QUESTIONS: QuestionData[] = [
  {
    question: "Which communities overlap with $PEPE?",
    response: "Based on 847K transactions across 3 chains, I found strong overlap with meme token communities:",
    insights: [
      { label: "$DOGE", value: "78%" },
      { label: "$SHIB", value: "65%" },
      { label: "$FLOKI", value: "52%" },
      { label: "$BONK", value: "48%" },
    ],
  },
  {
    question: "What chains are $ARB holders most active on?",
    response: "Analyzing 1.2M wallet interactions, here's the chain activity breakdown:",
    insights: [
      { label: "Arbitrum", value: "94%" },
      { label: "Ethereum", value: "76%" },
      { label: "Optimism", value: "41%" },
      { label: "Base", value: "28%" },
    ],
  },
  {
    question: "Best platforms to reach DeFi users?",
    response: "Social coverage analysis across 156 tokens shows these platforms:",
    insights: [
      { label: "X/Twitter", value: "89%" },
      { label: "Telegram", value: "72%" },
      { label: "Discord", value: "58%" },
      { label: "Reddit", value: "34%" },
    ],
  },
  {
    question: "How confident is the $SOL scan data?",
    response: "High confidence score - this data is ready for campaign activation:",
    insights: [
      { label: "Overall", value: "87%" },
      { label: "Data Integrity", value: "92%" },
      { label: "Behavior", value: "78%" },
      { label: "Context", value: "91%" },
    ],
  },
  {
    question: "Top categories for gaming token holders?",
    response: "Category affinity analysis from 92K wallets reveals:",
    insights: [
      { label: "GameFi", value: "High" },
      { label: "NFT", value: "68%" },
      { label: "Metaverse", value: "54%" },
      { label: "DeFi", value: "42%" },
    ],
  },
];

const getRandomQuestion = () => QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  angle: number;
}

const PlaceholderAI = () => {
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData>(getRandomQuestion);
  const [phase, setPhase] = useState<"typing" | "thinking" | "responding" | "insights" | "complete">("typing");
  const [typedText, setTypedText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [particles, setParticles] = useState<Particle[]>([]);
  const [insightReveal, setInsightReveal] = useState<number[]>([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [thinkingPulse, setThinkingPulse] = useState(0);
  const animationRef = useRef<number | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(prev => !prev), 530);
    return () => clearInterval(interval);
  }, []);

  // Typing animation for user message
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
        setTimeout(() => setPhase("thinking"), 400);
      }
    }, 35);
    return () => clearInterval(typeInterval);
  }, [phase, currentQuestion.question]);

  // Thinking animation with particles
  useEffect(() => {
    if (phase !== "thinking") return;
    
    // Create particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        opacity: 0.3 + Math.random() * 0.7,
        speed: 0.5 + Math.random() * 1.5,
        angle: Math.random() * Math.PI * 2,
      });
    }
    setParticles(newParticles);

    let startTime = Date.now();
    const duration = 2000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setThinkingPulse(Math.sin(elapsed * 0.01) * 0.5 + 0.5);
      
      // Spiral particles inward
      setParticles(prev => prev.map(p => ({
        ...p,
        x: 50 + (p.x - 50) * (1 - progress * 0.8) + Math.cos(p.angle + elapsed * 0.003 * p.speed) * (20 - progress * 18),
        y: 50 + (p.y - 50) * (1 - progress * 0.8) + Math.sin(p.angle + elapsed * 0.003 * p.speed) * (20 - progress * 18),
        opacity: p.opacity * (1 - progress * 0.5),
      })));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setParticles([]);
        setPhase("responding");
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [phase]);

  // Typing animation for AI response
  useEffect(() => {
    if (phase !== "responding") return;
    let charIndex = 0;
    const response = currentQuestion.response;
    const typeInterval = setInterval(() => {
      if (charIndex <= response.length) {
        setResponseText(response.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => setPhase("insights"), 300);
      }
    }, 20);
    return () => clearInterval(typeInterval);
  }, [phase, currentQuestion.response]);

  // Insight cards reveal
  useEffect(() => {
    if (phase !== "insights") return;
    
    const insights = currentQuestion.insights;
    let revealed = 0;
    
    const revealInterval = setInterval(() => {
      if (revealed < insights.length) {
        setInsightReveal(prev => [...prev, revealed]);
        revealed++;
      } else {
        clearInterval(revealInterval);
        setTimeout(() => setPhase("complete"), 500);
      }
    }, 200);

    return () => clearInterval(revealInterval);
  }, [phase, currentQuestion.insights]);

  // Auto-loop after completion
  useEffect(() => {
    if (phase !== "complete") return;
    
    const timeout = setTimeout(() => {
      let newQuestion = getRandomQuestion();
      while (newQuestion.question === currentQuestion.question && QUESTIONS.length > 1) {
        newQuestion = getRandomQuestion();
      }
      setCurrentQuestion(newQuestion);
      setPhase("typing");
      setTypedText("");
      setResponseText("");
      setParticles([]);
      setInsightReveal([]);
      setThinkingPulse(0);
    }, 3500);
    
    return () => clearTimeout(timeout);
  }, [phase, currentQuestion.question]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-purple-900/5" />
      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] transition-opacity duration-1000"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          opacity: phase === "thinking" ? 0.8 : 0.3,
        }}
      />

      {/* Chat container */}
      <div className="relative w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 px-4">
          <div className="relative w-10 h-10 p-[2px] rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.4),0_0_30px_rgba(236,72,153,0.2)]">
            <div className="w-full h-full rounded-[10px] bg-black flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-white font-medium">AudienceScan Signal</h1>
            <p className="text-white/40 text-sm">AI Strategy Assistant</p>
          </div>
        </div>

        {/* Chat area */}
        <div ref={chatRef} className="space-y-4 px-4">
          {/* User message */}
          {(phase !== "typing" || typedText) && (
            <div className="flex justify-end animate-fade-in">
              <div className="flex items-start gap-3 max-w-[85%]">
                <div className="bg-purple-500/20 border border-purple-500/30 rounded-2xl rounded-tr-sm px-4 py-3 backdrop-blur-sm">
                  <p className="text-white/90 text-sm">
                    {typedText}
                    {phase === "typing" && (
                      <span className={`inline-block w-0.5 h-4 bg-purple-400 ml-0.5 align-middle transition-opacity ${cursorVisible ? 'opacity-100' : 'opacity-0'}`} />
                    )}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white/60" />
                </div>
              </div>
            </div>
          )}

          {/* Thinking indicator */}
          {phase === "thinking" && (
            <div className="flex items-start gap-3 animate-fade-in">
              <div 
                className="relative w-8 h-8 p-[2px] rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0 transition-all"
                style={{
                  boxShadow: `0 0 ${15 + thinkingPulse * 20}px rgba(168, 85, 247, ${0.4 + thinkingPulse * 0.3}), 0 0 ${30 + thinkingPulse * 30}px rgba(236, 72, 153, ${0.2 + thinkingPulse * 0.2})`,
                  transform: `scale(${1 + thinkingPulse * 0.1})`,
                }}
              >
                <div className="w-full h-full rounded-[6px] bg-black flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="relative bg-white/[0.06] border border-white/10 rounded-2xl rounded-tl-sm px-4 min-w-[120px] h-10 overflow-hidden flex items-center">
                {/* Particles inside thinking bubble */}
                {particles.map(p => (
                  <div
                    key={p.id}
                    className="absolute rounded-full bg-purple-400"
                    style={{
                      left: `${p.x}%`,
                      top: `${p.y}%`,
                      width: p.size,
                      height: p.size,
                      opacity: p.opacity,
                      transform: "translate(-50%, -50%)",
                      boxShadow: `0 0 ${p.size * 2}px rgba(168, 85, 247, 0.6)`,
                    }}
                  />
                ))}
                <div className="flex items-center gap-1.5 relative z-10">
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          {/* AI Response */}
          {(phase === "responding" || phase === "insights" || phase === "complete") && (
            <div className="flex items-start gap-3 animate-fade-in">
              <div className="relative w-8 h-8 p-[2px] rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.4),0_0_24px_rgba(236,72,153,0.2)]">
                <div className="w-full h-full rounded-[6px] bg-black flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1 space-y-3">
                {/* Response text */}
                <div className="bg-white/[0.06] border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 backdrop-blur-sm">
                  <p className="text-white/80 text-sm">
                    {responseText}
                    {phase === "responding" && (
                      <span className={`inline-block w-0.5 h-4 bg-purple-400 ml-0.5 align-middle transition-opacity ${cursorVisible ? 'opacity-100' : 'opacity-0'}`} />
                    )}
                  </p>
                </div>

                {/* Insight cards */}
                {(phase === "insights" || phase === "complete") && (
                  <div className="flex flex-wrap gap-2">
                    {currentQuestion.insights.map((insight, i) => (
                      <div
                        key={insight.label}
                        className={`transform transition-all duration-500 ${
                          insightReveal.includes(i) 
                            ? "opacity-100 translate-y-0 scale-100" 
                            : "opacity-0 translate-y-4 scale-90"
                        }`}
                        style={{ transitionDelay: `${i * 50}ms` }}
                      >
                        <div 
                          className="bg-gradient-to-br from-purple-500/20 to-purple-700/20 border border-purple-500/30 rounded-xl px-3 py-2 backdrop-blur-sm"
                          style={{
                            boxShadow: insightReveal.includes(i) ? "0 0 20px rgba(168, 85, 247, 0.2)" : "none",
                          }}
                        >
                          <div className="text-white font-medium text-sm">{insight.label}</div>
                          <div className="text-purple-400 text-xs">{insight.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input field (decorative) */}
        <div className="mt-8 px-4">
          <div className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-white/30 text-sm flex-1">Ask about your audience...</span>
            <div className="relative w-8 h-8 p-[2px] rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_12px_rgba(168,85,247,0.3),0_0_24px_rgba(236,72,153,0.15)]">
              <div className="w-full h-full rounded-[6px] bg-black flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating particles decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-purple-400/30"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default PlaceholderAI;
