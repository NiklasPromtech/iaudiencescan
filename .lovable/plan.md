

# News Source Domains: PR Opportunities Feature

## The Idea

Aggregate all unique news source domains from the news feed and present them as **PR Opportunities** - media outlets that are already covering tokens your audience holds. The positioning: *"These publications cover projects your audience invests in. If they're writing about these tokens, they might write about you too."*

---

## What We'll Build

### 1. PR Outlets Section in News Feed Tab

Add a collapsible/expandable section at the top of the News Feed tab showing:

```text
+------------------------------------------------------------------+
|  PR Opportunities                                                 |
|  12 media outlets covering these communities        [Copy] [CSV]  |
+------------------------------------------------------------------+
|  These outlets write about projects your audience invests in.     |
|  If they're here, maybe you should be too.                       |
+------------------------------------------------------------------+
|                                                                    |
|  coinspeaker.com        | 23 articles  | [Visit Site]            |
|  benzinga.com           | 18 articles  | [Visit Site]            |
|  seekingalpha.com       | 12 articles  | [Visit Site]            |
|  banklesstimes.com      |  8 articles  | [Visit Site]            |
|  (sorted by article count)                                        |
+------------------------------------------------------------------+
```

### 2. PR Outlets Card in Export Center

Add a new export card in the URLs section:

```text
+-------------------+
| PR Outlets        |
| 12 domains        |
| [Copy] [CSV]      |
+-------------------+
```

### 3. PR Outlets Badge in Summary

Add a count badge: **"12 PR Outlets"** alongside the existing badges

---

## Technical Implementation

### New Utility Functions (`src/lib/export-utils.ts`)

```typescript
// Aggregate news sources with article counts
export interface NewsSourceAggregate {
  domain: string;
  article_count: number;
  latest_article: string; // date
  sample_url: string; // one article URL to visit
}

export function aggregateNewsSources(tokens: ScanResultsTopToken[]): NewsSourceAggregate[]

// Get unique domain list for export
export function formatNewsSourceDomains(tokens: ScanResultsTopToken[]): string[]
```

### New Component: `PROutletsSection.tsx`

A section component showing:
- Header with count and export buttons
- Value proposition copy ("These outlets...")
- Sortable list of domains with article counts
- Visit site button for each domain

### Updates to Existing Components

| Component | Change |
|-----------|--------|
| `NewsFeedTab.tsx` | Add PROutletsSection at the top |
| `ExportCenterTab.tsx` | Add PR Outlets export card |
| `SummaryBadges.tsx` | Add PR Outlets badge |
| `export-utils.ts` | Add aggregation functions |

---

## Files to Create/Modify

1. **Modify** `src/lib/export-utils.ts` - Add news source aggregation utilities
2. **Create** `src/components/scan-results/PROutletsSection.tsx` - PR opportunities display
3. **Modify** `src/components/scan-results/NewsFeedTab.tsx` - Integrate PROutletsSection
4. **Modify** `src/components/scan-results/ExportCenterTab.tsx` - Add PR Outlets export card
5. **Modify** `src/components/scan-results/SummaryBadges.tsx` - Add PR outlets badge

---

## User Value

- **Instant PR outreach list**: One-click export of media outlets covering your audience's investments
- **Prioritized targets**: Sorted by article count (more articles = more likely to cover similar projects)
- **Actionable insight**: Clear messaging that frames this as "where your competitors get coverage"

