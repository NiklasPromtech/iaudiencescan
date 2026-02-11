import React from "react";

interface DashboardFrameProps {
  children: React.ReactNode;
}

export const DashboardFrame = ({ children }: DashboardFrameProps) => (
  <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
    {/* Browser chrome bar */}
    <div className="flex items-center gap-2 px-4 py-2.5 bg-foreground/[0.03] border-b border-border">
      <div className="flex gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
      </div>
      <div className="flex-1 flex justify-center">
        <div className="bg-muted rounded-md px-4 py-1 text-[10px] font-mono text-muted-foreground tracking-wide">
          app.audiencescan.xyz/overview
        </div>
      </div>
      <div className="w-12" /> {/* Spacer to center the URL bar */}
    </div>
    {/* Dashboard content */}
    {children}
  </div>
);
