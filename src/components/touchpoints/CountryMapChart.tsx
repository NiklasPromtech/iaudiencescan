import { useState, memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Loader2, ChevronRight, ArrowLeft } from "lucide-react";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ISO 3166-1 numeric to name mapping (used by world-atlas topojson)
const numericToName: Record<string, string> = {
  "840": "United States", "826": "United Kingdom", "124": "Canada", "036": "Australia",
  "276": "Germany", "250": "France", "392": "Japan", "076": "Brazil", "356": "India",
  "156": "China", "410": "South Korea", "643": "Russia", "484": "Mexico", "380": "Italy",
  "724": "Spain", "528": "Netherlands", "792": "Turkey", "756": "Switzerland",
  "752": "Sweden", "616": "Poland", "360": "Indonesia", "032": "Argentina",
  "566": "Nigeria", "710": "South Africa", "702": "Singapore", "764": "Thailand",
  "608": "Philippines", "704": "Vietnam", "170": "Colombia", "818": "Egypt",
  "784": "UAE", "682": "Saudi Arabia", "620": "Portugal", "372": "Ireland",
  "578": "Norway", "208": "Denmark", "246": "Finland", "040": "Austria",
  "056": "Belgium", "203": "Czech Republic", "642": "Romania", "804": "Ukraine",
  "376": "Israel", "458": "Malaysia", "152": "Chile", "604": "Peru",
  "554": "New Zealand", "586": "Pakistan", "050": "Bangladesh", "404": "Kenya",
  "288": "Ghana", "158": "Taiwan", "344": "Hong Kong", "300": "Greece", "348": "Hungary",
};

// Country name aliases for matching data keys
const nameAliases: Record<string, string[]> = {
  "United States": ["US", "USA", "United States of America"],
  "United Kingdom": ["UK", "GB", "Great Britain"],
  "South Korea": ["Korea", "KR"],
  "UAE": ["United Arab Emirates", "AE"],
  "Czech Republic": ["Czechia", "CZ"],
  "Turkey": ["Türkiye", "TR"],
};

interface CountryData {
  key: string;
  incremental: number;
  uplift_percent: number;
  baseline_total: number;
  actual: number;
}

interface CountryMapChartProps {
  data: CountryData[];
  formatNumber: (n: number) => string;
  formatPercent: (n: number) => string;
  drillLevel?: "country" | "region" | "city";
  breadcrumb?: string[];
  onDrill?: (key: string) => void;
  onBack?: () => void;
  loading?: boolean;
}

function matchDataKey(geoName: string, data: CountryData[]): CountryData | undefined {
  // Direct match
  let found = data.find(d => d.key.toLowerCase() === geoName.toLowerCase());
  if (found) return found;
  // Check aliases
  const aliases = nameAliases[geoName];
  if (aliases) {
    for (const alias of aliases) {
      found = data.find(d => d.key.toLowerCase() === alias.toLowerCase());
      if (found) return found;
    }
  }
  // Reverse: check if any alias set contains geoName
  for (const [canonical, alts] of Object.entries(nameAliases)) {
    if (alts.some(a => a.toLowerCase() === geoName.toLowerCase())) {
      found = data.find(d => d.key.toLowerCase() === canonical.toLowerCase());
      if (found) return found;
    }
  }
  return undefined;
}

function getColor(incremental: number, maxAbs: number): string {
  if (maxAbs === 0) return "hsl(0 0% 91%)";
  const ratio = Math.min(Math.abs(incremental) / maxAbs, 1);
  if (incremental > 0) {
    const lightness = 85 - ratio * 40;
    return `hsl(152 ${40 + ratio * 30}% ${lightness}%)`;
  } else {
    const lightness = 85 - ratio * 40;
    return `hsl(0 ${40 + ratio * 30}% ${lightness}%)`;
  }
}

