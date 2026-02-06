

# Scan Results Page Redesign: Outreach Command Center

## Vision

Transform the Scan Results page from a simple "list of platform handles" into a strategic **Outreach Command Center** that a world-class growth marketer would use to plan, prioritize, and execute multi-channel campaigns. The page should answer: "What are my highest-value opportunities, and how do I act on them right now?"

---

## New Data Available

The API now returns:
- `news_articles[]` - Recent news for tokens (title, url, source, published_at, description, image_url)
- `news_count` - Number of news articles per token
- `website` - Project website URL
- `description` - Token/project description
- `outgoing_count` / `incoming_count` - Transaction flow direction

---

## Page Architecture

```text
+------------------------------------------------------------------+
|  Header: Scan Name + Stats + Export All Button                    |
+------------------------------------------------------------------+
|  Tab Navigation: [Communities] [News] [Websites] [Export]         |
+------------------------------------------------------------------+
|                                                                    |
|  Tab Content Area (changes based on selected tab)                  |
|                                                                    |
+------------------------------------------------------------------+
```

---

## Tab 1: Communities (Default View)

**Purpose**: Platform-specific targeting with improved hierarchy

### Layout Changes

1. **Summary Row at Top**
   - Quick count badges: "42 X handles | 28 Telegram | 15 Reddit | 8 Discord | 156 News Articles"
   - Each clickable to scroll/filter to that section

2. **Platform Cards (Improved)**
   - Keep the current 2x2 grid layout
   - Add a "news indicator" badge on tokens with recent news (e.g., flame icon + "5 articles")
   - Add inline token description (truncated) on hover or as subtitle
   - Show website link icon next to each token

3. **Filters Section (Enhanced)**
   - Current: Min Market Cap, Min Transactions, Sort By
   - Add: "Has News" toggle, "Has Website" toggle
   - Add: Platform filter (show only tokens with X, only with Telegram, etc.)

---

## Tab 2: News Feed

**Purpose**: All news articles aggregated for outreach inspiration and PR opportunities

### Layout

```text
+------------------------------------------------------------------+
|  News Feed                                          [Export URLs] |
|  156 articles from 42 communities                                 |
+------------------------------------------------------------------+
|  Filters: [All Sources] [Last 24h / 7d / 30d] [Search...]        |
+------------------------------------------------------------------+
|                                                                    |
|  +--------------------------------------------------------------+ |
|  | [Token Logo] TokenName                           2 hours ago | |
|  | Article Title (clickable link)                               | |
|  | Source: coinspeaker.com                                      | |
|  | Description preview text...                                  | |
|  +--------------------------------------------------------------+ |
|  | (repeat for each article)                                    | |
+------------------------------------------------------------------+
```

### Features

- Group by token or show as flat chronological feed (toggle)
- Filter by recency (last 24h, 7 days, 30 days, all)
- Search articles by keyword
- Export all news URLs to clipboard or CSV
- Click article to open in new tab

---

## Tab 3: Websites & Outreach List

**Purpose**: Master list of all project websites for partnership outreach

### Layout

```text
+------------------------------------------------------------------+
|  Websites                                           [Export CSV]  |
|  38 project websites found                                        |
+------------------------------------------------------------------+
|  Search: [............................]                           |
+------------------------------------------------------------------+
|                                                                    |
|  Token Name      | Website                 | Twitter | News | Mcap |
|  ---------------------------------------------------------------- |
|  USD Coin        | circle.com              | @circle | 5    | $2B  |
|  Ethereum        | ethereum.org            | @ethe.. | 12   | $200B|
|  (sortable columns, filterable)                                   |
+------------------------------------------------------------------+
```

### Features

- Sortable by: name, market cap, news count, transaction count
- Export as CSV with all columns
- Copy all website URLs with one click

---

## Tab 4: Export Center

**Purpose**: One-stop shop for all export options

### Layout

```text
+------------------------------------------------------------------+
|  Export Center                                                    |
|  Download your outreach data in multiple formats                  |
+------------------------------------------------------------------+
|                                                                    |
|  PLATFORM HANDLES                                                 |
|  +-------------------+  +-------------------+  +------------------+|
|  | X / Twitter       |  | Telegram          |  | Reddit           ||
|  | 42 handles        |  | 28 handles        |  | 15 subreddits    ||
|  | [Copy] [CSV]      |  | [Copy] [CSV]      |  | [Copy] [CSV]     ||
|  +-------------------+  +-------------------+  +------------------+|
|                                                                    |
|  URLS                                                             |
|  +-------------------+  +-------------------+  +------------------+|
|  | Project Websites  |  | News Article URLs |  | Social Profiles  ||
|  | 38 URLs           |  | 156 URLs          |  | 93 URLs          ||
|  | [Copy] [CSV]      |  | [Copy] [CSV]      |  | [Copy] [CSV]     ||
|  +-------------------+  +-------------------+  +------------------+|
|                                                                    |
|  FULL EXPORT                                                      |
|  +--------------------------------------------------------------+ |
|  | Download Complete Dataset                                     | |
|  | All tokens with metadata, socials, news, and URLs            | |
|  | [Download CSV]  [Copy as JSON]                               | |
|  +--------------------------------------------------------------+ |
|                                                                    |
+------------------------------------------------------------------+
```

