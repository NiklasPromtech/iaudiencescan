import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, User, HelpCircle } from "lucide-react";
import { BotSummary } from "@/lib/api";

interface BotSummaryCardsProps {
  summary: BotSummary | null;
  loading: boolean;
}

export function BotSummaryCards({ summary, loading }: BotSummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-5 border border-border">
            <Skeleton className="h-5 w-5 mb-3" />
            <Skeleton className="h-9 w-24 mb-1" />
            <Skeleton className="h-4 w-16" />
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Bots",
      count: summary?.bot_visitors ?? 0,
      pct: summary?.bot_pct ?? 0,
      icon: <Bot className="h-5 w-5" />,
      color: "text-destructive",
    },
    {
      label: "Humans",
      count: summary?.human_visitors ?? 0,
      pct: summary?.human_pct ?? 0,
      icon: <User className="h-5 w-5" />,
      color: "text-primary",
    },
    {
      label: "Unknown",
      count: summary?.unknown_visitors ?? 0,
      pct: summary?.unknown_pct ?? 0,
      icon: <HelpCircle className="h-5 w-5" />,
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card key={card.label} className="p-5 border border-border">
          <div className="flex items-start justify-between mb-3">
            <span className={card.color}>{card.icon}</span>
          </div>
          <p className="text-h2 text-foreground mb-1">
            {card.count.toLocaleString()}
          </p>
          <p className="text-p3 text-muted-foreground">
            {card.label}{" "}
            <span className="text-foreground font-medium">
              ({card.pct.toFixed(1)}%)
            </span>
          </p>
        </Card>
      ))}
    </div>
  );
}
