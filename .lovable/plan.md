

# Landing Page Overhaul — 100,000x Better

## Problems with the Current Page

1. **Logo**: The dark pill with an inverted tiny image looks cheap and unbranded. It needs a proper text wordmark like Dune does (clean text, no image forcing).
2. **Hero is generic**: Soft gradient + text feels like every SaaS template. No visual punch.
3. **Too many sections**: 8 distinct content blocks create fatigue. Needs consolidation.
4. **Dashboard preview looks like a prototype**, not a real product. Small text, thin borders, no depth.
5. **Charts are underwhelming**: Small, simple, no interactivity feel.
6. **No visual storytelling**: It's all text blocks with icons. Dune uses the product itself as the hero.
7. **Stats bar is buried**: The "10+ Chains / 50+ Clients" bar is forgettable.
8. **Social proof is weak**: A scrolling logo bar with tiny grayscale logos — easy to miss.

## The Fix — Key Design Moves

### 1. Logo: Clean Text Wordmark
- Remove the dark pill with the forced inverted image
- Replace with a simple, bold text wordmark: **AudienceScan** in the nav using a small icon (the square logo from `audiencescan-icon.png`) + text in `font-semibold`
- No dark pill background — just the icon + wordmark sitting cleanly in the nav, like how Dune shows their logo

### 2. Hero: Product-Led, Not Copy-Led
- Instead of gradient background + text + buttons, make the **dashboard preview THE hero**
- Structure: Short headline + subtitle at top, then immediately show a large, impressive full-width dashboard screenshot/mock below
- The dashboard mock becomes the centerpiece — floating with a subtle shadow, slightly overlapping the hero gradient
- Reduce the hero text to 1 headline + 1 line of copy + 1 CTA button (not two)

### 3. Consolidate Sections (from 8 to 5)
- **Hero** (headline + dashboard preview)
- **Social proof bar** (logos, integrated tightly under the hero)
- **Three value pillars** (GA comparison + Bot Detection + Wallet Intelligence — as a tabbed or stacked bento grid, not 3 separate full sections)
- **Audience Intelligence** (the "find more like them" section — keep as-is but tighter)
- **Final CTA** (simple, clean)
- Remove: "8 Things You Can Do Today" (redundant with pillars), "How It Works" numbered steps (move to a tooltip or collapse), separate "Cost Attribution" table

### 4. Dashboard Preview: Full-Width, Impressive
- Make the mock dashboard wider (max-w-6xl) with more visual depth
- Add a subtle dark top bar (like a browser chrome) to frame it as a real app
- Larger stat numbers with colored accent lines under each card
- Make the table rows slightly taller with better spacing
- The chart below gets integrated INTO the dashboard frame, not as a separate component

### 5. Bento Grid for Features
- Replace the 4x2 capability grid + separate sections with a **bento grid** layout
- 2 large cards (GA comparison + Bot detection) + 2-3 smaller cards (Wallet enrichment, Cost attribution, Audience scan)
- Each card has a mini-visualization inside it (not just icon + text)

### 6. Social Proof: Stronger
- Move client logos directly under the hero dashboard preview
- Add a quote card from the legal claim testimonial alongside the logos
- Make logos larger and not grayscale by default

### 7. Typography & Spacing Polish
- Hero headline: larger (text-6xl to text-7xl on desktop)
- More whitespace between sections
- Tighter line-heights on body copy

## Technical Details

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/Header.tsx` | Replace dark pill logo with icon + text wordmark. Clean up nav styling. |
| `src/pages/LandingPageV3.tsx` | Major restructure: product-led hero with floating dashboard, consolidated bento sections, remove redundant sections, stronger social proof placement |
| `src/components/landing/MockDailyChart.tsx` | Integrate into dashboard frame, slightly taller chart |
| `src/components/landing/MockBotSummary.tsx` | Restyle as a compact bento card with donut chart instead of 3 cards |
| `src/components/landing/MockHolderTrend.tsx` | Taller, more prominent, integrated into bento |
| `src/components/landing/MockPlatformCards.tsx` | Minor styling updates to match new card style |
| `src/index.css` | Tweak hero gradient to be even softer, add browser-chrome styling |

### What Stays
- Footer (already good)
- Color palette (warm orange works)
- Font choices (DM Serif + Space Mono)
- Mock data (realistic and good)
- Mobile responsiveness approach

### New Component
- `src/components/landing/DashboardFrame.tsx` — A wrapper that adds browser-chrome styling (dark top bar with dots) around the dashboard preview to make it look like a real app window

