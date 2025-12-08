import { useState, useEffect, useRef } from "react";
import overlapResults from "@/assets/overlap-results.png";

const VideoWhite = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Live stats counters
  const [wallets, setWallets] = useState(36250);
  const [transactions, setTransactions] = useState(236000);
  const [tokens, setTokens] = useState(52750);

  useEffect(() => {
    const interval = setInterval(() => {
      setWallets(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const tokensInterval = setInterval(() => {
      setTokens(prev => prev + Math.floor(Math.random() * 2) + 1);
    }, 1000);
    return () => clearInterval(tokensInterval);
  }, []);

  useEffect(() => {
    const transactionInterval = setInterval(() => {
      setTransactions(prev => prev + 1);
    }, 100);
    return () => clearInterval(transactionInterval);
  }, []);

  // Track scroll progress for parallax
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const progress = scrollTop / scrollHeight;
      setScrollProgress(progress);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scenes = [
    { type: "intro" },
    { type: "liveStats" },
    { type: "problem" },
    { type: "solution" },
    { type: "ahaOverlap" },
    { type: "scanTypes" },
    { type: "howItWorks" },
    { type: "benefits" },
    { type: "results" },
    { type: "socialProof" },
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
      
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 sm:py-4 bg-white/80 backdrop-blur-md border-b border-slate-100/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <span className="material-icons-outlined text-white" style={{ fontSize: '16px' }}>radar</span>
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent group-hover:from-violet-600 group-hover:to-purple-600 transition-all duration-300">
              AudienceScan
            </span>
          </a>
          
          {/* CTA Button */}
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
            <span className="hidden xs:inline">Launch App</span>
            <span className="xs:hidden">Launch</span>
            <span className="material-icons-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
          </a>
        </div>
      </header>
      
      {/* Scene Counter - Fixed - Hidden on mobile */}
      <div className="fixed top-20 sm:top-6 right-4 sm:right-24 z-40 text-xs sm:text-sm font-medium text-slate-400 tabular-nums hidden sm:block">
        {String(currentScene + 1).padStart(2, '0')} / {String(scenes.length).padStart(2, '0')}
      </div>

      {/* Scene Indicators - Left Side - Hidden on mobile */}
      <div className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 sm:gap-3 z-50 hidden sm:flex">
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
        className={`fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1.5 sm:gap-2 transition-opacity duration-500 ${
          currentScene < scenes.length - 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] font-medium">Scroll</span>
        <div className="w-4 h-6 sm:w-5 sm:h-8 rounded-full border-2 border-slate-300 flex items-start justify-center p-0.5 sm:p-1">
          <div className="w-0.5 sm:w-1 h-1.5 sm:h-2 bg-slate-400 rounded-full animate-scroll-hint" />
        </div>
      </div>

      {/* Parallax Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Base gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)",
          }}
        />
        
        {/* Floating shapes with parallax */}
        <div 
          className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-violet-200/20 to-purple-300/10 blur-3xl"
          style={{
            top: `${10 - scrollProgress * 30}%`,
            right: `${-10 + scrollProgress * 20}%`,
            transform: `translateY(${scrollProgress * -100}px) scale(${1 + scrollProgress * 0.3})`,
            transition: 'transform 0.1s ease-out',
          }}
        />
        <div 
          className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-blue-200/15 to-cyan-200/10 blur-3xl"
          style={{
            bottom: `${20 - scrollProgress * 40}%`,
            left: `${-5 + scrollProgress * 15}%`,
            transform: `translateY(${scrollProgress * 150}px) scale(${1 + scrollProgress * 0.2})`,
            transition: 'transform 0.1s ease-out',
          }}
        />
        <div 
          className="absolute w-64 h-64 rounded-full bg-gradient-to-bl from-emerald-200/10 to-teal-200/10 blur-3xl"
          style={{
            top: `${50 + scrollProgress * 20}%`,
            right: `${20 - scrollProgress * 10}%`,
            transform: `translateY(${scrollProgress * -80}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: `translateY(${scrollProgress * -50}px)`,
            transition: 'transform 0.1s ease-out',
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
            <SceneContent 
              type={scene.type} 
              isActive={currentScene === index} 
              wallets={wallets}
              transactions={transactions}
              tokens={tokens}
            />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.92); }
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
        @keyframes fadeInBlur {
          from { opacity: 0; filter: blur(10px); transform: translateY(20px); }
          to { opacity: 1; filter: blur(0); transform: translateY(0); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.8); }
          70% { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes scroll-hint {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.5; }
        }
        .animate-scroll-hint {
          animation: scroll-hint 1.5s ease-in-out infinite;
        }
        /* Base state - always invisible until animation runs */
        .anim-base { opacity: 0; }
        /* Active animations with improved timing */
        .anim-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .anim-fade-in-scale { animation: fadeInScale 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .anim-slide-in-left { animation: slideInLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .anim-slide-in-right { animation: slideInRight 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .anim-fade-in-blur { animation: fadeInBlur 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .anim-pop-in { animation: popIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
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
  wallets?: number;
  transactions?: number;
  tokens?: number;
}

const SceneContent = ({ type, isActive, wallets, transactions, tokens }: SceneContentProps) => {
  switch (type) {
    case "intro":
      return <IntroScene isActive={isActive} />;
    case "liveStats":
      return <LiveStatsScene isActive={isActive} wallets={wallets!} transactions={transactions!} tokens={tokens!} />;
    case "problem":
      return <ProblemScene isActive={isActive} />;
    case "solution":
      return <SolutionScene isActive={isActive} />;
    case "ahaOverlap":
      return <AhaOverlapScene isActive={isActive} />;
    case "scanTypes":
      return <ScanTypesScene isActive={isActive} />;
    case "howItWorks":
      return <HowItWorksScene isActive={isActive} />;
    case "benefits":
      return <BenefitsScene isActive={isActive} />;
    case "results":
      return <ResultsScene isActive={isActive} />;
    case "socialProof":
      return <SocialProofScene isActive={isActive} />;
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
  <div className="text-center max-w-4xl mx-auto px-4 sm:px-6 pt-16 sm:pt-0">
    <div 
      className={`mb-4 sm:mb-6 anim-base ${isActive ? 'anim-pop-in' : ''}`}
      style={{ animationDelay: isActive ? '0s' : '0s' }}
    >
      <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100">
        <span className="material-icons-outlined text-violet-600" style={{ fontSize: '16px' }}>auto_awesome</span>
        <span className="text-violet-700 font-medium text-xs sm:text-sm">On-Chain Intelligence Platform</span>
      </div>
    </div>
    <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-8 tracking-tight leading-[1.1] sm:leading-[0.95]">
      <span 
        className={`block bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 bg-clip-text text-transparent anim-base ${isActive ? 'anim-fade-in-blur' : ''}`}
        style={{ animationDelay: isActive ? '0.1s' : '0s' }}
      >
        Find Your Perfect
      </span>
      <span 
        className={`block bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent anim-base ${isActive ? 'anim-fade-in-blur' : ''}`}
        style={{ animationDelay: isActive ? '0.25s' : '0s' }}
      >
        Web3 Audience
      </span>
    </h1>
    <p 
      className={`text-base sm:text-xl md:text-2xl text-slate-500 font-light max-w-2xl mx-auto leading-relaxed anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
      style={{ animationDelay: isActive ? '0.4s' : '0s' }}
    >
      Use on-chain data to reach users through community targeting
    </p>
    <div 
      className={`mt-6 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
      style={{ animationDelay: isActive ? '0.55s' : '0s' }}
    >
      <a
        href="https://app.audiencescan.io/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold text-sm sm:text-base hover:shadow-xl hover:shadow-violet-200 hover:-translate-y-0.5 transition-all duration-300"
      >
        <span>Start Your Scan</span>
        <span className="material-icons-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
      </a>
    </div>
  </div>
);

interface LiveStatsSceneProps extends SceneProps {
  wallets: number;
  transactions: number;
  tokens: number;
}

const LiveStatsScene = ({ isActive, wallets, transactions, tokens }: LiveStatsSceneProps) => {
  const stats = [
    { value: wallets.toLocaleString(), label: "Wallets analysed", icon: "account_balance_wallet" },
    { value: transactions.toLocaleString(), label: "Transactions analysed", icon: "receipt_long" },
    { value: tokens.toLocaleString(), label: "Tokens found", icon: "token" },
  ];

  return (
    <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 pt-16 sm:pt-0">
      <p 
        className={`text-violet-600 text-[10px] sm:text-xs font-semibold mb-3 sm:mb-4 tracking-[0.15em] sm:tracking-[0.2em] uppercase anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
        style={{ animationDelay: isActive ? '0s' : '0s' }}
      >
        Live Platform Stats
      </p>
      <h2 
        className={`text-2xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-14 anim-base ${isActive ? 'anim-fade-in-blur' : ''}`}
        style={{ animationDelay: isActive ? '0.1s' : '0s' }}
      >
        Powering Web3 intelligence
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 rounded-xl sm:rounded-2xl p-5 sm:p-8 anim-base ${isActive ? 'anim-pop-in' : ''}`}
            style={{ animationDelay: isActive ? `${0.25 + i * 0.12}s` : '0s' }}
          >
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-3 sm:mb-4 mx-auto">
              <span className="material-icons-outlined text-white" style={{ fontSize: '22px' }}>{stat.icon}</span>
            </div>
            <div className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-1 sm:mb-2 tabular-nums">
              {stat.value}
            </div>
            <div className="text-slate-600 font-medium text-sm sm:text-base">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProblemScene = ({ isActive }: SceneProps) => (
  <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 pt-16 sm:pt-0">
    <p className={`text-violet-600 text-[10px] sm:text-xs font-semibold mb-3 sm:mb-4 tracking-[0.15em] sm:tracking-[0.2em] uppercase anim-base ${isActive ? 'anim-fade-in-up' : ''}`}>
      The Problem
    </p>
    <h2 
      className={`text-2xl sm:text-4xl md:text-6xl font-bold mb-8 sm:mb-16 leading-tight anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
      style={{ animationDelay: isActive ? '0.15s' : '0s' }}
    >
      90% of Web3 marketing<br />
      <span className="text-slate-300">misses its target audience</span>
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
      {[
        { icon: "person_off", text: "Targeting based on demographics, not behavior", color: "text-rose-500", bg: "from-rose-50 to-red-50", border: "border-rose-100" },
        { icon: "money_off", text: "Wasted ad spend on unqualified audiences", color: "text-amber-500", bg: "from-amber-50 to-orange-50", border: "border-amber-100" },
      ].map((item, i) => (
        <div
          key={i}
          className={`bg-gradient-to-br ${item.bg} border ${item.border} rounded-xl sm:rounded-2xl p-5 sm:p-8 anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
          style={{ animationDelay: isActive ? `${0.3 + i * 0.1}s` : '0s' }}
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/80 border ${item.border} flex items-center justify-center shrink-0`}>
              <span className={`material-icons-outlined ${item.color}`} style={{ fontSize: '20px' }}>{item.icon}</span>
            </div>
            <p className="text-slate-700 text-sm sm:text-lg text-left leading-relaxed">{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SolutionScene = ({ isActive }: SceneProps) => (
  <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 pt-16 sm:pt-0">
    <p className={`text-violet-600 text-[10px] sm:text-xs font-semibold mb-3 sm:mb-4 tracking-[0.15em] sm:tracking-[0.2em] uppercase anim-base ${isActive ? 'anim-fade-in-up' : ''}`}>
      The Solution
    </p>
    <h2 
      className={`text-2xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
      style={{ animationDelay: isActive ? '0.15s' : '0s' }}
    >
      <span className="block sm:inline">Community targeting</span>{' '}
      <span className="block sm:inline">powered by on-chain data</span>
    </h2>
    <p 
      className={`text-sm sm:text-lg text-slate-500 mb-8 sm:mb-14 max-w-2xl mx-auto anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
      style={{ animationDelay: isActive ? '0.25s' : '0s' }}
    >
      AudienceScan analyzes on-chain behavior to help you reach users through community targeting
    </p>
    <div 
      className={`relative anim-base ${isActive ? 'anim-fade-in-scale' : ''}`}
      style={{ animationDelay: isActive ? '0.4s' : '0s' }}
    >
      <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-10 shadow-xl shadow-slate-200/40">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10">
          <div className="text-center group">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-50 to-purple-100 border border-violet-200 flex items-center justify-center mb-2 sm:mb-3 mx-auto transition-transform group-hover:scale-105">
              <span className="material-icons-outlined text-violet-600" style={{ fontSize: '28px' }}>token</span>
            </div>
            <p className="text-slate-600 font-medium text-xs sm:text-sm">Your Token</p>
          </div>
          <div className="text-violet-400 rotate-90 sm:rotate-0">
            <span className="material-icons-outlined" style={{ fontSize: '24px' }}>trending_flat</span>
          </div>
          <div className="text-center group">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center mb-2 sm:mb-3 mx-auto transition-transform group-hover:scale-105">
              <span className="material-icons-outlined text-slate-600" style={{ fontSize: '28px' }}>manage_search</span>
            </div>
            <p className="text-slate-600 font-medium text-xs sm:text-sm">Scan Holders</p>
          </div>
          <div className="text-violet-400 rotate-90 sm:rotate-0">
            <span className="material-icons-outlined" style={{ fontSize: '24px' }}>trending_flat</span>
          </div>
          <div className="text-center group">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200 flex items-center justify-center mb-2 sm:mb-3 mx-auto transition-transform group-hover:scale-105">
              <span className="material-icons-outlined text-emerald-600" style={{ fontSize: '28px' }}>groups</span>
            </div>
            <p className="text-slate-600 font-medium text-xs sm:text-sm">Perfect Audience</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AhaOverlapScene = ({ isActive }: SceneProps) => (
  <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 pt-16 sm:pt-0">
    <p className={`text-violet-600 text-[10px] sm:text-xs font-semibold mb-3 sm:mb-4 tracking-[0.15em] sm:tracking-[0.2em] uppercase anim-base ${isActive ? 'anim-fade-in-up' : ''}`}>
      The "Aha" Moment
    </p>
    <h2 
      className={`text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
      style={{ animationDelay: isActive ? '0.15s' : '0s' }}
    >
      See who your holders <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">actually follow</span>
    </h2>
    <p 
      className={`text-sm sm:text-lg text-slate-500 mb-6 sm:mb-10 max-w-2xl mx-auto anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
      style={{ animationDelay: isActive ? '0.25s' : '0s' }}
    >
      Discover surprising tokens and communities your holders engage with.
    </p>
    <div 
      className={`rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 shadow-xl sm:shadow-2xl shadow-slate-200/50 anim-base ${isActive ? 'anim-fade-in-scale' : ''}`}
      style={{ animationDelay: isActive ? '0.4s' : '0s' }}
    >
      <img 
        src={overlapResults} 
        alt="AudienceScan overlap results showing Twitter, Telegram, Reddit and Tags data with affinity scores"
        className="w-full h-auto"
      />
    </div>
  </div>
);

const ScanTypesScene = ({ isActive }: SceneProps) => {
  const scanTypes = [
    { 
      icon: "currency_exchange", 
      title: "Token Transactors", 
      desc: "Scan wallets that actively transfer a token",
      image: "/lovable-uploads/token-transactors.png"
    },
    { 
      icon: "account_balance_wallet", 
      title: "Token Holders", 
      desc: "Scan wallets that currently hold a token",
      image: "/lovable-uploads/token-holders.png"
    },
    { 
      icon: "list_alt", 
      title: "List of Wallets", 
      desc: "Upload your own wallet list to scan",
      image: "/lovable-uploads/list-of-wallets.png"
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-0">
      <p className={`text-violet-600 text-[10px] sm:text-xs font-semibold mb-3 sm:mb-4 tracking-[0.15em] sm:tracking-[0.2em] uppercase text-center anim-base ${isActive ? 'anim-fade-in-up' : ''}`}>
        3 Types of Scans
      </p>
      <h2 
        className={`text-2xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-12 text-center anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
        style={{ animationDelay: isActive ? '0.15s' : '0s' }}
      >
        Choose how to <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">analyze</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {scanTypes.map((type, i) => (
          <div
            key={i}
            className={`bg-white border border-slate-200 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-xl hover:border-violet-200 transition-all duration-300 anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
            style={{ animationDelay: isActive ? `${0.3 + i * 0.1}s` : '0s' }}
          >
            <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-center">
              <img 
                src={type.image} 
                alt={`${type.title} interface screenshot`}
                className="w-full max-w-[180px] sm:max-w-[220px] h-auto object-contain"
              />
            </div>
            <div className="p-4 sm:p-5">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-violet-50 to-purple-100 border border-violet-100 flex items-center justify-center">
                  <span className="material-icons-outlined text-violet-600" style={{ fontSize: '18px' }}>{type.icon}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{type.title}</h3>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{type.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HowItWorksScene = ({ isActive }: SceneProps) => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-0">
    <p className={`text-violet-600 text-[10px] sm:text-xs font-semibold mb-3 sm:mb-4 tracking-[0.15em] sm:tracking-[0.2em] uppercase text-center anim-base ${isActive ? 'anim-fade-in-up' : ''}`}>
      How It Works
    </p>
    <h2 
      className={`text-2xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-14 text-center anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
      style={{ animationDelay: isActive ? '0.15s' : '0s' }}
    >
      Three simple steps
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
      {[
        {
          step: "01",
          title: "Scan Wallets",
          desc: "Find wallets using a ticker, category, or upload a list.",
          color: "text-blue-600",
          bg: "from-blue-50 to-sky-50",
          border: "border-blue-100",
          accent: "bg-blue-600",
        },
        {
          step: "02",
          title: "Find Overlaps",
          desc: "Discover which communities your target audience engages with.",
          color: "text-violet-600",
          bg: "from-violet-50 to-purple-50",
          border: "border-violet-100",
          accent: "bg-violet-600",
        },
        {
          step: "03",
          title: "Target Precisely",
          desc: "Export to DV360, X Ads, Telegram, or outreach campaigns.",
          color: "text-emerald-600",
          bg: "from-emerald-50 to-green-50",
          border: "border-emerald-100",
          accent: "bg-emerald-600",
        },
      ].map((item, i) => (
        <div
          key={i}
          className={`relative bg-gradient-to-br ${item.bg} border ${item.border} rounded-xl sm:rounded-2xl p-4 sm:p-7 overflow-hidden anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
          style={{ animationDelay: isActive ? `${0.3 + i * 0.1}s` : '0s' }}
        >
          <div className="relative z-10">
            <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${item.accent} mb-3 sm:mb-5`}>
              <span className="text-base sm:text-xl font-bold text-white">{item.step}</span>
            </div>
            <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-3 text-slate-900">{item.title}</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const BenefitsScene = ({ isActive }: SceneProps) => {
  const benefits = [
    { 
      icon: "gps_fixed", 
      title: "Stop Guessing", 
      desc: "Target wallets that actually transact with tokens like yours",
      color: "text-blue-600",
      bg: "from-blue-50 to-sky-50",
      border: "border-blue-100"
    },
    { 
      icon: "verified", 
      title: "Proven Communities", 
      desc: "Find overlap between your holders and successful projects",
      color: "text-emerald-600",
      bg: "from-emerald-50 to-green-50",
      border: "border-emerald-100"
    },
    { 
      icon: "bolt", 
      title: "2-3 Minutes", 
      desc: "Get actionable data faster than testing a single ad",
      color: "text-amber-600",
      bg: "from-amber-50 to-orange-50",
      border: "border-amber-100"
    },
    { 
      icon: "savings", 
      title: "Avoid Waste", 
      desc: "$199 vs $5,000+ wasted on bad audiences",
      color: "text-violet-600",
      bg: "from-violet-50 to-purple-50",
      border: "border-violet-100"
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-0">
      <p className={`text-violet-600 text-[10px] sm:text-xs font-semibold mb-3 sm:mb-4 tracking-[0.15em] sm:tracking-[0.2em] uppercase text-center anim-base ${isActive ? 'anim-fade-in-up' : ''}`}>
        Why AudienceScan
      </p>
      <h2 
        className={`text-2xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-14 text-center anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
        style={{ animationDelay: isActive ? '0.15s' : '0s' }}
      >
        Benefits that matter
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {benefits.map((benefit, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${benefit.bg} border ${benefit.border} rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center anim-base ${isActive ? 'anim-fade-in-scale' : ''}`}
            style={{ animationDelay: isActive ? `${0.3 + i * 0.1}s` : '0s' }}
          >
            <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-white/80 border ${benefit.border} flex items-center justify-center mb-2 sm:mb-4 mx-auto`}>
              <span className={`material-icons-outlined ${benefit.color}`} style={{ fontSize: '22px' }}>{benefit.icon}</span>
            </div>
            <h3 className="text-sm sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">{benefit.title}</h3>
            <p className="text-slate-600 text-[11px] sm:text-sm leading-relaxed">{benefit.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ResultsScene = ({ isActive }: SceneProps) => (
  <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 pt-16 sm:pt-0">
    <p className={`text-violet-600 text-[10px] sm:text-xs font-semibold mb-3 sm:mb-4 tracking-[0.15em] sm:tracking-[0.2em] uppercase anim-base ${isActive ? 'anim-fade-in-up' : ''}`}>
      Real Results
    </p>
    <h2 
      className={`text-2xl sm:text-4xl md:text-6xl font-bold mb-6 sm:mb-14 anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
      style={{ animationDelay: isActive ? '0.15s' : '0s' }}
    >
      Proven performance
    </h2>
    <div className="grid grid-cols-3 gap-3 sm:gap-6">
      {[
        { value: "73%", label: "Lower CPA", desc: "Cost per acquisition" },
        { value: "4.2x", label: "Better CTR", desc: "Click-through rate" },
        { value: "250+", label: "Scans Run", desc: "Campaigns optimized" },
      ].map((stat, i) => (
        <div
          key={i}
          className={`bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-lg shadow-slate-100/80 anim-base ${isActive ? 'anim-fade-in-scale' : ''}`}
          style={{ animationDelay: isActive ? `${0.3 + i * 0.1}s` : '0s' }}
        >
          <div className="text-2xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-1 sm:mb-2">
            {stat.value}
          </div>
          <div className="text-slate-900 font-semibold text-xs sm:text-base mb-0.5 sm:mb-1">{stat.label}</div>
          <div className="text-slate-500 text-[10px] sm:text-sm hidden sm:block">{stat.desc}</div>
        </div>
      ))}
    </div>
  </div>
);

const SocialProofScene = ({ isActive }: SceneProps) => {
  const clients = [
    "BitMEX", "OKX", "PrimeXBT", "FXTM", "Alpari", "CoinChange", 
    "Syscoin", "Flare Network", "Mantra DAO", "MintLayer"
  ];

  return (
    <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 pt-16 sm:pt-0">
      <p className={`text-violet-600 text-[10px] sm:text-xs font-semibold mb-3 sm:mb-4 tracking-[0.15em] sm:tracking-[0.2em] uppercase anim-base ${isActive ? 'anim-fade-in-up' : ''}`}>
        Trusted By Leaders
      </p>
      <h2 
        className={`text-2xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-12 anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
        style={{ animationDelay: isActive ? '0.15s' : '0s' }}
      >
        Powering top Web3 teams
      </h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-8 sm:mb-14">
        {[
          { value: "$8M+", label: "Ad budget deployed", icon: "payments" },
          { value: "314", label: "Campaigns activated", icon: "campaign" },
        ].map((metric, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-white anim-base ${isActive ? 'anim-fade-in-scale' : ''}`}
            style={{ animationDelay: isActive ? `${0.3 + i * 0.1}s` : '0s' }}
          >
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-white/20 flex items-center justify-center mb-2 sm:mb-4 mx-auto">
              <span className="material-icons-outlined" style={{ fontSize: '22px' }}>{metric.icon}</span>
            </div>
            <div className="text-2xl sm:text-5xl md:text-6xl font-bold mb-1 sm:mb-2">{metric.value}</div>
            <div className="text-violet-200 font-medium text-xs sm:text-base">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Client Logos */}
      <div 
        className={`anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
        style={{ animationDelay: isActive ? '0.5s' : '0s' }}
      >
        <p className="text-slate-400 text-xs sm:text-sm mb-4 sm:mb-6 uppercase tracking-wider">Trusted by</p>
        <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-8 gap-y-2 sm:gap-y-4">
          {clients.map((client, i) => (
            <span 
              key={i} 
              className="text-slate-400 font-medium text-xs sm:text-sm hover:text-slate-600 transition-colors"
            >
              {client}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const UseCasesScene = ({ isActive }: SceneProps) => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-0">
    <p className={`text-violet-600 text-[10px] sm:text-xs font-semibold mb-3 sm:mb-4 tracking-[0.15em] sm:tracking-[0.2em] uppercase text-center anim-base ${isActive ? 'anim-fade-in-up' : ''}`}>
      Use Cases
    </p>
    <h2 
      className={`text-2xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-12 text-center anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
      style={{ animationDelay: isActive ? '0.15s' : '0s' }}
    >
      Who uses AudienceScan?
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {[
        { icon: "rocket_launch", title: "Token Projects", desc: "On-chain data for GTM strategy" },
        { icon: "record_voice_over", title: "KOL Researchers", desc: "Find communities with relevant KOLs" },
        { icon: "foundation", title: "Launchpads", desc: "Discover holder engagement patterns" },
        { icon: "account_balance", title: "Exchanges", desc: "Evaluate tokens for listing decisions" },
        { icon: "campaign", title: "Marketing Agencies", desc: "Stand out with on-chain insights" },
      ].map((item, i) => (
        <div
          key={i}
          className={`bg-white border border-slate-200 rounded-lg sm:rounded-xl p-3 sm:p-5 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/50 transition-all duration-300 anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
          style={{ animationDelay: isActive ? `${0.3 + i * 0.08}s` : '0s' }}
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-violet-50 to-purple-100 border border-violet-100 flex items-center justify-center shrink-0">
              <span className="material-icons-outlined text-violet-600" style={{ fontSize: '18px' }}>{item.icon}</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base mb-0.5 sm:mb-1">{item.title}</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CTAScene = ({ isActive }: SceneProps) => (
  <div className="text-center max-w-3xl mx-auto px-4 sm:px-6 pt-16 sm:pt-0">
    <h2 className={`text-2xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 anim-base ${isActive ? 'anim-fade-in-up' : ''}`}>
      Ready to find your<br />
      <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">perfect audience?</span>
    </h2>
    <p 
      className={`text-sm sm:text-lg text-slate-500 mb-6 sm:mb-10 anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
      style={{ animationDelay: isActive ? '0.15s' : '0s' }}
    >
      Join leading Web3 teams using on-chain intelligence
    </p>
    <div 
      className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center anim-base ${isActive ? 'anim-fade-in-up' : ''}`}
      style={{ animationDelay: isActive ? '0.3s' : '0s' }}
    >
      <a
        href="https://app.audiencescan.io/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold text-sm sm:text-base hover:shadow-xl hover:shadow-violet-200 hover:-translate-y-0.5 transition-all duration-300"
      >
        <span>Launch App</span>
        <span className="material-icons-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
      </a>
      <a
        href="/pricing"
        className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm sm:text-base hover:border-violet-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
      >
        View Pricing
      </a>
    </div>
  </div>
);

export default VideoWhite;
