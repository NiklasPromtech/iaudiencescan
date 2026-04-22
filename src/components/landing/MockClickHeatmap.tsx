interface Props {
  compact?: boolean;
}

const badges = [
  { top: "12%", left: "30%", value: "9.8%" },
  { top: "12%", left: "48%", value: "2.0%" },
  { top: "12%", left: "66%", value: "12%" },
  { top: "62%", left: "38%", value: "34%" },
];

export const MockClickHeatmap = ({ compact = false }: Props) => {
  return (
    <div className="border border-border bg-card overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-foreground/[0.03] border-b border-border">
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-destructive/50" />
          <span className="w-2 h-2 rounded-full bg-amber-400/50" />
          <span className="w-2 h-2 rounded-full bg-emerald-400/50" />
        </div>
        <div className="flex-1 text-center font-mono text-[9px] text-muted-foreground">
          yourtoken.io
        </div>
      </div>

      <div className="flex">
        {/* Page area with click badges */}
        <div className="relative flex-1 bg-background min-h-[180px] p-4">
          {/* Fake nav buttons */}
          <div className="flex justify-end gap-2 mb-6">
            <div className="px-2 py-1 bg-muted h-5 w-12" />
            <div className="px-2 py-1 bg-muted h-5 w-12" />
            <div className="px-2 py-1 bg-muted h-5 w-14" />
          </div>
          <div className="space-y-2 mb-6">
            <div className="bg-muted h-3 w-3/4" />
            <div className="bg-muted h-3 w-1/2" />
          </div>
          <div className="flex justify-center">
            <div className="bg-primary/30 h-7 w-32" />
          </div>

          {/* Click badges */}
          {badges.map((b, i) => (
            <div
              key={i}
              className="absolute bg-primary px-1.5 py-0.5 font-mono text-[9px] font-bold text-primary-foreground"
              style={{ top: b.top, left: b.left }}
            >
              {b.value}
            </div>
          ))}
        </div>

        {/* Side panel */}
        {!compact && (
          <div className="w-28 border-l border-border bg-foreground/[0.02] p-2 space-y-2">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground">
                Clickers
              </p>
              <p className="font-mono text-base font-bold text-foreground">165</p>
            </div>
            <div className="flex gap-1">
              <span className="font-mono text-[8px] px-1 py-0.5 bg-primary text-primary-foreground">
                DSK
              </span>
              <span className="font-mono text-[8px] px-1 py-0.5 border border-border text-muted-foreground">
                MOB
              </span>
            </div>
            <div className="flex gap-1">
              <span className="font-mono text-[8px] px-1 py-0.5 border border-border text-muted-foreground">
                1D
              </span>
              <span className="font-mono text-[8px] px-1 py-0.5 bg-primary text-primary-foreground">
                7D
              </span>
              <span className="font-mono text-[8px] px-1 py-0.5 border border-border text-muted-foreground">
                30D
              </span>
            </div>
            <div className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground pt-1 border-t border-border">
              Query →
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
