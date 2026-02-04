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

  return (
    <div 
      className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none"
      style={{ marginLeft: chartLeftMargin }}
    >
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
                className="absolute top-0 bottom-8 pointer-events-auto cursor-pointer group"
                style={{
                  left: leftPos,
                  width: 2,
                  transform: "translateX(-50%)",
                }}
                onClick={() => {
                  if (isSingle) {
                    onTouchpointClick(tps[0]);
                  } else {
                    onMultipleTouchpointsClick(tps, dateKey);
                  }
                }}
              >
                {/* The line */}
                <div
                  className="w-full h-full transition-opacity group-hover:opacity-60"
                  style={{
                    backgroundColor: primaryColor,
                    opacity: 0.3,
                  }}
                />
                {/* Top indicator dot */}
                <div
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-transform group-hover:scale-150"
                  style={{ backgroundColor: primaryColor }}
                />
                {/* Multiple indicator */}
                {!isSingle && (
                  <div
                    className="absolute -top-1 left-1/2 translate-x-1 w-2 h-2 rounded-full border-2 border-background"
                    style={{ backgroundColor: tps[1].color || "#3b82f6" }}
                  />
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
