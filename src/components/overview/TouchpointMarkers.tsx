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
      <div className="flex-1 flex h-5">
        {chartDates.map((dateKey) => {
          const tps = groupedByDate[dateKey];
          const hasTps = tps && tps.length > 0;
          
          if (!hasTps) {
            return <div key={dateKey} className="flex-1" />;
          }

          // Separate single events (dots) from range events (lines)
          const singleEvents = tps.filter(tp => tp.event_type === "single");
          const rangeEvents = tps.filter(tp => tp.event_type === "range");
          
          // All events for this date (for combined hover)
          const allEvents = tps;

          return (
            <div key={dateKey} className="flex-1 flex items-center justify-center relative">
              {/* Range events - full width lines with transparency, stacked */}
              {rangeEvents.length > 0 && (
                <HoverCard openDelay={100} closeDelay={50}>
                  <HoverCardTrigger asChild>
                    <div
                      className="absolute inset-x-1 cursor-pointer"
                      style={{ height: 14 }}
                      onClick={() => {
                        if (rangeEvents.length === 1) {
                          onTouchpointClick(rangeEvents[0]);
                        } else {
                          onMultipleTouchpointsClick(rangeEvents, dateKey);
                        }
                      }}
                    >
                      {rangeEvents.map((tp, idx) => (
                        <div
                          key={tp.id}
                          className="absolute inset-x-0 rounded-full"
                          style={{ 
                            backgroundColor: tp.color || "#8b5cf6",
                            opacity: 0.5,
                            height: 14,
                            top: 0,
                          }}
                        />
                      ))}
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent side="top" className="w-auto max-w-[250px] p-2" sideOffset={8}>
                    <div className="space-y-1.5">
                      {rangeEvents.map((tp) => (
                        <div
                          key={tp.id}
                          className={cn(
                            "flex items-center gap-2 text-sm",
                            rangeEvents.length > 1 && "cursor-pointer hover:bg-muted rounded px-1.5 py-1 -mx-1.5"
                          )}
                          onClick={(e) => {
                            if (rangeEvents.length > 1) {
                              e.stopPropagation();
                              onTouchpointClick(tp);
                            }
                          }}
                        >
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: tp.color || "#8b5cf6" }}
                          />
                          <span className="font-medium truncate">{tp.name}</span>
                        </div>
                      ))}
                      {rangeEvents.length === 1 && (
                        <p className="text-xs text-muted-foreground">Click for details</p>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}

              {/* Single events - 14px dots with transparency, stacked */}
              {singleEvents.length > 0 && (
                <HoverCard openDelay={100} closeDelay={50}>
                  <HoverCardTrigger asChild>
                    <div
                      className="cursor-pointer group flex items-center justify-center relative z-10"
                      style={{ width: 14, height: 14 }}
                      onClick={() => {
                        if (singleEvents.length === 1) {
                          onTouchpointClick(singleEvents[0]);
                        } else {
                          onMultipleTouchpointsClick(singleEvents, dateKey);
                        }
                      }}
                    >
                      {/* Stack dots - each one slightly offset and semi-transparent */}
                      {singleEvents.map((tp, idx) => (
                        <div
                          key={tp.id}
                          className="absolute rounded-full transition-transform group-hover:scale-110"
                          style={{ 
                            backgroundColor: tp.color || "#8b5cf6",
                            opacity: 0.5,
                            width: 14,
                            height: 14,
                            left: idx * 3,
                          }}
                        />
                      ))}
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
                            className="w-3 h-3 rounded-full flex-shrink-0"
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
