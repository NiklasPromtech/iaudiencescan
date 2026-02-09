import { useState } from "react";

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
}

// Mapping from country names to ISO 2-letter codes
const countryNameToCode: Record<string, string> = {
  "United States": "US", "USA": "US", "US": "US",
  "United Kingdom": "GB", "UK": "GB", "GB": "GB",
  "Canada": "CA", "CA": "CA",
  "Australia": "AU", "AU": "AU",
  "Germany": "DE", "DE": "DE",
  "France": "FR", "FR": "FR",
  "Japan": "JP", "JP": "JP",
  "Brazil": "BR", "BR": "BR",
  "India": "IN", "IN": "IN",
  "China": "CN", "CN": "CN",
  "South Korea": "KR", "Korea": "KR", "KR": "KR",
  "Russia": "RU", "RU": "RU",
  "Mexico": "MX", "MX": "MX",
  "Italy": "IT", "IT": "IT",
  "Spain": "ES", "ES": "ES",
  "Netherlands": "NL", "NL": "NL",
  "Turkey": "TR", "TR": "TR", "Türkiye": "TR",
  "Switzerland": "CH", "CH": "CH",
  "Sweden": "SE", "SE": "SE",
  "Poland": "PL", "PL": "PL",
  "Indonesia": "ID", "ID": "ID",
  "Argentina": "AR", "AR": "AR",
  "Nigeria": "NG", "NG": "NG",
  "South Africa": "ZA", "ZA": "ZA",
  "Singapore": "SG", "SG": "SG",
  "Thailand": "TH", "TH": "TH",
  "Philippines": "PH", "PH": "PH",
  "Vietnam": "VN", "VN": "VN",
  "Colombia": "CO", "CO": "CO",
  "Egypt": "EG", "EG": "EG",
  "UAE": "AE", "United Arab Emirates": "AE", "AE": "AE",
  "Saudi Arabia": "SA", "SA": "SA",
  "Portugal": "PT", "PT": "PT",
  "Ireland": "IE", "IE": "IE",
  "Norway": "NO", "NO": "NO",
  "Denmark": "DK", "DK": "DK",
  "Finland": "FI", "FI": "FI",
  "Austria": "AT", "AT": "AT",
  "Belgium": "BE", "BE": "BE",
  "Czech Republic": "CZ", "Czechia": "CZ", "CZ": "CZ",
  "Romania": "RO", "RO": "RO",
  "Ukraine": "UA", "UA": "UA",
  "Israel": "IL", "IL": "IL",
  "Malaysia": "MY", "MY": "MY",
  "Chile": "CL", "CL": "CL",
  "Peru": "PE", "PE": "PE",
  "New Zealand": "NZ", "NZ": "NZ",
  "Pakistan": "PK", "PK": "PK",
  "Bangladesh": "BD", "BD": "BD",
  "Kenya": "KE", "KE": "KE",
  "Ghana": "GH", "GH": "GH",
  "Taiwan": "TW", "TW": "TW",
  "Hong Kong": "HK", "HK": "HK",
  "Greece": "GR", "GR": "GR",
  "Hungary": "HU", "HU": "HU",
};

