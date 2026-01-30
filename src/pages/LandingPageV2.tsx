import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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

// Minimal Dark Header
const MinimalHeader = () => {
  return (
    <header className="w-full bg-black/60 backdrop-blur-md fixed top-0 z-50 border-b border-white/[0.05]">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <Link to="/">
          <img src={logoWhite} alt="AudienceScan" className="h-5 hover:opacity-80 transition-opacity" />
        </Link>
        
        <Button 
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-[0_0_20px_rgba(168,85,247,0.4)] text-sm px-6"
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

// Minimal Dark Footer
const MinimalFooter = () => {
  return (
    <footer className="bg-black border-t border-white/[0.05] py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/7badbb3e-0d49-4228-97e2-42ebc92a02e0.png" 
              alt="AudienceScan" 
              className="h-6 w-6"
            />
            <span className="text-white/40 text-sm">Turn wallet data into marketing signal.</span>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://www.linkedin.com/company/audiencescanio/" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-white/[0.03] hover:bg-purple-500/20 border border-white/[0.06] rounded-lg flex items-center justify-center transition-all duration-300"
            >
              <img src="/lovable-uploads/1df0ea7a-b66d-48b6-9c07-db35b36a8798.png" alt="LinkedIn" className="w-4 h-4 opacity-50 hover:opacity-100 transition-opacity" />
            </a>
            <a 
              href="https://t.me/audienceScan" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-white/[0.03] hover:bg-purple-500/20 border border-white/[0.06] rounded-lg flex items-center justify-center transition-all duration-300"
            >
              <img src={telegramLogo} alt="Telegram" className="w-4 h-4 opacity-50 hover:opacity-100 transition-opacity" />
            </a>
            <a 
              href="https://x.com/AudienceScanIO" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-white/[0.03] hover:bg-purple-500/20 border border-white/[0.06] rounded-lg flex items-center justify-center transition-all duration-300"
            >
              <img src={xLogo} alt="X" className="w-4 h-4 opacity-50 hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-white/30">© 2024 AudienceScan</p>
        </div>
      </div>
    </footer>
  );
};

const LandingPageV2 = () => {
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[180px]" />
      </div>

      <MinimalHeader />

      {/* Section 1: Hero - Clean, Confident, Minimal */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <p className="text-violet-400 text-sm tracking-widest uppercase">
              Web3 Analytics
            </p>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Know What's Actually Working.
            </h1>
            
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Connect your marketing spend to real wallet value.
            </p>

            {/* 3 Large Stats - Floating Numbers */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-20 pt-12">
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  <AnimatedCounter end={342} suffix="K" />
                </div>
                <div className="text-sm text-white/40 mt-2">visitors tracked</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  <AnimatedCounter end={253} prefix="$" suffix="K" />
                </div>
                <div className="text-sm text-white/40 mt-2">balance tracked</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  <AnimatedCounter end={64} />
                </div>
                <div className="text-sm text-white/40 mt-2">communities to target</div>
              </div>
            </div>

            {/* Single CTA */}
            <div className="pt-8">
              <Button 
                size="lg" 
                className="text-lg px-10 py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(168,85,247,0.6)]" 
                asChild
              >
                <Link to="/auth">
                  Place Your Tag
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: The Proof (CPB Comparison) - Visual, Not Verbal */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 items-stretch">
              {/* Left Panel - Muted/Dim (The Old Way) */}
              <div className="opacity-50 grayscale bg-white/[0.01] border border-white/[0.05] rounded-2xl p-8 flex flex-col justify-between min-h-[280px]">
                <div className="space-y-4">
                  <div className="text-white/40 text-sm">500 clicks</div>
                  <div className="text-white/40 text-sm">$1,000 spent</div>
                  <div className="h-px bg-white/10 my-4" />
                  <div className="text-2xl text-white/30">??? outcome</div>
                </div>
                <div className="text-white/20 text-xs mt-auto pt-4">blind spend</div>
              </div>

              {/* Right Panel - Bright/Glowing (The Answer) */}
              <div className="bg-white/[0.02] border border-purple-500/50 rounded-2xl p-8 shadow-[0_0_60px_rgba(168,85,247,0.3)] flex flex-col justify-between min-h-[280px] relative overflow-hidden">
                {/* Spotlight effect */}
                <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent" />
                
                <div className="space-y-4 relative z-10">
                  <div className="text-white/70 text-sm">200 clicks</div>
                  <div className="text-white/70 text-sm">$1,000 spent</div>
                  <div className="h-px bg-purple-500/30 my-4" />
                  <div className="text-2xl text-white font-semibold">$50K wallet value acquired</div>
                  <div className="font-mono text-purple-400 text-lg">CPB: $0.02</div>
                </div>
                <div className="text-purple-400/60 text-xs mt-auto pt-4 relative z-10">precision targeting</div>
              </div>
            </div>

            {/* One Line Summary */}
            <div className="text-center mt-12">
              <p className="text-xl text-white/60">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">25x better ROI.</span>
                {" "}Same spend.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Bot Detection - Visual Proof */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left - Bad Source */}
              <div className="text-center p-10 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-6xl md:text-7xl font-bold text-red-400 mb-2">73%</div>
                <div className="text-white/40 text-sm uppercase tracking-wide">bots</div>
                <div className="text-white/20 text-xs mt-4">Source: Ad Network A</div>
              </div>

              {/* Right - Good Source */}
              <div className="text-center p-10 rounded-2xl bg-white/[0.02] border border-green-500/30">
                <div className="text-6xl md:text-7xl font-bold text-green-400 mb-2">8%</div>
                <div className="text-white/40 text-sm uppercase tracking-wide">bots</div>
                <div className="text-white/20 text-xs mt-4">Source: Ad Network B</div>
              </div>
            </div>

            {/* One Line */}
            <div className="text-center mt-10">
              <p className="text-lg text-white/50">Know which sources to cut.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Social Proof - Logos + One Bold Stat */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          {/* Logo Marquee */}
          <div className="relative mb-16">
            {/* Gradient fade masks */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />
            
            <div className="flex overflow-hidden">
              <div className="flex animate-[marquee_30s_linear_infinite] gap-16 items-center">
                {[...clientLogos, ...clientLogos].map((logo, index) => (
                  <img 
                    key={index} 
                    src={logo.src} 
                    alt={logo.alt} 
                    className="h-8 md:h-10 opacity-40 hover:opacity-70 transition-opacity grayscale hover:grayscale-0"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* One Massive Stat */}
          <div className="text-center">
            <div className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
              $8M+
            </div>
            <p className="text-white/40 text-lg">deployed on campaigns using AudienceScan data</p>
          </div>
        </div>
      </section>

      {/* Section 5: Final CTA - Minimal, Powerful */}
      <section className="py-32 relative">
        {/* Centered glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[400px] bg-purple-600/20 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white">
              Stop guessing.
            </h2>
            
            <Button 
              size="lg" 
              className="text-lg px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all duration-300 hover:shadow-[0_0_60px_rgba(168,85,247,0.6)]" 
              asChild
            >
              <Link to="/auth">
                Place Your Tag
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <MinimalFooter />

      {/* Marquee animation keyframes */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default LandingPageV2;
