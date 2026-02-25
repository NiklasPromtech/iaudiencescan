import { Code2, Eye, BarChart3, Check } from "lucide-react";

const steps = [
  {
    icon: Code2,
    number: "01",
    title: "Place the tag",
    description:
      "Drop a lightweight script tag on your site or app. Works with any CMS or custom build. Takes under 5 minutes.",
    stat: "Avg install time: 2 min",
  },
  {
    icon: Eye,
    number: "02",
    title: "Data starts flowing",
    description:
      "Wallet extensions, geographic distribution, referrer sources, bot signals, and trading behavior — all linked and analyzed automatically.",
    stat: "First data within seconds",
  },
  {
    icon: BarChart3,
    number: "03",
    title: "Insights + recommendations",
    description:
      "Your dashboard surfaces actionable audience segments, change detection (shifts in holders, new wallet patterns, geographic hot spots), and ready-to-use targeting lists.",
    stat: "Avg 12 communities per scan",
  },
];

const outputs = [
  "Actionable audience segments (frequent traders, top regions)",
  "Bot detection across 12+ signals",
  "Real CPA per wallet connected",
  "Community overlap (X, Telegram, Reddit, Discord)",
  "Change detection (trading behaviors, holder shifts)",
  "Geographic hot spots and wallet tier breakdowns",
];

const benefits = [
  "Improved ROI by cutting bot spend",
  "Data-first strategy investors trust",
  "Insights visible within hours, not weeks",
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Label + heading */}
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4">
          How It Works
        </p>
        <h2 className="font-bold text-3xl md:text-4xl text-foreground mb-3">
          Google Analytics for crypto.
        </h2>
        <p className="text-muted-foreground max-w-2xl mb-16">
          Place a tag, enrich with wallet data, get actionable insights. Crypto
          projects struggle to understand user behavior and trading activity —
          AudienceScan fixes that.
        </p>

        {/* 3 Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {steps.map((step) => (
            <div
              key={step.number}
              className="border border-border bg-card p-6 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 border border-primary/30 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Step {step.number}
                </span>
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {step.description}
              </p>
              <div className="mt-4 pt-4 border-t border-border">
                <span className="font-mono text-[11px] text-primary">
                  {step.stat}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* What You Get */}
        <div className="mb-16">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-6">
            What You Get
          </p>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {outputs.map((item) => (
              <div key={item} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="border-t border-border pt-8 flex flex-wrap gap-8">
          {benefits.map((b) => (
            <div key={b} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              <span className="text-sm text-foreground">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
