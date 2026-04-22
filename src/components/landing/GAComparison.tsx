import { Bot, Wallet } from "lucide-react";

const cards = [
  {
    icon: Bot,
    title: "Bot detection",
    body: "Google Analytics counts bot clicks as real visitors. We flag them — so you stop paying to advertise to scrapers.",
  },
  {
    icon: Wallet,
    title: "Wallet enrichment",
    body: "When an EVM wallet connects, we capture the address and enrich it with token holdings + USD value. GA shows you a session — we show you a buyer.",
  },
];

export const GAComparison = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 max-w-5xl">
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary text-center mb-3">
          Beyond Google Analytics
        </p>
        <h2 className="font-bold text-3xl md:text-4xl text-center mb-12 text-foreground">
          What we <span className="underline decoration-primary decoration-2 underline-offset-4">track</span> that GA can't.
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          {cards.map((c) => (
            <div key={c.title} className="border border-border bg-card p-6">
              <div className="w-10 h-10 border border-primary/30 flex items-center justify-center mb-4">
                <c.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