// Simplified world map paths (Natural Earth inspired, simplified for performance)
// Each country is a simplified SVG path positioned on a 1000x500 viewBox (equirectangular-ish)
const countryPaths: Record<string, string> = {
  US: "M85,175 L85,160 L110,155 L135,155 L160,155 L185,160 L200,170 L215,170 L230,175 L235,185 L230,195 L215,200 L200,200 L190,195 L175,195 L160,195 L145,195 L130,195 L115,190 L100,185 Z M45,165 L55,155 L70,150 L80,155 L75,165 L60,170 Z",
  CA: "M80,90 L100,80 L130,75 L160,75 L190,80 L220,85 L240,95 L245,110 L240,130 L225,145 L210,150 L190,155 L165,155 L140,155 L115,155 L95,155 L85,150 L80,135 L75,120 L75,105 Z",
  MX: "M100,200 L115,195 L130,200 L145,205 L155,215 L150,230 L140,240 L130,245 L115,240 L105,230 L100,215 Z",
  BR: "M250,280 L270,265 L290,260 L310,265 L320,280 L315,300 L305,320 L290,335 L275,340 L260,335 L250,320 L245,300 Z",
  AR: "M245,340 L260,340 L270,350 L275,370 L270,390 L260,405 L250,410 L240,400 L235,380 L235,360 Z",
  CO: "M210,255 L225,250 L240,255 L245,270 L235,280 L220,280 L210,270 Z",
  PE: "M210,280 L225,280 L235,285 L240,300 L235,315 L220,320 L210,310 L205,295 Z",
  CL: "M235,320 L245,315 L250,330 L250,350 L245,370 L240,390 L235,405 L230,395 L230,370 L230,345 Z",
  GB: "M435,120 L440,115 L445,110 L450,115 L448,125 L442,130 L437,128 Z",
  IE: "M428,118 L433,115 L436,120 L434,126 L429,125 Z",
  FR: "M445,140 L455,135 L465,138 L468,148 L462,155 L452,155 L445,150 Z",
  DE: "M470,125 L480,120 L490,125 L492,138 L485,145 L475,142 L468,135 Z",
  ES: "M430,155 L445,152 L455,155 L455,165 L445,170 L432,168 L428,162 Z",
  PT: "M425,158 L430,155 L432,165 L428,170 L423,165 Z",
  IT: "M475,150 L480,148 L485,155 L488,168 L483,175 L478,170 L475,160 Z",
  NL: "M460,118 L468,116 L472,120 L470,125 L463,125 Z",
  BE: "M455,125 L463,123 L468,128 L462,132 L456,130 Z",
  CH: "M462,138 L470,136 L475,140 L472,145 L465,144 Z",
  AT: "M475,135 L488,133 L495,138 L490,143 L478,142 Z",
  SE: "M480,80 L488,75 L495,82 L492,100 L485,110 L480,105 L478,90 Z",
  NO: "M470,70 L480,65 L488,72 L485,85 L478,95 L472,90 L468,80 Z",
  DK: "M470,108 L478,105 L482,110 L478,115 L472,114 Z",
  FI: "M500,70 L510,65 L518,72 L515,90 L508,100 L500,95 L498,80 Z",
  PL: "M490,118 L505,115 L515,120 L512,132 L500,135 L490,130 Z",
  CZ: "M480,128 L492,126 L498,132 L492,136 L482,135 Z",
  RO: "M505,140 L518,138 L525,145 L520,152 L508,152 L502,148 Z",
  HU: "M495,135 L508,133 L512,140 L505,145 L495,143 Z",
  GR: "M500,160 L510,155 L515,162 L510,170 L502,168 Z",
  UA: "M515,120 L535,115 L545,122 L540,135 L525,138 L515,132 Z",
  TR: "M525,150 L545,145 L560,148 L565,155 L555,162 L535,160 L525,158 Z",
  RU: "M550,60 L620,50 L700,55 L750,65 L780,80 L770,100 L740,110 L700,115 L650,120 L600,125 L560,120 L540,110 L535,95 L540,75 Z",
  IN: "M620,195 L640,180 L655,185 L660,200 L655,225 L645,245 L635,250 L625,240 L618,220 L615,205 Z",
  CN: "M680,130 L720,120 L750,125 L770,135 L775,155 L760,170 L735,175 L710,175 L690,170 L680,155 Z",
  JP: "M790,155 L798,148 L805,152 L803,165 L795,172 L788,168 L786,160 Z",
  KR: "M770,160 L778,155 L783,160 L780,170 L773,170 Z",
  TW: "M765,195 L770,190 L774,195 L772,202 L767,200 Z",
  ID: "M710,280 L730,275 L750,278 L760,285 L755,295 L735,298 L715,295 L708,288 Z",
  TH: "M690,225 L698,218 L705,225 L703,240 L697,248 L690,242 L688,232 Z",
  VN: "M705,215 L712,208 L718,215 L715,235 L710,245 L705,238 L702,225 Z",
  MY: "M700,260 L715,255 L725,260 L722,268 L710,270 L700,267 Z",
  PH: "M748,225 L755,218 L762,225 L758,238 L752,240 L746,235 Z",
  SG: "M708,272 L713,270 L716,274 L712,277 L708,275 Z",
  AU: "M740,330 L780,320 L810,325 L830,340 L825,360 L805,375 L780,378 L755,372 L740,358 L735,345 Z",
  NZ: "M848,375 L855,368 L862,375 L858,388 L852,392 L846,385 Z",
  SA: "M555,195 L575,190 L585,198 L580,215 L568,222 L555,218 L550,208 Z",
  AE: "M590,208 L600,205 L608,210 L605,218 L595,218 Z",
  IL: "M530,175 L535,172 L538,178 L535,185 L530,182 Z",
  EG: "M510,185 L525,180 L530,190 L525,205 L515,210 L508,200 Z",
  NG: "M460,245 L475,240 L485,248 L480,260 L468,262 L458,255 Z",
  ZA: "M500,360 L520,350 L535,358 L530,375 L515,382 L500,378 L495,368 Z",
  KE: "M540,265 L550,260 L558,268 L555,280 L545,282 L538,275 Z",
  GH: "M445,252 L455,248 L460,255 L456,264 L448,262 Z",
  PK: "M600,180 L618,172 L628,180 L625,195 L612,200 L600,195 Z",
  BD: "M645,210 L655,205 L660,212 L656,220 L648,220 Z",
  HK: "M740,200 L745,197 L748,202 L745,206 L740,204 Z",
};

