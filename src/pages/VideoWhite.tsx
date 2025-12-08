import { useState, useEffect, useRef, useCallback } from "react";
import logoBlack from "@/assets/audiencescan-logo-white.png"; // We'll need a dark logo

const VideoWhite = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isTransitioning = useRef(false);
  const accumulatedDelta = useRef(0);
  const lastScrollTime = useRef(0);

  const scenes = [
    { type: "intro" },
    { type: "problem" },
    { type: "solution" },
    { type: "howItWorks" },
    { type: "results" },
    { type: "useCases" },
    { type: "cta" },
  ];

  const SCROLL_THRESHOLD = 50;
  const TRANSITION_DURATION = 600;
  const SCROLL_COOLDOWN = 100;

  const changeScene = useCallback((direction: 'next' | 'prev') => {
    if (isTransitioning.current) return;
    
    setCurrentScene(prev => {
      const newScene = direction === 'next' 
        ? Math.min(prev + 1, scenes.length - 1)
        : Math.max(prev - 1, 0);
      
      if (newScene !== prev) {
        isTransitioning.current = true;
        setTimeout(() => {
          isTransitioning.current = false;
        }, TRANSITION_DURATION);
      }
      
      return newScene;
    });
    
    accumulatedDelta.current = 0;
  }, [scenes.length]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isTransitioning.current) return;
      
      const now = Date.now();
      if (now - lastScrollTime.current < SCROLL_COOLDOWN) {
        accumulatedDelta.current += e.deltaY;
      } else {
        accumulatedDelta.current = e.deltaY;
      }
      lastScrollTime.current = now;
      
      if (Math.abs(accumulatedDelta.current) >= SCROLL_THRESHOLD) {
        if (accumulatedDelta.current > 0) {
          changeScene('next');
        } else {
          changeScene('prev');
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [changeScene]);

  // Touch support for mobile
  const touchStart = useRef(0);
  
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isTransitioning.current) return;
      
      const touchEnd = e.changedTouches[0].clientY;
      const diff = touchStart.current - touchEnd;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          changeScene('next');
        } else {
          changeScene('prev');
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [changeScene]);

  const goToScene = (index: number) => {
    if (index === currentScene || isTransitioning.current) return;
    isTransitioning.current = true;
    setCurrentScene(index);
    setTimeout(() => {
      isTransitioning.current = false;
    }, TRANSITION_DURATION);
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-white text-slate-900 overflow-hidden relative"
    >
      {/* Google Material Icons */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex gap-1 p-4 bg-white/80 backdrop-blur-sm">
        {scenes.map((_, index) => (
          <button
            key={index}
            onClick={() => goToScene(index)}
            className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-200 cursor-pointer"
          >
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{
                width: currentScene >= index ? "100%" : "0%",
              }}
            />
          </button>
        ))}
      </div>

      {/* Scene Counter */}
      <div className="fixed top-6 right-6 z-50 text-sm font-medium text-slate-400">
        {String(currentScene + 1).padStart(2, '0')} / {String(scenes.length).padStart(2, '0')}
      </div>

      {/* Scroll Hint */}
      {currentScene < scenes.length - 1 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-slate-400 uppercase tracking-widest">Scroll</span>
          <span className="material-icons-outlined text-slate-400" style={{ fontSize: '24px' }}>expand_more</span>
        </div>
      )}

      {/* Subtle Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)",
          }}
        />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Scene Indicators - Left Side */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
        {scenes.map((_, index) => (
          <button
            key={index}
            onClick={() => goToScene(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
              currentScene === index 
                ? "bg-primary scale-125" 
                : "bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>

      {/* Scenes Container */}
      <div className="relative h-screen">
        {scenes.map((scene, index) => (
          <div
            key={index}
            className={`absolute inset-0 will-change-transform ${
              currentScene === index 
                ? 'opacity-100 translate-y-0 pointer-events-auto' 
                : currentScene > index 
                  ? 'opacity-0 -translate-y-[30%] pointer-events-none' 
                  : 'opacity-0 translate-y-[30%] pointer-events-none'
            }`}
            style={{
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease-out',
            }}
          >
            {scene.type === "intro" && <IntroScene isActive={currentScene === index} />}
            {scene.type === "problem" && <ProblemScene isActive={currentScene === index} />}
            {scene.type === "solution" && <SolutionScene isActive={currentScene === index} />}
            {scene.type === "howItWorks" && <HowItWorksScene isActive={currentScene === index} />}
            {scene.type === "results" && <ResultsScene isActive={currentScene === index} />}
            {scene.type === "useCases" && <UseCasesScene isActive={currentScene === index} />}
            {scene.type === "cta" && <CTAScene isActive={currentScene === index} />}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in-scale { animation: fadeInScale 0.8s ease-out forwards; }
        .animate-slide-in-left { animation: slideInLeft 0.7s ease-out forwards; }
        .animate-slide-in-right { animation: slideInRight 0.7s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
        .delay-400 { animation-delay: 0.4s; opacity: 0; }
        .delay-500 { animation-delay: 0.5s; opacity: 0; }
        .delay-600 { animation-delay: 0.6s; opacity: 0; }
        .delay-700 { animation-delay: 0.7s; opacity: 0; }
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
      `}</style>
    </div>
  );
};

const Scene = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex items-center justify-center px-6 py-24">
    {children}
  </div>
);

interface SceneProps {
  isActive: boolean;
}

const IntroScene = ({ isActive }: SceneProps) => (
  <Scene>
    <div className="text-center max-w-4xl mx-auto">
      <div className={`mb-8 ${isActive ? 'animate-fade-in-up' : ''}`}>
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
          <span className="material-icons-outlined text-primary" style={{ fontSize: '20px' }}>auto_awesome</span>
          <span className="text-primary font-medium text-sm">On-Chain Intelligence Platform</span>
        </div>
      </div>
      <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-[0.9] ${isActive ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
        <span className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent">
          Find Your Perfect
        </span>
        <br />
        <span className="text-primary">Web3 Audience</span>
      </h1>
      <p className={`text-xl md:text-2xl text-slate-500 font-light max-w-2xl mx-auto ${isActive ? 'animate-fade-in-up delay-400' : 'opacity-0'}`}>
        Use on-chain data to reach users through community targeting
      </p>
    </div>
  </Scene>
);

const ProblemScene = ({ isActive }: SceneProps) => (
  <Scene>
    <div className="max-w-5xl mx-auto text-center">
      <p className={`text-primary text-sm font-semibold mb-4 tracking-widest uppercase ${isActive ? 'animate-fade-in-up' : 'opacity-0'}`}>
        The Problem
      </p>
      <h2 className={`text-4xl md:text-6xl font-bold mb-16 leading-tight ${isActive ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
        90% of Web3 marketing<br />
        <span className="text-slate-400">misses its target audience</span>
      </h2>
      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {[
          { icon: "person_off", text: "Targeting based on demographics, not behavior", color: "text-red-500", bg: "bg-red-50", border: "border-red-100" },
          { icon: "money_off", text: "Wasted ad spend on unqualified audiences", color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100" },
        ].map((item, i) => (
          <div
            key={i}
            className={`${item.bg} border ${item.border} rounded-3xl p-10 ${isActive ? (i === 0 ? 'animate-slide-in-left delay-400' : 'animate-slide-in-right delay-500') : 'opacity-0'}`}
          >
            <div className={`w-16 h-16 rounded-2xl ${item.bg} border ${item.border} flex items-center justify-center mx-auto mb-6`}>
              <span className={`material-icons-outlined ${item.color}`} style={{ fontSize: '32px' }}>{item.icon}</span>
            </div>
            <p className="text-slate-700 text-lg">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  </Scene>
);

const SolutionScene = ({ isActive }: SceneProps) => (
  <Scene>
    <div className="max-w-5xl mx-auto text-center">
      <p className={`text-primary text-sm font-semibold mb-4 tracking-widest uppercase ${isActive ? 'animate-fade-in-up' : 'opacity-0'}`}>
        The Solution
      </p>
      <h2 className={`text-4xl md:text-6xl font-bold mb-6 leading-tight ${isActive ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
        Community targeting powered<br />by on-chain data
      </h2>
      <p className={`text-xl text-slate-500 mb-16 max-w-3xl mx-auto ${isActive ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
        AudienceScan analyzes on-chain behavior to help you reach users through community targeting
      </p>
      <div className={`relative ${isActive ? 'animate-fade-in-scale delay-500' : 'opacity-0'}`}>
        <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-3xl p-12 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-center gap-4 md:gap-12 flex-wrap md:flex-nowrap">
            <div className="text-center">
              <div className="w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 mx-auto">
                <span className="material-icons-outlined text-primary" style={{ fontSize: '40px' }}>token</span>
              </div>
              <p className="text-slate-600 font-medium">Your Token</p>
            </div>
            <div className="text-primary">
              <span className="material-icons-outlined" style={{ fontSize: '32px' }}>arrow_forward</span>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-4 mx-auto">
                <span className="material-icons-outlined text-slate-600" style={{ fontSize: '40px' }}>search</span>
              </div>
              <p className="text-slate-600 font-medium">Scan Holders</p>
            </div>
            <div className="text-primary">
              <span className="material-icons-outlined" style={{ fontSize: '32px' }}>arrow_forward</span>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center mb-4 mx-auto">
                <span className="material-icons-outlined text-green-600" style={{ fontSize: '40px' }}>groups</span>
              </div>
              <p className="text-slate-600 font-medium">Perfect Audience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Scene>
);

const HowItWorksScene = ({ isActive }: SceneProps) => (
  <Scene>
    <div className="max-w-6xl mx-auto">
      <p className={`text-primary text-sm font-semibold mb-4 tracking-widest uppercase text-center ${isActive ? 'animate-fade-in-up' : 'opacity-0'}`}>
        How It Works
      </p>
      <h2 className={`text-4xl md:text-5xl font-bold mb-16 text-center ${isActive ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
        Three simple steps
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            step: "01",
            title: "Scan Wallets",
            desc: "Find wallets using a ticker, browse by token category, or upload a list of wallets you already have.",
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100",
          },
          {
            step: "02",
            title: "Find Overlaps",
            desc: "Discover which other tokens, communities, and platforms your target audience engages with.",
            color: "text-purple-600",
            bg: "bg-purple-50",
            border: "border-purple-100",
          },
          {
            step: "03",
            title: "Target Precisely",
            desc: "Export audiences to DV360, X Ads, Telegram, or use for direct outreach campaigns.",
            color: "text-green-600",
            bg: "bg-green-50",
            border: "border-green-100",
          },
        ].map((item, i) => (
          <div
            key={i}
            className={`relative ${item.bg} border ${item.border} rounded-3xl p-8 overflow-hidden ${isActive ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: `${0.3 + i * 0.15}s` }}
          >
            <div className={`absolute top-4 right-4 text-8xl font-black ${item.color} opacity-10`}>
              {item.step}
            </div>
            <div className="relative z-10">
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${item.bg} border-2 ${item.border} mb-6`}>
                <span className={`text-2xl font-bold ${item.color}`}>{item.step}</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">{item.title}</h3>
              <p className="text-slate-600">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Scene>
);

const ResultsScene = ({ isActive }: SceneProps) => (
  <Scene>
    <div className="max-w-5xl mx-auto text-center">
      <p className={`text-primary text-sm font-semibold mb-4 tracking-widest uppercase ${isActive ? 'animate-fade-in-up' : 'opacity-0'}`}>
        Real Results
      </p>
      <h2 className={`text-4xl md:text-6xl font-bold mb-16 ${isActive ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
        Proven performance
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { value: "73%", label: "Lower CPA", desc: "Cost per acquisition reduced" },
          { value: "4.2x", label: "Better CTR", desc: "Click-through rate improvement" },
          { value: "250+", label: "Scans Run", desc: "Campaigns optimized" },
        ].map((stat, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-3xl p-10 shadow-lg shadow-slate-100 ${isActive ? 'animate-fade-in-scale' : 'opacity-0'}`}
            style={{ animationDelay: `${0.3 + i * 0.15}s` }}
          >
            <div className="text-5xl md:text-6xl font-bold text-primary mb-3">
              {stat.value}
            </div>
            <div className="text-xl font-semibold text-slate-900 mb-1">{stat.label}</div>
            <div className="text-slate-500 text-sm">{stat.desc}</div>
          </div>
        ))}
      </div>
    </div>
  </Scene>
);

const UseCasesScene = ({ isActive }: SceneProps) => (
  <Scene>
    <div className="max-w-6xl mx-auto">
      <p className={`text-primary text-sm font-semibold mb-4 tracking-widest uppercase text-center ${isActive ? 'animate-fade-in-up' : 'opacity-0'}`}>
        Use Cases
      </p>
      <h2 className={`text-4xl md:text-5xl font-bold mb-12 text-center ${isActive ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
        Who uses AudienceScan?
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: "rocket_launch", title: "Token Projects", desc: "Using on-chain data to assist their GTM strategy and outreach", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
          { icon: "record_voice_over", title: "KOL Researchers", desc: "Discover which communities to look for relevant KOLs", color: "text-pink-600", bg: "bg-pink-50", border: "border-pink-100" },
          { icon: "construction", title: "Launchpads", desc: "Figure out which launchpads your or your competitors' holders engage with", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
          { icon: "account_balance", title: "Exchanges", desc: "Evaluate tokens for listing based on what gets deposited into large CEXs", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
          { icon: "campaign", title: "Marketing Agencies", desc: "Stand out from competition and enhance your pitch with on-chain insights", color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
        ].map((item, i) => (
          <div
            key={i}
            className={`${item.bg} border ${item.border} rounded-2xl p-6 hover:shadow-lg transition-shadow ${isActive ? (i % 2 === 0 ? 'animate-slide-in-left' : 'animate-slide-in-right') : 'opacity-0'}`}
            style={{ animationDelay: `${0.3 + i * 0.1}s` }}
          >
            <div className={`w-12 h-12 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center mb-4`}>
              <span className={`material-icons-outlined ${item.color}`} style={{ fontSize: '24px' }}>{item.icon}</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-slate-900">{item.title}</h3>
            <p className="text-slate-500 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </Scene>
);

const CTAScene = ({ isActive }: SceneProps) => (
  <Scene>
    <div className="max-w-4xl mx-auto text-center">
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 mb-8 ${isActive ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <span className="material-icons-outlined text-green-600" style={{ fontSize: '18px' }}>verified</span>
        <span className="text-green-700 font-medium text-sm">Start from just $199/month</span>
      </div>
      <h2 className={`text-5xl md:text-7xl font-bold mb-6 ${isActive ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
        Ready to find your<br />
        <span className="text-primary">perfect audience?</span>
      </h2>
      <p className={`text-xl text-slate-500 mb-12 ${isActive ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
        Join 300+ Web3 teams using on-chain intelligence
      </p>
      <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isActive ? 'animate-fade-in-up delay-500' : 'opacity-0'}`}>
        <a
          href="https://app.audiencescan.xyz"
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-primary hover:bg-primary/90 text-white rounded-full transition-all hover:scale-105 shadow-lg shadow-primary/30"
        >
          Launch App
          <span className="material-icons-outlined ml-2" style={{ fontSize: '20px' }}>arrow_forward</span>
        </a>
        <a
          href="/case-studies"
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-full transition-all border border-slate-200"
        >
          View Case Studies
        </a>
      </div>
    </div>
  </Scene>
);

export default VideoWhite;
