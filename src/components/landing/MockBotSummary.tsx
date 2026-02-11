import { Bot, User, HelpCircle } from "lucide-react";
import { mockBotSummary } from "./mock-data";

export const MockBotSummary = () => {
  const total = mockBotSummary.reduce((s, c) => s + c.count, 0);
  // Simple donut via SVG
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;
  const colors = ["hsl(0, 84%, 60%)", "hsl(170, 70%, 45%)", "hsl(40, 20%, 80%)"];
  const icons = [<Bot className="h-4 w-4" key="b" />, <User className="h-4 w-4" key="u" />, <HelpCircle className="h-4 w-4" key="h" />];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 rounded-2xl border border-border bg-card p-6">
      {/* Donut chart */}
      <div className="relative shrink-0">
        <svg width="100" height="100" viewBox="0 0 100 100">
          {mockBotSummary.map((card, i) => {
            const pct = card.count / total;
            const dashLen = pct * circumference;
            const dashOffset = -cumulative * circumference;
            cumulative += pct;
            return (
              <circle
                key={card.label}
                cx="50" cy="50" r={radius}
                fill="none"
                stroke={colors[i]}
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
        {mockBotSummary.map((card, i) => (
          <div key={card.label} className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: colors[i] }} />
            <span className={`${card.color}`}>{icons[i]}</span>
            <span className="text-sm text-foreground font-medium">{card.label}</span>
            <span className="ml-auto font-mono text-sm tabular-nums text-foreground">{card.count.toLocaleString()}</span>
            <span className="font-mono text-xs text-muted-foreground w-10 text-right">{card.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
