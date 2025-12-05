import { useState, useEffect } from "react";
import { Search, ArrowRight, Target, Users, Zap, TrendingUp, BarChart3, Globe, CheckCircle2, Wallet, Tags, Building2, FileText, ChevronRight, Play, Pause } from "lucide-react";

const Video1 = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const scenes = [
    { type: "intro", duration: 4000 },
    { type: "hook", duration: 4000 },
    { type: "problem1", duration: 4000 },
    { type: "problem2", duration: 4000 },
    { type: "problem3", duration: 4000 },
    { type: "transition", duration: 3000 },
    { type: "solution", duration: 5000 },
    { type: "howIntro", duration: 3000 },
    { type: "step1Category", duration: 4000 },
    { type: "step2Token", duration: 4000 },
    { type: "step3Analysis", duration: 4000 },
    { type: "step4Strategy", duration: 4000 },
    { type: "widgetDemo", duration: 5000 },
    { type: "resultsIntro", duration: 3000 },
    { type: "result1", duration: 3500 },
    { type: "result2", duration: 3500 },
    { type: "result3", duration: 3500 },
    { type: "platforms", duration: 4000 },
    { type: "useCases", duration: 4000 },
    { type: "testimonial", duration: 4000 },
    { type: "socialProofStats", duration: 4000 },
    { type: "clientLogos", duration: 5000 },
    { type: "pricing", duration: 4000 },
    { type: "cta", duration: 6000 },
  ];

  useEffect(() => {
    if (!autoPlay || isPaused) return;
    
    const timer = setTimeout(() => {
      if (currentScene < scenes.length - 1) {
        goToScene(currentScene + 1, false);
      }
    }, scenes[currentScene].duration);

    return () => clearTimeout(timer);
  }, [currentScene, autoPlay, isPaused]);

  const goToScene = (index: number, pauseAutoPlay = false) => {
    if (pauseAutoPlay) {
      setAutoPlay(false);
    }
    if (index === currentScene) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScene(index);
      setIsTransitioning(false);
    }, 200);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const renderScene = () => {
    const sceneProps = { key: currentScene };
    switch (scenes[currentScene].type) {
      case "intro": return <IntroScene {...sceneProps} />;
      case "hook": return <HookScene {...sceneProps} />;
      case "problem1": return <Problem1Scene {...sceneProps} />;
      case "problem2": return <Problem2Scene {...sceneProps} />;
      case "problem3": return <Problem3Scene {...sceneProps} />;
      case "transition": return <TransitionScene {...sceneProps} />;
      case "solution": return <SolutionScene {...sceneProps} />;
      case "howIntro": return <HowIntroScene {...sceneProps} />;
      case "step1Category": return <Step1Scene {...sceneProps} />;
      case "step2Token": return <Step2Scene {...sceneProps} />;
      case "step3Analysis": return <Step3Scene {...sceneProps} />;
      case "step4Strategy": return <Step4Scene {...sceneProps} />;
      case "widgetDemo": return <WidgetDemoScene {...sceneProps} />;
      case "resultsIntro": return <ResultsIntroScene {...sceneProps} />;
      case "result1": return <Result1Scene {...sceneProps} />;
      case "result2": return <Result2Scene {...sceneProps} />;
      case "result3": return <Result3Scene {...sceneProps} />;
      case "platforms": return <PlatformsScene {...sceneProps} />;
      case "useCases": return <UseCasesScene {...sceneProps} />;
      case "testimonial": return <TestimonialScene {...sceneProps} />;
      case "socialProofStats": return <SocialProofStatsScene {...sceneProps} />;
      case "clientLogos": return <ClientLogosScene {...sceneProps} />;
      case "pricing": return <PricingScene {...sceneProps} />;
      case "cta": return <CTAScene {...sceneProps} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden relative">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex gap-0.5 px-4 pt-4">
        {scenes.map((scene, index) => (
          <button
            key={index}
            onClick={() => goToScene(index, true)}
            className="flex-1 h-1 rounded-full overflow-hidden bg-slate-200 cursor-pointer hover:bg-slate-300 transition-colors"
          >
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-purple-600 transition-all"
              style={{
                width: currentScene > index ? "100%" : currentScene === index ? "100%" : "0%",
                transition: currentScene === index && !isPaused ? `width ${scene.duration}ms linear` : "width 0.2s",
              }}
            />
          </button>
        ))}
      </div>

      {/* Scene Counter & Controls */}
      <div className="fixed top-6 right-4 z-50 flex items-center gap-3">
        <button
          onClick={togglePause}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          {isPaused ? <Play className="w-4 h-4 text-slate-600" /> : <Pause className="w-4 h-4 text-slate-600" />}
        </button>
        <span className="text-sm text-slate-400 font-mono">
          {String(currentScene + 1).padStart(2, '0')}/{String(scenes.length).padStart(2, '0')}
        </span>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => goToScene(Math.max(0, currentScene - 1), true)}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 shadow-lg"
        disabled={currentScene === 0}
      >
        <ChevronRight className="w-6 h-6 rotate-180 text-slate-600" />
      </button>
      <button
        onClick={() => goToScene(Math.min(scenes.length - 1, currentScene + 1), true)}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 shadow-lg"
        disabled={currentScene === scenes.length - 1}
      >
        <ChevronRight className="w-6 h-6 text-slate-600" />
      </button>

      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(100, 100, 100) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Scene Content */}
      <div className={`transition-all duration-200 ${isTransitioning ? 'opacity-0 scale-98' : 'opacity-100 scale-100'}`}>
        {renderScene()}
      </div>

      {/* Keyboard hint */}
      <div className="fixed bottom-4 right-4 z-50 text-xs text-slate-300">
        Click arrows or progress bar to navigate
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        @keyframes countUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes draw { to { stroke-dashoffset: 0; } }
        
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-down { animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-left { animation: fadeInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-right { animation: fadeInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-scale-in { animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse 2s ease-in-out infinite; }
        .animate-gradient { animation: gradientShift 3s ease infinite; background-size: 200% 200%; }
        
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
        .delay-1200 { animation-delay: 1.2s; opacity: 0; }
        .delay-1500 { animation-delay: 1.5s; opacity: 0; }
        
        .scale-98 { transform: scale(0.98); }
        
        .gradient-text {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .gradient-border {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          padding: 2px;
          border-radius: 24px;
        }
        
        .gradient-border-inner {
          background: white;
          border-radius: 22px;
        }
      `}</style>
    </div>
  );
};

const Scene = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`min-h-screen flex items-center justify-center px-8 py-24 ${className}`}>
    {children}
  </div>
);

// Scene 1: Intro
const IntroScene = () => (
  <Scene>
    <div className="text-center max-w-4xl">
      <div className="mb-12 animate-fade-in">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100">
          <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse-slow" />
          <span className="text-violet-700 font-medium">On-Chain Audience Intelligence</span>
        </div>
      </div>
      <h1 className="text-7xl md:text-9xl font-bold tracking-tight mb-8 animate-fade-in-up delay-200">
        <span className="gradient-text">Audience</span>
        <span className="text-slate-900">Scan</span>
      </h1>
      <p className="text-2xl md:text-3xl text-slate-500 font-light animate-fade-in-up delay-400">
        Find your perfect crypto audience through<br />
        <span className="text-slate-800 font-medium">community targeting</span>
      </p>
    </div>
  </Scene>
);

// Scene 2: Hook
const HookScene = () => (
  <Scene>
    <div className="text-center max-w-5xl">
      <h2 className="text-5xl md:text-7xl font-bold leading-tight animate-fade-in-up">
        What if you could target
        <br />
        <span className="gradient-text">the exact people</span>
        <br />
        who care about crypto?
      </h2>
    </div>
  </Scene>
);

// Scene 3-5: Problems
const Problem1Scene = () => (
  <Scene className="bg-gradient-to-br from-red-50 to-orange-50">
    <div className="max-w-4xl">
      <div className="text-red-500 text-sm font-bold uppercase tracking-widest mb-6 animate-fade-in">
        Problem #1
      </div>
      <h2 className="text-4xl md:text-6xl font-bold mb-8 animate-fade-in-up delay-100">
        Traditional targeting<br />
        <span className="text-red-500">doesn't work</span> in Web3
      </h2>
      <p className="text-xl text-slate-600 animate-fade-in-up delay-300">
        Demographics tell you nothing about crypto behavior.<br />
        Age, location, interests... all useless when targeting token buyers.
      </p>
    </div>
  </Scene>
);

const Problem2Scene = () => (
  <Scene className="bg-gradient-to-br from-orange-50 to-amber-50">
    <div className="max-w-4xl">
      <div className="text-orange-500 text-sm font-bold uppercase tracking-widest mb-6 animate-fade-in">
        Problem #2
      </div>
      <h2 className="text-4xl md:text-6xl font-bold mb-8 animate-fade-in-up delay-100">
        You're burning budget on<br />
        <span className="text-orange-500">cold audiences</span>
      </h2>
      <div className="grid md:grid-cols-3 gap-6 mt-12 animate-fade-in-up delay-300">
        {[
          { value: "90%", label: "of ad spend wasted" },
          { value: "2%", label: "average CTR" },
          { value: "$50+", label: "cost per lead" },
        ].map((stat, i) => (
          <div key={i} className="text-center p-6 bg-white/60 rounded-2xl backdrop-blur-sm">
            <div className="text-4xl font-bold text-orange-600 mb-2">{stat.value}</div>
            <div className="text-slate-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </Scene>
);

const Problem3Scene = () => (
  <Scene className="bg-gradient-to-br from-amber-50 to-yellow-50">
    <div className="max-w-4xl">
      <div className="text-amber-600 text-sm font-bold uppercase tracking-widest mb-6 animate-fade-in">
        Problem #3
      </div>
      <h2 className="text-4xl md:text-6xl font-bold mb-8 animate-fade-in-up delay-100">
        Finding the right community is<br />
        <span className="text-amber-600">needle in a haystack</span>
      </h2>
      <p className="text-xl text-slate-600 animate-fade-in-up delay-300">
        Millions of tokens. Thousands of communities.<br />
        Where do you even start?
      </p>
    </div>
  </Scene>
);

// Scene 6: Transition
const TransitionScene = () => (
  <Scene>
    <div className="text-center">
      <h2 className="text-5xl md:text-7xl font-bold animate-scale-in">
        There's a <span className="gradient-text">better way</span>
      </h2>
    </div>
  </Scene>
);

// Scene 7: Solution
const SolutionScene = () => (
  <Scene className="bg-gradient-to-br from-violet-50 to-purple-50">
    <div className="max-w-5xl">
      <div className="text-violet-600 text-sm font-bold uppercase tracking-widest mb-6 animate-fade-in">
        The Solution
      </div>
      <h2 className="text-4xl md:text-6xl font-bold mb-8 animate-fade-in-up delay-100">
        On-chain data reveals<br />
        <span className="gradient-text">exactly who to target</span>
      </h2>
      <div className="grid md:grid-cols-3 gap-8 mt-12">
        {[
          { icon: <Wallet className="w-8 h-8" />, title: "Wallet Analysis", desc: "See what tokens people actually hold" },
          { icon: <Users className="w-8 h-8" />, title: "Community Overlap", desc: "Find where your audience hangs out" },
          { icon: <Target className="w-8 h-8" />, title: "Precision Targeting", desc: "Reach only the right people" },
        ].map((item, i) => (
          <div 
            key={i} 
            className="p-8 bg-white rounded-3xl shadow-sm border border-violet-100 animate-fade-in-up"
            style={{ animationDelay: `${0.3 + i * 0.15}s`, opacity: 0 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600 mb-6">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-slate-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </Scene>
);

// Scene 8: How It Works Intro
const HowIntroScene = () => (
  <Scene>
    <div className="text-center">
      <div className="text-violet-600 text-sm font-bold uppercase tracking-widest mb-6 animate-fade-in">
        How It Works
      </div>
      <h2 className="text-5xl md:text-7xl font-bold animate-fade-in-up delay-200">
        Simple as <span className="gradient-text">1-2-3-4</span>
      </h2>
    </div>
  </Scene>
);

// Scene 9: Step 1 - Category
const Step1Scene = () => (
  <Scene className="bg-slate-50">
    <div className="max-w-5xl w-full">
      <div className="flex items-center gap-4 mb-8 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-violet-600 text-white flex items-center justify-center text-2xl font-bold">1</div>
        <div className="text-violet-600 font-bold uppercase tracking-widest">Select Your Category</div>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold mb-12 animate-fade-in-up delay-100">
        What type of project are you?
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up delay-300">
        {[
          { label: "DeFi", icon: "💰" },
          { label: "NFT", icon: "🎨" },
          { label: "Gaming", icon: "🎮" },
          { label: "Infrastructure", icon: "🔧" },
          { label: "AI / Data", icon: "🤖" },
          { label: "Social", icon: "💬" },
          { label: "Meme", icon: "🐸" },
          { label: "Other", icon: "✨" },
        ].map((cat, i) => (
          <div 
            key={i}
            className={`p-6 rounded-2xl border-2 text-center cursor-pointer transition-all hover:scale-105 ${
              i === 0 ? 'border-violet-500 bg-violet-50 ring-4 ring-violet-200' : 'border-slate-200 bg-white hover:border-violet-300'
            }`}
          >
            <div className="text-4xl mb-3">{cat.icon}</div>
            <div className="font-semibold">{cat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </Scene>
);

// Scene 10: Step 2 - Token
const Step2Scene = () => (
  <Scene className="bg-slate-50">
    <div className="max-w-4xl w-full">
      <div className="flex items-center gap-4 mb-8 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-violet-600 text-white flex items-center justify-center text-2xl font-bold">2</div>
        <div className="text-violet-600 font-bold uppercase tracking-widest">Select a Reference Token</div>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold mb-8 animate-fade-in-up delay-100">
        Pick a token <span className="gradient-text">relevant to you</span>
      </h2>
      <p className="text-xl text-slate-600 mb-12 animate-fade-in-up delay-200">
        Choose a successful token in your space — we'll analyze who holds it
      </p>
      <div className="gradient-border animate-scale-in delay-400">
        <div className="gradient-border-inner p-8">
          <div className="flex items-center gap-4">
            <Search className="w-6 h-6 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search token name or paste contract..."
              className="flex-1 text-xl bg-transparent outline-none"
              defaultValue="USDC"
            />
          </div>
          <div className="mt-6 p-4 bg-slate-50 rounded-xl flex items-center gap-4">
            <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png" alt="USDC" className="w-12 h-12 rounded-full" />
            <div className="flex-1">
              <div className="font-bold text-lg">USD Coin</div>
              <div className="text-slate-500">USDC • Multi-chain</div>
            </div>
            <div className="px-4 py-2 bg-violet-600 text-white rounded-full font-medium">Selected</div>
          </div>
        </div>
      </div>
    </div>
  </Scene>
);

// Scene 11: Step 3 - Analysis
const Step3Scene = () => (
  <Scene className="bg-slate-50">
    <div className="max-w-5xl w-full">
      <div className="flex items-center gap-4 mb-8 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-violet-600 text-white flex items-center justify-center text-2xl font-bold">3</div>
        <div className="text-violet-600 font-bold uppercase tracking-widest">We Analyze Everything</div>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold mb-12 animate-fade-in-up delay-100">
        Deep on-chain analysis
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { icon: <BarChart3 className="w-6 h-6" />, title: "Token Overlap Analysis", desc: "Find other tokens your audience holds", highlight: "45 tokens found" },
          { icon: <Users className="w-6 h-6" />, title: "Community Mapping", desc: "Identify active communities", highlight: "12 communities" },
          { icon: <Globe className="w-6 h-6" />, title: "Social Discovery", desc: "Link wallets to social accounts", highlight: "2,400 profiles" },
          { icon: <TrendingUp className="w-6 h-6" />, title: "Behavior Patterns", desc: "Understand trading behaviors", highlight: "High conviction" },
        ].map((item, i) => (
          <div 
            key={i}
            className="p-6 bg-white rounded-2xl border border-slate-200 flex gap-4 animate-fade-in-left"
            style={{ animationDelay: `${0.2 + i * 0.1}s`, opacity: 0 }}
          >
            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 shrink-0">
              {item.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold mb-1">{item.title}</h3>
              <p className="text-slate-600 text-sm mb-2">{item.desc}</p>
              <div className="text-violet-600 font-semibold text-sm">{item.highlight}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Scene>
);

// Scene 12: Step 4 - Strategy
const Step4Scene = () => (
  <Scene className="bg-slate-50">
    <div className="max-w-5xl w-full">
      <div className="flex items-center gap-4 mb-8 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-violet-600 text-white flex items-center justify-center text-2xl font-bold">4</div>
        <div className="text-violet-600 font-bold uppercase tracking-widest">Execute Your Strategy</div>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold mb-8 animate-fade-in-up delay-100">
        Start winning with<br /><span className="gradient-text">our proven playbook</span>
      </h2>
      <p className="text-xl text-slate-600 mb-12 animate-fade-in-up delay-200">
        We give you a complete marketing strategy tailored to your audience
      </p>
      <div className="flex flex-wrap gap-4 animate-fade-in-up delay-400">
        {["X Ads Campaign", "Telegram Outreach", "KOL Strategy", "DV360 Setup", "Reddit Campaign", "DM Sequences"].map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-5 py-3 bg-white rounded-full border border-slate-200 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="font-medium">{item}</span>
          </div>
        ))}
      </div>
    </div>
  </Scene>
);

// Scene 13: Widget Demo
const WidgetDemoScene = () => (
  <Scene>
    <div className="max-w-5xl w-full">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold animate-fade-in-up">
          It all starts with <span className="gradient-text">one scan</span>
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6 animate-fade-in-up delay-300">
        {[
          { icon: <TrendingUp className="w-8 h-8" />, title: "Token Transactors", desc: "Analyze wallet transaction activity" },
          { icon: <Wallet className="w-8 h-8" />, title: "Token Holders", desc: "Study current token holders" },
          { icon: <Tags className="w-8 h-8" />, title: "Category Scan", desc: "Target by token category" },
        ].map((option, i) => (
          <div 
            key={i}
            className={`p-8 rounded-3xl border-2 text-center cursor-pointer transition-all ${
              i === 0 ? 'border-violet-500 bg-violet-50 shadow-lg shadow-violet-200/50' : 'border-slate-200 bg-white hover:border-violet-300'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center ${
              i === 0 ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {option.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{option.title}</h3>
            <p className="text-slate-600">{option.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </Scene>
);

// Scene 14: Results Intro
const ResultsIntroScene = () => (
  <Scene className="bg-gradient-to-br from-green-50 to-emerald-50">
    <div className="text-center">
      <div className="text-green-600 text-sm font-bold uppercase tracking-widest mb-6 animate-fade-in">
        Real Results
      </div>
      <h2 className="text-5xl md:text-7xl font-bold animate-fade-in-up delay-200">
        Performance that<br /><span className="text-green-600">speaks for itself</span>
      </h2>
    </div>
  </Scene>
);

// Scene 15-17: Individual Results
const Result1Scene = () => (
  <Scene className="bg-gradient-to-br from-green-50 to-emerald-50">
    <div className="text-center max-w-3xl">
      <div className="text-9xl md:text-[12rem] font-bold text-green-600 mb-4 animate-scale-in">
        73%
      </div>
      <h3 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up delay-300">
        Lower Cost Per Acquisition
      </h3>
      <p className="text-xl text-slate-600 animate-fade-in-up delay-500">
        Compared to standard demographic targeting
      </p>
    </div>
  </Scene>
);

const Result2Scene = () => (
  <Scene className="bg-gradient-to-br from-green-50 to-emerald-50">
    <div className="text-center max-w-3xl">
      <div className="text-9xl md:text-[12rem] font-bold text-green-600 mb-4 animate-scale-in">
        4.2x
      </div>
      <h3 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up delay-300">
        Higher Click-Through Rate
      </h3>
      <p className="text-xl text-slate-600 animate-fade-in-up delay-500">
        When targeting on-chain validated audiences
      </p>
    </div>
  </Scene>
);

const Result3Scene = () => (
  <Scene className="bg-gradient-to-br from-green-50 to-emerald-50">
    <div className="text-center max-w-3xl">
      <div className="text-9xl md:text-[12rem] font-bold text-green-600 mb-4 animate-scale-in">
        314
      </div>
      <h3 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up delay-300">
        Campaigns Activated
      </h3>
      <p className="text-xl text-slate-600 animate-fade-in-up delay-500">
        Launched using AudienceScan data
      </p>
    </div>
  </Scene>
);

// Scene 18: Platforms
const PlatformsScene = () => (
  <Scene>
    <div className="max-w-5xl">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold animate-fade-in-up">
          Works with <span className="gradient-text">every platform</span>
        </h2>
      </div>
      <div className="flex flex-wrap justify-center gap-6 animate-fade-in-up delay-300">
        {[
          { name: "Google Ads", color: "bg-red-100 text-red-600" },
          { name: "DV360", color: "bg-blue-100 text-blue-600" },
          { name: "X Ads", color: "bg-slate-100 text-slate-900" },
          { name: "Telegram Ads", color: "bg-sky-100 text-sky-600" },
          { name: "Reddit Ads", color: "bg-orange-100 text-orange-600" },
          { name: "Direct DMs", color: "bg-purple-100 text-purple-600" },
        ].map((platform, i) => (
          <div 
            key={i} 
            className={`px-8 py-4 rounded-2xl ${platform.color} font-semibold text-lg`}
          >
            {platform.name}
          </div>
        ))}
      </div>
    </div>
  </Scene>
);

// Scene 19: Use Cases
const UseCasesScene = () => (
  <Scene>
    <div className="max-w-6xl">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold animate-fade-in-up">
          Built for <span className="gradient-text">Web3 teams</span>
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { icon: "🚀", title: "Token Projects", desc: "Find your tribe" },
          { icon: "🎤", title: "KOL Researchers", desc: "Discover influencers" },
          { icon: "🏗️", title: "Launchpads", desc: "Source quality projects" },
          { icon: "🔬", title: "Researchers", desc: "Deep token analysis" },
          { icon: "🏦", title: "Exchanges", desc: "Listing decisions" },
          { icon: "📢", title: "Agencies", desc: "Deliver better results" },
        ].map((item, i) => (
          <div 
            key={i}
            className="p-6 bg-slate-50 rounded-2xl animate-fade-in-up"
            style={{ animationDelay: `${0.1 + i * 0.1}s`, opacity: 0 }}
          >
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="font-bold mb-1">{item.title}</h3>
            <p className="text-slate-600 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </Scene>
);

// Scene 20: Testimonial
const TestimonialScene = () => (
  <Scene className="bg-slate-50">
    <div className="max-w-4xl text-center">
      <div className="text-6xl mb-8 animate-scale-in">"</div>
      <p className="text-2xl md:text-4xl font-medium leading-relaxed mb-8 animate-fade-in-up delay-200">
        AudienceScan completely changed how we approach Web3 marketing. 
        We went from <span className="text-violet-600">guessing</span> to{" "}
        <span className="text-violet-600">knowing</span> exactly who to target.
      </p>
      <div className="flex items-center justify-center gap-4 animate-fade-in-up delay-500">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-600" />
        <div className="text-left">
          <div className="font-bold">Marketing Lead</div>
          <div className="text-slate-500">Top 100 Token Project</div>
        </div>
      </div>
    </div>
  </Scene>
);

// Scene 21: Social Proof Stats
const SocialProofStatsScene = () => (
  <Scene className="bg-gradient-to-br from-violet-50 to-purple-50">
    <div className="max-w-5xl">
      <div className="text-center mb-16">
        <div className="text-violet-600 text-sm font-bold uppercase tracking-widest mb-6 animate-fade-in">
          Proven At Scale
        </div>
        <h2 className="text-4xl md:text-6xl font-bold animate-fade-in-up delay-200">
          Trusted by <span className="gradient-text">industry leaders</span>
        </h2>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="text-center p-10 bg-white rounded-3xl shadow-sm border border-violet-100 animate-fade-in-up delay-300">
          <div className="text-6xl md:text-8xl font-bold gradient-text mb-4">$8M+</div>
          <h3 className="text-2xl font-bold mb-2">Ad Budget Powered</h3>
          <p className="text-slate-600">In marketing spend managed using AudienceScan data</p>
        </div>
        <div className="text-center p-10 bg-white rounded-3xl shadow-sm border border-violet-100 animate-fade-in-up delay-500">
          <div className="text-6xl md:text-8xl font-bold gradient-text mb-4">314</div>
          <h3 className="text-2xl font-bold mb-2">Campaigns Activated</h3>
          <p className="text-slate-600">Successful campaigns launched with our targeting data</p>
        </div>
      </div>
    </div>
  </Scene>
);

// Scene 22: Client Logos
const ClientLogosScene = () => {
  const tier1 = ["BitMEX", "OKX", "PrimeXBT", "FXTM", "Alpari", "CoinChange", "Syscoin", "Flare Network"];
  const tier2 = ["Mantra DAO", "MintLayer", "Semetrix", "TronPad", "Vabble", "Vent Finance", "Realms of Ethernity", "Synesis One", "Moonstake", "NFTrade", "Guild of Guardians", "Hume"];
  const tier3 = ["Axion", "WAM", "Luxy", "SharkRace", "Soma"];
  
  return (
    <Scene>
      <div className="max-w-6xl">
        <div className="text-center mb-12">
          <div className="text-violet-600 text-sm font-bold uppercase tracking-widest mb-4 animate-fade-in">
            Our Clients
          </div>
          <h2 className="text-4xl md:text-5xl font-bold animate-fade-in-up delay-100">
            Powering <span className="gradient-text">Web3's best</span>
          </h2>
        </div>
        
        {/* Tier 1 - Exchanges & Major Platforms */}
        <div className="mb-8 animate-fade-in-up delay-200">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-yellow-500 text-xl">🥇</span>
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Exchanges & Major Platforms</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {tier1.map((client, i) => (
              <div 
                key={i}
                className="px-5 py-2.5 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200 font-semibold text-slate-800"
              >
                {client}
              </div>
            ))}
          </div>
        </div>
        
        {/* Tier 2 - Established Web3 Projects */}
        <div className="mb-8 animate-fade-in-up delay-400">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-slate-400 text-xl">🥈</span>
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Established Web3 Projects</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {tier2.map((client, i) => (
              <div 
                key={i}
                className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 font-medium text-slate-700 text-sm"
              >
                {client}
              </div>
            ))}
          </div>
        </div>
        
        {/* Tier 3 - Additional Projects */}
        <div className="animate-fade-in-up delay-600">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-amber-600 text-xl">🔥</span>
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">And Many More</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {tier3.map((client, i) => (
              <div 
                key={i}
                className="px-4 py-2 bg-slate-50/50 rounded-lg border border-slate-100 font-medium text-slate-500 text-sm"
              >
                {client}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Scene>
  );
};

// Scene 23: Pricing
const PricingScene = () => (
  <Scene>
    <div className="max-w-3xl text-center">
      <h2 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-up">
        Start from just
      </h2>
      <div className="animate-scale-in delay-200">
        <span className="text-8xl md:text-9xl font-bold gradient-text">$199</span>
        <span className="text-3xl text-slate-500">/month</span>
      </div>
      <p className="text-xl text-slate-600 mt-8 animate-fade-in-up delay-400">
        No contracts. Cancel anytime.<br />
        <span className="text-violet-600 font-semibold">30-day money-back guarantee</span>
      </p>
    </div>
  </Scene>
);

// Scene 22: CTA
const CTAScene = () => (
  <Scene className="bg-gradient-to-br from-violet-600 to-purple-700">
    <div className="max-w-4xl text-center text-white">
      <h2 className="text-5xl md:text-7xl font-bold mb-8 animate-fade-in-up">
        Ready to find your<br />
        perfect audience?
      </h2>
      <p className="text-xl text-white/80 mb-12 animate-fade-in-up delay-200">
        Join 300+ Web3 teams powering $8M+ in ad spend
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-400">
        <a
          href="https://app.audiencescan.xyz"
          className="inline-flex items-center justify-center gap-3 px-10 py-5 text-xl font-bold bg-white text-violet-700 rounded-full transition-all hover:scale-105 shadow-2xl shadow-black/20"
        >
          Launch App
          <ArrowRight className="w-6 h-6" />
        </a>
        <a
          href="/case-studies"
          className="inline-flex items-center justify-center gap-3 px-10 py-5 text-xl font-semibold bg-white/10 text-white rounded-full transition-all hover:bg-white/20 border border-white/20"
        >
          View Case Studies
        </a>
      </div>
      <div className="mt-16 animate-fade-in-up delay-700">
        <div className="text-white/60 text-sm mb-4">Trusted by teams from</div>
        <div className="flex justify-center gap-8 opacity-60">
          {["🔷", "⬟", "🔴", "🟡", "🟢"].map((icon, i) => (
            <span key={i} className="text-3xl">{icon}</span>
          ))}
        </div>
      </div>
    </div>
  </Scene>
);

export default Video1;
