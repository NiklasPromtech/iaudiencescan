import { useState } from "react";
import { Bot, Wallet, MousePointerClick } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import walletImg from "@/assets/ga-wallet-balance.png";
import botImg from "@/assets/ga-human-vs-bot.png";
import clickImg from "@/assets/ga-click-text.png";

const cards = [
  {
    icon: Bot,
    title: "Bot detection",
    body: "Google Analytics counts bot clicks as real visitors. We flag them — so you stop paying to advertise to scrapers.",
    image: botImg,
    alt: "Human vs bot visitors donut chart",
  },
  {
    icon: Wallet,
    title: "Wallet enrichment",
    body: "When an EVM wallet connects, we capture the address and enrich it with token holdings + USD value. GA shows you a session — we show you a buyer.",
    image: walletImg,
    alt: "Wallet balance by country table",
  },
  {
    icon: MousePointerClick,
    title: "Click text tracking",
    body: "We capture the exact text people click — every button, link, and CTA. GA tells you a page was viewed; we tell you which words actually got the click.",
    image: clickImg,
    alt: "Funnel by click text table",
  },
];

export const GAComparison = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 max-w-5xl">
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary text-center mb-3">
          Beyond Google Analytics
        </p>
        <h2 className="font-bold text-3xl md:text-4xl text-center mb-12 text-foreground">
          What we <span className="underline decoration-primary decoration-2 underline-offset-4">track</span> that GA can't.
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {cards.map((c, i) => (
            <div key={c.title} className="border border-border bg-card p-6 flex flex-col">
              <div className="w-10 h-10 border border-primary/30 flex items-center justify-center mb-4">
                <c.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{c.body}</p>
              <button
                type="button"
                onClick={() => setOpenIdx(i)}
                className="mt-auto block w-full cursor-zoom-in"
                aria-label={`View ${c.title} preview`}
              >
                <div className="w-full border border-border bg-background overflow-hidden aspect-[1628/466]">
                  <img
                    src={c.image}
                    alt={c.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
      <Dialog open={openIdx !== null} onOpenChange={(o) => !o && setOpenIdx(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden border-border">
          <DialogTitle className="sr-only">{openIdx !== null ? cards[openIdx].title : ""}</DialogTitle>
          {openIdx !== null && (
            <img src={cards[openIdx].image} alt={cards[openIdx].alt} className="w-full h-auto" />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
