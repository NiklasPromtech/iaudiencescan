import { Link } from "react-router-dom";
import { ArrowRight, LayoutDashboard, MousePointerClick, Send } from "lucide-react";
import { MockQueryDashboard } from "./MockQueryDashboard";
import { MockClickHeatmap } from "./MockClickHeatmap";
import { MockTelegramChat } from "./MockTelegramChat";

const pillars = [
  {
    eyebrow: "Pillar 01",
    icon: LayoutDashboard,
    title: "Build your own dashboard",
    body: "Pin queries as tiles. They update themselves.",
    visual: <MockQueryDashboard compact />,
    link: "/how-it-works#dashboard",
  },
  {
    eyebrow: "Pillar 02",
    icon: MousePointerClick,
    title: "See where people click",
    body: "Browser extension overlays real click counts on every button.",
    visual: <MockClickHeatmap />,
    link: "/how-it-works#extension",
  },
  {
    eyebrow: "Pillar 03",
    icon: Send,
    title: "Ask in Telegram",
    body: "DM the bot or invite it to a group. /ask and get the number.",
    visual: <MockTelegramChat />,
    link: "/how-it-works#telegram",
  },
];

export const PillarsRow = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-center mb-3">
          What AudienceScan does
        </p>
        <h2 className="font-bold text-3xl md:text-4xl text-center mb-12 text-foreground">
          Website analytics for Web3. Three pillars. One tag.
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {pillars.map((p) => (
            <div key={p.title} className="border border-border bg-card flex flex-col">
              <div className="p-5 border-b border-border">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 border border-primary/30 flex items-center justify-center">
                    <p.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {p.eyebrow}
                  </span>
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
              </div>
              <div className="p-3 flex-1 flex items-center bg-foreground/[0.02]">
                {p.visual}
              </div>
              <Link
                to={p.link}
                className="px-5 py-3 border-t border-border font-mono text-[10px] uppercase tracking-widest text-primary hover:bg-primary/5 transition-colors flex items-center justify-between"
              >
                See how
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
