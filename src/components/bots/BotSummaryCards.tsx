import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, User, HelpCircle } from "lucide-react";
import { BotSummary } from "@/lib/api";

interface BotSummaryCardsProps {
  summary: BotSummary | null;
  loading: boolean;
}

const COLORS = ["hsl(0, 84%, 60%)", "hsl(var(--primary))", "hsl(170, 70%, 45%)"];
const ICONS = [
  <Bot className="h-4 w-4" key="b" />,
  <User className="h-4 w-4" key="u" />,
  <HelpCircle className="h-4 w-4" key="h" />,
];

export function BotSummaryCards({ summary, loading }: BotSummaryCardsProps) {
  if (loading) {
    return (
      <Card className="p-6 border border-border">
        <div className="flex items-center gap-6">
          <Skeleton className="h-[100px] w-[100px] rounded-full shrink-0" />
          <div className="flex flex-col gap-3 flex-1">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
      </Card>
    );
  }

  const cards = [
    { label: "Bots", count: summary?.bot_visitors ?? 0, pct: summary?.bot_pct ?? 0, color: "text-destructive" },
    { label: "Humans", count: summary?.human_visitors ?? 0, pct: summary?.human_pct ?? 0, color: "text-primary" },
    { label: "Unknown", count: summary?.unknown_visitors ?? 0, pct: summary?.unknown_pct ?? 0, color: "text-muted-foreground" },
  ];

  const total = cards.reduce((s, c) => s + c.count, 0);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;

  return (
    <Card className="flex flex-col sm:flex-row items-center gap-6 p-6 border border-border">
      {/* Donut chart */}
      <div className="relative shrink-0">
        <svg width="100" height="100" viewBox="0 0 100 100">
          {cards.map((card, i) => {
            const pct = total > 0 ? card.count / total : 0;
            const dashLen = pct * circumference;
            const dashOffset = -cumulative * circumference;
            cumulative += pct;
            return (
              <circle
                key={card.label}
                cx="50" cy="50" r={radius}
                fill="none"
                stroke={COLORS[i]}
                strokeWidth="10"
                strokeDasharray={`${dashLen} ${circumference - dashLen}`}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 50 50)"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-xs font-bold text-foreground">{total.toLocaleString()}</span>
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-col gap-2 flex-1">
        {cards.map((card, i) => (
          <div key={card.label} className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i] }} />
            <span className={card.color}>{ICONS[i]}</span>
            <span className="text-sm text-foreground font-medium">{card.label}</span>
            <span className="ml-auto font-mono text-sm tabular-nums text-foreground">{card.count.toLocaleString()}</span>
            <span className="font-mono text-xs text-muted-foreground w-10 text-right">{card.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
