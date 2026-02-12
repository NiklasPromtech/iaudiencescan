

## Fix Multiple UI Issues Across Landing Page, Network, Wallets, and Scans

### Issues Identified

**1. GA Comparison table doesn't stretch to full height**
The "Google Analytics vs AudienceScan" card (left) is shorter than the "Bot Detection" card (right). The card needs `h-full flex flex-col` and the rows container needs `flex-1` so it fills the available space to match the Bot Detection card height.

**2. Landing page "Find More Users" section — mock data is sparse**
The user provided a JSON file with ~50+ real tokens including rich social data (twitter, telegram, discord, reddit, news articles). The current `mock-data.ts` only has 4 Twitter tokens, 3 Telegram tokens, 3 Discord tokens, and 1 Reddit token. We need to update the mock data to include more entries derived from the uploaded JSON to fill out the platform cards and news feed on the landing page.

**3. Network page back button is off**
The back button is positioned at `fixed bottom-6 left-6` — overlapping the stats panel which is also at `absolute bottom-6 left-6`. The back button needs to be repositioned (e.g., top-left) to avoid overlap.

**4. Wallets page scorecards are old-style Card components**
The `/wallets` page uses 6 individual `Card` components with `CardHeader/CardContent` — the old style. Per the layout standards, these should be converted to the flat inline stat row with vertical dividers (matching the dashboard overview and landing page scorecard pattern): a single horizontal strip with dividers, using `font-mono` labels.

**5. Scans page feels off**
The scans list items use plain `border-b` rows with no card wrapper, making them float without structure. Adding a subtle card border around the list group and tightening spacing will give it a more polished feel. Also apply `font-mono` styling to metadata text for consistency.

---

### Detailed Changes

#### File: `src/pages/LandingPageV3.tsx`
- **GA Comparison card** (~line 203): Add `h-full flex flex-col` to the outer div. Add `flex-1` to the rows container div so rows stretch to match the Bot Detection card.

#### File: `src/components/landing/mock-data.ts`
- Update `mockPlatformTokens` to include more tokens per platform derived from the uploaded JSON:
  - Twitter: expand from 4 to ~8 tokens (USDC, Chainlink, Ondo, Tether Gold, Paxos Gold, Aave, Mantle, Lido)
  - Telegram: expand from 3 to ~6 tokens
  - Discord: expand from 3 to ~5 tokens
  - Reddit: expand from 1 to ~3 tokens
- Update `mockNewsArticles` to include more articles from the JSON (expand from 5 to ~8-10)
- Update `mockPROutlets` to include more outlets from the JSON data

#### File: `src/pages/Network.tsx`
- Move the back button from `fixed bottom-6 left-6` to `fixed top-6 left-6` so it doesn't overlap the stats panel.

#### File: `src/pages/Wallets.tsx`
- Replace the 6-card grid (lines 270-369) with a single flat inline stat row using `flex items-center divide-x divide-border border-b border-border` — matching the pattern used in `ScanResultsStats` and the landing page scorecards. Each stat becomes a `div` with `font-mono` labels and bold values. Remove the Card/CardHeader/CardContent wrapper.

#### File: `src/pages/Scans.tsx`
- Wrap the active scans list in a `border border-border rounded-lg overflow-hidden` container for visual grouping.
- Apply `font-mono text-xs` to metadata text (wallet count, chain, time) for consistency.
- Apply `font-mono` styling to the page title/subtitle.

