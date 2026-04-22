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
    link: "/how/dashboard",
  },
  {
    eyebrow: "Pillar 02",
    icon: MousePointerClick,
    title: "See where people click",
    body: "Browser extension overlays real click counts on every button.",
    visual: <MockClickHeatmap />,
    link: "/how/extension",
  },
  {
    eyebrow: "Pillar 03",
    icon: Send,
    title: "Ask in Telegram",
    body: "DM the bot or invite it to a group. /ask and get the number.",
    visual: <MockTelegramChat />,
    link: "/how/telegram",
  },
];

export const PillarsRow = () => {
  return (
    <section className="pt-8 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="font-bold text-3xl md:text-4xl text-center mb-12 text-foreground">
          <span className="underline decoration-primary decoration-2 underline-offset-4">Website analytics</span> for Web3. Three pillars. One tag.
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
                <p className="text-sm text-muted-foreground leading-relaxed min-h-[2.75rem]">{p.body}</p>
              </div>
              <div className="flex-1 bg-foreground/[0.02] border-t border-border">
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
