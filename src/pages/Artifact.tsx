import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import logoWhite from "@/assets/audiencescan-logo-white.png";

interface TokenData {
  logo: string;
  score: number;
}

const Artifact = () => {
  const { studyId } = useParams<{ studyId: string }>();
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!studyId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`https://token-analysis-final.nw.r.appspot.com/chart/${studyId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        
        const data = await response.json();
        setTokens(data.token || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studyId]);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between">
        <img src={logoWhite} alt="AudienceScan" className="h-8" />
        <a
          href="https://app.audiencescan.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2 bg-violet-600 hover:bg-violet-500 rounded-full text-sm font-medium transition-colors"
        >
          Launch App
        </a>
      </header>

      {/* Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-20">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            <p className="text-white/60">Loading token data...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <span className="material-icons-outlined text-red-500 text-5xl mb-4">error_outline</span>
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        ) : (
          <TokenOverlapChart tokens={tokens} />
        )}
      </div>
    </div>
  );
};

interface TokenOverlapChartProps {
  tokens: TokenData[];
}

const TokenOverlapChart = ({ tokens }: TokenOverlapChartProps) => {
  const size = 700;
  const center = size / 2;
  
  // Use first token as center (the scanned token)
  const centerToken = tokens[0];
  const otherTokens = tokens.slice(1, 100); // Max 99 outer tokens
  
  // Ring configurations: [count, radius, tokenSize, baseOpacity]
  const rings: [number, number, number, number][] = [
    [8, 90, 22, 1],
    [12, 145, 18, 0.9],
    [18, 200, 15, 0.75],
    [22, 255, 13, 0.6],
    [28, 305, 11, 0.45],
    [12, 340, 9, 0.3],
  ];
  
  let tokenIndex = 0;
  const positionedTokens: { x: number; y: number; r: number; logo: string; opacity: number; score: number }[] = [];
  
  // Sort by score descending so higher scores are in inner rings
  const sortedTokens = [...otherTokens].sort((a, b) => b.score - a.score);
  
  rings.forEach(([count, radius, tokenSize, baseOpacity]) => {
    for (let i = 0; i < count && tokenIndex < sortedTokens.length; i++) {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const token = sortedTokens[tokenIndex];
      positionedTokens.push({
        x: center + Math.cos(angle) * radius,
        y: center + Math.sin(angle) * radius,
        r: tokenSize,
        logo: token.logo,
        opacity: baseOpacity * Math.max(token.score, 0.3),
        score: token.score,
      });
      tokenIndex++;
    }
  });

  return (
    <div className="max-w-5xl mx-auto text-center relative">
      {/* Text content */}
      <div className="relative z-10">
        <p className="text-violet-400 text-sm md:text-base mb-4 tracking-widest uppercase animate-fade-in-up">
          Token Analysis
        </p>
        <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up delay-100">
          Token Overlap Results
        </h2>
        <p className="text-lg text-white/60 mb-8 animate-fade-in-up delay-200">
          Ranked by how many wallets also transact each token
        </p>
      </div>

      {/* Chart */}
      <div className="relative z-10 flex justify-center animate-fade-in-scale delay-300">
        <style>{`
          @keyframes dashFlow {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -12; }
          }
          @keyframes tokenFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          @keyframes centerPulse {
            0%, 100% { transform: scale(1); filter: url(#glow); }
            50% { transform: scale(1.05); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out forwards;
            opacity: 0;
          }
          .animate-fade-in-scale {
            animation: fadeInUp 0.5s ease-out forwards;
            opacity: 0;
          }
          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-300 { animation-delay: 0.3s; }
        `}</style>
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`}
          className="w-[95vw] h-[95vw] max-w-[650px] max-h-[650px]"
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            {positionedTokens.map((_, i) => (
              <clipPath key={`clip-${i}`} id={`artifact-token-clip-${i}`}>
                <circle cx={positionedTokens[i].x} cy={positionedTokens[i].y} r={positionedTokens[i].r - 1} />
              </clipPath>
            ))}
            <clipPath id="artifact-center-clip">
              <circle cx={center} cy={center} r={28} />
            </clipPath>
          </defs>

          {/* Connection lines */}
          {positionedTokens.map((token, i) => (
            <line
              key={`line-${i}`}
              x1={center}
              y1={center}
              x2={token.x}
              y2={token.y}
              stroke={`rgba(139, 92, 246, ${token.opacity * 0.4})`}
              strokeWidth="1"
              strokeDasharray="4 4"
              style={{
                animation: `dashFlow ${2 + (i % 3) * 0.5}s linear infinite`,
              }}
            />
          ))}

          {/* Token circles */}
          {positionedTokens.map((token, i) => (
            <g 
              key={`token-${i}`} 
              style={{ 
                opacity: token.opacity,
                animation: `tokenFloat ${3 + (i % 4) * 0.5}s ${(i * 0.1)}s ease-in-out infinite`,
                transformOrigin: `${token.x}px ${token.y}px`,
              }}
            >
              <circle
                cx={token.x}
                cy={token.y}
                r={token.r}
                fill="rgba(255, 255, 255, 0.1)"
                stroke={`rgba(139, 92, 246, ${token.opacity * 0.6})`}
                strokeWidth="1"
              />
              <image
                href={token.logo}
                x={token.x - token.r + 1}
                y={token.y - token.r + 1}
                width={(token.r - 1) * 2}
                height={(token.r - 1) * 2}
                clipPath={`url(#artifact-token-clip-${i})`}
              />
            </g>
          ))}

          {/* Central node */}
          {centerToken && (
            <g 
              filter="url(#glow)"
              style={{
                animation: 'centerPulse 2s ease-in-out infinite',
                transformOrigin: `${center}px ${center}px`,
              }}
            >
              <circle cx={center} cy={center} r={32} fill="#7c3aed" stroke="white" strokeWidth="2" />
              <image
                href={centerToken.logo}
                x={center - 24}
                y={center - 24}
                width="48"
                height="48"
                clipPath="url(#artifact-center-clip)"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Token count */}
      <p className="text-white/40 text-sm mt-6 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
        {tokens.length} tokens analyzed
      </p>
    </div>
  );
};

export default Artifact;
