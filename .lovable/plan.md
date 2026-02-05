

# Incrementality Report: Complete Professional Redesign

## Overview

Transform the current incrementality report into a world-class, VC-ready document that serves multiple stakeholders while emphasizing that **incremental values are the only metrics that matter**.

---

## The Core Philosophy

The report must hammer home one key insight: **Incremental = What Actually Matters**

Every metric shown should reinforce that we're measuring **true lift** - not vanity metrics, not raw totals, but the additional value created by this specific marketing action compared to what would have happened anyway.

---

## Structural Changes

### New Page Structure

| Page | Title | Purpose |
|------|-------|---------|
| 1 | Cover & Executive Summary | 5-second verdict with branded header |
| 2 | The Incremental Story | Educational callout + Conversion/Wallet funnels with visual bars |
| 3 | Timeline & Attribution | Daily performance chart + traffic source breakdown |
| 4+ | Breakdown Deep Dives | One page per breakdown dimension (UTM, Geo, etc.) |
| N-1 | Key Insights | Narrative takeaways + recommendations |
| N | Appendix & Methodology | Traffic summary + methodology explanation + branded footer |

---

## Technical Changes

### 1. Expand TypeScript Interface for Breakdowns

Add the missing `breakdowns` field to support all breakdown dimensions from the API:

```typescript
interface BreakdownItem {
  key: string;
  baseline_total: number;
  event_total: number;
  expected: number;
  actual: number;
  incremental: number;
  uplift_percent: number;
}

// Add to IncrementalityResult interface:
breakdowns?: {
  country?: BreakdownItem[];
  utm_source?: BreakdownItem[];
  utm_medium?: BreakdownItem[];
  utm_campaign?: BreakdownItem[];
  utm_content?: BreakdownItem[];
  utm_term?: BreakdownItem[];
  region?: BreakdownItem[];
  city?: BreakdownItem[];
  referrer_domain?: BreakdownItem[];
  conversion_event?: BreakdownItem[];
  wallet_action?: BreakdownItem[];
};
```

### 2. Add "Why Incremental Matters" Educational Section

After the executive summary, add a prominent callout box:

```text
+------------------------------------------------------------------+
| WHY INCREMENTAL MATTERS                                           |
|                                                                   |
| Incremental metrics measure the TRUE impact of your campaign -    |
| the additional visitors, conversions, and wallet connections      |
| you gained BEYOND what would have happened naturally.             |
|                                                                   |
| Raw totals include organic activity. Incremental isolates your    |
| marketing's real contribution. This is what investors care about. |
+------------------------------------------------------------------+
```

### 3. Enhanced Page Headers with Branding

Every page will have:
- AudienceScan logo in top-left
- Page title in top-center
- Report date in top-right

### 4. Consistent Footers with Page Numbers

Every page will have:
- Analysis period (Baseline dates | Event dates)
- Page number (Page X of Y)
- "Powered by AudienceScan" on final page

### 5. New Funnel Visualization

Replace the current funnel rows with visual comparison bars that immediately show the gap between expected and actual:

```text
Signed up
┌──────────────────────────────────────────────────────┐
│ EXPECTED  ████████████████████░░░░░░░░  129         │
│ ACTUAL    ████████████████████████████████████  279 │
│ INCREMENTAL VALUE: +150 (+116.3%)                   │
└──────────────────────────────────────────────────────┘
```

### 6. Dynamic Breakdown Pages

For each breakdown that has data, generate a dedicated page with:
- Clear section title (e.g., "Breakdown by Country", "Breakdown by UTM Source")
- Professional data table with columns: Dimension | Baseline | Actual | Incremental | Uplift
- Highlight the top performer
- Sort by incremental (descending)
- Limit to top 10 per breakdown to prevent overflow

Breakdown groupings:
- **Marketing Sources**: utm_source, utm_medium, utm_campaign, utm_content, utm_term
- **Geography**: country, region, city
- **Technical**: referrer_domain, conversion_event, wallet_action

### 7. Remove Emojis from Headers

Replace emoji icons with clean, professional headers using border-bottom styling instead.

### 8. Timeline Chart Improvements

- Add actual visitor counts above each bar
- Add conversion counts as secondary label
- Clearer baseline vs. event visual distinction
- Add a subtle divider line between baseline and event periods

---

## Page-by-Page Design

### PAGE 1: Cover & Executive Summary

**Header Bar (Dark)**
- AudienceScan logo (white version) on right
- "INCREMENTALITY ANALYSIS REPORT" label
- Event name as main title
- Report date

**Verdict Box (Colored by verdict)**
- Large verdict badge: "STRONG POSITIVE IMPACT"
- Headline: "Campaign drove 157 incremental conversions"
- Sublabel explaining what this means
- Confidence score as percentage with visual gauge

**Key Metrics Grid (2x2 max)**
- Incremental Conversions (+157) with uplift %
- Incremental Wallets (+159) with uplift %
- Cost per Incremental Conversion ($6.37) - if cost provided
- ROI - if available

