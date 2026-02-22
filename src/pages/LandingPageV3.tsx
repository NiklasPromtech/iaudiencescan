import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp as TrendUp, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Eye, Wallet, BarChart3, Shield, Bot, TrendingUp, DollarSign, Activity,
  Layers, Search, Megaphone, Check, X as XIcon,
  ArrowRight, Zap, Clock, CreditCard, Users, Target, Database, Code2
} from "lucide-react";
import { InvestmentGradeBadge } from "@/components/overview/InvestmentGrade";
import { MockDailyChart } from "@/components/landing/MockDailyChart";
import { MockHolderTrend } from "@/components/landing/MockHolderTrend";
import { MockBotSummary } from "@/components/landing/MockBotSummary";
import { MockPlatformCards } from "@/components/landing/MockPlatformCards";

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

const outcomeCards = [
  {
    icon: Shield,
    title: "Stop paying for bots",
    desc: "See exactly which campaigns brought bots. Block them. Claim back your budget — or take it to your supplier.",
    stat: "Avg 23% bot rate detected",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  {
    icon: Target,
    title: "Know your real CPA",
    desc: "Attach spend to UTMs. Know the cost per real wallet connected — not just the cost per click.",
    stat: "CPA visible within 48h of install",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Search,
    title: "Find your next buyers",
    desc: "Run a scan. Get X accounts, Telegram groups, and subreddits your holders already follow — ready to target.",
    stat: "Avg 12 communities found per scan",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

const LandingPageV3 = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl pt-24 pb-8">
          <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl tracking-tight mb-5 text-foreground leading-[1.1]">
            Stop paying for bot traffic.<br />
            <span className="text-primary">Start reaching real buyers.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            The only analytics tool built for Web3 teams — free to start, with bot detection, wallet attribution, and ready-to-use audience targeting lists.
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

      {/* ── BOT MONEY SECTION ── */}
      <section className="relative z-10 pt-12 pb-0">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-destructive mb-3">The problem</p>
              <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4 leading-snug">
                If 20–40% of your traffic is bots, you're overpaying by thousands every month.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The average Web3 campaign has <span className="text-foreground font-medium">23% bot traffic</span>. At $2,000/mo in ad spend, that's <span className="text-destructive font-semibold">$460/mo wasted</span> — paid to suppliers who sent you fake clicks. Most teams never know.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                AudienceScan detects bots across 12+ signals and surfaces exactly which campaigns, sources, and suppliers are responsible — so you can stop paying for traffic that will never convert.
              </p>
            </div>
            <div>
              <MockBotSummary />
            </div>
          </div>
        </div>
      </section>

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

      {/* ── WHAT YOU GET (FREE) — 3-column outcome grid ── */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-center mb-3">What you get for free</p>
          <h2 className="font-bold text-3xl md:text-4xl text-center mb-3 text-foreground">
            Three problems. One install. Free.
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Place a tag. We handle the rest. Most teams see their first wallet data within an hour.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {outcomeCards.map((card) => (
              <div key={card.title} className="rounded-lg border border-border bg-card p-6 flex flex-col">
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-4`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{card.desc}</p>
                <div className={`mt-4 pt-4 border-t border-border font-mono text-xs ${card.color} font-medium`}>
                  {card.stat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section className="pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-center mb-4">The dashboard</p>
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

      {/* ── WALLET VALUE ── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-bold text-3xl md:text-4xl text-center mb-4 text-foreground">
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

      {/* ── AUDIENCE INTELLIGENCE / FIND MORE BUYERS ── */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Audience scanning</p>
          <h2 className="font-bold text-3xl md:text-4xl mb-4 text-foreground">
            Then find more of your best users
          </h2>
          <p className="text-muted-foreground mb-3 max-w-2xl mx-auto">
            Your connected wallets are the blueprint. Run a scan and we find the X accounts, Telegram groups, and subreddits they follow — then hand you the list.
          </p>
          <p className="font-mono text-sm text-foreground font-medium mb-10">
            847 wallets → 18 X accounts · 6 Telegram groups · 4 subreddits · ready to target
          </p>

          <MockPlatformCards limit={3} platforms={["twitter", "telegram", "reddit"]} />

          <p className="mt-8 text-sm text-muted-foreground max-w-lg mx-auto">
            Just place your tag — we'll find these communities based on <span className="text-foreground font-medium">your</span> users.
          </p>
        </div>
      </section>

      {/* ── SQL / QUERIES SECTION ── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Query workspace</p>
              <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4 leading-snug">
                Query your data like a data analyst — not a marketer
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A built-in SQL workspace with schema explorer, autocomplete, and one-click CSV export. Ask your own questions. Get your own answers.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The only Web3 analytics platform that gives you the raw power of a data warehouse — without needing a data team.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card overflow-hidden shadow-elegant">
              <div className="px-4 py-2.5 bg-foreground/[0.03] border-b border-border flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-mono text-xs text-muted-foreground">query.sql</span>
              </div>
              <pre className="p-5 text-xs font-mono leading-relaxed overflow-x-auto text-foreground">
                <span className="text-primary">SELECT</span>{"\n"}
                {"  "}utm_source,{"\n"}
                {"  "}COUNT(*) <span className="text-primary">AS</span> visitors,{"\n"}
                {"  "}COUNT(<span className="text-primary">DISTINCT</span> wallet_address){"\n"}
                {"    "}<span className="text-primary">AS</span> wallets,{"\n"}
                {"  "}ROUND(AVG(bot_score), 2){"\n"}
                {"    "}<span className="text-primary">AS</span> avg_bot_score{"\n"}
                <span className="text-primary">FROM</span> pageviews{"\n"}
                <span className="text-primary">WHERE</span> created_at {">"} NOW(){"\n"}
                {"  "}- INTERVAL <span className="text-amber-500">'30 days'</span>{"\n"}
                <span className="text-primary">GROUP BY</span> utm_source{"\n"}
                <span className="text-primary">ORDER BY</span> wallets <span className="text-primary">DESC</span>
              </pre>
              <div className="px-5 py-3 border-t border-border bg-muted/30 flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">5 rows · 0.3s</span>
                <span className="font-mono text-[10px] text-primary uppercase tracking-widest">↓ Export CSV</span>
              </div>
            </div>
          </div>
        </div>
      </section>

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
      <section id="how-it-works" className="py-24 bg-muted/30">
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
