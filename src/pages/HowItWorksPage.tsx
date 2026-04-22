import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, LayoutDashboard, Sparkles, MousePointerClick, Send, CreditCard, Clock, Check } from "lucide-react";
import { MockQueryDashboard } from "@/components/landing/MockQueryDashboard";
import { MockClickHeatmap } from "@/components/landing/MockClickHeatmap";
import { MockTelegramChat } from "@/components/landing/MockTelegramChat";
import { MockAISQLDemo } from "@/components/landing/MockAISQLDemo";

const sections = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "sql", icon: Sparkles, label: "AI SQL" },
  { id: "extension", icon: MousePointerClick, label: "Extension" },
  { id: "telegram", icon: Send, label: "Telegram" },
];

const HowItWorksPage = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Header />

    {/* Hero */}
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl pt-24 pb-12">
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4">How it works</p>
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-5 text-foreground leading-[1.15]">
          Set it up once. Then just look.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Build queries once. Pin them. Ask follow-ups in plain English. See clicks where they happen. Get answers in Telegram. Boom — boom — boom.
        </p>
      </div>
    </section>

    {/* Anchor nav */}
    <div className="sticky top-16 z-20 bg-background/95 backdrop-blur border-y border-border">
      <div className="container mx-auto px-4 max-w-5xl flex flex-wrap gap-2 md:gap-6 py-3 justify-center">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            <s.icon className="w-3 h-3" />
            {s.label}
          </a>
        ))}
      </div>
    </div>

    {/* Dashboard */}
    <section id="dashboard" className="py-20 scroll-mt-32">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-3">Pillar 01 · Dashboard</p>
            <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4 leading-snug">
              Pin the answers you care about. Forever.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Every query you write — or generate — can be pinned to your dashboard as a tile. Scorecards, bar charts, line charts, tables. They refresh automatically.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Come back next Monday. The numbers are already there.
            </p>
          </div>
          <MockQueryDashboard />
        </div>
      </div>
    </section>

    {/* AI SQL */}
    <section id="sql" className="py-20 bg-muted/30 scroll-mt-32">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-3">Pillar 02 · AI SQL</p>
          <h2 className="font-bold text-3xl md:text-4xl text-foreground mb-4 leading-snug">
            Just ask. We write the SQL.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Type the question. We generate the query. You press Run.{" "}
            <span className="text-foreground font-medium">Boom — the data.</span>{" "}
            Need to dig deeper? Ask a follow-up. Boom — more data. Pin any of them to your dashboard.
          </p>
        </div>
        <MockAISQLDemo />
        <p className="text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-4">
          Every generated query is yours to keep
        </p>
      </div>
    </section>

    {/* Extension */}
    <section id="extension" className="py-20 scroll-mt-32">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <MockClickHeatmap />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-3">Pillar 03 · Extension</p>
            <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4 leading-snug">
              See what people actually click — right on the page.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Install the AudienceScan browser extension and visit your own site. Every clickable element gets a live percentage badge showing what real visitors actually pressed.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Filter by desktop / mobile and 1d / 7d / 30d. Jump to the underlying query in one click.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/settings/integrations#extension">
                Download in Settings <ArrowRight className="ml-2 w-3 h-3" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>

    {/* Telegram */}
    <section id="telegram" className="py-20 bg-muted/30 scroll-mt-32">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-3">Pillar 04 · Telegram</p>
            <h2 className="font-bold text-2xl md:text-3xl text-foreground mb-4 leading-snug">
              Get your analytics in Telegram.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              DM the bot for a quick number. Or invite it to a group chat and use{" "}
              <code className="font-mono text-foreground bg-muted px-1.5 py-0.5">/ask</code> — your team gets answers without leaving the conversation.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Same data as your dashboard. Same queries. Just a different surface.
            </p>
          </div>
          <MockTelegramChat />
        </div>
      </div>
    </section>

    {/* Final CTA */}
    <section className="py-24">
      <div className="container mx-auto px-4 text-center max-w-2xl">
        <h2 className="font-bold text-3xl md:text-4xl mb-4 text-foreground">
          Free to start. <span className="text-primary">No credit card. Takes 5 minutes.</span>
        </h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Set up your queries once. Use them every week.
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
  </div>
);

export default HowItWorksPage;
