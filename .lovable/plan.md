

# Redesign the Incrementality Report for Instant Clarity

## The Problem

The current report is structured like a PDF document (9+ pages, section headers, methodology appendices). When you open it on screen, you're scrolling through a wall of styled divs that look like printed pages. Nothing jumps out. You have to read before you understand.

## The Solution: A Dashboard-First Layout

Restructure the on-screen report into a **single-scroll dashboard** with clear visual hierarchy. The PDF export stays as-is (it already works well for sharing). The on-screen view gets a completely different treatment.

### What you'll see at first glance (above the fold)

```text
+--------------------------------------------------+
|  STRONG POSITIVE IMPACT          65% Confidence   |
|  "Period drove 658 incremental conversions"       |
+--------------------------------------------------+
|                                                    |
|  +658 Conversions   +329 Wallets   $2.40 CPI      |
|  (+116%)            (+326%)        12.3% ROI       |
|                                                    |
+--------------------------------------------------+
|  WHAT CHANGED (visual comparison bars)             |
|  Signed up:    99 expected --> 411 actual  +315%   |
|  wallet_detected: 254 --> 450              +77%    |
|  submitted:    99 --> 411                  +315%   |
|  connected:    0 --> 21                    NEW     |
+--------------------------------------------------+
```

**One look = "things went up, by how much, and I trust the signal."**

### Below the fold (scroll to explore)

1. **Traffic Sparkline** -- compact daily timeline with baseline/event shading (not the tall bar chart)
2. **Top Sources** -- horizontal attribution bars (kept, but tighter)
3. **Breakdowns** -- collapsible accordion sections instead of separate "pages"
4. **Insights** -- numbered cards at the bottom
5. **Methodology & Appendix** -- collapsed by default, expandable

### Key Design Decisions

- **No more fake "pages" on screen** -- the `pageBreakAfter`, `minHeight: 9.5in`, page footers, and page numbers only render inside the PDF export (wrapped in a `print-only` container)
- **The on-screen view is a proper dashboard** with cards, grids, and collapsible sections
- **PDF export remains unchanged** -- the existing `reportRef` div stays hidden on screen but is used for `html2pdf` export
- **"What Changed" section** replaces the separate "Incremental Story" page -- it shows conversion funnel AND wallet funnel side-by-side in a compact grid
- **Breakdowns become accordions** -- click to expand country, UTM source, etc. instead of scrolling through 6 fake pages
- **Confidence gets a traffic-light dot** next to the score (green/amber/red) so you instantly know the signal quality without reading text

## Technical Details

### File: `src/components/touchpoints/IncrementalityResultsView.tsx`

This is the only file that changes. The approach:

1. **Split the render into two containers:**
   - `<div ref={reportRef} className="hidden">` -- the existing PDF layout (untouched, just hidden from screen)
   - `<div className="print:hidden">` -- the new dashboard layout

2. **New dashboard sections (all inline-styled for consistency with existing code):**

   | Section | Description |
   |---|---|
   | Hero Card | Verdict badge + headline + confidence dot/score + reason, all in one row |
   | Metric Grid | 2-4 cards: Incremental Conversions, Wallets, CPI, ROI (same MetricCard component) |
   | "What Changed" | Compact grid showing conversion_funnel + wallet_funnel items with comparison bars (reuses FunnelComparisonBar but in a tighter 2-column grid) |
   | Daily Timeline | Slim sparkline-style bar chart (reuses existing bar rendering, but 80px tall instead of 160px) |
   | Attribution | Top sources bars (same as current, but limited to top 5) |
   | Breakdowns | Each breakdown in a collapsible `<details>` element with the existing BreakdownTable + CountryMapChart |
   | Insights | Numbered list (same as current) |
   | Methodology | Collapsed `<details>` at the bottom |

3. **Collapsible sections** use native HTML `<details>/<summary>` elements for zero-dependency accordion behavior. The first breakdown (utm_source) is open by default.

4. **Analysis Period** moves to a subtle inline badge under the hero card instead of a full-width box.

5. **"Why Incremental Matters"** callout is removed from the dashboard view (it's educational text that clutters the results -- it stays in the PDF).

### No new files or dependencies needed.

