import { useMemo } from "react";
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
  onTouchpointClick: (touchpoint: TouchpointForChart) => void;
  onMultipleTouchpointsClick: (touchpoints: TouchpointForChart[], dateKey: string) => void;
}

export function TouchpointMarkers({
  touchpoints,
  chartDates,
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

  const hasTouchpoints = touchpoints.length > 0;

  return (
    <div className="flex border-t border-border/50">
      {/* Label on the left - matches Y-axis width */}
      <div className="w-[50px] flex-shrink-0 flex items-center justify-end pr-2">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
          Events
        </span>
      </div>
      
      {/* Markers row - one cell per date */}
      <div className="flex-1 flex h-6">
        {chartDates.map((dateKey, index) => {
          const tps = groupedByDate[dateKey];
          const hasTps = tps && tps.length > 0;
          
          if (!hasTps) {
            return <div key={dateKey} className="flex-1" />;
          }

          const isSingle = tps.length === 1;
          const primaryColor = tps[0].color || "#8b5cf6";

          return (
            <div key={dateKey} className="flex-1 flex items-center justify-center">
              <HoverCard openDelay={100} closeDelay={50}>
                <HoverCardTrigger asChild>
                  <div
                    className="cursor-pointer group flex items-center justify-center relative"
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
                          left: 8,
                        }}
                      />
                    )}
                    {/* Count badge for 3+ */}
                    {tps.length > 2 && (
                      <div
                        className="absolute -top-1.5 left-3 w-3.5 h-3.5 rounded-full bg-foreground text-background text-[8px] flex items-center justify-center font-medium"
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
            </div>
          );
        })}
      </div>
      
      {/* Right side spacer - matches right Y-axis width */}
      <div className="w-[50px] flex-shrink-0" />
    </div>
  );
}
