import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  BarChart3, 
  Wallet, 
  DollarSign, 
  Target, 
  Sparkles, 
  Crown, 
  Bot, 
  Users, 
  Zap,
  Check,
  TrendingUp,
  Search,
  Upload,
  Eye
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

// Client logos
import bitmexLogo from "@/assets/client-logos/bitmex.png";
import okxLogo from "@/assets/client-logos/okx.png";
import flareLogo from "@/assets/client-logos/flare.png";
import mantraLogo from "@/assets/client-logos/mantra.png";
import mintlayerLogo from "@/assets/client-logos/mintlayer.png";
import syscoinLogo from "@/assets/client-logos/syscoin.png";
import luxyLogo from "@/assets/client-logos/luxy.png";
import somaLogo from "@/assets/client-logos/soma.png";
import synesisLogo from "@/assets/client-logos/synesis.png";
import ventLogo from "@/assets/client-logos/vent.png";
import xLogo from "@/assets/x-logo.png";
import telegramLogo from "@/assets/telegram-logo.png";
import logoWhite from "@/assets/audiencescan-logo-white.png";
import audienceScanIcon from "@/assets/audiencescan-icon.png";

// Animated Counter Component
const AnimatedCounter = ({ 
  end, 
  duration = 2000, 
  prefix = "", 
  suffix = "",
  startOnView = true 
}: { 
  end: number; 
  duration?: number; 
  prefix?: string; 
  suffix?: string;
  startOnView?: boolean;
}) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(!startOnView);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!startOnView) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [startOnView, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [end, duration, hasStarted]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// Dark Header Component
const DarkHeader = () => {
  return (
    <header className="w-full bg-black/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/[0.08]">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <img src={logoWhite} alt="AudienceScan" className="h-6 hover:opacity-80 transition-opacity cursor-pointer" />
          </Link>
        </div>
        
        <Button 
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-[0_0_20px_rgba(168,85,247,0.5),0_0_40px_rgba(236,72,153,0.3)] text-sm md:text-base px-4 sm:px-6 md:px-8"
          asChild
        >
          <Link to="/auth">
            Place Your Tag
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </header>
  );
};

// Dark Footer Component
const DarkFooter = () => {
  return (
    <footer className="bg-black border-t border-white/[0.08] py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={audienceScanIcon} 
                alt="AudienceScan Logo" 
                className="h-8 w-8 rounded-md"
              />
              <span className="text-h3 font-bold text-white">AudienceScan</span>
            </div>
            <p className="text-p3 text-white/50 leading-relaxed">
              Turn wallet data into marketing signal.
            </p>
          </div>
          
          {/* Connect */}
          <div>
            <h3 className="font-semibold text-white mb-4">Connect</h3>
            <div className="flex gap-4">
              <a 
                href="https://www.linkedin.com/company/audiencescanio/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/[0.05] hover:bg-purple-500 border border-white/[0.08] rounded-lg flex items-center justify-center transition-all duration-300 group"
              >
                <img src="/lovable-uploads/1df0ea7a-b66d-48b6-9c07-db35b36a8798.png" alt="LinkedIn" className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:brightness-0 group-hover:invert transition-all" />
              </a>
              <a 
                href="https://t.me/audienceScan" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/[0.05] hover:bg-purple-500 border border-white/[0.08] rounded-lg flex items-center justify-center transition-all duration-300 group"
              >
                <img src={telegramLogo} alt="Telegram" className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:brightness-0 group-hover:invert transition-all" />
              </a>
              <a 
                href="https://x.com/AudienceScanIO" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/[0.05] hover:bg-purple-500 border border-white/[0.08] rounded-lg flex items-center justify-center transition-all duration-300 group"
              >
                <img src={xLogo} alt="X" className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:brightness-0 group-hover:invert transition-all" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/[0.08] mt-8 pt-6 text-center">
          <p className="text-sm text-white/40">
            © 2024 AudienceScan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

const LandingPageV2 = () => {
  // Scroll-based slide animation for audience steps
  const audienceRowRef = useRef<HTMLDivElement>(null);
  const [audienceSlideProgress, setAudienceSlideProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!audienceRowRef.current) return;
      const rect = audienceRowRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Progress from 0 to 1 as element moves from bottom to top of viewport
      const progress = Math.max(0, Math.min(1, 1 - (rect.top / windowHeight)));
      setAudienceSlideProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const clientLogos = [
    { src: bitmexLogo, alt: "BitMEX" },
    { src: okxLogo, alt: "OKX" },
    { src: flareLogo, alt: "Flare" },
    { src: mantraLogo, alt: "Mantra" },
    { src: mintlayerLogo, alt: "Mintlayer" },
    { src: syscoinLogo, alt: "Syscoin" },
    { src: luxyLogo, alt: "LUXY" },
    { src: somaLogo, alt: "SOMA" },
    { src: synesisLogo, alt: "Synesis" },
    { src: ventLogo, alt: "Vent" },
  ];

  const stats = [
    { value: 342000, label: "Visitors Tracked", suffix: "" },
    { value: 12234, label: "With Wallet Extensions", suffix: "" },
    { value: 314, label: "Wallets Connected", suffix: "" },
    { value: 253340, label: "Total Balance", prefix: "$" },
    { value: 64, label: "Communities to Target", suffix: "" },
  ];

  const painPoints = [
    {
      title: "You're measuring the wrong things",
      points: [
        "GA tells you clicks and sessions",
        "But which clicks came from whales?",
        "You have no idea if your $10k campaign brought in high-value users or bots"
      ]
    },
    {
      title: "Your costs are disconnected from outcomes",
      points: [
        "You know you spent $5,000 on X ads",
        "But did you acquire users holding $500 or users holding $500,000?",
        "CPM and CPC are meaningless in Web3"
      ]
    },
    {
      title: "You can't find more of your best users",
      points: [
        "You got 50 great wallet connections",
        "But you can't scale what you can't measure",
        "No way to find lookalike audiences on-chain"
      ]
    }
  ];

  const features = [
    {
      icon: BarChart3,
      title: "Standard Analytics + Web3 Layer",
      description: "All the basics: visitors, sessions, sources, UTMs",
      extra: "Plus: wallet extension detection, connection tracking, address capture"
    },
    {
      icon: DollarSign,
      title: "Cost Attribution That Actually Matters",
      description: "Upload your ad spend by campaign",
      extra: "We match it to wallet connections automatically"
    },
    {
      icon: Sparkles,
      title: "Balance Enrichment",
      description: "We enrich every connected wallet with on-chain data",
      extra: "See total holdings across Ethereum, Base, Solana, and more"
    },
    {
      icon: Crown,
      title: "CPB - The Only Metric That Matters",
      description: "Cost Per Balance = Spend ÷ Total Wallet Value",
      extra: "The first metric that connects marketing to on-chain outcomes"
    }
  ];

  const audienceSteps = [
    { icon: Eye, title: "Track", description: "Visitors connect wallets" },
    { icon: Users, title: "Segment", description: "Group by source or campaign" },
    { icon: Sparkles, title: "Enrich", description: "See on-chain holdings" },
    { icon: Search, title: "Expand", description: "Find similar wallets" },
    { icon: Target, title: "Target", description: "Export to ad platforms" },
  ];

  const howItWorksSteps = [
    {
      icon: Zap,
      title: "Install the Tag",
      subtitle: "5 minutes",
      description: "Add one script to your site. We start tracking immediately."
    },
    {
      icon: Upload,
      title: "Connect Your Costs",
      subtitle: "Optional",
      description: "Upload a CSV of your ad spend. We match it to your traffic."
    },
    {
      icon: TrendingUp,
      title: "See The Magic",
      subtitle: "Instant",
      description: "Wallet balances, CPB, audience segments. All in one dashboard."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Ambient Background Glows - Fixed position */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[180px]" />
        <div className="absolute top-2/3 left-1/2 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[150px]" />
      </div>

      <DarkHeader />

      {/* Section 1: Hero */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/40 px-4 py-2 text-sm font-semibold tracking-wide">
              FREE ALPHA ACCESS
            </Badge>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              <span className="text-white">GA for Web3, </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">On Steroids</span>
            </h1>
            
            <p className="text-lg text-white/60 max-w-3xl mx-auto leading-relaxed">
              See exactly how much value your marketing brings in. Track wallet balances, 
              calculate Cost Per Balance, and build audiences that actually convert.
            </p>
            
            <div className="pt-2">
              <Button 
                size="lg" 
                className="text-base px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-[0_0_30px_rgba(168,85,247,0.5),0_0_60px_rgba(236,72,153,0.3)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.6),0_0_80px_rgba(236,72,153,0.4)]" 
                asChild
              >
                <Link to="/auth">
                  Get Free Alpha Access
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/50 pt-2">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-purple-400" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-purple-400" />
                5-minute setup
              </span>
            </div>
          </div>

          {/* Stats Row - Glass Cards */}
          <div className="mt-12 max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center p-3 rounded-lg bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] hover:border-purple-500/30 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    <AnimatedCounter 
                      end={stat.value} 
                      prefix={stat.prefix || ""} 
                      suffix={stat.suffix || ""} 
                    />
                  </div>
                  <div className="text-xs text-white/50 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Problem Statement */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">Web3 Marketing Is Flying Blind</h2>
              <p className="text-base text-white/60">
                While GA tells you someone visited, AudienceScan tells you that visitor holds $50,000 in their wallet.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {painPoints.map((pain, index) => (
                <div 
                  key={index} 
                  className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-lg p-5 hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 hover:scale-[1.02]"
                >
                  <h3 className="text-lg font-semibold text-white mb-3">"{pain.title}"</h3>
                  <ul className="space-y-2">
                    {pain.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-white/60">
                        <span className="text-red-400 mt-0.5">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Bot Detection */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="space-y-5">
                <Badge variant="outline" className="text-red-400 border-red-500/50 bg-red-500/10">
                  <Bot className="h-4 w-4 mr-2" />
                  Proven Savings
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Stop Burning Money on Bots</h2>
                <p className="text-base text-white/60">
                  Our data has already helped clients save thousands of dollars by identifying 
                  traffic sources sending nothing but bots.
                </p>
                <div className="bg-white/[0.02] backdrop-blur-sm border border-purple-500/30 rounded-lg p-5 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                  <p className="text-base text-white/80 italic">
                    "One client discovered 73% of their traffic from a major ad network was bots. 
                    They cut the source and reallocated budget to channels bringing real users."
                  </p>
                </div>
                <p className="text-sm text-white/50">
                  Know exactly which ad networks are sending real humans vs automated garbage. 
                  Cut the bad sources. Keep the good ones.
                </p>
              </div>
              <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-lg p-5 space-y-3">
                <h3 className="text-lg font-semibold text-white mb-3">Bot Detection Signals</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2.5 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                    <span className="text-sm text-white/70">WebDriver Detected</span>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/40 text-xs">Bot</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                    <span className="text-sm text-white/70">Headless Browser</span>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/40 text-xs">Bot</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                    <span className="text-sm text-white/70">Missing WebGL</span>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/40 text-xs">Bot</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <span className="text-sm text-white/70">All Signals Pass</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/40 animate-pulse text-xs">Human</Badge>
                  </div>
                </div>
                <div className="pt-3 border-t border-white/[0.08]">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Ad Network A</span>
                    <span className="text-red-400 font-semibold">73% bots</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-white/50">Ad Network B</span>
                    <span className="text-green-400 font-semibold">8% bots</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Features */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">Everything GA Does, Plus Everything Web3 Needs</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-lg p-5 hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 hover:scale-[1.02] group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300">
                      <feature.icon className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1.5 text-white">{feature.title}</h3>
                      <p className="text-sm text-white/60 mb-1">{feature.description}</p>
                      <p className="text-xs text-purple-400">{feature.extra}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: CPB Explained - The "Aha" Moment */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/40 px-4 py-1.5 mb-3">
                The "Aha" Moment
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Why CPB Changes Everything</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-stretch">
              {/* Without - Muted, dark styling */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-5 opacity-70 flex flex-col h-full">
                <h3 className="text-lg font-semibold text-white/50 mb-3">Without AudienceScan</h3>
                <div className="space-y-3 font-mono text-xs flex-1 flex flex-col">
                  <div className="p-2.5 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                    <div className="text-white/60">Campaign A: $1,000 spent</div>
                    <div className="text-white/40">→ 500 clicks → ??? value</div>
                    <div className="text-white/30">→ ??? outcome</div>
                  </div>
                  <div className="p-2.5 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                    <div className="text-white/60">Campaign B: $1,000 spent</div>
                    <div className="text-white/40">→ 200 clicks → ??? value</div>
                    <div className="text-white/30">→ ??? outcome</div>
                  </div>
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg mt-auto">
                    <span className="text-red-400 font-semibold">Winner: Campaign A</span>
                    <span className="text-white/40 ml-2">(more clicks!)</span>
                  </div>
                </div>
              </div>

              {/* With - Bright, glowing, spotlight effect */}
              <div className="bg-purple-500/10 border-2 border-purple-500/40 rounded-lg p-5 shadow-[0_0_40px_rgba(168,85,247,0.3)] relative overflow-hidden flex flex-col h-full">
                {/* Spotlight glow */}
                <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent pointer-events-none" />
                
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-purple-300">With AudienceScan</h3>
                  <Badge className="bg-purple-500/30 text-purple-200 border border-purple-400/50 text-xs">WINNER</Badge>
                </div>
                <div className="space-y-3 font-mono text-xs relative z-10 flex-1 flex flex-col">
                  <div className="p-2.5 bg-black/40 border border-white/[0.08] rounded-lg">
                    <div className="text-white/80">Campaign A: $1,000 → 500 clicks</div>
                    <div className="text-white/50">→ Users holding $2,000 total</div>
                    <div className="text-white/50">→ CPB: $0.50</div>
                  </div>
                  <div className="p-2.5 bg-black/40 border border-purple-500/40 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                    <div className="text-white/90">Campaign B: $1,000 → 200 clicks</div>
                    <div className="text-purple-300 font-semibold">→ Users holding $50,000 total</div>
                    <div className="text-purple-300 font-semibold">→ CPB: $0.02</div>
                  </div>
                  <div className="p-3 bg-purple-500/20 border border-purple-400/50 rounded-lg shadow-[0_0_30px_rgba(168,85,247,0.3)] mt-auto">
                    <span className="text-purple-300 font-semibold">Winner: Campaign B</span>
                    <span className="text-white ml-2">(25x better ROI!)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-base text-white/60 max-w-2xl mx-auto">
                Campaign B had fewer clicks but brought in users holding <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">25x more value</span>. 
                That's the difference between flying blind and flying smart.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Build Audiences */}
      <section className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">From First-Party Data to On-Chain Lookalikes</h2>
              <p className="text-base text-white/60 max-w-2xl mx-auto">
                We can help you find more. Your best users' wallets are the blueprint for finding thousands like them.
              </p>
            </div>

            {/* Audience Steps - Single row with scroll slide animation */}
            <div 
              ref={audienceRowRef}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4"
              style={{
                transform: `translateX(-${audienceSlideProgress * 60}px)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              {audienceSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center p-3 bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-lg hover:border-purple-500/40 transition-all duration-300">
                    <div className="p-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-2">
                      <step.icon className="h-4 w-4 text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-white text-sm">{step.title}</h3>
                    <p className="text-[11px] text-white/50 text-center mt-1 line-clamp-2">{step.description}</p>
                  </div>
                  {index < audienceSteps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-purple-500/60 absolute -right-2 top-1/2 -translate-y-1/2 hidden lg:block" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <div className="inline-block bg-purple-500/10 border border-purple-500/30 rounded-lg px-5 py-3 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                <p className="text-sm text-white/70">
                  We scan the chain to find communities they're already part of. Then help you target them on <span className="text-purple-400">X</span>, <span className="text-purple-400">Telegram</span>, and <span className="text-purple-400">Google</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Social Proof - Marquee Logos */}
      <section className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-white">Trusted by Leading Web3 Teams</h2>
            
            {/* Logo Marquee with Fade Masks */}
            <div className="relative overflow-hidden py-6">
              {/* Gradient fade masks */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
              
              <div className="flex animate-marquee">
                {/* First set of logos */}
                {clientLogos.map((logo, index) => (
                  <img 
                    key={`first-${index}`}
                    src={logo.src} 
                    alt={logo.alt}
                    className="h-6 md:h-10 object-contain mx-6 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                  />
                ))}
                {/* Duplicate for seamless loop */}
                {clientLogos.map((logo, index) => (
                  <img 
                    key={`second-${index}`}
                    src={logo.src} 
                    alt={logo.alt}
                    className="h-6 md:h-10 object-contain mx-6 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                  />
                ))}
              </div>
            </div>

            {/* Testimonial Glass Card */}
            <div className="bg-white/[0.02] backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 max-w-2xl mx-auto mt-6 shadow-[0_0_40px_rgba(168,85,247,0.15)]">
              <p className="text-base text-white/80 italic mb-4">
                "Every campaign we've run with AudienceScan data delivered 50%+ lower cost-per-engagement compared to guessing."
              </p>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                $8M+ in ad budget deployed using AudienceScan data
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Alpha CTA - The Big Push */}
      <section className="py-20 relative overflow-hidden">
        {/* Large centered glow behind */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[800px] h-[600px] bg-purple-600/30 rounded-full blur-[200px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge className="bg-purple-500/30 text-purple-200 border border-purple-400/50 px-4 py-1.5 text-sm font-semibold">
              Limited Alpha Access
            </Badge>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              <span className="text-white">We're in Alpha. </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Everything is Free.</span>
            </h2>
            
            <p className="text-base text-white/70 leading-relaxed">
              We're onboarding our first 100 projects for free alpha access. No catch. No credit card. 
              Just install our lightweight tag and start seeing your Web3 analytics in minutes.
            </p>
            
            <p className="text-sm text-white/50">
              Why free? Because we're building this with you. Your feedback shapes the product. 
              Your success stories become our case studies. Get in now before we go paid.
            </p>

            <div className="pt-2">
              <Button 
                size="lg" 
                className="text-base px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-[0_0_40px_rgba(168,85,247,0.6),0_0_80px_rgba(236,72,153,0.4)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(168,85,247,0.8),0_0_100px_rgba(236,72,153,0.5)] hover:scale-105" 
                asChild
              >
                <Link to="/auth">
                  Get Free Alpha Access Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <p className="text-sm text-white/40">
              Setup takes 5 minutes. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: How It Works */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">How It Works</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {howItWorksSteps.map((step, index) => (
                <div key={index} className="text-center group">
                  <div className="relative inline-block mb-4">
                    <div className="w-14 h-14 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300">
                      <step.icon className="h-6 w-6 text-purple-400" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center text-xs font-bold shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-1 text-white">{step.title}</h3>
                  <Badge variant="outline" className="mb-2 text-purple-300 border-purple-500/40 bg-purple-500/10 text-xs">{step.subtitle}</Badge>
                  <p className="text-sm text-white/60">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 10: Final CTA */}
      <section className="py-16 relative">
        {/* Centered gradient spotlight */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[400px] bg-purple-600/20 rounded-full blur-[150px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              <span className="text-white">Stop Guessing. </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Start Measuring What Matters.</span>
            </h2>
            
            <p className="text-base text-white/60">
              Join the Web3 projects that know exactly what their marketing delivers.
            </p>

            <Button 
              size="lg" 
              className="text-base px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-[0_0_30px_rgba(168,85,247,0.5),0_0_60px_rgba(236,72,153,0.3)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.6),0_0_80px_rgba(236,72,153,0.4)]" 
              asChild
            >
              <Link to="/auth">
                Get Free Alpha Access
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <DarkFooter />
    </div>
  );
};

export default LandingPageV2;
