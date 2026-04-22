import { useEffect, useState } from "react";
import { LayoutGrid, Plus, Puzzle } from "lucide-react";

const bars = [4, 18, 6, 5, 4, 8, 9, 4, 3, 32, 26, 32];
const days = ["04-08", "04-09", "04-10", "04-13", "04-14", "04-15", "04-16", "04-17", "04-19", "04-20", "04-21", "04-22"];
const maxBar = Math.max(...bars);

const tableRows = [
  ["/", "121", "39"],
  ["/query-dashboard", "25", "149"],
  ["/install", "17", "17"],
  ["/auth", "15", "1"],
  ["/queries", "13", "39"],
];

interface Props {
  compact?: boolean;
}

// Empty cell with NEW / EXISTING actions
const EmptyCell = () => (
  <div className="border border-dashed border-border/60 flex flex-col items-center justify-center gap-1.5 py-3">
    <LayoutGrid className="w-3 h-3 text-muted-foreground/30" />
    <span className="font-mono text-[7px] uppercase tracking-widest text-muted-foreground/40">
      1 × 1 · Empty
    </span>
    <div className="flex items-center gap-1 mt-0.5">
      <span className="border border-border px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-widest text-muted-foreground flex items-center gap-0.5">
        <Plus className="w-2 h-2" /> New
      </span>
      <span className="border border-border px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-widest text-muted-foreground flex items-center gap-0.5">
        <Puzzle className="w-2 h-2" /> Existing
      </span>
    </div>
  </div>
);

// Tile: daily pageviews bar chart (full width)
const TileBars = () => (
  <div className="col-span-2 border border-border bg-card p-2.5">
    <p className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground mb-2">
      Daily unique pageviews · 14 days
    </p>
    <div className="flex items-end gap-1 h-12">
      {bars.map((v, i) => (
        <div key={i} className="flex-1 bg-primary" style={{ height: `${(v / maxBar) * 100}%` }} />
      ))}
    </div>
    <div className="flex justify-between mt-1 font-mono text-[6px] text-muted-foreground/60">
      <span>{days[0]}</span>
      <span>{days[Math.floor(days.length / 2)]}</span>
      <span>{days[days.length - 1]}</span>
    </div>
  </div>
);

// Tile: wallet engagement donut
const TileDonut = () => (
  <div className="border border-border bg-card p-2.5">
    <p className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground mb-2">
      Visitor wallet engagement
    </p>
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
        <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--primary))" strokeWidth="6" />
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke="hsl(var(--muted-foreground) / 0.4)"
          strokeWidth="6"
          strokeDasharray="6 88"
        />
      </svg>
      <div className="space-y-0.5 font-mono text-[7px]">
        <p className="text-foreground">Total: 35</p>
        <p className="text-muted-foreground">Detected: 2</p>
        <p className="text-muted-foreground">Connected: 0</p>
      </div>
    </div>
  </div>
);

// Tile: top pages table
const TileTable = () => (
  <div className="border border-border bg-card p-2.5">
    <p className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground mb-2">
      Top 20 pages · 14 days
    </p>
    <div className="space-y-0.5">
      <div className="flex justify-between font-mono text-[7px] uppercase tracking-widest text-muted-foreground/60 border-b border-border pb-0.5">
        <span>Path</span>
        <span>Views</span>
      </div>
      {tableRows.slice(0, 4).map((row) => (
        <div key={row[0]} className="flex justify-between font-mono text-[7px] text-foreground">
          <span className="truncate">{row[0]}</span>
          <span className="tabular-nums text-muted-foreground">{row[1]}</span>
        </div>
      ))}
    </div>
  </div>
);

export const MockQueryDashboard = ({ compact = false }: Props) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 4), 1800);
    return () => clearInterval(id);
  }, []);

  // Step 0: all empty. Step 1: bars. Step 2: bars + donut. Step 3: bars + donut + table.
  return (
    <div className="bg-foreground/[0.02] p-2 border border-border">
      <div className="flex items-center gap-2 mb-2 px-1">
        <LayoutGrid className="w-3 h-3 text-muted-foreground" />
        <span className="font-mono text-[8px] uppercase tracking-widest text-foreground font-semibold">
          Dashboard
        </span>
        <span className="font-mono text-[7px] text-muted-foreground">
          {step} {step === 1 ? "tile" : "tiles"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {step >= 1 ? <TileBars /> : (<><EmptyCell /><EmptyCell /></>)}
        {step >= 2 ? <TileDonut /> : <EmptyCell />}
        {step >= 3 ? <TileTable /> : <EmptyCell />}
        <EmptyCell />
        <EmptyCell />
      </div>
    </div>
  );
};
