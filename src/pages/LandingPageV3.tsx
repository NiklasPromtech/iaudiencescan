import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Eye, Wallet, BarChart3, Shield, Bot, TrendingUp, DollarSign, Activity,
  Mail, Layers, Search, Megaphone, Check, X as XIcon, Newspaper,
  ArrowRight, Zap, Clock, CreditCard, Users, Target, Globe, Hash
} from "lucide-react";
import { InvestmentGradeBadge } from "@/components/overview/InvestmentGrade";
import { MockDailyChart } from "@/components/landing/MockDailyChart";
import { MockHolderTrend } from "@/components/landing/MockHolderTrend";
import { MockBotSummary } from "@/components/landing/MockBotSummary";
import { MockPlatformCards } from "@/components/landing/MockPlatformCards";
import { MockNewsFeed } from "@/components/landing/MockNewsFeed";
import {
  mockScorecard, mockDimensionRows, mockCostRows,
} from "@/components/landing/mock-data";

import bitmex from "@/assets/client-logos/bitmex.png";
import flare from "@/assets/client-logos/flare.png";
import luxy from "@/assets/client-logos/luxy.png";
import mantra from "@/assets/client-logos/mantra.png";
import mintlayer from "@/assets/client-logos/mintlayer.png";
import okx from "@/assets/client-logos/okx.png";
import soma from "@/assets/client-logos/soma.png";
import synesis from "@/assets/client-logos/synesis.png";
import syscoin from "@/assets/client-logos/syscoin.png";
import vent from "@/assets/client-logos/vent.png";

