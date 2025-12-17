import { useState, useEffect } from "react";
import { Search, Sparkles } from "lucide-react";

const QUESTION = "Which communities overlap most with $PEPE holders?";
const INSIGHTS = [
  { label: "$DOGE", value: "78% overlap" },
  { label: "$SHIB", value: "65% overlap" },
  { label: "$FLOKI", value: "52% overlap" },
  { label: "Meme category", value: "High affinity" },
];

const PlaceholderAI = () => {
  const [phase, setPhase] = useState<"typing" | "thinking" | "responding">("typing");
  const [typedText, setTypedText] = useState("");
  const [visibleInsights, setVisibleInsights] = useState<number>(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Typing animation
  useEffect(() => {
    if (phase !== "typing") return;

    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex <= QUESTION.length) {
        setTypedText(QUESTION.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => setPhase("thinking"), 500);
      }
    }, 45);

    return () => clearInterval(typeInterval);
  }, [phase]);

  // Thinking to responding transition
  useEffect(() => {
    if (phase !== "thinking") return;
    const timer = setTimeout(() => setPhase("responding"), 1800);
    return () => clearTimeout(timer);
  }, [phase]);

  // Reveal insights one by one
  useEffect(() => {
    if (phase !== "responding") return;

    const revealInterval = setInterval(() => {
      setVisibleInsights(prev => {
        if (prev >= INSIGHTS.length) {
          clearInterval(revealInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 350);

    return () => clearInterval(revealInterval);
  }, [phase]);

  const reset = () => {
    setPhase("typing");
    setTypedText("");
    setVisibleInsights(0);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center p-8">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-transparent to-transparent" />

      {/* Stage label */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
        <span className="text-white/30 text-xs uppercase tracking-[0.2em]">
          {phase === "typing" && "Ask anything"}
          {phase === "thinking" && "Analyzing on-chain data"}
          {phase === "responding" && "Insights ready"}
        </span>
      </div>

      {/* Main content */}
      <div className="w-full max-w-lg space-y-6 relative z-10">
        {/* Input area */}
        <div className="bg-white/[0.06] border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Search className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex-1 min-h-[24px]">
              <span className="text-white/80 text-sm">
                {typedText}
                {phase === "typing" && (
                  <span 
                    className={`inline-block w-0.5 h-4 bg-purple-400 ml-0.5 align-middle transition-opacity duration-100 ${
                      cursorVisible ? 'opacity-100' : 'opacity-0'
                    }`} 
                  />
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Thinking indicator */}
        {phase === "thinking" && (
          <div className="flex items-center justify-center gap-3 animate-fade-in py-4">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div 
                  key={i}
                  className="w-2 h-2 rounded-full bg-purple-500/60 animate-pulse" 
                  style={{ animationDelay: `${i * 150}ms` }} 
                />
              ))}
            </div>
            <span className="text-white/40 text-sm">Searching billions of transactions...</span>
          </div>
        )}

        {/* Response area */}
        {phase === "responding" && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="text-white/50 text-xs uppercase tracking-wider">AudienceScan Signal</span>
            </div>

            {INSIGHTS.map((insight, index) => (
              <div
                key={insight.label}
                className={`flex items-center justify-between bg-white/[0.04] border border-white/5 rounded-lg px-4 py-3 transition-all duration-500 ${
                  index < visibleInsights
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                }`}
              >
                <span className="text-white/70 text-sm font-medium">{insight.label}</span>
                <span className="text-purple-400 text-sm">{insight.value}</span>
              </div>
            ))}

            {visibleInsights >= INSIGHTS.length && (
              <p className="text-white/30 text-xs mt-4 animate-fade-in">
                Based on 847,000 wallet transactions across 3 chains
              </p>
            )}
          </div>
        )}
      </div>

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
