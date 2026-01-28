
# Plan: Create Scan Results Page

## Overview

Create a new dedicated results page at `/scans/:scanId/results` that displays completed scan data in a more useful, actionable format. The network chart will be included as a visual element but the focus will be on actionable data tables and insights.

## Design Philosophy

The current Network page is primarily visual - it shows tokens as nodes connected by edges, which is aesthetically pleasing but hard to extract actionable insights from. The new page will:

1. **Lead with actionable data** - Top tokens table with social links, prices, and targeting opportunities
2. **Include the network graph** - As a secondary visual element, not the main focus
3. **Provide quick stats** - Summary cards showing what was discovered
4. **Enable actions** - Links to Twitter/X accounts, websites, and potential ad targeting

## Page Structure

```text
+------------------------------------------------------------------+
|  < Back to Scan Details                    [View Network Full]   |
+------------------------------------------------------------------+
|                                                                   |
|  Scan Results: "My Audience Scan"                                |
|  BNB Chain • 100 wallets analyzed • Completed 2 hours ago        |
|                                                                   |
+------------------+-------------------+-------------------+--------+
|   Wallets        |   Tokens Found    |  Tokens Enriched  | Social |
|   Processed      |                   |                   | Signals|
|      100         |       250         |        50         |   25   |
+------------------+-------------------+-------------------+--------+
|                                                                   |
|  +------------------------+  +----------------------------------+ |
|  |   NETWORK CHART        |  |  TOP TOKENS                      | |
|  |   (Compact View)       |  |  +-------------------------------+| |
|  |                        |  |  | Logo | Symbol | Wallets |Price|| |
|  |   [ token nodes ]      |  |  |------|--------|---------|-----|| |
|  |                        |  |  | ETH  |  ETH   |   45    |$3200|| |
|  |                        |  |  | BNB  |  BNB   |   38    |$320 || |
|  |                        |  |  | USDT |  USDT  |   32    |$1.00|| |
|  |                        |  |  +-------------------------------+| |
|  +------------------------+  +----------------------------------+ |
|                                                                   |
|  TARGETING OPPORTUNITIES                                          |
|  +---------------------------------------------------------------+|
|  | Token  | Twitter     | Website     | News | Action            ||
|  |--------|-------------|-------------|------|-------------------||
|  | ETH    | @ethereum   | ethereum.org|  5   | [Add to Audience] ||
|  | BNB    | @BNBCHAIN   | bnbchain.org|  3   | [Add to Audience] ||
|  +---------------------------------------------------------------+|
+------------------------------------------------------------------+
```

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/api.ts` | Modify | Add scan results types and `getScanResults()` function |
| `src/pages/ScanResults.tsx` | Create | New results page with summary stats, compact network, and token tables |
| `src/App.tsx` | Modify | Add route for `/scans/:scanId/results` |
| `src/pages/ScanDetail.tsx` | Modify | Change "View Results" button to navigate to new page instead of `/network/:id` |
| `src/pages/Scans.tsx` | Modify (optional) | Update to show inline progress with `step_label` |

## Technical Details

### 1. API Types (src/lib/api.ts)

Add new types for scan results:

```typescript
export type ScanStep =
  | "QUEUED"
  | "FETCHING_BALANCES"
  | "FETCHING_TRANSACTIONS"
  | "BUILDING_NETWORK"
  | "ENRICHING_SOCIALS"
  | "FETCHING_NEWS"
  | "FINALIZING"
  | "DONE";

// Update existing Scan interface
export interface Scan {
  id: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  step: ScanStep;        // NEW
  step_label: string;    // NEW
  progress: number;
  wallet_count: number;
  processed_count: number;
  chain: string;
  name: string | null;
  audience_id: string | null;
  website_id: string | null;
  error: string | null;
  created_at: string;
  completed_at: string | null;
}

