import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Check, X, Clock, CreditCard, Shield, ArrowRight, Wallet, Sparkles, Code2 } from "lucide-react";
import {
  competitors,
  audienceScanRows,
  rowOrder,
  getCompetitor,
} from "@/components/compare/competitors";

const Compare = () => {
  const initialSlug = useMemo(() => {
    if (typeof window === "undefined") return competitors[0].slug;
    const params = new URLSearchParams(window.location.search);
    const vs = params.get("vs");
    return competitors.find((c) => c.slug === vs)?.slug ?? competitors[0].slug;
  }, []);

  const [activeSlug, setActiveSlug] = useState<string>(initialSlug);
  const active = getCompetitor(activeSlug);

  useEffect(() => {
    const prevTitle = document.title;
    document.title =
      "Web3 Analytics Comparison — AudienceScan vs Plausible, Fathom, GA4 & more";

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta(
      "description",
      "Compare Web3 analytics tools. AudienceScan is a privacy-first alternative to Plausible, Fathom, Simple Analytics, Matomo, Umami, GA4 and more — with wallet tracking built in. Free under 20K pageviews."
    );

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", "https://audiencescan.io/compare");

    return () => {
      document.title = prevTitle;
    };
  }, []);

  const handleSelect = (slug: string) => {
    setActiveSlug(slug);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("vs", slug);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const faqs = [
    {
      q: `Can I migrate from ${active.name}?`,
      a: active.migrationNote,
    },
    {
      q: "Is it really free?",
      a: "Yes. Up to 20,000 pageviews per month, forever. No credit card required to start. You only upgrade if you cross that threshold.",
    },
    {
      q: "Do I need a cookie banner?",
      a: "No. AudienceScan is cookieless by default — we don't drop tracking cookies, so you don't need a consent banner for analytics in most jurisdictions.",
    },
    {
      q: "How is this different from a generic privacy analytics tool?",
      a: "Generic tools (Plausible, Fathom, Simple Analytics, Umami) give you pageviews and referrers. AudienceScan adds wallet connects, on-chain holder context, and click-text tracking — built specifically for dApps, DeFi, and token sites.",
    },
    {
      q: "How long does setup take?",
      a: "Under 5 minutes. Drop one snippet into your site (or paste it into Google Tag Manager) and data starts flowing immediately.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* HERO */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-5">
            {active.eyebrow}
          </p>
          <h1 className="font-bold text-4xl md:text-6xl tracking-tight text-foreground mb-6 leading-[1.05]">
            Compare <span className="underline decoration-primary decoration-2 underline-offset-[6px]">Web3 Analytics</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-3">
            Wallet-aware. Cookieless. One snippet, full insights.
          </p>
          <p className="text-lg md:text-xl text-foreground font-medium max-w-2xl mx-auto mb-10">
            Free under 20,000 monthly pageviews.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link to="/auth">
              <Button
                size="lg"
                className="font-mono text-xs uppercase tracking-wider rounded-full px-8 h-12"
              >
                Start Free — No Credit Card
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="font-mono text-xs uppercase tracking-wider rounded-full px-8 h-12"
              >
                See How It Works
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              Setup in under 5 min
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-primary" />
              GDPR-ready
            </span>
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-primary" />
              No card required
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-primary" />
              No cookie banner
            </span>
          </div>
        </div>
      </section>

      {/* COMPETITOR SWITCHER */}
      <section className="py-8 border-y border-border bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-center mb-4">
            Compare AudienceScan vs
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {competitors.map((c) => {
              const isActive = c.slug === activeSlug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => handleSelect(c.slug)}
                  className={`font-mono text-[11px] uppercase tracking-wider px-4 h-9 border transition-colors ${
                    isActive
                      ? "bg-primary text-white border-primary"
                      : "bg-card text-foreground border-border hover:border-primary"
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary text-center mb-3">
            Side-by-side
          </p>
          <h2 className="font-bold text-3xl md:text-4xl text-center mb-3 text-foreground">
            AudienceScan vs {active.name}.
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            {active.tagline}
          </p>

          <div className="border border-border bg-card overflow-hidden">
            <div className="grid grid-cols-3 border-b border-border bg-muted/30">
              <div className="p-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Feature
              </div>
              <div className="p-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-center border-l border-border">
                {active.name}
              </div>
              <div className="p-4 font-mono text-[10px] uppercase tracking-widest text-primary text-center border-l border-border">
                AudienceScan
              </div>
            </div>
            {rowOrder.map((row, i) => {
              const comp = active.rows[row.key];
              const us = audienceScanRows[row.key];
              return (
                <div
                  key={row.key}
                  className={`grid grid-cols-3 ${
                    i !== rowOrder.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="p-4 text-sm text-foreground font-medium">
                    {row.label}
                  </div>
                  <div className="p-4 text-sm text-muted-foreground text-center border-l border-border flex items-center justify-center gap-2">
                    {comp.ok ? (
                      <Check className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    <span>{comp.label}</span>
                  </div>
                  <div className="p-4 text-sm text-foreground text-center border-l border-border flex items-center justify-center gap-2 bg-primary/5">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>{us.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY WEB3 TEAMS SWITCH */}
      <section className="py-20 bg-muted/20 border-y border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary text-center mb-3">
            Why Web3 teams switch
          </p>
          <h2 className="font-bold text-3xl md:text-4xl text-center mb-12 text-foreground">
            What generic analytics can't show you.
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Wallet,
                title: "Wallet visibility",
                body: "See which visitors connected wallets, on which chain, and what they hold. Generic tools stop at the click.",
              },
              {
                icon: Shield,
                title: "Privacy by default",
                body: "Cookieless, no banners, GDPR-ready. Made for sites that take privacy seriously without sacrificing data.",
              },
              {
                icon: Code2,
                title: "One snippet, full insights",
                body: "Drop in a single line. No SDK, no config, no per-event tagging marathon. Live data in minutes.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="border border-border bg-card p-6 flex flex-col"
              >
                <card.icon className="w-5 h-5 text-primary mb-4" />
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary text-center mb-3">
            How it works
          </p>
          <h2 className="font-bold text-3xl md:text-4xl text-center mb-12 text-foreground">
            Switch from {active.name} in three steps.
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                n: "01",
                title: "Drop in one snippet",
                body: "Paste a single line into your site or GTM. No build steps, no SDK, no config.",
              },
              {
                n: "02",
                title: "See real users instantly",
                body: "Pageviews, clicks, wallets, bot filtering — live in your dashboard within minutes.",
              },
              {
                n: "03",
                title: "Stay free until 20K / mo",
                body: "Free tier covers most sites forever. Upgrade only when you cross 20,000 monthly pageviews.",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="border border-border bg-card p-6 flex flex-col"
              >
                <p className="font-mono text-xs text-primary mb-4">{step.n}</p>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/20 border-t border-border">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary text-center mb-3">
            Frequently asked
          </p>
          <h2 className="font-bold text-3xl md:text-4xl text-center mb-12 text-foreground">
            Questions before you switch.
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-border"
              >
                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-primary/5 border-y border-border">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <Sparkles className="w-6 h-6 text-primary mx-auto mb-5" />
          <h2 className="font-bold text-3xl md:text-5xl text-foreground mb-5 tracking-tight">
            Made for dApps and DeFi.
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Drop in. Track wallets. Stay free until 20K pageviews / month.
          </p>
          <Link to="/auth">
            <Button
              size="lg"
              className="font-mono text-xs uppercase tracking-wider rounded-full px-10 h-12"
            >
              Start Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Compare;
