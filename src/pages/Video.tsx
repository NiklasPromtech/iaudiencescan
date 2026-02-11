import { useState, useEffect } from "react";
import logoWhite from "@/assets/audiencescan-logo-white.png";

const Video = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  const scenes = [
    { type: "intro" },
    { type: "problem" },
    { type: "solution" },
    { type: "howItWorks" },
    { type: "results" },
    { type: "useCases" },
    { type: "cta" },
  ];

  useEffect(() => {
    if (!autoPlay) return;
    
    const sceneTimer = setInterval(() => {
      setCurrentScene((prev) => {
        if (prev < scenes.length - 1) return prev + 1;
        return prev;
      });
    }, 6000);

    return () => clearInterval(sceneTimer);
  }, [autoPlay]);

  const goToScene = (index: number, pauseAutoPlay = false) => {
    if (pauseAutoPlay) setAutoPlay(false);
    if (index === currentScene) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScene(index);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex gap-1 p-4">
        {scenes.map((_, index) => (
          <button
            key={index}
            onClick={() => goToScene(index, true)}
            className="flex-1 h-1 rounded-full overflow-hidden bg-white/20 cursor-pointer"
          >
            <div
              className="h-full bg-violet-500 transition-all duration-300"
              style={{
                width: currentScene > index ? "100%" : currentScene === index ? "100%" : "0%",
                transition: currentScene === index ? "width 6s linear" : "width 0.3s",
              }}
            />
          </button>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => goToScene(Math.max(0, currentScene - 1), true)}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-30"
        disabled={currentScene === 0}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => goToScene(Math.min(scenes.length - 1, currentScene + 1), true)}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-30"
        disabled={currentScene === scenes.length - 1}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial animate-pulse-slow" 
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 60%)",
          }}
        />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      {/* Scenes Container */}
      <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {currentScene === 0 && <IntroScene />}
        {currentScene === 1 && <ProblemScene />}
        {currentScene === 2 && <SolutionScene />}
        {currentScene === 3 && <HowItWorksScene />}
        {currentScene === 4 && <ResultsScene />}
        {currentScene === 5 && <UseCasesScene />}
        {currentScene === 6 && <CTAScene />}
      </div>

      {/* Scene Indicators */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {scenes.map((_, index) => (
          <button
            key={index}
            onClick={() => goToScene(index, true)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentScene === index ? "bg-violet-500 w-8" : "bg-white/30 hover:bg-white/50 w-2"
            }`}
          />
        ))}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9); }
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
        @keyframes bounce {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in-scale { animation: fadeInScale 0.8s ease-out forwards; }
        .animate-slide-in-left { animation: slideInLeft 0.6s ease-out forwards; }
        .animate-slide-in-right { animation: slideInRight 0.6s ease-out forwards; }
        .animate-bounce-x { animation: bounce 1.5s ease-in-out infinite; }
        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
        .delay-400 { animation-delay: 0.4s; opacity: 0; }
        .delay-500 { animation-delay: 0.5s; opacity: 0; }
        .delay-600 { animation-delay: 0.6s; opacity: 0; }
        .delay-700 { animation-delay: 0.7s; opacity: 0; }
        .delay-800 { animation-delay: 0.8s; opacity: 0; }
        .delay-900 { animation-delay: 0.9s; opacity: 0; }
        .delay-1000 { animation-delay: 1s; opacity: 0; }
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
  <div className="min-h-screen flex items-center justify-center px-6 py-20">
    {children}
  </div>
);

const IntroScene = () => (
  <Scene>
    <div className="text-center">
      <div className="mb-8 animate-fade-in-up">
        <img 
          src={logoWhite} 
          alt="AudienceScan" 
          className="h-12 mx-auto"
        />
      </div>
      <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight animate-fade-in-up delay-300">
        <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
          On-Chain Intelligence
        </span>
      </h1>
      <p className="text-2xl md:text-3xl text-white/60 font-light animate-fade-in-up delay-500">
        for Web3 Marketing
      </p>
    </div>
  </Scene>
);

const ProblemScene = () => (
  <Scene>
    <div className="max-w-5xl mx-auto text-center">
      <p className="text-violet-400 text-lg mb-6 tracking-widest uppercase animate-fade-in-up">
        The Problem
      </p>
      <h2 className="text-4xl md:text-6xl font-bold mb-12 leading-tight animate-fade-in-up delay-200">
        90% of Web3 marketing<br />
        <span className="text-white/40">misses its target audience</span>
      </h2>
      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {[
          { icon: "person_off", text: "Targeting based on demographics, not behavior" },
          { icon: "money_off", text: "Wasted ad spend on unqualified audiences" },
        ].map((item, i) => (
          <div
            key={i}
            className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 animate-fade-in-up delay-${400 + i * 200}`}
          >
            <div className="w-16 h-16 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-4">
              <span className="material-icons-outlined text-white/60" style={{ fontSize: '32px' }}>{item.icon}</span>
            </div>
            <p className="text-white/70">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  </Scene>
);

const SolutionScene = () => (
  <Scene>
    <div className="max-w-5xl mx-auto text-center">
      <p className="text-violet-400 text-lg mb-6 tracking-widest uppercase animate-fade-in-up">
        The Solution
      </p>
      <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight animate-fade-in-up delay-200">
        Community targeting powered<br />by on-chain data
      </h2>
      <p className="text-xl md:text-2xl text-white/60 mb-16 max-w-3xl mx-auto animate-fade-in-up delay-400">
        AudienceScan analyzes on-chain behavior to help you reach users through community targeting
      </p>
      <div className="relative animate-fade-in-scale delay-600">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-violet-500/20 blur-3xl" />
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-lg p-12">
          <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap md:flex-nowrap">
            <div className="text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-violet-500/20 border border-violet-500/50 flex items-center justify-center mb-4 mx-auto">
                <span className="material-icons-outlined text-violet-400" style={{ fontSize: '40px' }}>token</span>
              </div>
              <p className="text-white/60 text-sm md:text-base">Your Token</p>
            </div>
            <div className="text-3xl md:text-4xl text-violet-400 animate-bounce-x">
              <span className="material-icons-outlined" style={{ fontSize: '40px' }}>arrow_forward</span>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 border border-white/30 flex items-center justify-center mb-4 mx-auto">
                <span className="material-icons-outlined text-white/80" style={{ fontSize: '40px' }}>search</span>
              </div>
              <p className="text-white/60 text-sm md:text-base">Scan Holders</p>
            </div>
            <div className="text-3xl md:text-4xl text-violet-400 animate-bounce-x" style={{ animationDelay: "0.2s" }}>
              <span className="material-icons-outlined" style={{ fontSize: '40px' }}>arrow_forward</span>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center mb-4 mx-auto">
                <span className="material-icons-outlined text-purple-400" style={{ fontSize: '40px' }}>groups</span>
              </div>
              <p className="text-white/60 text-sm md:text-base">Perfect Audience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Scene>
);

const HowItWorksScene = () => (
  <Scene>
    <div className="max-w-6xl mx-auto">
      <p className="text-violet-400 text-lg mb-6 tracking-widest uppercase text-center animate-fade-in-up">
        How It Works
      </p>
      <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center animate-fade-in-up delay-200">
        Three simple steps
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            step: "01",
            title: "Scan Wallets",
            desc: "Find wallets using a ticker, browse by token category, or upload a list of wallets you already have.",
            opacity: "opacity-100",
          },
          {
            step: "02",
            title: "Find Overlaps",
            desc: "Discover which other tokens, communities, and platforms your target audience engages with.",
            opacity: "opacity-80",
          },
          {
            step: "03",
            title: "Target Precisely",
            desc: "Export audiences to DV360, X Ads, Telegram, or use for direct outreach campaigns.",
            opacity: "opacity-60",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="relative bg-gradient-to-br from-violet-500/20 to-purple-600/10 border border-violet-500/30 rounded-lg p-8 overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${0.4 + i * 0.2}s`, opacity: 0 }}
          >
            <div className={`absolute top-4 right-4 text-7xl font-black text-violet-400 ${item.opacity}`}>
              {item.step}
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 border border-violet-500/30 mb-4">
                <span className="text-2xl font-bold text-violet-400">{item.step}</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-white/60">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Scene>
);

const ResultsScene = () => (
  <Scene>
    <div className="max-w-5xl mx-auto text-center">
      <p className="text-violet-400 text-lg mb-6 tracking-widest uppercase animate-fade-in-up">
        Real Results
      </p>
      <h2 className="text-4xl md:text-6xl font-bold mb-16 animate-fade-in-up delay-200">
        Proven performance improvements
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { value: "73%", label: "Lower CPA", desc: "Cost per acquisition reduced" },
          { value: "4.2x", label: "Better CTR", desc: "Click-through rate improvement" },
          { value: "250+", label: "Scans Run", desc: "Campaigns optimized" },
        ].map((stat, i) => (
          <div
            key={i}
            className="relative animate-fade-in-scale"
            style={{ animationDelay: `${0.4 + i * 0.15}s`, opacity: 0 }}
          >
            <div className="absolute inset-0 bg-violet-500/20 blur-3xl rounded-full" />
            <div className="relative bg-white/5 border border-white/10 rounded-lg p-10">
              <div className="text-5xl md:text-6xl font-bold text-violet-400 mb-2">
                {stat.value}
              </div>
              <div className="text-xl font-semibold mb-1">{stat.label}</div>
              <div className="text-white/50 text-sm">{stat.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Scene>
);

const UseCasesScene = () => (
  <Scene>
    <div className="max-w-6xl mx-auto">
      <p className="text-violet-400 text-lg mb-6 tracking-widest uppercase text-center animate-fade-in-up">
        Use Cases
      </p>
      <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center animate-fade-in-up delay-200">
        Who uses AudienceScan?
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: "rocket_launch", title: "Token Projects", desc: "Using on-chain data to assist their GTM strategy and outreach" },
          { icon: "record_voice_over", title: "KOL Researchers", desc: "Discover which communities to look for relevant KOLs" },
          { icon: "construction", title: "Launchpads", desc: "Figure out which launchpads your or your competitors' holders engage with" },
          { icon: "account_balance", title: "Exchanges", desc: "Evaluate tokens for listing based on what gets deposited into large CEXs" },
          { icon: "campaign", title: "Marketing Agencies", desc: "Stand out from competition and enhance your pitch with on-chain insights" },
        ].map((item, i) => (
          <div
            key={i}
            className={`bg-violet-500/10 border border-violet-500/20 rounded-lg p-6 hover:bg-violet-500/20 transition-colors ${i % 2 === 0 ? 'animate-slide-in-left' : 'animate-slide-in-right'}`}
            style={{ animationDelay: `${0.3 + i * 0.1}s`, opacity: 0 }}
          >
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mb-3">
              <span className="material-icons-outlined text-violet-400" style={{ fontSize: '24px' }}>{item.icon}</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-white/50 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </Scene>
);

const CTAScene = () => (
  <Scene>
    <div className="max-w-4xl mx-auto text-center">
      <div className="mb-8 animate-fade-in-up">
        <img 
          src={logoWhite} 
          alt="AudienceScan" 
          className="h-10 mx-auto"
        />
      </div>
      <h2 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up delay-300">
        Ready to find your<br />
        <span className="text-violet-400">perfect audience?</span>
      </h2>
      <p className="text-xl text-white/60 mb-12 animate-fade-in-up delay-500">
        Start from just $199/month
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-700">
        <a
          href="https://app.audiencescan.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-full transition-all hover:scale-105 shadow-[0_0_30px_rgba(139,92,246,0.5)]"
          onClick={() => {
            try {
              (window as any).gtag_report_conversion?.('https://app.audiencescan.io/');
            } catch (e) {}
          }}
        >
          Launch App
          <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
        <a
          href="/case-studies"
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/20"
        >
          View Case Studies
        </a>
      </div>
    </div>
  </Scene>
);

export default Video;