function getColor(incremental: number, maxAbs: number): string {
  if (maxAbs === 0) return "#e4e4e7";
  const ratio = Math.min(Math.abs(incremental) / maxAbs, 1);
  const intensity = Math.round(40 + ratio * 160);
  
  if (incremental > 0) {
    // Green scale
    return `rgb(${220 - intensity}, ${240}, ${220 - intensity * 0.3})`;
  } else {
    // Red scale
    return `rgb(${240}, ${220 - intensity}, ${220 - intensity})`;
  }
}

export function CountryMapChart({ data, formatNumber, formatPercent }: CountryMapChartProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Build lookup: code -> data
  const countryDataMap = new Map<string, CountryData>();
  data.forEach(item => {
    const code = countryNameToCode[item.key] || item.key.toUpperCase();
    countryDataMap.set(code, item);
  });

  const maxAbs = Math.max(...data.map(d => Math.abs(d.incremental)), 1);

  const hoveredData = hoveredCountry ? countryDataMap.get(hoveredCountry) : null;

  return (
    <div style={{ 
      position: 'relative',
      backgroundColor: '#fafafa',
      borderRadius: '8px',
      border: '1px solid #e4e4e7',
      padding: '16px',
      marginBottom: '16px'
    }}>
      <div style={{ 
        fontSize: '10px', 
        textTransform: 'uppercase', 
        letterSpacing: '1px',
        color: '#a1a1aa',
        fontWeight: '600',
        marginBottom: '12px'
      }}>
        Geographic Distribution
      </div>
      
      <svg 
        viewBox="0 0 1000 500" 
        style={{ width: '100%', height: 'auto', maxHeight: '300px' }}
      >
        {/* Background */}
        <rect x="0" y="0" width="1000" height="500" fill="#fafafa" rx="4" />
        
        {/* Render all country paths */}
        {Object.entries(countryPaths).map(([code, path]) => {
          const cData = countryDataMap.get(code);
          const fill = cData ? getColor(cData.incremental, maxAbs) : "#e4e4e7";
          
          return (
            <path
              key={code}
              d={path}
              fill={fill}
              stroke="#d4d4d8"
              strokeWidth="0.5"
              style={{ cursor: cData ? 'pointer' : 'default', transition: 'fill 0.2s' }}
              onMouseEnter={(e) => {
                if (cData) {
                  setHoveredCountry(code);
                  const rect = (e.target as SVGElement).closest('svg')?.getBoundingClientRect();
                  if (rect) {
                    setTooltipPos({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top - 10
                    });
                  }
                }
              }}
              onMouseLeave={() => setHoveredCountry(null)}
            />
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredData && hoveredCountry && (
        <div style={{
          position: 'absolute',
          left: `${tooltipPos.x}px`,
          top: `${tooltipPos.y}px`,
          transform: 'translate(-50%, -100%)',
          backgroundColor: '#18181b',
          color: '#ffffff',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '11px',
          pointerEvents: 'none',
          zIndex: 10,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{hoveredData.key}</div>
          <div>
            Incremental: <span style={{ 
              fontWeight: '600',
              color: hoveredData.incremental > 0 ? '#4ade80' : hoveredData.incremental < 0 ? '#f87171' : '#a1a1aa'
            }}>
              {hoveredData.incremental > 0 ? '+' : ''}{formatNumber(hoveredData.incremental)}
            </span>
          </div>
          <div>
            Uplift: <span style={{ fontWeight: '600' }}>{formatPercent(hoveredData.uplift_percent)}</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        gap: '8px',
        marginTop: '12px',
        fontSize: '10px',
        color: '#71717a'
      }}>
        <span>Negative</span>
        <div style={{ 
          display: 'flex', 
          height: '8px', 
          borderRadius: '4px', 
          overflow: 'hidden',
          width: '120px'
        }}>
          <div style={{ flex: 1, background: 'rgb(240, 60, 60)' }} />
          <div style={{ flex: 1, background: 'rgb(240, 140, 140)' }} />
          <div style={{ flex: 1, background: '#e4e4e7' }} />
          <div style={{ flex: 1, background: 'rgb(140, 240, 140)' }} />
          <div style={{ flex: 1, background: 'rgb(60, 240, 60)' }} />
        </div>
        <span>Positive</span>
      </div>
    </div>
  );
}