const clientLogos = [
  { src: bitmex, alt: "BitMEX" },
  { src: okx, alt: "OKX" },
  { src: flare, alt: "Flare" },
  { src: mantra, alt: "Mantra" },
  { src: mintlayer, alt: "Mintlayer" },
  { src: luxy, alt: "Luxy" },
  { src: soma, alt: "Soma" },
  { src: synesis, alt: "Synesis" },
  { src: syscoin, alt: "Syscoin" },
  { src: vent, alt: "Vent" },
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

const capabilities = [
  { icon: Eye, title: "Track Every Visit", desc: "Page views, sessions, sources, UTMs. The basics, done right." },
  { icon: Wallet, title: "Detect Wallet Extensions", desc: "See which sources bring users who can actually connect." },
  { icon: Users, title: "Capture Wallet IDs", desc: "Automatically collect addresses when visitors connect to your dApp." },
  { icon: BarChart3, title: "Enrich Wallet Balances", desc: "See total holdings. Know if a campaign brought whales or dust." },
  { icon: Shield, title: "Filter Out Bots", desc: "12+ signals. Know which ad networks send real humans." },
  { icon: Mail, title: "Get Daily Change Reports", desc: "Automatic alerts when new sources or uplifts appear." },
  { icon: DollarSign, title: "Attribute Costs to Campaigns", desc: "Attach spend to UTMs. See real CPA per supplier." },
  { icon: Activity, title: "Measure Touchpoint Impact", desc: "Did that $1K sponsorship work? Incrementality, not guesses." },
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

const howItWorksSteps = [
  { num: "01", title: "Install the Tag", desc: "Add one script. Start tracking in 5 minutes." },
  { num: "02", title: "See Everything", desc: "Visitors, wallets, balances, bots, costs. One dashboard." },
  { num: "03", title: "Group Your Best Users", desc: "Segment high-value wallets. Filter out the noise." },
  { num: "04", title: "Find More Like Them", desc: "Scan the chain. Get X handles, Telegram groups, PR outlets." },
];

const stats = [
  { value: "10+", label: "Chains" },
  { value: "50+", label: "Clients" },
  { value: "1M+", label: "Wallets Scanned" },
];

const LandingPageV3 = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl pt-28 pb-20">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl tracking-tight mb-6 text-foreground">
            Web3 Analytics That Actually Understand Wallets
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Track visitors. Detect wallets. Enrich balances. Remove bots. Attribute real revenue.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="rounded-full font-mono text-sm uppercase tracking-wider px-8 py-6 shadow-elegant">
              <Link to="/auth">
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full font-mono text-sm uppercase tracking-wider px-8 py-6 border-foreground/20">
              <a href="https://calendly.com/niklas-audiencescan/audiencescan-demo" target="_blank" rel="nofollow noopener noreferrer">
                Book a Demo
              </a>
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 mt-5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4" /> No credit card</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 5-minute setup</span>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 border-t border-foreground/10">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="grid grid-cols-3 divide-x divide-foreground/10 py-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-mono text-2xl md:text-3xl font-bold text-foreground">{s.value}</p>
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MOCK DASHBOARD PREVIEW ── */}
      <section className="py-10 relative z-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
            {/* Scorecard row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-border [&>*:not(:last-child)]:border-r [&>*:not(:last-child)]:border-border max-sm:[&>*:nth-child(2)]:border-r-0 max-sm:[&>*:nth-child(4)]:border-r-0">
              {mockScorecard.map((s) => (
                <div key={s.label} className="px-5 py-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{s.label}</p>
                  <p className={`text-lg font-bold tabular-nums font-mono ${s.highlight ? "text-destructive" : "text-foreground"}`}>{s.value}</p>
                </div>
              ))}
            </div>
            {/* Mini dimension table */}
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
                  {mockDimensionRows.map((r) => (
                    <tr key={r.source} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-3 font-medium text-foreground">{r.source}</td>
                      <td className="text-center px-3 py-3"><InvestmentGradeBadge grade={r.grade} /></td>
                      <td className="text-right px-4 py-3 tabular-nums font-mono text-foreground">{r.visitors}</td>
                      <td className="text-right px-4 py-3 tabular-nums font-mono text-muted-foreground">{r.extensions}</td>
                      <td className="text-right px-4 py-3 tabular-nums font-mono text-foreground">{r.wallets}</td>
                      <td className="text-right px-4 py-3 tabular-nums font-mono text-foreground">{r.avgBalance}</td>
                      <td className={`text-right px-5 py-3 tabular-nums font-mono font-medium ${parseInt(r.botRate) > 30 ? "text-destructive" : parseInt(r.botRate) > 10 ? "text-amber-500" : "text-emerald-500"}`}>{r.botRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-3">Live dashboard preview — sample data</p>
          <div className="mt-6">
            <MockDailyChart />
          </div>
        </div>
      </section>

      {/* ── GA COMPARISON ── */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-4 text-foreground">
            Google Analytics Can't See This
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Standard analytics tools were built for Web2. Your users have wallets.
          </p>
          <div className="rounded-2xl border border-border overflow-hidden bg-card">
            <div className="grid grid-cols-2">
              <div className="bg-muted px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Google Analytics</div>
              <div className="bg-primary/5 px-6 py-4 font-mono text-[10px] uppercase tracking-widest text-primary border-l border-border">AudienceScan</div>
            </div>
            {gaComparison.map((row, i) => (
              <div key={i} className="grid grid-cols-2 border-t border-border">
                <div className="px-6 py-4 flex items-center gap-3 bg-muted/50">
                  <XIcon className="w-4 h-4 text-destructive shrink-0" />
                  <span className="text-sm text-muted-foreground">{row.ga}</span>
                </div>
                <div className="px-6 py-4 flex items-center gap-3 border-l border-border">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm font-medium text-foreground">{row.as}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOT DETECTION ── */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl mb-4 text-foreground">
              Analytics You Can Defend In Court
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              No vague filtering. Explicit bot detection with 12+ signals per visitor.
            </p>
          </div>

          <MockBotSummary />

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-muted/50">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Bot className="w-4 h-4 text-destructive" /> Bot Signal Report
                </span>
              </div>
              {botSignals.map((s, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-2.5 border-b border-border last:border-0">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <span className={`text-sm font-mono font-medium ${s.bad ? "text-destructive" : "text-foreground"}`}>{s.value}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border-2 border-primary/20 bg-primary/[0.03] p-8">
              <blockquote className="text-foreground font-medium leading-relaxed mb-6">
                "Our bot detection data is currently the foundation of a{" "}
                <span className="text-primary font-bold">$25K+ legal claim</span>{" "}
                against a fraudulent marketing provider. Analytics you can defend in court."
              </blockquote>
              <p className="text-sm text-muted-foreground">— AudienceScan client, token project</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8 CAPABILITIES ── */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-4 text-foreground">
            8 Things You Can Do Today
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            From basic analytics to wallet-level intelligence — all from one tag.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {capabilities.map((c, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-6 hover:shadow-elegant transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-mono text-xs font-bold text-primary">{i + 1}</span>
                  <c.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1.5">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          <hr className="border-border my-10" />

          {/* Cost Attribution Mock */}
          <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-muted/50 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Cost Attribution</span>
              <span className="font-mono text-[10px] text-muted-foreground ml-auto">Sample data</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">utm_source</th>
                    <th className="text-right px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Spend</th>
                    <th className="text-right px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Wallets</th>
                    <th className="text-right px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">CPA</th>
                    <th className="text-right px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Cost / $1K Bal.</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCostRows.map((r) => (
                    <tr key={r.source} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 font-medium text-foreground">{r.source}</td>
                      <td className="text-right px-4 py-3 tabular-nums font-mono text-foreground">{r.spend}</td>
                      <td className="text-right px-4 py-3 tabular-nums font-mono text-foreground">{r.wallets}</td>
                      <td className="text-right px-4 py-3 tabular-nums font-mono text-foreground">{r.cpa}</td>
                      <td className="text-right px-5 py-3 tabular-nums font-mono text-primary font-medium">{r.cpb}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── CPB AHA ── */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-4 text-foreground">
            See Wallet Value — Not Just Wallet Count
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
            Did your last campaign bring whales or dust wallets? Know instantly.
          </p>

          <MockHolderTrend />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-muted/50 p-8">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Without AudienceScan</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><XIcon className="w-4 h-4 text-destructive mt-0.5 shrink-0" /> "We got 5,000 visits from that campaign"</li>
                <li className="flex items-start gap-2"><XIcon className="w-4 h-4 text-destructive mt-0.5 shrink-0" /> "Bounce rate was 40%, so… decent?"</li>
                <li className="flex items-start gap-2"><XIcon className="w-4 h-4 text-destructive mt-0.5 shrink-0" /> "We think some connected their wallet"</li>
                <li className="flex items-start gap-2"><XIcon className="w-4 h-4 text-destructive mt-0.5 shrink-0" /> "No idea about bot traffic"</li>
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-primary/30 bg-background p-8 shadow-elegant">
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
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-4 text-foreground">
            Find More of Your Best Users
          </h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Your connected wallets are the blueprint. Group them, scan them, and we find the communities they belong to — then hand you the outreach list.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {audienceIntelSteps.map((s) => (
              <div key={s.step} className="rounded-2xl border border-border bg-card p-6 text-left">
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

      {/* ── SOCIAL PROOF ── */}
      <section className="py-16 overflow-hidden">
        <div className="container mx-auto px-4 text-center mb-10">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Trusted by token teams, exchanges, and Web3 agencies</p>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
          <div className="flex gap-12 items-center animate-marquee">
            {[...clientLogos, ...clientLogos].map((logo, i) => (
              <img key={i} src={logo.src} alt={logo.alt} className="h-8 opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 shrink-0" />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-12 text-foreground">
            How It Works
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksSteps.map((s) => (
              <div key={s.num} className="text-center">
                <span className="font-mono text-4xl font-bold text-primary/20 block mb-2">{s.num}</span>
                <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Alpha CTA */}
          <div className="mt-14 text-center rounded-2xl border border-primary/20 bg-primary/[0.03] p-10 max-w-2xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 font-mono text-[10px] uppercase tracking-widest">
              Early Access
            </Badge>
            <h3 className="font-serif text-2xl mb-3 text-foreground">
              We're in Alpha. Everything is Free.
            </h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto text-sm">
              Full access to every feature while we're building. No credit card. No commitment.
            </p>
            <Button asChild size="lg" className="rounded-full font-mono text-sm uppercase tracking-wider px-8 py-6 shadow-elegant">
              <Link to="/auth">
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="font-serif text-3xl md:text-4xl mb-6 text-foreground">
            Stop Optimizing for Clicks.{" "}
            <span className="text-primary">Start Optimizing for Wallets.</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Your marketing budget deserves better than vanity metrics. See who's actually valuable.
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
