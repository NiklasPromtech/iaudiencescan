import { useState, useEffect, useRef } from "react";

const VideoWhite = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scenes = [
    { type: "intro" },
    { type: "problem" },
    { type: "solution" },
    { type: "howItWorks" },
    { type: "results" },
    { type: "useCases" },
    { type: "cta" },
  ];

  // Use IntersectionObserver to track which scene is visible
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
      {/* Google Material Icons */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      
      {/* Progress Bar - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-50 flex gap-1 p-4 bg-white/90 backdrop-blur-md">
        {scenes.map((_, index) => (
          <button
            key={index}
            onClick={() => goToScene(index)}
            className="flex-1 h-1 rounded-full overflow-hidden bg-slate-200/80 cursor-pointer transition-all hover:bg-slate-300"
          >
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-purple-600 rounded-full transition-all duration-500 ease-out"
              style={{
                width: currentScene >= index ? "100%" : "0%",
              }}
            />
          </button>
        ))}
      </div>

      {/* Scene Counter - Fixed */}
      <div className="fixed top-6 right-6 z-50 text-sm font-medium text-slate-400 tabular-nums">
        {String(currentScene + 1).padStart(2, '0')} / {String(scenes.length).padStart(2, '0')}
      </div>

      {/* Scene Indicators - Left Side */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
        {scenes.map((_, index) => (
          <button
            key={index}
            onClick={() => goToScene(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentScene === index 
                ? "bg-violet-600 scale-150" 
                : "bg-slate-300 hover:bg-slate-400 hover:scale-125"
            }`}
          />
        ))}
      </div>

      {/* Scroll Hint */}
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 transition-opacity duration-500 ${
          currentScene < scenes.length - 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-medium">Scroll</span>
        <div className="w-5 h-8 rounded-full border-2 border-slate-300 flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-slate-400 rounded-full animate-scroll-hint" />
        </div>
      </div>

      {/* Subtle Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Scrollable Container with Snap */}
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
            className="h-screen w-full flex items-center justify-center scroll-snap-section"
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
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scroll-hint {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.5; }
        }
        .animate-scroll-hint {
          animation: scroll-hint 1.5s ease-in-out infinite;
        }
        .animate-fade-in-up { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-scale { animation: fadeInScale 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-in-left { animation: slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-in-right { animation: slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
        .delay-400 { animation-delay: 0.4s; opacity: 0; }
        .delay-500 { animation-delay: 0.5s; opacity: 0; }
        .delay-600 { animation-delay: 0.6s; opacity: 0; }
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
        
        /* Hide scrollbar but keep functionality */
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
    case "problem":
      return <ProblemScene isActive={isActive} />;
    case "solution":
      return <SolutionScene isActive={isActive} />;
    case "howItWorks":
      return <HowItWorksScene isActive={isActive} />;
    case "results":
      return <ResultsScene isActive={isActive} />;
    case "useCases":
      return <UseCasesScene isActive={isActive} />;
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
  <div className="text-center max-w-4xl mx-auto px-6">
    <div className={`mb-8 ${isActive ? 'animate-fade-in-up' : 'opacity-0'}`}>
      <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 mb-8">
        <span className="material-icons-outlined text-violet-600" style={{ fontSize: '18px' }}>auto_awesome</span>
        <span className="text-violet-700 font-medium text-sm">On-Chain Intelligence Platform</span>
      </div>
    </div>
    <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-[0.95] ${isActive ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
      <span className="bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent">
        Find Your Perfect
      </span>
      <br />
      <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Web3 Audience</span>
    </h1>
    <p className={`text-xl md:text-2xl text-slate-500 font-light max-w-2xl mx-auto leading-relaxed ${isActive ? 'animate-fade-in-up delay-400' : 'opacity-0'}`}>
      Use on-chain data to reach users through community targeting
    </p>
  </div>
);

const ProblemScene = ({ isActive }: SceneProps) => (
  <div className="max-w-5xl mx-auto text-center px-6">
    <p className={`text-violet-600 text-xs font-semibold mb-4 tracking-[0.2em] uppercase ${isActive ? 'animate-fade-in-up' : 'opacity-0'}`}>
      The Problem
    </p>
    <h2 className={`text-4xl md:text-6xl font-bold mb-16 leading-tight ${isActive ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
      90% of Web3 marketing<br />
      <span className="text-slate-300">misses its target audience</span>
    </h2>
    <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
      {[
        { icon: "person_off", text: "Targeting based on demographics, not behavior", color: "text-rose-500", bg: "from-rose-50 to-red-50", border: "border-rose-100" },
        { icon: "money_off", text: "Wasted ad spend on unqualified audiences", color: "text-amber-500", bg: "from-amber-50 to-orange-50", border: "border-amber-100" },
      ].map((item, i) => (
        <div
          key={i}
          className={`bg-gradient-to-br ${item.bg} border ${item.border} rounded-2xl p-8 ${isActive ? (i === 0 ? 'animate-slide-in-left delay-400' : 'animate-slide-in-right delay-500') : 'opacity-0'}`}
        >
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl bg-white/80 border ${item.border} flex items-center justify-center shrink-0`}>
              <span className={`material-icons-outlined ${item.color}`} style={{ fontSize: '24px' }}>{item.icon}</span>
            </div>
            <p className="text-slate-700 text-lg text-left leading-relaxed">{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SolutionScene = ({ isActive }: SceneProps) => (
  <div className="max-w-5xl mx-auto text-center px-6">
    <p className={`text-violet-600 text-xs font-semibold mb-4 tracking-[0.2em] uppercase ${isActive ? 'animate-fade-in-up' : 'opacity-0'}`}>
      The Solution
    </p>
    <h2 className={`text-4xl md:text-6xl font-bold mb-6 leading-tight ${isActive ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
      Community targeting powered<br />by on-chain data
    </h2>
    <p className={`text-lg text-slate-500 mb-14 max-w-2xl mx-auto ${isActive ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
      AudienceScan analyzes on-chain behavior to help you reach users through community targeting
    </p>
    <div className={`relative ${isActive ? 'animate-fade-in-scale delay-500' : 'opacity-0'}`}>
      <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-xl shadow-slate-200/40">
        <div className="flex items-center justify-center gap-4 md:gap-10 flex-wrap md:flex-nowrap">
          <div className="text-center group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-100 border border-violet-200 flex items-center justify-center mb-3 mx-auto transition-transform group-hover:scale-105">
              <span className="material-icons-outlined text-violet-600" style={{ fontSize: '36px' }}>token</span>
            </div>
            <p className="text-slate-600 font-medium text-sm">Your Token</p>
          </div>
          <div className="text-violet-400">
            <span className="material-icons-outlined" style={{ fontSize: '28px' }}>trending_flat</span>
          </div>
          <div className="text-center group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center mb-3 mx-auto transition-transform group-hover:scale-105">
              <span className="material-icons-outlined text-slate-600" style={{ fontSize: '36px' }}>manage_search</span>
            </div>
            <p className="text-slate-600 font-medium text-sm">Scan Holders</p>
          </div>
          <div className="text-violet-400">
            <span className="material-icons-outlined" style={{ fontSize: '28px' }}>trending_flat</span>
          </div>
          <div className="text-center group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200 flex items-center justify-center mb-3 mx-auto transition-transform group-hover:scale-105">
              <span className="material-icons-outlined text-emerald-600" style={{ fontSize: '36px' }}>groups</span>
            </div>
            <p className="text-slate-600 font-medium text-sm">Perfect Audience</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const HowItWorksScene = ({ isActive }: SceneProps) => (
  <div className="max-w-6xl mx-auto px-6">
    <p className={`text-violet-600 text-xs font-semibold mb-4 tracking-[0.2em] uppercase text-center ${isActive ? 'animate-fade-in-up' : 'opacity-0'}`}>
      How It Works
    </p>
    <h2 className={`text-4xl md:text-5xl font-bold mb-14 text-center ${isActive ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
      Three simple steps
    </h2>
    <div className="grid md:grid-cols-3 gap-5">
      {[
        {
          step: "01",
          title: "Scan Wallets",
          desc: "Find wallets using a ticker, browse by token category, or upload a list of wallets you already have.",
          color: "text-blue-600",
          bg: "from-blue-50 to-sky-50",
          border: "border-blue-100",
          accent: "bg-blue-600",
        },
        {
          step: "02",
          title: "Find Overlaps",
          desc: "Discover which other tokens, communities, and platforms your target audience engages with.",
          color: "text-violet-600",
          bg: "from-violet-50 to-purple-50",
          border: "border-violet-100",
          accent: "bg-violet-600",
        },
        {
          step: "03",
          title: "Target Precisely",
          desc: "Export audiences to DV360, X Ads, Telegram, or use for direct outreach campaigns.",
          color: "text-emerald-600",
          bg: "from-emerald-50 to-green-50",
          border: "border-emerald-100",
          accent: "bg-emerald-600",
        },
      ].map((item, i) => (
        <div
          key={i}
          className={`relative bg-gradient-to-br ${item.bg} border ${item.border} rounded-2xl p-7 overflow-hidden ${isActive ? 'animate-fade-in-up' : 'opacity-0'}`}
          style={{ animationDelay: `${0.3 + i * 0.1}s` }}
        >
          <div className="relative z-10">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${item.accent} mb-5`}>
              <span className="text-xl font-bold text-white">{item.step}</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ResultsScene = ({ isActive }: SceneProps) => (
  <div className="max-w-5xl mx-auto text-center px-6">
    <p className={`text-violet-600 text-xs font-semibold mb-4 tracking-[0.2em] uppercase ${isActive ? 'animate-fade-in-up' : 'opacity-0'}`}>
      Real Results
    </p>
    <h2 className={`text-4xl md:text-6xl font-bold mb-14 ${isActive ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
      Proven performance
    </h2>
    <div className="grid md:grid-cols-3 gap-6">
      {[
        { value: "73%", label: "Lower CPA", desc: "Cost per acquisition reduced" },
        { value: "4.2x", label: "Better CTR", desc: "Click-through rate improvement" },
        { value: "250+", label: "Scans Run", desc: "Campaigns optimized" },
      ].map((stat, i) => (
        <div
          key={i}
          className={`bg-white border border-slate-200 rounded-2xl p-8 shadow-lg shadow-slate-100/80 ${isActive ? 'animate-fade-in-scale' : 'opacity-0'}`}
          style={{ animationDelay: `${0.3 + i * 0.1}s` }}
        >
          <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {stat.value}
          </div>
          <div className="text-slate-900 font-semibold mb-1">{stat.label}</div>
          <div className="text-slate-500 text-sm">{stat.desc}</div>
        </div>
      ))}
    </div>
  </div>
);

const UseCasesScene = ({ isActive }: SceneProps) => (
  <div className="max-w-5xl mx-auto px-6">
    <p className={`text-violet-600 text-xs font-semibold mb-4 tracking-[0.2em] uppercase text-center ${isActive ? 'animate-fade-in-up' : 'opacity-0'}`}>
      Use Cases
    </p>
    <h2 className={`text-4xl md:text-5xl font-bold mb-12 text-center ${isActive ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
      Who uses AudienceScan?
    </h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[
        { icon: "rocket_launch", title: "Token Projects", desc: "Using on-chain data to assist their GTM strategy and outreach" },
        { icon: "record_voice_over", title: "KOL Researchers", desc: "Discover which communities to look for relevant KOLs" },
        { icon: "foundation", title: "Launchpads", desc: "Figure out which launchpads your holders engage with" },
        { icon: "account_balance", title: "Exchanges", desc: "Evaluate tokens for listing decisions based on deposit patterns" },
        { icon: "campaign", title: "Marketing Agencies", desc: "Stand out from competition with on-chain data insights" },
      ].map((item, i) => (
        <div
          key={i}
          className={`bg-white border border-slate-200 rounded-xl p-5 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/50 transition-all duration-300 ${isActive ? 'animate-fade-in-up' : 'opacity-0'}`}
          style={{ animationDelay: `${0.3 + i * 0.08}s` }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-50 to-purple-100 border border-violet-100 flex items-center justify-center shrink-0">
              <span className="material-icons-outlined text-violet-600" style={{ fontSize: '20px' }}>{item.icon}</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CTAScene = ({ isActive }: SceneProps) => (
  <div className="text-center max-w-3xl mx-auto px-6">
    <h2 className={`text-4xl md:text-6xl font-bold mb-6 ${isActive ? 'animate-fade-in-up' : 'opacity-0'}`}>
      Ready to find your<br />
      <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">perfect audience?</span>
    </h2>
    <p className={`text-lg text-slate-500 mb-10 ${isActive ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
      Join leading Web3 teams using on-chain intelligence
    </p>
    <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isActive ? 'animate-fade-in-up delay-400' : 'opacity-0'}`}>
      <a
        href="https://app.audiencescan.xyz"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-violet-200 hover:-translate-y-0.5 transition-all duration-300"
      >
        <span>Launch App</span>
        <span className="material-icons-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
      </a>
      <a
        href="/pricing"
        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:border-violet-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
      >
        View Pricing
      </a>
    </div>
  </div>
);

export default VideoWhite;
