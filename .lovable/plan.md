

# Refine Landing Page to Match Dune.com More Closely

Based on the three Dune screenshots, here are the key differences between our current implementation and Dune's actual design:

## What Needs to Change

### 1. Header — Closer to Dune's Nav
The Dune header has a distinctive black pill-shaped logo button (not just a logo image), a "Sim" toggle, centered nav with dropdown arrows, a search icon, and uppercase LOG IN / SIGN UP. Our current header is close but missing:
- A **dark/black pill button** for the logo (like Dune's green circle + "Dune" text in a dark pill)
- A **search icon** before LOG IN
- **Dropdown arrows** on nav items (Products, Data, Use Cases, Resources)
- File: `src/components/Header.tsx`

### 2. Color Refinements
Dune's actual accent color is a **warm teal-green** for the logo pill, with the hero gradient being a very **soft peach/salmon** (not deep orange). The charts use **vibrant multi-color palettes** (purples, teals, oranges, pinks, greens). Current orange is too saturated for the primary — it should be more subtle.
- Soften the hero gradient to a lighter peach tone
- Keep primary warm but dial back saturation slightly
- Add chart color palette variables for vibrant multi-color charts
- File: `src/index.css`

### 3. Dashboard Preview — More Dune-like Data Density
Dune dashboards (IMG_2091, IMG_2092) feature:
- **Large stat counters** at the top with icons and sparklines
- **Clean tables** with linked entity names (blue/teal links), right-aligned numbers
- Charts with a subtle **"Dune" watermark** — we should add an **"AudienceScan" watermark** to our mock charts
- More **chart variety**: bar charts, area charts, pie/donut charts with vibrant multi-color fills
- File: `src/pages/LandingPageV3.tsx`, `src/components/landing/MockDailyChart.tsx`, `src/components/landing/MockHolderTrend.tsx`

### 4. Tag/Pill Styling
Dune uses small rounded tag pills (like `#Ethereum`, `#DeFi`, `#ETF`) in a muted style. We should add similar tag pills to the mock dashboard table rows (e.g., chain tags next to source names).
- File: `src/pages/LandingPageV3.tsx`

### 5. Chart Watermark
Both dashboard screenshots show a subtle "Dune" logo watermark in the center of charts. We should add a subtle "AudienceScan" watermark to our mock charts for brand consistency and to look more like a real analytics platform.
- Files: `src/components/landing/MockDailyChart.tsx`, `src/components/landing/MockHolderTrend.tsx`

### 6. Stat Cards — Dune's Big Number Style
Dune's dashboard stats (IMG_2091) show huge numbers like "$37,025,196" with subtitles and small trend icons. Our scorecard row is compact — we should make the top stats bigger and bolder with more visual weight, matching Dune's style.
- File: `src/pages/LandingPageV3.tsx`

## Technical Details

### Files to Modify
| File | Changes |
|------|---------|
| `src/index.css` | Soften hero gradient to lighter peach; add chart color palette CSS variables |
| `src/components/Header.tsx` | Dark logo pill button, search icon, dropdown arrows on nav items |
| `src/pages/LandingPageV3.tsx` | Bigger stat cards at top of dashboard preview, add chain tag pills to table rows |
| `src/components/landing/MockDailyChart.tsx` | Add subtle "AudienceScan" watermark overlay, use warmer bar colors |
| `src/components/landing/MockHolderTrend.tsx` | Add subtle watermark overlay |
| `src/components/landing/MockBotSummary.tsx` | No changes needed — already looks good |

### What Stays the Same
- Overall page structure and content sections
- Footer design
- Font choices (DM Serif Display + Space Mono)
- Rounded card borders and spacing
- Mobile responsiveness

