import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { mockHolderTrend } from "./mock-data";

export const MockHolderTrend = () => (
  <div className="rounded-xl border border-border bg-card p-6 mb-10">
    <div className="flex items-center justify-between mb-4">
      <h4 className="text-sm font-semibold text-foreground">Token Holders — 30 Day Trend</h4>
      <span className="text-xs text-muted-foreground">All tracked contracts</span>
    </div>
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={mockHolderTrend}>
          <defs>
            <linearGradient id="holderGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} interval={4} />
          <YAxis domain={["dataMin - 100", "dataMax + 100"]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
          />
          <Area type="monotone" dataKey="holders" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#holderGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    <div className="flex items-center justify-center gap-2 mt-3">
      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
      <span className="text-xs text-muted-foreground">
        Day 21: <span className="text-foreground font-medium">Exchange Listing</span> — visible uptick in holder growth
      </span>
    </div>
  </div>
);
