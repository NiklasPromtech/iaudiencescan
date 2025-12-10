import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Rocket, Coins, Wallet, Building, CheckCircle2 } from "lucide-react";
import logoWhite from "@/assets/audiencescan-logo-white.png";

interface WizardOption {
  id: string;
  icon: React.ReactNode;
  label: string;
  smallText: string;
  title: string;
  cta: string;
}

const wizardOptions: WizardOption[] = [
  {
    id: "agency",
    icon: <Building2 className="w-7 h-7" />,
    label: "Agency",
    smallText: "Win more pitches",
    title: "Build Web3 pitches and GTMs backed by real on-chain behavior",
    cta: "Validate your next Web3 pitch",
  },
  {
    id: "launchpad",
    icon: <Rocket className="w-7 h-7" />,
    label: "Launchpads",
    smallText: "Attract the right tokens",
    title: "Show token teams you already understand their audience",
    cta: "Show audience demand to token teams",
  },
  {
    id: "token",
    icon: <Coins className="w-7 h-7" />,
    label: "Token owners",
    smallText: "Grow token adoption",
    title: "Find the communities your users are already part of — and reach more like them",
    cta: "Find where your next users are",
  },
  {
    id: "wallet",
    icon: <Wallet className="w-7 h-7" />,
    label: "Web3 wallets",
    smallText: "Find more wallet users",
    title: "Use your existing users' wallets to find where similar users already are",
    cta: "Upload wallets to find more users",
  },
  {
    id: "cex",
    icon: <Building className="w-7 h-7" />,
    label: "CEX",
    smallText: "Find your next token listing",
    title: "Identify high-signal tokens by analyzing where users of other CEXs transact",
    cta: "Discover listing opportunities",
  },
];

// Network Background Animation
const NetworkBackground = () => {
  const [nodes, setNodes] = useState<{ x: number; y: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    const newNodes = Array.from({ length: 40 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      size: 2 + Math.random() * 3,
    }));
    setNodes(newNodes);
  }, []);

  return (
    <svg className="absolute inset-0 w-full h-full opacity-20">
      {nodes.map((node, i) =>
        nodes.slice(i + 1, i + 3).map((target, j) => (
          <line
            key={`${i}-${j}`}
            x1={`${node.x}%`}
            y1={`${node.y}%`}
            x2={`${target.x}%`}
            y2={`${target.y}%`}
            stroke="rgba(168, 85, 247, 0.4)"
            strokeWidth="1"
            style={{
              animation: `flowLine 3s ${node.delay}s ease-out forwards`,
              strokeDasharray: 100,
              strokeDashoffset: 100,
            }}
          />
        ))
      )}
      {nodes.map((node, i) => (
        <circle
          key={i}
          cx={`${node.x}%`}
          cy={`${node.y}%`}
          r={node.size}
          fill="rgba(168, 85, 247, 0.6)"
          style={{
            animation: `nodeAppear 0.6s ${node.delay}s ease-out forwards`,
            opacity: 0,
          }}
        />
      ))}
    </svg>
  );
};

const Wizard = () => {
  const [selectedOption, setSelectedOption] = useState<WizardOption | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleSelect = (option: WizardOption) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedOption(option);
      setIsTransitioning(false);
    }, 400);
  };

  const handleBack = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedOption(null);
      setIsTransitioning(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-violet-500/8 rounded-full blur-[180px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Animated network background */}
      <div className="fixed inset-0 overflow-hidden">
        <NetworkBackground />
      </div>

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

      {/* Main Content */}
      <div
        className={`min-h-screen flex items-center justify-center px-6 py-24 transition-all duration-500 ${
          isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {!selectedOption ? (
          // Selection Screen
          <div className="max-w-5xl w-full space-y-16 relative z-10">
            <div className="text-center space-y-6 animate-fade-in-up">
              <p className="text-violet-400 text-sm tracking-[0.3em] uppercase">
                Welcome
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                What best describes you?
              </h1>
              <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto">
                Select your role to discover how on-chain insights can transform your strategy
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {wizardOptions.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHoveredId(option.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 md:p-7 text-left transition-all duration-300 overflow-hidden animate-fade-in-up ${
                    hoveredId && hoveredId !== option.id ? 'opacity-50' : 'opacity-100'
                  }`}
                  style={{
                    animationDelay: `${0.1 + index * 0.08}s`,
                    animationFillMode: 'backwards',
                  }}
                >
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 border border-purple-500/0 group-hover:border-purple-500/40 rounded-2xl transition-all duration-300" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-all duration-300">
                        {option.icon}
                      </div>
                      <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    
                    <h3 className="text-white font-semibold text-xl mb-2 group-hover:text-white transition-colors">
                      {option.label}
                    </h3>
                    <p className="text-white/40 text-sm group-hover:text-white/60 transition-colors">
                      {option.smallText}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Result Screen
          <div className="max-w-3xl w-full text-center space-y-10 relative z-10">
            <button
              onClick={handleBack}
              className="text-white/40 hover:text-white text-sm inline-flex items-center gap-2 transition-colors animate-fade-in-up"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back
            </button>

            <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
                <span className="text-purple-400 text-sm tracking-wider uppercase">
                  {selectedOption.smallText}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white">
                {selectedOption.title}
              </h1>
            </div>

            <div className="pt-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <a
                href="https://app.audiencescan.xyz"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  {selectedOption.cta}
                </Button>
              </a>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes flowLine {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes nodeAppear {
          0% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Wizard;
