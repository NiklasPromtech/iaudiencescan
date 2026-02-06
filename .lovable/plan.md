

# Landing Page V3: Visual Expansion -- Talk With Visuals, Sell With Words

## Overview

Major content expansion of `src/pages/LandingPageV3.tsx` to add rich, interactive mock UI elements that replicate the actual platform experience. Every section gets a visual companion that shows the product in action with realistic dummy data.

---

## New Visual Elements (6 additions)

### 1. Daily Metrics Bar Chart (After Dashboard Preview, ~line 217)

A mock recreation of the real `DailyChart` component using recharts `BarChart`. Shows 7 days of dual-axis data:
- Purple bars: Page Views (left axis)
- Dark bars: Wallet Extensions (right axis)
- Proper axis labels, formatted dates

Mock data (7 days):

```
Mon Jan 27: 1,842 views / 612 extensions
Tue Jan 28: 2,105 views / 734 extensions
Wed Jan 29: 1,678 views / 589 extensions
Thu Jan 30: 3,412 views / 1,204 extensions  (spike day)
Fri Jan 31: 2,891 views / 987 extensions
Sat Feb 1:  1,456 views / 498 extensions
Sun Feb 2:  1,203 views / 421 extensions
```

A subtle "Touchpoint" marker on Thu Jan 30 labeled "KOL Campaign Launch" to demo the incrementality feature. Styled as a small diamond marker with a tooltip-style label.

Caption below: "Daily Metrics -- dual axis comparison with touchpoint markers"

### 2. Token Holder Trend Chart (Inside Section 5, the CPB section)

A mock `LineChart` showing 30 days of token holder growth. Visualizes the "See Wallet Value" narrative with a real chart instead of just text.

Mock data: 30 points from ~8,200 holders trending up to ~9,450 with a visible uptick around day 20 (labeled "Exchange Listing").

Placed between the section headline and the With/Without comparison cards. Uses the same recharts `LineChart` with a smooth monotone curve, purple stroke, and subtle gradient fill area.

Caption: "Token holders across all tracked contracts -- 30 day trend"

### 3. Investment Grade Badges (Inside Dashboard Preview table, ~line 202)

Add a "Grade" column to the existing mock dimension table. Each source row gets a letter grade (A+, A, B, C, D, F) using color-coded badges matching the real `InvestmentGradeBadge` styles:

- twitter_ads: A (green)
- telegram_promo: B (blue)
- kol_campaign: D (orange) -- high bot rate
- organic: A+ (bright green) -- best quality
- coindesk_banner: F (red) -- 67% bots

This instantly communicates the "investment quality" concept.

### 4. Rich Platform Targeting Cards (Replace simple scan results tabs in Section 6)

Replace the current minimal tabbed list with a richer 2x2 grid of platform cards that mirrors the real `PlatformTargetingCard` component. Each card has:

- Platform icon + color header (X = sky, Telegram = blue, Reddit = orange, Discord = indigo)
- "N communities found" subtitle
- 3-4 sample token rows with: token symbol avatar (2-letter circle), token name, handle, and a market cap badge
- "Copy All" and "Create Campaign" button placeholders (disabled, for visual effect)

Mock tokens per platform (realistic Web3 names):

**X / Twitter (8 communities)**:
- Chainlink (LINK) -- @chainlink -- $8.2B
- Aave (AAVE) -- @aabornyakov -- $1.4B  
- Uniswap (UNI) -- @uniswap -- $5.8B
- Arbitrum (ARB) -- @arbitrum -- $2.1B

**Telegram (6 communities)**:
- Render (RNDR) -- render_network -- $3.2B
- Optimism (OP) -- optimism -- $1.8B
- Polygon (MATIC) -- polygonofficial -- $4.1B

**Reddit (4 communities)**:
- Ethereum (ETH) -- r/ethereum
- Solana (SOL) -- r/solana
- Cosmos (ATOM) -- r/cosmosnetwork

**Discord (3 communities)**:
- Lido (LDO) -- Lido DAO
- Maker (MKR) -- MakerDAO
- Curve (CRV) -- Curve Finance

### 5. News Feed Preview (New section between Section 6 and Social Proof)

A compact mock of the `NewsFeedTab` showing 4-5 recent articles. Each article card has:
- Token logo (2-letter circle), token name
- Article title (realistic headlines)
- Source domain + relative time ("2h ago", "1d ago")
- A small "PR Outlets" sidebar showing 3 source domains with article counts

Mock articles:
- "Chainlink Expands Cross-Chain Services to Base Network" -- CoinDesk -- 2h ago
- "Uniswap Labs Proposes New Fee Structure for V4" -- The Block -- 6h ago
- "Arbitrum DAO Approves $50M Gaming Catalyst Fund" -- Decrypt -- 1d ago
- "Aave Deploys Lending Markets on zkSync Era" -- CryptoSlate -- 2d ago

Caption: "Aggregated news feed -- filter by recency, search, or export for PR outreach"

### 6. Bot Detection Expansion (Enhance Section 3)

Add a mock "Bot Summary" row above the existing signal table, mirroring `BotSummaryCards`:

Three cards side by side:
- Bots: 2,847 (23.1%) -- red icon
- Humans: 8,934 (72.5%) -- purple icon  
- Unknown: 546 (4.4%) -- gray icon

This gives instant visual impact before the detailed signal breakdown.

---

## Technical Details

### File Modified

`src/pages/LandingPageV3.tsx` -- Single file, all changes inline

### New Imports Needed

From `recharts` (already installed):
- `BarChart`, `Bar`, `LineChart`, `Line`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer`, `Area`, `AreaChart`

From `lucide-react` (already installed):
- `User`, `HelpCircle`, `MessageCircle`, `ExternalLink`, `Copy`, `Rocket`, `Diamond`

### New Mock Data Arrays

All hardcoded inline in the file:

- `mockDailyChart` -- 7 objects with date/views/extensions
- `mockHolderTrend` -- 30 objects with date/holders
- `mockPlatformTokens` -- object with twitter/telegram/reddit/discord arrays, each token having name/symbol/handle/marketCap
- `mockNewsArticles` -- 4-5 objects with token/title/source/timeAgo
- `mockBotSummary` -- 3 values for bots/humans/unknown
- Add `grade` field to existing `mockDimensionRows`

### What Stays the Same

- All existing sections (structure preserved, visuals added within)
- Header, Footer, route
- All existing mock data (scorecard, cost table, scan tabs are enhanced not replaced)
- The GA comparison table, With/Without cards, How It Works, CTAs

### Recharts Usage

Uses `ResponsiveContainer` wrapping `BarChart` and `AreaChart` with basic styling matching the platform's chart colors (purple primary, foreground secondary). No `ChartContainer` wrapper needed for the landing page mocks -- simpler inline approach.

