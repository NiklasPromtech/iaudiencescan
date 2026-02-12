import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp as TrendUp, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Eye, Wallet, BarChart3, Shield, Bot, TrendingUp, DollarSign, Activity,
  Layers, Search, Megaphone, Check, X as XIcon,
  ArrowRight, Zap, Clock, CreditCard, Users, Target
} from "lucide-react";
import { InvestmentGradeBadge } from "@/components/overview/InvestmentGrade";
import { MockDailyChart } from "@/components/landing/MockDailyChart";
import { MockHolderTrend } from "@/components/landing/MockHolderTrend";
import { MockBotSummary } from "@/components/landing/MockBotSummary";
import { MockPlatformCards } from "@/components/landing/MockPlatformCards";
import { MockNewsFeed } from "@/components/landing/MockNewsFeed";
import { DashboardFrame } from "@/components/landing/DashboardFrame";
import {
  mockScorecard, mockDimensionRows, mockCostRows,
} from "@/components/landing/mock-data";

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

const gaComparison = [
  { ga: "Tracks pageviews", as: "Tracks wallets" },
  { ga: "Sees sessions", as: "Sees token holders" },
  { ga: "Cookie-based", as: "Wallet-based" },
  { ga: "Blind to balance", as: "Knows wallet value" },
  { ga: "No bot clarity", as: "Explicit bot detection" },
  { ga: "Guesses attribution", as: "Measures incrementality" },
  { ga: "No outreach data", as: "PR, X, Telegram, Reddit lists" },
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

const audienceIntelSteps = [
  { icon: Layers, step: "1", title: "Group", desc: "Segment your best wallets by source, balance, or behavior." },
  { icon: Search, step: "2", title: "Scan", desc: "We analyze on-chain activity to find the communities they belong to." },
  { icon: Megaphone, step: "3", title: "Act", desc: "Get targeting lists for X, Telegram, Reddit, and PR outlets." },
];

const LandingPageV3 = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* ── HERO: Product-Led ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl pt-24 pb-8">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl tracking-tight mb-5 text-foreground leading-[1.1]">
            Web3 Analytics That Actually Understand Wallets
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Track visitors. Detect wallets. Enrich balances. Remove bots. Attribute real revenue.
          </p>
          <Button asChild size="lg" className="rounded-full font-mono text-sm uppercase tracking-wider px-8 py-6 shadow-elegant">
            <Link to="/auth">
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4" /> No credit card</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 5-minute setup</span>
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW — THE HERO ── */}
      <section className="relative z-10 -mt-4 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <DashboardFrame>
            {/* Big stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-border">
              {[
                { label: "Visitors", value: "12,847", trend: "+12%", up: true },
                { label: "With Extension", value: "4,231", trend: "+8%", up: true },
                { label: "Wallets Connected", value: "892", trend: "+23%", up: true },
                { label: "Median Balance", value: "$2,400", trend: "-3%", up: false },
                { label: "Bot Rate", value: "23%", trend: "+5%", up: true, bad: true },
              ].map((s) => (
                <div key={s.label} className="px-5 py-5 border-r border-border last:border-r-0">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{s.label}</p>
                  <p className={`text-2xl md:text-3xl font-bold tabular-nums font-mono ${s.bad ? "text-destructive" : "text-foreground"}`}>{s.value}</p>
                  <p className={`text-xs font-mono mt-1 flex items-center gap-1 ${s.bad ? (s.up ? "text-destructive" : "text-emerald-500") : (s.up ? "text-emerald-500" : "text-destructive")}`}>
                    {s.up ? <TrendUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {s.trend} 7d
                  </p>
                </div>
              ))}
            </div>
            {/* Dimension table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Source</th>
                    <th className="text-center px-3 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Grade</th>
                    <th className="text-right px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Visitors</th>
                    <th className="text-right px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Extensions</th>
                    <th className="text-right px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Wallets</th>
                    <th className="text-right px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Avg Balance</th>
                    <th className="text-right px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Bot %</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDimensionRows.map((r) => {
                    const tags: Record<string, string> = {
                      twitter_ads: "#X",
                      telegram_promo: "#Telegram",
                      kol_campaign: "#KOL",
                      organic: "#Organic",
                      coindesk_banner: "#Display",
                    };
                    return (
                      <tr key={r.source} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="px-5 py-3 font-medium text-foreground flex items-center gap-2">
                          <span className="text-primary hover:underline cursor-pointer">{r.source}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{tags[r.source]}</span>
                        </td>
                        <td className="text-center px-3 py-3"><InvestmentGradeBadge grade={r.grade} /></td>
                        <td className="text-right px-4 py-3 tabular-nums font-mono text-foreground">{r.visitors}</td>
                        <td className="text-right px-4 py-3 tabular-nums font-mono text-muted-foreground">{r.extensions}</td>
                        <td className="text-right px-4 py-3 tabular-nums font-mono text-foreground">{r.wallets}</td>
                        <td className="text-right px-4 py-3 tabular-nums font-mono text-foreground">{r.avgBalance}</td>
                        <td className={`text-right px-5 py-3 tabular-nums font-mono font-medium ${parseInt(r.botRate) > 30 ? "text-destructive" : parseInt(r.botRate) > 10 ? "text-amber-500" : "text-emerald-500"}`}>{r.botRate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Chart integrated inside the frame */}
            <div className="border-t border-border">
              <MockDailyChart />
            </div>
          </DashboardFrame>
          <p className="text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-3">Live dashboard preview — sample data</p>
        </div>
      </section>

      {/* ── SOCIAL PROOF — Right under hero ── */}
      <section className="py-10 overflow-hidden">
        <div className="container mx-auto px-4 text-center mb-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Trusted by 50+ token teams, exchanges, and Web3 agencies</p>
        </div>
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
          <div className="flex gap-16 items-center animate-marquee w-max">
            {[...clientLogos, ...clientLogos].map((logo, i) => (
              <img key={i} src={logo.src} alt={logo.alt} className="h-8 shrink-0 opacity-50 hover:opacity-80 transition-opacity grayscale brightness-0" />
            ))}
          </div>
        </div>
      </section>

      {/* ── BENTO GRID: Core Features ── */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-4 text-foreground">
            Everything GA Can't Do
          </h2>
          <p className="text-center text-muted-foreground mb-14 max-w-xl mx-auto">
            Standard analytics were built for Web2. Your users have wallets.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Large card: GA Comparison */}
            <div className="rounded-lg border border-border bg-card overflow-hidden h-full flex flex-col">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" /> Google Analytics vs AudienceScan
                </h3>
              </div>
              <div className="flex-1 flex flex-col">
                {gaComparison.map((row, i) => (
                  <div key={i} className="grid grid-cols-2 border-b border-border last:border-0 flex-1">
                    <div className="px-5 py-3 flex items-center gap-2 bg-muted/30">
                      <XIcon className="w-3.5 h-3.5 text-destructive shrink-0" />
                      <span className="text-xs text-muted-foreground">{row.ga}</span>
                    </div>
                    <div className="px-5 py-3 flex items-center gap-2 border-l border-border">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="text-xs font-medium text-foreground">{row.as}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Large card: Bot Detection */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" /> Bot Detection — 12+ Signals
                </h3>
              </div>
              <div className="p-6">
                <MockBotSummary />
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {botSignals.map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5">
                      <span className="text-xs text-muted-foreground">{s.label}</span>
                      <span className={`text-xs font-mono font-medium ${s.bad ? "text-destructive" : "text-foreground"}`}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Smaller bento cards */}
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-primary" />
                </span>
              </div>
              <h3 className="font-semibold text-foreground mb-1.5">Wallet Enrichment</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Detect extensions, capture addresses, enrich balances. Know if a campaign brought whales or dust.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-primary" />
                </span>
              </div>
              <h3 className="font-semibold text-foreground mb-1.5">Cost Attribution</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Attach spend to UTMs. See real CPA per supplier. Know cost per $1K in wallet balance.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-primary" />
                </span>
              </div>
              <h3 className="font-semibold text-foreground mb-1.5">Incrementality</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Did that $1K sponsorship actually work? Real impact measurement, not guesses.
              </p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-10 rounded-lg border-2 border-primary/20 bg-primary/[0.03] p-8 max-w-3xl mx-auto">
            <blockquote className="text-foreground font-medium leading-relaxed mb-4">
              "Our bot detection data is currently the foundation of a{" "}
              <span className="text-primary font-bold">$25K+ legal claim</span>{" "}
              against a fraudulent marketing provider. Analytics you can defend in court."
            </blockquote>
            <p className="text-sm text-muted-foreground">— AudienceScan client, token project</p>
          </div>
        </div>
      </section>

      {/* ── WALLET VALUE ── */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-4 text-foreground">
            See Wallet Value — Not Just Wallet Count
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
            Did your last campaign bring whales or dust wallets? Know instantly.
          </p>

          <MockHolderTrend />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-lg border border-border bg-card p-8">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Without AudienceScan</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><XIcon className="w-4 h-4 text-destructive mt-0.5 shrink-0" /> "We got 5,000 visits from that campaign"</li>
                <li className="flex items-start gap-2"><XIcon className="w-4 h-4 text-destructive mt-0.5 shrink-0" /> "Bounce rate was 40%, so… decent?"</li>
                <li className="flex items-start gap-2"><XIcon className="w-4 h-4 text-destructive mt-0.5 shrink-0" /> "We think some connected their wallet"</li>
                <li className="flex items-start gap-2"><XIcon className="w-4 h-4 text-destructive mt-0.5 shrink-0" /> "No idea about bot traffic"</li>
              </ul>
            </div>
            <div className="rounded-lg border-2 border-primary/30 bg-background p-8 shadow-elegant">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4">With AudienceScan</h3>
              <ul className="space-y-3 text-sm text-foreground">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> "412 wallet extensions detected out of 5,000 visits"</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> "68 wallets connected — median balance $2,400"</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> "34% of traffic was bots — from supplier X"</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> "CPA per real wallet: $14.70. Per bot: $0"</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── AUDIENCE INTELLIGENCE ── */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-4 text-foreground">
            Find More of Your Best Users
          </h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Your connected wallets are the blueprint. Group them, scan them, and we find the communities they belong to — then hand you the outreach list.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {audienceIntelSteps.map((s) => (
              <div key={s.step} className="rounded-lg border border-border bg-card p-6 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-mono font-bold">{s.step}</span>
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <MockPlatformCards />

          <p className="mt-8 text-sm text-muted-foreground italic max-w-lg mx-auto">
            From analytics to action. We don't just show you data — we give you the outreach lists to act on it.
          </p>

          <div className="mt-12 text-left">
            <MockNewsFeed />
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section id="how-it-works" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 font-mono text-[10px] uppercase tracking-widest">
            Early Access
          </Badge>
          <h2 className="font-serif text-3xl md:text-4xl mb-4 text-foreground">
            Stop Optimizing for Clicks.{" "}
            <span className="text-primary">Start Optimizing for Wallets.</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Full access to every feature while we're in alpha. No credit card. No commitment.
          </p>
          <Button asChild size="lg" className="rounded-full font-mono text-sm uppercase tracking-wider px-8 py-6 shadow-elegant">
            <Link to="/auth">
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          width: max-content;
        }
      `}</style>
    </div>
  );
};

export default LandingPageV3;
