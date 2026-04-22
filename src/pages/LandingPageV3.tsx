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

      {/* ── THREE PILLARS ── */}
      <PillarsRow />

      {/* ── BEYOND GA ── */}
      <GAComparison />

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