**Analysis Period Summary**
- Baseline: Jan 31 - Feb 2 (3 days)
- Event: Feb 2 - Feb 3 (2 days)
- Investment: $1,000 USD (if provided)

### PAGE 2: The Incremental Story

**Educational Callout**
"Why Incremental Matters" box explaining that these are the only metrics that count

**Conversion Funnel**
- Visual bars for each conversion event
- Expected vs Actual comparison
- Large incremental value callout

**Wallet Activity Funnel**
- Same visual treatment for wallet actions

### PAGE 3: Timeline & Attribution

**Daily Performance Timeline**
- Bar chart with visitor numbers labeled
- Clear baseline/event period separation
- Legend at bottom

**Traffic Attribution**
- Horizontal bar chart showing where incremental conversions came from
- Source name, count, and percentage

### PAGES 4+: Breakdown Analysis

**One page per breakdown type that has data**

Example: "Breakdown by UTM Source"
```text
| Source       | Baseline | Actual | Incremental | Uplift    |
|--------------|----------|--------|-------------|-----------|
| Crypto Retro |    1,287 |  3,761 |      +2,903 | +338.3%   |
| (organic)    |      892 |  1,204 |        +312 | +35.0%    |
| ...          |          |        |             |           |
```

Top insight callout: "Crypto Retro drove the most incremental traffic with +338.3% uplift"

### PAGE N-1: Key Insights

**Numbered insight list**
Each insight in a clean row with number prefix

**Recommendation Box**
Based on verdict, provide actionable recommendation:
- STRONG POSITIVE: "Repeat this campaign type. The incremental CPA of $6.37 represents strong unit economics."
- NEGATIVE: "Reconsider this approach. The campaign did not generate meaningful incremental value."
- INCONCLUSIVE: "Gather more data before drawing conclusions."

### PAGE N: Appendix & Methodology

**Traffic Summary Table**
- Baseline daily avg visitors/pageviews
- Event period totals
- Bounce rate comparison

**Methodology Explanation**
```text
This report uses incrementality analysis to measure the causal impact 
of marketing activities. We compare observed behavior during the 
campaign period against expected behavior based on historical baseline.

• Baseline Period: X days of pre-event activity
• Event Period: Y days during/after the event  
• Incremental = Actual - Expected
• Confidence: Statistical significance of the observed lift
```

**Branded Footer**
- AudienceScan logo centered
- "Generated by AudienceScan | audiencescan.io"
- Report generation timestamp

---

## Helper Components to Create/Modify

| Component | Purpose |
|-----------|---------|
| `ReportHeader` | Branded header for every page with logo, title, date |
| `ReportFooter` | Analysis period + page number + optional branding |
| `VerdictBox` | The colored verdict section with confidence gauge |
| `MetricCard` | Individual metric display (unchanged but refined) |
| `FunnelBarComparison` | New visual bar comparing expected vs actual |
| `BreakdownTable` | Table for breakdown data with sorting |
| `BreakdownPage` | Full page template for each breakdown type |
| `IncrementalCallout` | Educational "Why Incremental Matters" box |
| `InsightRow` | Individual insight with numbering |
| `RecommendationBox` | Action recommendation based on verdict |

---

## PDF Export Optimization

Update html2pdf configuration:
```typescript
const opt = {
  margin: [0.4, 0.5, 0.5, 0.5], // top, left, bottom, right
  filename: `incrementality-report-${eventName}.pdf`,
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { 
    scale: 2, 
    useCORS: true,
    logging: false 
  },
  jsPDF: { 
    unit: 'in', 
    format: 'letter', 
    orientation: 'portrait' 
  },
  pagebreak: { mode: ['avoid-all', 'css'] }
};
```

---

## Key Messaging Throughout

Reinforce these concepts on every page:

1. **"Incremental"** - Always prefix metrics with "Incremental" to emphasize true lift
2. **Expected vs Actual** - Always show the comparison, not just the end result
3. **The Baseline Context** - Explain what "expected" means (what would have happened without the campaign)
4. **Actionable Verdicts** - Don't just report data, tell them what to do

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/touchpoints/IncrementalityResultsView.tsx` | Complete rewrite with new multi-page structure, breakdown pages, educational callouts, enhanced visualizations, page numbers, and consistent branding |

---

## Summary

This redesign transforms the incrementality report from a basic data export into an investor-grade document that:

1. **Leads with the verdict** - VCs know in 5 seconds if it worked
2. **Educates on why incremental matters** - Sets the right mental model
3. **Shows the full funnel story** - Visual expected vs actual comparisons
4. **Includes ALL breakdown data** - Dedicated pages for each dimension
5. **Maintains consistent branding** - AudienceScan logo + footer on every page
6. **Has professional structure** - Page numbers, clear headers, logical flow
7. **Removes visual clutter** - No emojis, clean typography, subtle styling
8. **Provides actionable recommendations** - Tells them what to do next
9. **Is defensible** - Methodology section explains the analysis

