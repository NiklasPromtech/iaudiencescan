import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Rocket, Coins, Wallet, Building, ArrowRight, Search, Target, ArrowLeft } from "lucide-react";
import logoWhite from "@/assets/audiencescan-logo-white.png";
import { useIsMobile } from "@/hooks/use-mobile";

interface ScanOption {
  id: string;
  title: string;
  description: string;
  cta: string;
  icon: React.ReactNode;
}

interface WizardOption {
  id: string;
  icon: React.ReactNode;
  label: string;
  smallText: string;
  title: string;
  subline: string;
  cta: string;
  gradient: string;
  scanOptions: ScanOption[];
}

const wizardOptions: WizardOption[] = [
  {
    id: "agency",
    icon: <Building2 className="w-6 h-6" />,
    label: "Agency",
    smallText: "Win more Web3 pitches",
    title: "Build pitches backed by real on-chain behavior",
    subline: "Remove guesswork from your Web3 GTM.",
    cta: "Validate your next pitch",
    gradient: "from-violet-600 to-purple-600",
    scanOptions: [
      {
        id: "pitch-token",
        title: "Scan a pitching token",
        description: "Validate where users overlap on-chain.",
        cta: "Scan token",
        icon: <Search className="w-5 h-5" />,
      },
      {
        id: "competitor",
        title: "Scan a competitor",
        description: "Reveal competing communities.",
        cta: "Scan competitor",
        icon: <Target className="w-5 h-5" />,
      },
    ],
  },
  {
    id: "launchpad",
    icon: <Rocket className="w-6 h-6" />,
    label: "Launchpads",
    smallText: "Attract the right token teams",
    title: "Show token teams you understand their audience",
    subline: "Prove demand with real data.",
    cta: "Show audience demand",
    gradient: "from-violet-600 to-purple-600",
    scanOptions: [
      {
        id: "category-scan",
        title: "Scan by category",
        description: "Find aligned communities.",
        cta: "Scan category",
        icon: <Search className="w-5 h-5" />,
      },
      {
        id: "competitor-launchpad",
        title: "Analyze competitors",
        description: "See competitor audiences.",
        cta: "Scan competitors",
        icon: <Target className="w-5 h-5" />,
      },
    ],
  },
  {
    id: "token",
    icon: <Coins className="w-6 h-6" />,
    label: "Token owners",
    smallText: "Grow token adoption",
    title: "Find communities your users belong to",
    subline: "Your holders reveal your next audience.",
    cta: "Find your next users",
    gradient: "from-violet-600 to-purple-600",
    scanOptions: [
      {
        id: "own-token",
        title: "Scan your token",
        description: "Discover holder communities.",
        cta: "Scan my token",
        icon: <Search className="w-5 h-5" />,
      },
      {
        id: "similar-token",
        title: "Scan similar tokens",
        description: "Find untapped communities.",
        cta: "Scan similar",
        icon: <Target className="w-5 h-5" />,
      },
    ],
  },
  {
    id: "wallet",
    icon: <Wallet className="w-6 h-6" />,
    label: "Web3 wallets",
    smallText: "Acquire more wallet users",
    title: "Use existing users to find lookalikes",
    subline: "Your user base is your blueprint.",
    cta: "Find more users",
    gradient: "from-violet-600 to-purple-600",
    scanOptions: [
      {
        id: "upload-wallets",
        title: "Upload wallet list",
        description: "Analyze for lookalikes.",
        cta: "Upload wallets",
        icon: <Search className="w-5 h-5" />,
      },
      {
        id: "competitor-wallet",
        title: "Scan competitors",
        description: "See competitor communities.",
        cta: "Scan competitors",
        icon: <Target className="w-5 h-5" />,
      },
    ],
  },
  {
    id: "cex",
    icon: <Building className="w-6 h-6" />,
    label: "CEX",
    smallText: "Identify your next token listing",
    title: "Identify high-signal tokens for listing",
    subline: "On-chain behavior reveals opportunities.",
    cta: "Discover listings",
    gradient: "from-violet-600 to-purple-600",
    scanOptions: [
      {
        id: "deposit-analysis",
        title: "Analyze deposits",
        description: "See active tokens.",
        cta: "Analyze",
        icon: <Search className="w-5 h-5" />,
      },
      {
        id: "competitor-cex",
        title: "Scan competitors",
        description: "Find trending tokens.",
        cta: "Scan CEX",
        icon: <Target className="w-5 h-5" />,
      },
    ],
  },
];

