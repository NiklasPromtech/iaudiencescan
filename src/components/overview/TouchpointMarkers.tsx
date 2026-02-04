import { useMemo, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

export interface TouchpointForChart {
  id: string;
  name: string;
  event_type: string;
  timestamp: string | null;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  color: string | null;
  dateKey: string; // The date this touchpoint should appear on (YYYY-MM-DD)
}

interface TouchpointMarkersProps {
  touchpoints: TouchpointForChart[];
  chartDates: string[]; // Array of date keys in chart order
  chartWidth: number;
  chartLeftMargin: number;
  onTouchpointClick: (touchpoint: TouchpointForChart) => void;
  onMultipleTouchpointsClick: (touchpoints: TouchpointForChart[], dateKey: string) => void;
}

export function TouchpointMarkers({
  touchpoints,
  chartDates,
  chartWidth,
  chartLeftMargin,
  onTouchpointClick,
  onMultipleTouchpointsClick,
}: TouchpointMarkersProps) {
  // Group touchpoints by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, TouchpointForChart[]> = {};
    touchpoints.forEach((tp) => {
      if (!groups[tp.dateKey]) {
        groups[tp.dateKey] = [];
      }
      groups[tp.dateKey].push(tp);
    });
    return groups;
  }, [touchpoints]);

  // Calculate position for each date
  const barWidth = chartDates.length > 0 
    ? (chartWidth - chartLeftMargin) / chartDates.length 
    : 0;

  const hasTouchpoints = touchpoints.length > 0;

  return (
    <div 
      className="relative h-6 border-t border-border/50"
      style={{ marginLeft: chartLeftMargin, marginRight: 0 }}
    >
      {/* Label on the left */}
      <span 
        className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground uppercase tracking-wider"
        style={{ marginLeft: -chartLeftMargin, width: chartLeftMargin - 8, textAlign: 'right' }}
      >
        Events
      </span>
      
      {/* Touchpoint markers */}
      {chartDates.map((dateKey, index) => {
        const tps = groupedByDate[dateKey];
        if (!tps || tps.length === 0) return null;

        const leftPos = (index * barWidth) + (barWidth / 2);
        const isSingle = tps.length === 1;
        const primaryColor = tps[0].color || "#8b5cf6";

        return (
          <HoverCard key={dateKey} openDelay={100} closeDelay={50}>
            <HoverCardTrigger asChild>
              <div
                className="absolute top-1/2 -translate-y-1/2 cursor-pointer group flex items-center justify-center"
                style={{
                  left: leftPos,
                  transform: "translateX(-50%) translateY(-50%)",
                }}
                onClick={() => {
                  if (isSingle) {
                    onTouchpointClick(tps[0]);
                  } else {
                    onMultipleTouchpointsClick(tps, dateKey);
                  }
                }}
              >
                {/* Primary dot */}
                <div
                  className="w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-125"
                  style={{ backgroundColor: primaryColor }}
                />
                {/* Multiple indicator - second dot offset */}
                {!isSingle && (
                  <div
                    className="absolute w-2.5 h-2.5 rounded-full border-2 border-background"
                    style={{ 
                      backgroundColor: tps[1].color || "#3b82f6",
                      left: 6,
                    }}
                  />
                )}
                {/* Count badge for 3+ */}
                {tps.length > 2 && (
                  <div
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-foreground text-background text-[8px] flex items-center justify-center font-medium"
                  >
                    {tps.length}
                  </div>
                )}
              </div>
            </HoverCardTrigger>
            <HoverCardContent 
              side="top" 
              className="w-auto max-w-[250px] p-2"
              sideOffset={8}
            >
              <div className="space-y-1.5">
                {tps.map((tp) => (
                  <div
                    key={tp.id}
                    className={cn(
                      "flex items-center gap-2 text-sm",
                      !isSingle && "cursor-pointer hover:bg-muted rounded px-1.5 py-1 -mx-1.5"
                    )}
                    onClick={(e) => {
                      if (!isSingle) {
                        e.stopPropagation();
                        onTouchpointClick(tp);
                      }
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: tp.color || "#8b5cf6" }}
                    />
                    <span className="font-medium truncate">{tp.name}</span>
                  </div>
                ))}
                {isSingle && (
                  <p className="text-xs text-muted-foreground">Click for details</p>
                )}
              </div>
            </HoverCardContent>
          </HoverCard>
        );
      })}
    </div>
  );
}
