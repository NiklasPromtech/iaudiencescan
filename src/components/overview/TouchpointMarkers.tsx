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
        {chartDates.map((dateKey) => {
          const tps = groupedByDate[dateKey];
          const hasTps = tps && tps.length > 0;
          
          if (!hasTps) {
            return <div key={dateKey} className="flex-1" />;
          }

          // Separate single events (dots) from range events (lines)
          const singleEvents = tps.filter(tp => tp.event_type === "single");
          const rangeEvents = tps.filter(tp => tp.event_type === "range");

          return (
            <div key={dateKey} className="flex-1 flex items-center justify-center relative">
              {/* Range events - full width lines with transparency */}
              {rangeEvents.map((tp, idx) => (
                <HoverCard key={tp.id} openDelay={100} closeDelay={50}>
                  <HoverCardTrigger asChild>
                    <div
                      className="absolute inset-x-0 h-[5px] cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ 
                        backgroundColor: tp.color || "#8b5cf6",
                        opacity: 0.4,
                        top: `calc(50% - 2.5px + ${idx * 2}px)`,
                      }}
                      onClick={() => onTouchpointClick(tp)}
                    />
                  </HoverCardTrigger>
                  <HoverCardContent side="top" className="w-auto max-w-[250px] p-2" sideOffset={8}>
                    <div className="flex items-center gap-2 text-sm">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: tp.color || "#8b5cf6" }}
                      />
                      <span className="font-medium truncate">{tp.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Click for details</p>
                  </HoverCardContent>
                </HoverCard>
              ))}

              {/* Single events - dots with transparency */}
              {singleEvents.length > 0 && (
                <HoverCard openDelay={100} closeDelay={50}>
                  <HoverCardTrigger asChild>
                    <div
                      className="cursor-pointer group flex items-center justify-center relative z-10"
                      onClick={() => {
                        if (singleEvents.length === 1) {
                          onTouchpointClick(singleEvents[0]);
                        } else {
                          onMultipleTouchpointsClick(singleEvents, dateKey);
                        }
                      }}
                    >
                      {/* Stack dots with slight offset for visibility */}
                      {singleEvents.slice(0, 3).map((tp, idx) => (
                        <div
                          key={tp.id}
                          className="w-[5px] h-[5px] rounded-full transition-transform group-hover:scale-125"
                          style={{ 
                            backgroundColor: tp.color || "#8b5cf6",
                            opacity: 0.6,
                            position: idx === 0 ? "relative" : "absolute",
                            left: idx === 0 ? undefined : `calc(50% + ${(idx - 0.5) * 4}px)`,
                            transform: idx === 0 ? undefined : "translateX(-50%)",
                          }}
                        />
                      ))}
                      {/* Count badge for 3+ single events */}
                      {singleEvents.length > 3 && (
                        <div className="absolute -top-2 left-3 w-3.5 h-3.5 rounded-full bg-foreground text-background text-[8px] flex items-center justify-center font-medium">
                          {singleEvents.length}
                        </div>
                      )}
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent side="top" className="w-auto max-w-[250px] p-2" sideOffset={8}>
                    <div className="space-y-1.5">
                      {singleEvents.map((tp) => (
                        <div
                          key={tp.id}
                          className={cn(
                            "flex items-center gap-2 text-sm",
                            singleEvents.length > 1 && "cursor-pointer hover:bg-muted rounded px-1.5 py-1 -mx-1.5"
                          )}
                          onClick={(e) => {
                            if (singleEvents.length > 1) {
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
                      {singleEvents.length === 1 && (
                        <p className="text-xs text-muted-foreground">Click for details</p>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Right side spacer - matches right Y-axis width */}
      <div className="w-[50px] flex-shrink-0" />
    </div>
  );
}