const baseWords = ["confident", "smarter", "defensible", "data-backed"];
const WORD_HEIGHT = 40;

const WizardMobile = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedOption, setSelectedOption] = useState<WizardOption | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);

  // Redirect to desktop version if not mobile
  useEffect(() => {
    if (isMobile === false) {
      navigate("/wizard", { replace: true });
    }
  }, [isMobile]);

  const handleLaunchApp = () => {
    setIsLaunching(true);
    setTimeout(() => {
      window.open("https://app.audiencescan.io", "_blank");
      setTimeout(() => setIsLaunching(false), 300);
    }, 800);
  };

  // Word cycling
  useEffect(() => {
    if (selectedOption) return;
    const interval = setInterval(() => {
      setCurrentWordIndex(prev => (prev + 2 + Math.floor(Math.random() * 3)) % baseWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedOption]);

  const handleSelect = (option: WizardOption) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedOption(option);
      setIsTransitioning(false);
    }, 300);
  };

  const handleBack = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedOption(null);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 flex items-center justify-between bg-black/80 backdrop-blur-md">
        <img src={logoWhite} alt="AudienceScan" className="h-5 opacity-80" />
        <button
          onClick={handleLaunchApp}
          className="px-4 py-1.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-full text-xs transition-all"
        >
          Launch App
        </button>
      </header>

      {/* White transition overlay */}
      <div 
        className={`fixed inset-0 bg-white z-[100] pointer-events-none transition-opacity ease-in-out ${
          isLaunching ? 'opacity-100 duration-700' : 'opacity-0 duration-300'
        }`}
      />

      <div
        className={`min-h-screen pt-16 transition-all ease-in-out ${
          isLaunching ? "opacity-0 duration-500" : isTransitioning ? "opacity-0 duration-300" : "opacity-100 duration-300"
        }`}
      >
        {!selectedOption ? (
          /* Selection Screen */
          <div className="min-h-screen flex flex-col px-4 pb-6">
            {/* Mini Network Visualization */}
            <div className="pt-6 pb-4">
              <div className="relative w-full h-40 flex items-center justify-center overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 280 140">
                  {/* Connection lines */}
                  <g className="opacity-30">
                    {/* Lines from center to outer nodes */}
                    <line x1="140" y1="70" x2="60" y2="35" stroke="url(#lineGrad)" strokeWidth="1" />
                    <line x1="140" y1="70" x2="220" y2="35" stroke="url(#lineGrad)" strokeWidth="1" />
                    <line x1="140" y1="70" x2="45" y2="90" stroke="url(#lineGrad)" strokeWidth="1" />
                    <line x1="140" y1="70" x2="235" y2="90" stroke="url(#lineGrad)" strokeWidth="1" />
                    <line x1="140" y1="70" x2="80" y2="120" stroke="url(#lineGrad)" strokeWidth="1" />
                    <line x1="140" y1="70" x2="200" y2="120" stroke="url(#lineGrad)" strokeWidth="1" />
                    {/* Cross connections */}
                    <line x1="60" y1="35" x2="45" y2="90" stroke="url(#lineGrad)" strokeWidth="0.5" className="opacity-50" />
                    <line x1="220" y1="35" x2="235" y2="90" stroke="url(#lineGrad)" strokeWidth="0.5" className="opacity-50" />
                    <line x1="45" y1="90" x2="80" y2="120" stroke="url(#lineGrad)" strokeWidth="0.5" className="opacity-50" />
                    <line x1="235" y1="90" x2="200" y2="120" stroke="url(#lineGrad)" strokeWidth="0.5" className="opacity-50" />
                  </g>
                  
                  {/* Gradient definitions */}
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                    <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  
                  {/* Outer nodes */}
                  {[
                    { x: 60, y: 35, size: 10 },
                    { x: 220, y: 35, size: 12 },
                    { x: 45, y: 90, size: 8 },
                    { x: 235, y: 90, size: 11 },
                    { x: 80, y: 120, size: 9 },
                    { x: 200, y: 120, size: 10 },
                  ].map((node, i) => (
                    <g key={i}>
                      <circle cx={node.x} cy={node.y} r={node.size + 4} fill="url(#nodeGlow)" />
                      <circle 
                        cx={node.x} 
                        cy={node.y} 
                        r={node.size} 
                        fill="#1a1a1a" 
                        stroke="#a855f7" 
                        strokeWidth="1.5"
                        className="opacity-60"
                      />
                    </g>
                  ))}
                  
                  {/* Center node (larger, highlighted) */}
                  <circle cx="140" cy="70" r="24" fill="url(#nodeGlow)" />
                  <circle 
                    cx="140" 
                    cy="70" 
                    r="18" 
                    fill="#1a1a1a" 
                    stroke="url(#lineGrad)" 
                    strokeWidth="2"
                  />
                  <text 
                    x="140" 
                    y="74" 
                    textAnchor="middle" 
                    fill="white" 
                    fontSize="10" 
                    fontWeight="600"
                    className="opacity-80"
                  >
                    TOKEN
                  </text>
                </svg>
                
                {/* Subtle radial glow behind */}
                <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Hero Text */}
            <div className="pb-5 space-y-2">
              <p className="text-purple-400 text-xs tracking-widest uppercase font-medium">
                On-chain audience intelligence
              </p>
              <h1 className="text-2xl font-bold leading-tight">
                Make{" "}
                <span className="inline-block align-bottom overflow-hidden whitespace-nowrap" style={{ height: WORD_HEIGHT }}>
                  <span
                    className="flex flex-col"
                    style={{
                      transform: `translateY(-${currentWordIndex * WORD_HEIGHT}px)`,
                      transition: "transform 800ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  >
                    {baseWords.map((word, i) => (
                      <span
                        key={i}
                        className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
                        style={{ height: WORD_HEIGHT, lineHeight: `${WORD_HEIGHT}px` }}
                      >
                        {word}
                      </span>
                    ))}
                  </span>
                </span>{" "}
                growth decisions
              </h1>
              <p className="text-white/50 text-sm">
                Select your role to get started.
              </p>
            </div>

            {/* Options - Full width cards */}
            <div className="flex-1 space-y-3">
              {wizardOptions.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  className="group relative w-full bg-white/[0.03] active:bg-white/[0.08] border border-white/[0.08] rounded-xl p-4 text-left transition-all"
                  style={{
                    animation: `fadeInUp 0.4s ${index * 0.05}s ease-out backwards`,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-purple-400 p-2 bg-purple-500/10 rounded-lg">
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-sm">
                        {option.label}
                      </h3>
                      <p className="text-white/70 text-xs">
                        {option.smallText}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/30" />
                  </div>
                </button>
              ))}
            </div>

            {/* Bottom text */}
            <p className="text-white/30 text-xs text-center mt-6">
              Powered by real on-chain transaction data
            </p>
          </div>
        ) : (
          /* Detail Screen */
          <div className="min-h-screen flex flex-col px-4 pb-6">
            {/* Back button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-white/50 text-sm py-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {/* Header */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-purple-400 p-2 bg-purple-500/10 rounded-lg">
                  {selectedOption.icon}
                </div>
                <span className="text-purple-400 text-sm font-medium">{selectedOption.label}</span>
              </div>
              <h1 className="text-xl font-bold leading-tight">
                {selectedOption.title}
              </h1>
              <p className="text-white/50 text-sm">
                {selectedOption.subline}
              </p>
            </div>

            {/* Scan Options */}
            <div className="flex-1 space-y-3">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2">
                Choose what to validate
              </p>
              
              {selectedOption.scanOptions.map((scan, index) => (
                <button
                  key={scan.id}
                  onClick={handleLaunchApp}
                  className="group relative w-full bg-white/[0.03] active:bg-purple-500/20 border border-white/[0.08] active:border-purple-500/40 rounded-xl p-4 text-left transition-all"
                  style={{
                    animation: `fadeInUp 0.4s ${index * 0.1}s ease-out backwards`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-purple-400 mt-0.5">
                      {scan.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-sm mb-1">
                        {scan.title}
                      </h3>
                      <p className="text-white/40 text-xs">
                        {scan.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5" />
                  </div>
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleLaunchApp}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl text-white font-semibold transition-all active:scale-98"
              >
                <span>✓</span>
                {selectedOption.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-white/30 text-xs text-center">
                Based on real on-chain transactions
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .scale-98 { transform: scale(0.98); }
      `}</style>
    </div>
  );
};

export default WizardMobile;
