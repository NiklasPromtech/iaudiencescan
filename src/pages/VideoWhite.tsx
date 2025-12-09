import { useState, useEffect, useRef } from "react";
import overlapResults from "@/assets/overlap-results.png";

const VideoWhite = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Condensed to 6 punchy scenes
  const scenes = [
    { type: "intro" },
    { type: "problemSolution" },
    { type: "ahaOverlap" },
    { type: "howItWorks" },
    { type: "socialProof" },
    { type: "cta" },
  ];

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    sceneRefs.current.forEach((ref, index) => {
      if (!ref) return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              setCurrentScene(index);
            }
          });
        },
        { threshold: 0.5 }
      );
      
      observer.observe(ref);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const goToScene = (index: number) => {
    sceneRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative bg-white">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 sm:py-4 bg-white/80 backdrop-blur-md border-b border-slate-100/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <span className="material-icons-outlined text-white" style={{ fontSize: '16px' }}>radar</span>
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent group-hover:from-violet-600 group-hover:to-purple-600 transition-all duration-300">
              AudienceScan
            </span>
          </a>
          
          <a
            href="https://app.audiencescan.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-violet-200 hover:-translate-y-0.5 transition-all duration-300"
            onClick={() => {
              try {
                (window as any).gtag_report_conversion?.('https://app.audiencescan.io/');
              } catch (e) {}
            }}
          >
            <span>Launch App</span>
            <span className="material-icons-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
          </a>
        </div>
      </header>

      {/* Scene Indicators - Left Side - Hidden on mobile */}
      <div className="fixed left-4 sm:left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-50 hidden sm:flex">
        {scenes.map((_, index) => (
          <button
            key={index}
            onClick={() => goToScene(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              currentScene === index 
                ? "bg-violet-600 scale-125" 
                : "bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>

      {/* Scroll Hint */}
      <div 
        className={`fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1.5 transition-opacity duration-500 ${
          currentScene < scenes.length - 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-[0.2em] font-medium">Scroll</span>
        <div className="w-5 h-7 rounded-full border-2 border-slate-300 flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-slate-400 rounded-full animate-scroll-hint" />
        </div>
      </div>

      {/* Subtle Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(139, 92, 246, 0.04) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Scrollable Container */}
      <div 
        ref={containerRef}
        className="h-screen overflow-y-auto scroll-snap-container"
        style={{
          scrollSnapType: "y mandatory",
          scrollBehavior: "smooth",
        }}
      >
        {scenes.map((scene, index) => (
          <div
            key={index}
            ref={(el) => (sceneRefs.current[index] = el)}
            className="min-h-screen w-full flex items-center justify-center scroll-snap-section py-20 sm:py-0"
            style={{
              scrollSnapAlign: "start",
              scrollSnapStop: "always",
            }}
          >
            <SceneContent type={scene.type} isActive={currentScene === index} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes scroll-hint {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(6px); opacity: 0.5; }
        }
        .animate-scroll-hint {
          animation: scroll-hint 1.5s ease-in-out infinite;
        }
        .anim-base { opacity: 0; }
        .anim-fade-in-up { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .anim-fade-in-scale { animation: fadeInScale 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .material-icons-outlined {
          font-family: 'Material Icons Outlined';
          font-weight: normal;
          font-style: normal;
          font-size: 24px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          -webkit-font-feature-settings: 'liga';
          font-feature-settings: 'liga';
          -webkit-font-smoothing: antialiased;
        }
        .scroll-snap-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scroll-snap-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

interface SceneContentProps {
  type: string;
  isActive: boolean;
}

const SceneContent = ({ type, isActive }: SceneContentProps) => {
  switch (type) {
    case "intro":
      return <IntroScene isActive={isActive} />;
    case "problemSolution":
      return <ProblemSolutionScene isActive={isActive} />;
    case "ahaOverlap":
      return <AhaOverlapScene isActive={isActive} />;
    case "howItWorks":
      return <HowItWorksScene isActive={isActive} />;
    case "socialProof":
      return <SocialProofScene isActive={isActive} />;
    case "cta":
      return <CTAScene isActive={isActive} />;
    default:
      return null;
  }
};

interface SceneProps {
  isActive: boolean;
}

const IntroScene = ({ isActive }: SceneProps) => (
  <div className="text-center max-w-4xl mx-auto px-5 sm:px-6">
    <div 
      className={`mb-5 anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-100">
        <span className="material-icons-outlined text-violet-600" style={{ fontSize: '16px' }}>auto_awesome</span>
        <span className="text-violet-700 font-medium text-xs sm:text-sm">On-Chain Intelligence</span>
      </div>
    </div>
    <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-5 tracking-tight leading-[1.1]">
      <span 
        className={`block text-slate-900 anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
        style={{ animationDelay: '0.1s' }}
      >
        Find Your Perfect
      </span>
      <span 
        className={`block bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
        style={{ animationDelay: '0.2s' }}
      >
        Web3 Audience
      </span>
    </h1>
    <p 
      className={`text-lg sm:text-xl text-slate-500 max-w-xl mx-auto mb-8 anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
      style={{ animationDelay: '0.3s' }}
    >
      Use on-chain data to discover and reach the right communities
    </p>
    <div 
      className={`anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
      style={{ animationDelay: '0.4s' }}
    >
      <a
        href="https://app.audiencescan.io/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-violet-200 hover:-translate-y-0.5 transition-all duration-300"
        onClick={() => {
          try {
            (window as any).gtag_report_conversion?.('https://app.audiencescan.io/');
          } catch (e) {}
        }}
      >
        <span>Start Your Scan</span>
        <span className="material-icons-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
      </a>
    </div>
  </div>
);

const ProblemSolutionScene = ({ isActive }: SceneProps) => (
  <div className="max-w-5xl mx-auto px-5 sm:px-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
      {/* Problem */}
      <div 
        className={`bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-6 sm:p-8 anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center">
            <span className="material-icons-outlined text-rose-500" style={{ fontSize: '20px' }}>close</span>
          </div>
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">The Problem</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
          90% of Web3 marketing misses its target
        </h3>
        <ul className="space-y-2.5 text-slate-600 text-sm sm:text-base">
          <li className="flex items-start gap-2">
            <span className="material-icons-outlined text-rose-400 mt-0.5" style={{ fontSize: '16px' }}>remove</span>
            Targeting based on demographics, not behavior
          </li>
          <li className="flex items-start gap-2">
            <span className="material-icons-outlined text-rose-400 mt-0.5" style={{ fontSize: '16px' }}>remove</span>
            Wasted ad spend on unqualified audiences
          </li>
        </ul>
      </div>
      
      {/* Solution */}
      <div 
        className={`bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-2xl p-6 sm:p-8 anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
        style={{ animationDelay: '0.15s' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center">
            <span className="material-icons-outlined text-violet-600" style={{ fontSize: '20px' }}>check</span>
          </div>
          <span className="text-violet-500 text-xs font-semibold uppercase tracking-wider">The Solution</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
          Community targeting powered by on-chain data
        </h3>
        <ul className="space-y-2.5 text-slate-600 text-sm sm:text-base">
          <li className="flex items-start gap-2">
            <span className="material-icons-outlined text-violet-500 mt-0.5" style={{ fontSize: '16px' }}>add</span>
            Find wallets, discover communities they engage with
          </li>
          <li className="flex items-start gap-2">
            <span className="material-icons-outlined text-violet-500 mt-0.5" style={{ fontSize: '16px' }}>add</span>
            Target precisely across X, Telegram, Reddit, DV360
          </li>
        </ul>
      </div>
    </div>
  </div>
);

const AhaOverlapScene = ({ isActive }: SceneProps) => (
  <div className="max-w-5xl mx-auto text-center px-5 sm:px-6">
    <p 
      className={`text-violet-600 text-xs font-semibold mb-3 tracking-[0.2em] uppercase anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
    >
      The "Aha" Moment
    </p>
    <h2 
      className={`text-2xl sm:text-4xl md:text-5xl font-bold mb-4 anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
      style={{ animationDelay: '0.1s' }}
    >
      See who your holders <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">actually follow</span>
    </h2>
    <p 
      className={`text-slate-500 mb-8 max-w-lg mx-auto anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
      style={{ animationDelay: '0.2s' }}
    >
      Discover the communities and tokens your audience already engages with
    </p>
    <div 
      className={`rounded-2xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-200/50 anim-base ${isActive ? 'anim-fade-in-scale' : ''}`}
      style={{ animationDelay: '0.3s' }}
    >
      <img 
        src={overlapResults} 
        alt="AudienceScan overlap results"
        className="w-full h-auto"
      />
    </div>
  </div>
);

const HowItWorksScene = ({ isActive }: SceneProps) => (
  <div className="max-w-5xl mx-auto px-5 sm:px-6">
    <p 
      className={`text-violet-600 text-xs font-semibold mb-3 tracking-[0.2em] uppercase text-center anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
    >
      How It Works
    </p>
    <h2 
      className={`text-2xl sm:text-4xl md:text-5xl font-bold mb-10 text-center anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
      style={{ animationDelay: '0.1s' }}
    >
      Three simple steps
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      {[
        {
          step: "01",
          title: "Scan Wallets",
          desc: "Select a token or upload a wallet list",
          color: "bg-blue-600",
          bg: "from-blue-50 to-sky-50",
          border: "border-blue-100",
        },
        {
          step: "02",
          title: "Find Overlaps",
          desc: "Discover communities they engage with",
          color: "bg-violet-600",
          bg: "from-violet-50 to-purple-50",
          border: "border-violet-100",
        },
        {
          step: "03",
          title: "Target Precisely",
          desc: "Export to X Ads, Telegram, DV360",
          color: "bg-emerald-600",
          bg: "from-emerald-50 to-green-50",
          border: "border-emerald-100",
        },
      ].map((item, i) => (
        <div
          key={i}
          className={`bg-gradient-to-br ${item.bg} border ${item.border} rounded-2xl p-6 sm:p-8 anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
          style={{ animationDelay: `${0.2 + i * 0.1}s` }}
        >
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${item.color} mb-4`}>
            <span className="text-lg font-bold text-white">{item.step}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold mb-2 text-slate-900">{item.title}</h3>
          <p className="text-slate-600 text-sm">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const SocialProofScene = ({ isActive }: SceneProps) => {
  const clients = ["BitMEX", "OKX", "PrimeXBT", "FXTM", "Alpari", "Flare Network", "Mantra DAO", "MintLayer"];

  return (
    <div className="max-w-5xl mx-auto text-center px-5 sm:px-6">
      <p 
        className={`text-violet-600 text-xs font-semibold mb-3 tracking-[0.2em] uppercase anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
      >
        Trusted Results
      </p>
      <h2 
        className={`text-2xl sm:text-4xl md:text-5xl font-bold mb-10 anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
        style={{ animationDelay: '0.1s' }}
      >
        Powering top Web3 teams
      </h2>
      
      {/* Key Metrics */}
      <div 
        className={`grid grid-cols-2 gap-4 sm:gap-6 mb-10 anim-base ${isActive ? 'anim-fade-in-scale' : ''}`}
        style={{ animationDelay: '0.2s' }}
      >
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-lg">
          <div className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-1">
            $8M+
          </div>
          <div className="text-slate-600 text-sm sm:text-base">Ad budget deployed</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-lg">
          <div className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-1">
            314
          </div>
          <div className="text-slate-600 text-sm sm:text-base">Campaigns activated</div>
        </div>
      </div>
      
      {/* Client Logos */}
      <div 
        className={`flex flex-wrap justify-center gap-3 sm:gap-4 anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
        style={{ animationDelay: '0.35s' }}
      >
        {clients.map((client, i) => (
          <div
            key={i}
            className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-600 text-sm font-medium"
          >
            {client}
          </div>
        ))}
      </div>
    </div>
  );
};

const CTAScene = ({ isActive }: SceneProps) => (
  <div className="max-w-3xl mx-auto text-center px-5 sm:px-6">
    <div 
      className={`bg-gradient-to-br from-violet-600 to-purple-600 rounded-3xl p-8 sm:p-14 text-white anim-base ${isActive ? 'anim-fade-in-scale' : ''}`}
    >
      <h2 className="text-3xl sm:text-5xl font-bold mb-4">
        Ready to find your audience?
      </h2>
      <p className="text-violet-100 text-lg mb-8 max-w-md mx-auto">
        Start with a free scan and see the communities your holders engage with
      </p>
      <a
        href="https://app.audiencescan.io/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-violet-600 rounded-xl font-bold text-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        onClick={() => {
          try {
            (window as any).gtag_report_conversion?.('https://app.audiencescan.io/');
          } catch (e) {}
        }}
      >
        <span>Start Your Free Scan</span>
        <span className="material-icons-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
      </a>
    </div>
  </div>
);

export default VideoWhite;