---

## Technical Implementation

### 1. Update API Types

**File: `src/lib/api.ts`**

Add `news_articles` to `ScanResultsTopToken`:

```typescript
export interface NewsArticle {
  title: string;
  url: string;
  source_name: string;
  source_domain: string;
  published_at: string;
  description: string | null;
  image_url: string | null;
}

export interface ScanResultsTopToken {
  // ... existing fields ...
  news_articles?: NewsArticle[];
}
```

### 2. Create New Components

**Files to create:**

| Component | Purpose |
|-----------|---------|
| `ScanResultsTabs.tsx` | Tab navigation container |
| `CommunitiesTab.tsx` | Enhanced version of current view |
| `NewsFeedTab.tsx` | Chronological news articles list |
| `WebsitesTab.tsx` | Table of all project websites |
| `ExportCenterTab.tsx` | All export options in one place |
| `NewsArticleCard.tsx` | Individual news article display |
| `ExportCard.tsx` | Reusable export action card |

### 3. Refactor ScanResults.tsx

- Replace current flat layout with tab-based navigation
- Add useMemo for aggregated news articles across all tokens
- Add useMemo for unique websites list
- Update state for active tab and tab-specific filters

### 4. Export Utilities

**Create utility functions:**

```typescript
// Download as CSV
const downloadCSV = (data: string[][], filename: string) => { ... }

// Copy to clipboard with toast feedback
const copyToClipboard = (text: string, successMessage: string) => { ... }

// Format data for different export types
const formatPlatformHandles = (tokens, platform) => { ... }
const formatNewsURLs = (tokens) => { ... }
const formatWebsites = (tokens) => { ... }
const formatFullExport = (tokens) => { ... }
```

### 5. Enhanced Filtering

Add new filter state:
- `hasNews: boolean | null`
- `hasWebsite: boolean | null`
- `platformFilter: "all" | "twitter" | "telegram" | "reddit" | "discord"`
- `newsRecency: "all" | "24h" | "7d" | "30d"`

---

## Files to Create/Modify

1. **Modify** `src/lib/api.ts` - Add NewsArticle interface
2. **Create** `src/components/scan-results/ScanResultsTabs.tsx`
3. **Create** `src/components/scan-results/CommunitiesTab.tsx`
4. **Create** `src/components/scan-results/NewsFeedTab.tsx`
5. **Create** `src/components/scan-results/WebsitesTab.tsx`
6. **Create** `src/components/scan-results/ExportCenterTab.tsx`
7. **Create** `src/components/scan-results/NewsArticleCard.tsx`
8. **Create** `src/components/scan-results/ExportCard.tsx`
9. **Create** `src/lib/export-utils.ts` - CSV/clipboard utilities
10. **Modify** `src/pages/ScanResults.tsx` - Integrate new tab structure
11. **Modify** `src/components/scan-results/PlatformTargetingCard.tsx` - Add news badges
12. **Modify** `src/components/scan-results/TargetingFilters.tsx` - Add new filter options

---

## User Experience Flow

1. **First Load**: Communities tab shows platform cards with enhanced data
2. **Explore News**: Click "News" tab to see all articles, filter by recency
3. **Build Outreach List**: Click "Websites" tab for sortable master list
4. **Export Everything**: Click "Export" tab for one-click export of any data type
5. **Quick Actions**: Each tab has its own "Copy All" / "Export" button for immediate action

---

## Export Options Summary

| Data Type | Format Options | Description |
|-----------|----------------|-------------|
| X Handles | Copy, CSV | @handle format for X Ads |
| Telegram Handles | Copy, CSV | Channel names for TG Ads |
| Reddit Subreddits | Copy, CSV | r/subreddit format |
| Discord Servers | Copy, CSV | Server invite codes |
| Project Websites | Copy, CSV | All unique project URLs |
| News URLs | Copy, CSV | All news article URLs |
| Social Profile URLs | Copy, CSV | Full URLs to all social profiles |
| Full Dataset | CSV, JSON | Complete token data with all fields |

