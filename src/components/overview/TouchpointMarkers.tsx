import { useMemo } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

export interface TouchpointForChart {
  id: string;
  name: string;
  event_type: string;
  timestamp: string | null;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  color: string | null;
  cost_amount?: number | null;
  cost_currency?: string | null;
  dateKey: string; // The date this touchpoint should appear on (YYYY-MM-DD)
}

interface TouchpointMarkersProps {
  touchpoints: TouchpointForChart[];
  chartDates: string[]; // Array of date keys in chart order
  onTouchpointClick: (touchpoint: TouchpointForChart) => void;
  onMultipleTouchpointsClick: (touchpoints: TouchpointForChart[], dateKey: string) => void;
  onAddTouchpoint?: () => void;
}

export function TouchpointMarkers({
  touchpoints,
  chartDates,
  onTouchpointClick,
  onMultipleTouchpointsClick,
  onAddTouchpoint,
}: TouchpointMarkersProps) {
  const chartDateSet = useMemo(() => new Set(chartDates), [chartDates]);
  
  // Separate single and range events
  const singleEvents = useMemo(
    () => touchpoints.filter(tp => tp.event_type === "single"),
    [touchpoints]
  );
  
  const rangeEvents = useMemo(
    () => touchpoints.filter(tp => tp.event_type === "range"),
    [touchpoints]
  );
  
  // Group single events by date
  const singlesByDate = useMemo(() => {
    const groups: Record<string, TouchpointForChart[]> = {};
    singleEvents.forEach((tp) => {
      if (!groups[tp.dateKey]) {
        groups[tp.dateKey] = [];
      }
      groups[tp.dateKey].push(tp);
    });
    return groups;
  }, [singleEvents]);

  // Calculate range event spans (start index, end index)
  const rangeSpans = useMemo(() => {
    return rangeEvents.map((tp) => {
      const startDate = tp.start_date ? parseISO(tp.start_date) : null;
      const endDate = tp.end_date ? parseISO(tp.end_date) : startDate;
      
      let startIdx = -1;
      let endIdx = -1;
      
      if (startDate && endDate) {
        // Find first and last visible dates within the range
        for (let i = 0; i < chartDates.length; i++) {
          const chartDate = chartDates[i];
          const chartDateObj = parseISO(chartDate);
          
          if (chartDateObj >= startDate && chartDateObj <= endDate) {
            if (startIdx === -1) startIdx = i;
            endIdx = i;
          }
        }
      }
      
      return { tp, startIdx, endIdx };
    }).filter(({ startIdx }) => startIdx !== -1);
  }, [rangeEvents, chartDates]);

  const totalColumns = chartDates.length;

  return (
    <div className="flex border-t border-border/50 pt-3 mt-2">
      {/* Label on the left - matches Y-axis width */}
      <div className="w-[50px] flex-shrink-0 flex items-center justify-end pr-2">
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Touchpoints
          </span>
          {onAddTouchpoint && (
            <button
              onClick={onAddTouchpoint}
              className="h-4 w-4 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              title="Add touchpoint"
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Markers row - with relative positioning for the spanning bars */}
      <div className="flex-1 relative h-5">
        {/* Range events - absolutely positioned spanning bars */}
        {rangeSpans.map(({ tp, startIdx, endIdx }, rangeIndex) => {
          const leftPercent = (startIdx / totalColumns) * 100;
          const widthPercent = ((endIdx - startIdx + 1) / totalColumns) * 100;
          
          return (
            <HoverCard key={tp.id} openDelay={100} closeDelay={50}>
              <HoverCardTrigger asChild>
                <div
                  className="absolute cursor-pointer flex items-center"
                  style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                    top: 0,
                    height: 14,
                    paddingLeft: 2,
                    paddingRight: 2,
                  }}
                  onClick={() => onTouchpointClick(tp)}
                >
                  <div
                    className="w-full h-full rounded-full border-2 border-background hover:scale-y-110 transition-transform"
                    style={{ 
                      backgroundColor: "hsl(var(--primary) / 0.4)",
                    }}
                  />
                </div>
              </HoverCardTrigger>
              <HoverCardContent side="top" className="w-auto max-w-[250px] p-2" sideOffset={8}>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: tp.color || "#8b5cf6" }}
                    />
                    <span className="font-medium truncate">{tp.name}</span>
                  </div>
                  {tp.start_date && tp.end_date && (
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(tp.start_date), "MMM d")} – {format(parseISO(tp.end_date), "MMM d, yyyy")}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">Click for details</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        })}
        
        {/* Grid for single events */}
        <div className="flex h-full">
          {chartDates.map((dateKey) => {
            const singles = singlesByDate[dateKey];
            const hasSingles = singles && singles.length > 0;
            
            if (!hasSingles) {
              return <div key={dateKey} className="flex-1" />;
            }

            return (
              <div key={dateKey} className="flex-1 flex items-center justify-center relative z-10">
                <HoverCard openDelay={100} closeDelay={50}>
                  <HoverCardTrigger asChild>
                    <div
                      className="cursor-pointer group flex items-center justify-center relative"
                      style={{ width: 14 + (singles.length - 1) * 6, height: 14 }}
                      onClick={() => {
                        if (singles.length === 1) {
                          onTouchpointClick(singles[0]);
                        } else {
                          onMultipleTouchpointsClick(singles, dateKey);
                        }
                      }}
                    >
                      {/* Stack dots with offset, each has border */}
                      {singles.map((tp, idx) => (
                        <div
                          key={tp.id}
                          className="absolute rounded-full border-2 border-background transition-transform group-hover:scale-110"
                          style={{ 
                            backgroundColor: "hsl(var(--primary) / 0.5)",
                            width: 14,
                            height: 14,
                            left: idx * 6,
                          }}
                        />
                      ))}
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent side="top" className="w-auto max-w-[250px] p-2" sideOffset={8}>
                    <div className="space-y-1.5">
                      {singles.map((tp) => (
                        <div
                          key={tp.id}
                          className={cn(
                            "flex items-center gap-2 text-sm",
                            singles.length > 1 && "cursor-pointer hover:bg-muted rounded px-1.5 py-1 -mx-1.5"
                          )}
                          onClick={(e) => {
                            if (singles.length > 1) {
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
                      {singles.length === 1 && (
                        <p className="text-xs text-muted-foreground">Click for details</p>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Right side spacer - matches right Y-axis width */}
      <div className="w-[50px] flex-shrink-0" />
    </div>
  );
}
