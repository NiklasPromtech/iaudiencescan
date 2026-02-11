import { Bot, User, HelpCircle } from "lucide-react";
import { mockBotSummary } from "./mock-data";

const icons = [
  <Bot className="h-5 w-5" />,
  <User className="h-5 w-5" />,
  <HelpCircle className="h-5 w-5" />,
];

export const MockBotSummary = () => (
  <div className="grid grid-cols-3 gap-4 mb-8">
    {mockBotSummary.map((card, i) => (
      <div key={card.label} className="rounded-2xl border border-border bg-card p-5">
        <div className={`mb-3 ${card.color}`}>{icons[i]}</div>
        <p className="text-2xl font-bold text-foreground tabular-nums font-mono">{card.count.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">
          {card.label} <span className="text-foreground font-medium">({card.pct}%)</span>
        </p>
      </div>
    ))}
  </div>
);
