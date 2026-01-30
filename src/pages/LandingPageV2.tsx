import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
    { icon: Eye, title: "Track", description: "Visitors connect wallets on your site" },
    { icon: Users, title: "Segment", description: "Group wallets by source, geo, or campaign" },
    { icon: Sparkles, title: "Enrich", description: "See their on-chain behavior and holdings" },
    { icon: Search, title: "Expand", description: "Find thousands of similar wallets" },
    { icon: Target, title: "Target", description: "Export to X Ads, Telegram Ads, Google Ads" },
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
    <div className="min-h-screen bg-background">
      <Header />

      {/* Section 1: Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm font-semibold">
              🚀 FREE ALPHA - First 100 Projects
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-foreground">GA for Web3, </span>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">On Steroids</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              See exactly how much value your marketing brings in. Track wallet balances, 
              calculate Cost Per Balance, and build audiences that actually convert.
            </p>
            
            <div className="pt-4">
              <Button size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-glow" asChild>
                <Link to="/auth">
                  Get Free Alpha Access
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground pt-2">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                5-minute setup
              </span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-16 max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 rounded-xl bg-card border border-border">
                  <div className="text-2xl md:text-3xl font-bold text-primary">
                    <AnimatedCounter 
                      end={stat.value} 
                      prefix={stat.prefix || ""} 
                      suffix={stat.suffix || ""} 
                    />
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Problem Statement */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-h2 font-bold mb-4">Web3 Marketing Is Flying Blind</h2>
              <p className="text-p1 text-muted-foreground">
                While GA tells you someone visited, AudienceScan tells you that visitor holds $50,000 in their wallet.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {painPoints.map((pain, index) => (
                <Card key={index} className="bg-card border-border hover:border-primary/50 transition-all">
                  <CardContent className="p-6">
                    <h3 className="text-h3 font-semibold text-foreground mb-4">"{pain.title}"</h3>
                    <ul className="space-y-3">
                      {pain.points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-p2 text-muted-foreground">
                          <span className="text-destructive mt-1">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Bot Detection */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="outline" className="text-destructive border-destructive/50">
                  <Bot className="h-4 w-4 mr-2" />
                  Proven Savings
                </Badge>
                <h2 className="text-h2 font-bold">Stop Burning Money on Bots</h2>
                <p className="text-p1 text-muted-foreground">
                  Our data has already helped clients save thousands of dollars by identifying 
                  traffic sources sending nothing but bots.
                </p>
                <div className="bg-muted/50 border border-border rounded-lg p-6">
                  <p className="text-p1 text-foreground italic">
                    "One client discovered 73% of their traffic from a major ad network was bots. 
                    They cut the source and reallocated budget to channels bringing real users."
                  </p>
                </div>
                <p className="text-p2 text-muted-foreground">
                  Know exactly which ad networks are sending real humans vs automated garbage. 
                  Cut the bad sources. Keep the good ones.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h3 className="text-h3 font-semibold mb-4">Bot Detection Signals</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-p2">WebDriver Detected</span>
                    <Badge variant="destructive">Bot</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-p2">Headless Browser</span>
                    <Badge variant="destructive">Bot</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-p2">Missing WebGL</span>
                    <Badge variant="destructive">Bot</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                    <span className="text-p2">All Signals Pass</span>
                    <Badge className="bg-primary/20 text-primary border-primary/30">Human</Badge>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between text-p2">
                    <span className="text-muted-foreground">Ad Network A</span>
                    <span className="text-destructive font-semibold">73% bots</span>
                  </div>
                  <div className="flex justify-between text-p2 mt-2">
                    <span className="text-muted-foreground">Ad Network B</span>
                    <span className="text-primary font-semibold">8% bots</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Features */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-h2 font-bold mb-4">Everything GA Does, Plus Everything Web3 Needs</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="bg-card border-border hover:shadow-elegant transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-h3 font-semibold mb-2">{feature.title}</h3>
                        <p className="text-p2 text-muted-foreground mb-2">{feature.description}</p>
                        <p className="text-p3 text-primary">{feature.extra}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: CPB Explained */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 mb-4">
                The "Aha" Moment
              </Badge>
              <h2 className="text-h2 font-bold">Why CPB Changes Everything</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Without */}
              <div className="bg-muted/30 border border-border rounded-xl p-6">
                <h3 className="text-h3 font-semibold text-muted-foreground mb-4">Without AudienceScan</h3>
                <div className="space-y-4 font-mono text-sm">
                  <div className="p-3 bg-background rounded-lg">
                    <div className="text-foreground">Campaign A: $1,000 spent</div>
                    <div className="text-muted-foreground">→ 500 clicks → ??? value</div>
                  </div>
                  <div className="p-3 bg-background rounded-lg">
                    <div className="text-foreground">Campaign B: $1,000 spent</div>
                    <div className="text-muted-foreground">→ 200 clicks → ??? value</div>
                  </div>
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <span className="text-destructive font-semibold">Winner: Campaign A</span>
                    <span className="text-muted-foreground ml-2">(more clicks!)</span>
                  </div>
                </div>
              </div>

              {/* With */}
              <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-6">
                <h3 className="text-h3 font-semibold text-primary mb-4">With AudienceScan</h3>
                <div className="space-y-4 font-mono text-sm">
                  <div className="p-3 bg-background rounded-lg">
                    <div className="text-foreground">Campaign A: $1,000 → 500 clicks</div>
                    <div className="text-muted-foreground">→ Users holding $2,000 total</div>
                    <div className="text-muted-foreground">→ CPB: $0.50</div>
                  </div>
                  <div className="p-3 bg-background rounded-lg">
                    <div className="text-foreground">Campaign B: $1,000 → 200 clicks</div>
                    <div className="text-primary font-semibold">→ Users holding $50,000 total</div>
                    <div className="text-primary font-semibold">→ CPB: $0.02</div>
                  </div>
                  <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                    <span className="text-primary font-semibold">Winner: Campaign B</span>
                    <span className="text-foreground ml-2">(25x better ROI!)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-p1 text-muted-foreground max-w-2xl mx-auto">
                Campaign B had fewer clicks but brought in users holding <span className="text-primary font-semibold">25x more value</span>. 
                That's the difference between flying blind and flying smart.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Build Audiences */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-h2 font-bold mb-4">From First-Party Data to On-Chain Lookalikes</h2>
              <p className="text-p1 text-muted-foreground max-w-2xl mx-auto">
                We can help you find more. Your best users' wallets are the blueprint for finding thousands like them.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {audienceSteps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex flex-col items-center p-4 bg-card border border-border rounded-xl min-w-[140px]">
                    <div className="p-3 rounded-full bg-primary/10 mb-3">
                      <step.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                    <p className="text-p4 text-muted-foreground text-center mt-1">{step.description}</p>
                  </div>
                  {index < audienceSteps.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-muted-foreground mx-2 hidden md:block" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-p1 text-muted-foreground">
                We scan the chain to find communities they're already part of. Then help you target them on X, Telegram, and Google.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Social Proof */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-h2 font-bold mb-8">Trusted by Leading Web3 Teams</h2>
            
            <div className="flex flex-wrap justify-center items-center gap-8 mb-12 opacity-70">
              {clientLogos.map((logo, index) => (
                <img 
                  key={index}
                  src={logo.src} 
                  alt={logo.alt}
                  className="h-8 md:h-10 object-contain grayscale hover:grayscale-0 transition-all"
                />
              ))}
            </div>

            <div className="bg-card border border-border rounded-xl p-8 max-w-2xl mx-auto">
              <p className="text-p1 text-foreground italic mb-4">
                "Every campaign we've run with AudienceScan data delivered 50%+ lower cost-per-engagement compared to guessing."
              </p>
              <div className="text-primary font-semibold text-h3">
                $8M+ in ad budget deployed using AudienceScan data
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Alpha CTA */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <Badge className="bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold">
              Limited Alpha Access
            </Badge>
            
            <h2 className="text-h1 font-bold">
              We're in Alpha. <span className="text-primary">Everything is Free.</span>
            </h2>
            
            <p className="text-p1 text-muted-foreground leading-relaxed">
              We're onboarding our first 100 projects for free alpha access. No catch. No credit card. 
              Just install our lightweight tag and start seeing your Web3 analytics in minutes.
            </p>
            
            <p className="text-p2 text-muted-foreground">
              Why free? Because we're building this with you. Your feedback shapes the product. 
              Your success stories become our case studies. Get in now before we go paid.
            </p>

            <div className="pt-4">
              <Button size="lg" className="text-lg px-12 py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-glow" asChild>
                <Link to="/auth">
                  Get Free Alpha Access Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Setup takes 5 minutes. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-h2 font-bold mb-4">How It Works</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {howItWorksSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-h3 font-semibold mb-1">{step.title}</h3>
                  <Badge variant="outline" className="mb-3">{step.subtitle}</Badge>
                  <p className="text-p2 text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 10: Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="text-h2 font-bold">Stop Guessing. Start Measuring What Matters.</h2>
            
            <p className="text-p1 text-muted-foreground">
              Join the Web3 projects that know exactly what their marketing delivers.
            </p>

            <Button size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-glow" asChild>
              <Link to="/auth">
                Get Free Alpha Access
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPageV2;
