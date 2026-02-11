import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockDailyChart } from "./mock-data";
import { Diamond } from "lucide-react";

export const MockDailyChart = () => (
  <div className="rounded-2xl border border-border bg-card p-6 relative">
    {/* Watermark */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/10 text-lg font-bold select-none">AudienceScan</span>
    </div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-foreground font-mono uppercase tracking-wider">Daily Metrics</h4>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-primary" /> Page Views</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "hsl(170, 70%, 45%)" }} /> Wallet Extensions</span>
        </div>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockDailyChart} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
            />
            <Bar yAxisId="left" dataKey="views" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
            <Bar yAxisId="right" dataKey="extensions" fill="hsl(170, 70%, 45%)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Touchpoint marker */}
      <div className="flex items-center justify-center gap-2 mt-3">
        <Diamond className="w-3 h-3 text-primary" />
        <span className="text-xs text-muted-foreground">
          Jan 30: <span className="text-foreground font-medium">KOL Campaign Launch</span> — touchpoint marker
        </span>
      </div>
    </div>
  </div>
);