// New results types
export interface ScanResultsNetworkNode {
  token_address: string;
  token_name: string;
  token_symbol: string;
  token_logo_url: string;
  transaction_count: number;
  unique_wallets: number;
}

export interface ScanResultsNetworkEdge {
  source: string;
  target: string;
  weight: number;
}

export interface ScanResultsTopToken {
  token_address: string;
  token_symbol: string;
  token_name?: string;
  token_logo_url?: string;
  website: string;
  twitter: string;
  description: string;
  current_price_usd: number;
  market_cap_usd: number;
  news_count: number;
  unique_wallets?: number;
}

export interface ScanResultsResponse {
  scan_id: string;
  status: string;
  wallets_processed: number;
  tokens_found: number;
  tokens_enriched: number;
  network: {
    nodes: ScanResultsNetworkNode[];
    edges: ScanResultsNetworkEdge[];
  };
  top_tokens: ScanResultsTopToken[];
}

export async function getScanResults(scanId: string): Promise<ScanResultsResponse> {
  // Fetch from /api/scans/:id/results
}
```

### 2. Results Page Components (src/pages/ScanResults.tsx)

The page will have these sections:

**Header Section:**
- Back button to scan detail
- Scan name and metadata
- Link to view full network visualization

**Summary Stats Row:**
- Four stat cards: Wallets Processed, Tokens Found, Tokens Enriched, Social Signals
- Use the existing Card component styling

**Main Content (Two Columns on Desktop):**

**Left Column - Compact Network Graph:**
- Smaller version of the network visualization
- Uses the same SVG rendering logic as Network.tsx but in a contained card
- Shows top 30-40 nodes for performance
- Click to expand or navigate to full network view

**Right Column - Top Tokens Table:**
- Sortable table showing discovered tokens
- Columns: Logo, Symbol, Name, Unique Wallets, Price
- Limited to 10 rows with "View all" expansion

**Targeting Opportunities Section (Full Width):**
- Table showing tokens with social/web presence
- Columns: Token, Twitter Handle (linked), Website (linked), News Count, Actions
- Filter to only show tokens with social data
- "Add to Audience" button for future functionality

### 3. Update ScanDetail Navigation

Change the "View Results" button destination:
```typescript
// Before
<Button onClick={() => navigate(`/network/${scan.id}`)}>
  View Results
</Button>

// After
<Button onClick={() => navigate(`/scans/${scan.id}/results`)}>
  View Results
</Button>
```

### 4. Route Configuration (App.tsx)

Add new route:
```typescript
<Route path="/scans/:scanId/results" element={<ScanResults />} />
```

## UI Components Breakdown

**ScanResults Page Structure:**
```typescript
const ScanResults = () => {
  const { scanId } = useParams();
  const [scan, setScan] = useState<Scan | null>(null);
  const [results, setResults] = useState<ScanResultsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch both scan metadata and results
  useEffect(() => {
    Promise.all([getScan(scanId), getScanResults(scanId)])
      .then(([scanData, resultsData]) => {
        setScan(scanData);
        setResults(resultsData);
      })
      .finally(() => setLoading(false));
  }, [scanId]);
  
  return (
    <DashboardLayout>
      {/* Header with back button */}
      {/* Summary stat cards */}
      {/* Two-column layout: Network + Token table */}
      {/* Targeting opportunities table */}
    </DashboardLayout>
  );
};
```

## Implementation Order

1. **Update API types** - Add ScanStep, update Scan interface, add results types and function
2. **Create ScanResults page** - Build out the new page with all sections
3. **Add route** - Register the new route in App.tsx
4. **Update ScanDetail** - Change navigation to use new results page
5. **Update Scans list** (optional) - Add inline step_label progress display

## Bonus: Update Scans List with Progress

While in the scan-related files, also update the Scans list page to show:
- `step_label` text for processing scans
- Mini progress bar inline with the scan card
- Auto-refresh when active scans exist

This provides better visibility into scan progress without needing to drill into details.
