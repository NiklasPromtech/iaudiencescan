import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, ArrowRight, Clock, CreditCard } from "lucide-react";
import { MockBotSummary } from "@/components/landing/MockBotSummary";
import { PillarsRow } from "@/components/landing/PillarsRow";
import { GAComparison } from "@/components/landing/GAComparison";

import bitmex from "@/assets/client-logos/bitmex.png";
import flare from "@/assets/client-logos/flare.png";
import luxy from "@/assets/client-logos/luxy.png";
import axion from "@/assets/client-logos/axion.png";
import mintlayer from "@/assets/client-logos/mintlayer.png";
import okx from "@/assets/client-logos/okx.png";
import soma from "@/assets/client-logos/soma.png";
import synesis from "@/assets/client-logos/synesis.png";
import syscoin from "@/assets/client-logos/syscoin.png";
import nftrade from "@/assets/client-logos/nftrade.png";

const clientLogos = [
  { src: bitmex, alt: "BitMEX" },
  { src: okx, alt: "OKX" },
  { src: flare, alt: "Flare" },
  { src: axion, alt: "Axion" },
  { src: mintlayer, alt: "Mintlayer" },
  { src: luxy, alt: "Luxy" },
  { src: soma, alt: "Soma" },
  { src: synesis, alt: "Synesis" },
  { src: syscoin, alt: "Syscoin" },
  { src: nftrade, alt: "NFTrade" },
];

const botSignals = [
  { label: "Headless browser", value: "Yes", bad: true },
  { label: "WebDriver detected", value: "Yes", bad: true },
  { label: "Screen dimensions", value: "0 × 0", bad: true },
  { label: "Languages", value: "Empty", bad: true },
  { label: "Plugins", value: "0", bad: true },
  { label: "Touch support", value: "None", bad: true },
  { label: "Session duration", value: "0.3s", bad: true },
  { label: "Render engine", value: "Unknown", bad: true },
];

const LandingPageV3 = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl pt-24 pb-16">
          <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight mb-5 text-foreground leading-[1.15]">
            Web3 analytics that respects your time.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Build your view once. Reuse it forever. We cut the number of times you have to dig for the same numbers.
          </p>
          <Button asChild size="lg" className="rounded-full font-mono text-sm uppercase tracking-wider px-8 py-6 shadow-elegant">
            <Link to="/auth">
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <div className="flex items-center justify-center flex-wrap gap-4 md:gap-6 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4" /> No credit card</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 5-minute setup</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> Free forever on core features</span>
          </div>
        </div>
      </section>

      {/* ── THREE PILLARS ── */}
      <PillarsRow />

      {/* ── BEYOND GA ── */}
      <GAComparison />

      {/* ── $25K TESTIMONIAL ── */}
      <section className="pt-10 pb-6">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="rounded-lg border-2 border-primary/20 bg-primary/[0.03] p-8">
            <blockquote className="text-foreground font-medium leading-relaxed mb-4">
              "Our bot detection data is currently the foundation of a{" "}
              <span className="text-primary font-bold">$25K+ legal claim</span>{" "}
              against a fraudulent marketing provider. Analytics you can defend in court."
            </blockquote>
            <p className="text-sm text-muted-foreground">— AudienceScan client, token project</p>
          </div>
        </div>
      </section>

      {/* ── LOGO MARQUEE ── */}
      <section className="py-10 overflow-hidden">
        <div className="container mx-auto px-4 text-center mb-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Trusted by 50+ token teams, exchanges, and Web3 agencies</p>
        </div>
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
          <div className="flex gap-16 items-center w-max animate-marquee">
            {[...clientLogos, ...clientLogos, ...clientLogos].map((logo, i) => (
              <img key={i} src={logo.src} alt={logo.alt} className="h-8 shrink-0 opacity-50 hover:opacity-80 transition-opacity grayscale brightness-0" />
            ))}
          </div>
        </div>
      </section>

      {/* Removed: What you get free, Dashboard preview, Period comparison, Wallet value, Find more buyers — keeping landing page SIMPLE */}

      {/* ── "Like GA wrapped in Dune" testimonial ── */}
      <section className="py-6">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="rounded-lg border border-border bg-card p-8">
            <blockquote className="text-foreground font-medium leading-relaxed mb-4">
              "It's like Google Analytics wrapped in Dune. Genuinely the first dashboard I actually <span className="text-primary font-bold">want</span> to open every morning."
            </blockquote>
            <p className="text-sm text-muted-foreground">— Head of Growth, DeFi protocol</p>
          </div>
        </div>
      </section>

      {/* ── Ned testimonial + book demo ── */}
      <section className="pb-16 pt-4">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="rounded-lg border border-border bg-card p-8">
            <blockquote className="text-foreground font-medium leading-relaxed mb-4">
              "He got some really good ideas on how to maximize value from your visitor data — it's worth grabbing 30 minutes with him."
            </blockquote>
            <p className="text-sm text-muted-foreground mb-3">— Ned, Token Project</p>
            <Link to="/auth" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-mono">
              Book a Demo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="font-bold text-3xl md:text-4xl mb-4 text-foreground">
            Free to start.{" "}
            <span className="text-primary">No credit card. Takes 5 minutes.</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Most teams see their first wallet data within an hour of installing the tag.
          </p>
          <Button asChild size="lg" className="rounded-full font-mono text-sm uppercase tracking-wider px-8 py-6 shadow-elegant">
            <Link to="/auth">
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <div className="flex items-center justify-center flex-wrap gap-4 md:gap-6 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4" /> No credit card</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 5-minute setup</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> Free forever on core features</span>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPageV3;
