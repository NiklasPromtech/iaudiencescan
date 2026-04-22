import { TrendingUp } from "lucide-react";

const bars = [42, 28, 18, 9, 5];
const lineDays = Array.from({ length: 14 }, (_, i) => 30 + Math.round(Math.sin(i / 2) * 12) + i * 3);
const maxLine = Math.max(...lineDays);
const pieSlices = [
  { label: "Human", pct: 72, color: "bg-primary" },
  { label: "Bot", pct: 23, color: "bg-destructive" },
  { label: "Unknown", pct: 5, color: "bg-muted-foreground" },
];

interface Props {
  compact?: boolean;
}

export const MockQueryDashboard = ({ compact = false }: Props) => {
  const padding = compact ? "p-3" : "p-4";
  const titleSize = compact ? "text-[9px]" : "text-[10px]";

  return (
    <div className="grid grid-cols-3 gap-2 bg-foreground/[0.02] p-2">
      {/* Tile 1 — scorecard */}
      <div className={`col-span-1 border border-border bg-card ${padding}`}>
        <p className={`font-mono ${titleSize} uppercase tracking-widest text-muted-foreground mb-2`}>
          Wallets / week
        </p>
        <p className="font-mono text-2xl font-bold text-foreground tabular-nums">312</p>
        <p className="font-mono text-[10px] text-emerald-500 flex items-center gap-1 mt-1">
          <TrendingUp className="w-3 h-3" /> +18%
        </p>
        <p className="font-mono text-[9px] text-muted-foreground mt-2">2m ago</p>
      </div>

      {/* Tile 2 — bar chart, spans 2 */}
      <div className={`col-span-2 border border-border bg-card ${padding}`}>
        <p className={`font-mono ${titleSize} uppercase tracking-widest text-muted-foreground mb-2`}>
          Wallets by source
        </p>
        <div className="flex items-end gap-1.5 h-14">
          {bars.map((v, i) => (
            <div key={i} className="flex-1 bg-primary" style={{ height: `${(v / 42) * 100}%` }} />
          ))}
        </div>
        <p className="font-mono text-[9px] text-muted-foreground mt-2">2m ago</p>
      </div>

      {/* Tile 3 — pie */}
      <div className={`col-span-1 border border-border bg-card ${padding}`}>
        <p className={`font-mono ${titleSize} uppercase tracking-widest text-muted-foreground mb-2`}>
          Bot vs Human
        </p>
        <div className="flex h-3 w-full overflow-hidden">
          {pieSlices.map((s) => (
            <div key={s.label} className={s.color} style={{ width: `${s.pct}%` }} />
          ))}
        </div>
        <div className="mt-2 space-y-0.5">
          {pieSlices.map((s) => (
            <div key={s.label} className="flex items-center justify-between font-mono text-[9px]">
              <span className="text-muted-foreground">{s.label}</span>
              <span className="text-foreground tabular-nums">{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tile 4 — line, spans 2 */}
      <div className={`col-span-2 border border-border bg-card ${padding}`}>
        <p className={`font-mono ${titleSize} uppercase tracking-widest text-muted-foreground mb-2`}>
          Daily wallets · 14d
        </p>
        <svg viewBox="0 0 140 50" className="w-full h-14" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
            points={lineDays
              .map((v, i) => `${(i / (lineDays.length - 1)) * 140},${50 - (v / maxLine) * 45}`)
              .join(" ")}
          />
        </svg>
        <p className="font-mono text-[9px] text-muted-foreground mt-2">2m ago</p>
      </div>
    </div>
  );
};