export const CountryMapChart = memo(function CountryMapChart({
  data,
  formatNumber,
  formatPercent,
  drillLevel = "country",
  breadcrumb = [],
  onDrill,
  onBack,
  loading = false,
}: CountryMapChartProps) {
  const [tooltipContent, setTooltipContent] = useState<{
    name: string;
    data: CountryData | null;
    x: number;
    y: number;
  } | null>(null);

  const maxAbs = Math.max(...data.map(d => Math.abs(d.incremental)), 1);

  return (
    <div className="relative rounded-lg border border-border bg-card overflow-hidden">
      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <div className="flex items-center gap-1 px-4 pt-3 text-xs text-muted-foreground">
          <button
            onClick={onBack}
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Back
          </button>
          <ChevronRight className="h-3 w-3" />
          {breadcrumb.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3" />}
              <span className={i === breadcrumb.length - 1 ? "text-foreground font-medium" : ""}>
                {crumb}
              </span>
            </span>
          ))}
        </div>
      )}

      <div className="px-4 pt-2 pb-1">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          Geographic Distribution {drillLevel !== "country" && `(${drillLevel})`}
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-background/60 z-20 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Map */}
      <div className="relative" onMouseLeave={() => setTooltipContent(null)}>
        <ComposableMap
          projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}
          width={800}
          height={400}
          style={{ width: "100%", height: "auto" }}
        >
          <ZoomableGroup>
            <Geographies geography={GEO_URL}>
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo) => {
                  const geoId = geo.id;
                  const geoName = numericToName[geoId] || geo.properties?.name || "";
                  const matched = matchDataKey(geoName, data);
                  const fill = matched ? getColor(matched.incremental, maxAbs) : "hsl(0 0% 91%)";
                  const hasData = !!matched;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke="hsl(0 0% 80%)"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: {
                          outline: "none",
                          fill: hasData ? "hsl(220 60% 60%)" : "hsl(0 0% 85%)",
                          cursor: hasData && onDrill ? "pointer" : "default",
                        },
                        pressed: { outline: "none" },
                      }}
                      onMouseEnter={(evt) => {
                        const rect = (evt.target as SVGElement).closest("svg")?.getBoundingClientRect();
                        if (rect) {
                          setTooltipContent({
                            name: geoName || geoId,
                            data: matched || null,
                            x: evt.clientX - rect.left,
                            y: evt.clientY - rect.top,
                          });
                        }
                      }}
                      onMouseMove={(evt) => {
                        const rect = (evt.target as SVGElement).closest("svg")?.getBoundingClientRect();
                        if (rect && tooltipContent) {
                          setTooltipContent(prev => prev ? ({
                            ...prev,
                            x: evt.clientX - rect.left,
                            y: evt.clientY - rect.top,
                          }) : null);
                        }
                      }}
                      onMouseLeave={() => setTooltipContent(null)}
                      onClick={() => {
                        if (hasData && onDrill && matched) {
                          onDrill(matched.key);
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip */}
        {tooltipContent && (
          <div
            className="absolute pointer-events-none z-30"
            style={{
              left: tooltipContent.x,
              top: tooltipContent.y,
              transform: "translate(-50%, -110%)",
            }}
          >
            <div className="bg-popover text-popover-foreground border border-border rounded-md shadow-lg px-3 py-2 text-xs whitespace-nowrap">
              <div className="font-semibold mb-0.5">{tooltipContent.name}</div>
              {tooltipContent.data ? (
                <>
                  <div>
                    Incremental:{" "}
                    <span className={`font-semibold ${tooltipContent.data.incremental > 0 ? "text-emerald-600" : tooltipContent.data.incremental < 0 ? "text-red-600" : "text-muted-foreground"}`}>
                      {tooltipContent.data.incremental > 0 ? "+" : ""}
                      {formatNumber(tooltipContent.data.incremental)}
                    </span>
                  </div>
                  <div>
                    Uplift: <span className="font-semibold">{formatPercent(tooltipContent.data.uplift_percent)}</span>
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground">No data</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex justify-center items-center gap-2 px-4 pb-3 text-[10px] text-muted-foreground">
        <span>Negative</span>
        <div className="flex h-2 rounded-full overflow-hidden w-24">
          <div className="flex-1" style={{ background: "hsl(0 70% 45%)" }} />
          <div className="flex-1" style={{ background: "hsl(0 50% 65%)" }} />
          <div className="flex-1" style={{ background: "hsl(0 0% 91%)" }} />
          <div className="flex-1" style={{ background: "hsl(152 50% 65%)" }} />
          <div className="flex-1" style={{ background: "hsl(152 70% 45%)" }} />
        </div>
        <span>Positive</span>
      </div>
    </div>
  );
});
