import { useEffect } from "react";
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
import { PillarsRow } from "@/components/landing/PillarsRow";
import { Check, X, Clock, CreditCard, Shield, ArrowRight } from "lucide-react";

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

const comparisonRows: Array<{
  feature: string;
  ga: { label: string; ok: boolean };
  us: { label: string; ok: boolean };
}> = [
  { feature: "Cookieless tracking", ga: { label: "No", ok: false }, us: { label: "Yes", ok: true } },
  { feature: "Cookie banner required", ga: { label: "Yes", ok: false }, us: { label: "Not needed", ok: true } },
  { feature: "GDPR-ready out of the box", ga: { label: "Manual setup", ok: false }, us: { label: "Yes", ok: true } },
  { feature: "Bot filtering", ga: { label: "Limited", ok: false }, us: { label: "Built-in", ok: true } },
  { feature: "Wallet enrichment", ga: { label: "No", ok: false }, us: { label: "Yes", ok: true } },
  { feature: "Click-text tracking", ga: { label: "No", ok: false }, us: { label: "Yes", ok: true } },
  { feature: "Setup time", ga: { label: "Hours", ok: false }, us: { label: "Under 5 minutes", ok: true } },
  { feature: "Free tier", ga: { label: "Free with limits", ok: true }, us: { label: "20K pageviews / mo", ok: true } },
];

const faqs = [
  {
    q: "Is it really free?",
    a: "Yes. Up to 20,000 pageviews per month, forever. No credit card required to start. You only upgrade if you cross that threshold.",
  },
  {
    q: "Do I need a cookie banner?",
    a: "No. AudienceScan is cookieless by default — we don't drop tracking cookies, so you don't need a consent banner for analytics in most jurisdictions.",
  },
  {
    q: "Is it GDPR compliant?",
    a: "Yes. Privacy-first by design: no cookies, no cross-site tracking, no personal identifiers stored without consent. EU-friendly out of the box.",
  },
  {
    q: "How long does it take to migrate from GA4?",
    a: "Under 5 minutes. Drop one snippet into your site (or paste it into Google Tag Manager) and data starts flowing immediately. You can run both in parallel.",
  },
  {
    q: "Will I lose my historical Google Analytics data?",
    a: "No. AudienceScan runs alongside GA4 — your historical GA data stays in Google. We just give you a better view going forward.",
  },
  {
    q: "Does it work for non-Web3 sites?",
    a: "Yes. The wallet features only activate when an EVM wallet connects. For everyone else, it works as a fast, simple, cookieless analytics tool.",
  },
];

const GAAlternative = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title =
      "Google Analytics Alternative for Web3 — Free Until 20K Pageviews | AudienceScan";

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
      "The Google Analytics alternative built for Web3. Cookieless, privacy-first, GDPR-ready. Free until 20,000 monthly pageviews. Set up in under 5 minutes."
    );

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", "https://audiencescan.io/ga-alternative");

    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* HERO */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-5">
            Google Analytics Alternative
          </p>
          <h1 className="font-bold text-4xl md:text-6xl tracking-tight text-foreground mb-6 leading-[1.05]">
            GA Alternative <br className="hidden md:block" />
            <span className="underline decoration-primary decoration-2 underline-offset-[6px]">
              built for Web3
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-3">
            Cookieless. Privacy-first. GDPR-ready out of the box.
          </p>
          <p className="text-lg md:text-xl text-foreground font-medium max-w-2xl mx-auto mb-10">
            Free until 20,000 monthly pageviews.
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

      {/* LOGO MARQUEE */}
      <section className="py-10 overflow-hidden border-y border-border">
        <div className="container mx-auto px-4 text-center mb-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Trusted by 50+ token teams, exchanges, and Web3 agencies
          </p>
        </div>
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
          <div className="flex gap-16 items-center w-max animate-marquee">
            {[...clientLogos, ...clientLogos, ...clientLogos].map((logo, i) => (
              <img
                key={i}
                src={logo.src}
                alt={logo.alt}
                className="h-8 shrink-0 opacity-50 hover:opacity-80 transition-opacity grayscale brightness-0"
              />
            ))}
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
            Why teams replace Google Analytics.
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            A simple, lightweight web analytics tool built for the modern web —
            without the cookie banners, dark patterns, or sampled data.
          </p>

          <div className="border border-border bg-card overflow-hidden">
            <div className="grid grid-cols-3 border-b border-border bg-muted/30">
              <div className="p-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Feature
              </div>
              <div className="p-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-center border-l border-border">
                Google Analytics 4
              </div>
              <div className="p-4 font-mono text-[10px] uppercase tracking-widest text-primary text-center border-l border-border">
                AudienceScan
              </div>
            </div>
            {comparisonRows.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 ${
                  i !== comparisonRows.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="p-4 text-sm text-foreground font-medium">
                  {row.feature}
                </div>
                <div className="p-4 text-sm text-muted-foreground text-center border-l border-border flex items-center justify-center gap-2">
                  {row.ga.ok ? (
                    <Check className="w-4 h-4 text-muted-foreground shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                  <span>{row.ga.label}</span>
                </div>
                <div className="p-4 text-sm text-foreground text-center border-l border-border flex items-center justify-center gap-2 bg-primary/5">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  <span>{row.us.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THREE PILLARS - reused */}
      <PillarsRow />

      {/* HOW IT WORKS */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary text-center mb-3">
            How it works
          </p>
          <h2 className="font-bold text-3xl md:text-4xl text-center mb-12 text-foreground">
            Replace Google Analytics in three steps.
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                n: "01",
                title: "Drop in one snippet",
                body: "Paste a single line of code into your site or GTM. No build steps, no SDK, no config.",
              },
              {
                n: "02",
                title: "See real users instantly",
                body: "Pageviews, clicks, wallets, bot filtering — live in your dashboard within minutes.",
              },
              {
                n: "03",
                title: "Stay free until 20K / mo",
                body: "Free tier covers most sites forever. Upgrade only when you actually grow past 20K monthly pageviews.",
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
      <section className="py-20">
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
          <h2 className="font-bold text-3xl md:text-5xl text-foreground mb-5 tracking-tight">
            Replace Google Analytics in 5 minutes.
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Free until 20,000 pageviews / month. No credit card. No cookie banner.
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

export default GAAlternative;
