

# Day 1 + Week 1 Implementation Plan

## Task 1: Fix Hero Animation (crossfade approach)

Replace the broken `translateX` slide animation with a simple opacity crossfade in `LandingPageV3.tsx`. This completely avoids CSS transform conflicts.

**Changes:**
- `src/pages/LandingPageV3.tsx`: Replace the `animate-hero-slide-out-right` / `animate-hero-slide-in-left` classes with new `animate-hero-fade-out` / `animate-hero-fade-in` classes. Remove `top-1/2 -translate-y-1/2` (no transforms needed). Both layers stay `absolute inset-0 flex items-center justify-center`.
- `tailwind.config.ts`: Add two new keyframes (`hero-fade-out`: opacity 1 to 0; `hero-fade-in`: opacity 0 to 1) and their animation entries (0.6s each). Remove the old `hero-slide-out-right` and `hero-slide-in-left` keyframes and animations.

## Task 2: Delete Dead Pages + Orphaned Components

Delete 33 page files (keeping `SDTerms.tsx`) and 3 orphaned components:

**Pages to delete:**
```text
AI.tsx, Artifact.tsx, Confidence.tsx, Creation.tsx,
CreateScan.tsx, DMAssistant.tsx, GADune.tsx, GADune2.tsx,
Index.tsx, LandingPageV2.tsx, LinkedInAds.tsx,
ManagedService.tsx, Merge.tsx, Network.tsx,
NetworkAgency.tsx, NoNiche.tsx, NoNicheV2.tsx, NoNicheV3.tsx,
PlaceholderAI.tsx, PlaceholderConfidence.tsx, Pricing.tsx,
ProposedFeatures.tsx, SalesPitch.tsx, Sample1.tsx,
StrategyPlaybook.tsx, Video.tsx, Video1.tsx,
VideoWhite.tsx, Wizard.tsx, WizardMobile.tsx, WizardV2.tsx,
XAdsAgency.tsx, XData.tsx
```

**Orphaned components to delete** (only imported by deleted pages):
```text
src/components/AsteroidFieldAnimation.tsx
src/components/ConfidenceAnimation.tsx
src/components/AIChatAnimation.tsx
src/components/AgencyHowPanel.tsx
```

## Task 3: Add React.lazy() Code Splitting to App.tsx

Wrap all ~25 active route components in `React.lazy()` with dynamic imports. Add a `<Suspense>` wrapper around `<Routes>` with a minimal loading fallback (centered spinner). This splits the bundle so each page loads on demand.

## Task 4: Extract Overview State into useOverviewData Hook

Create `src/hooks/use-overview-data.ts` containing all state and logic currently in `Overview.tsx` (lines 54-565):
- All 30+ `useState` declarations
- `getFiltersParam`, `getDateRangeLabel`, `getRangeConfig`, `getPreviousRangeConfig`
- `handleStartComparison`, `handleExitComparison`
- `loadAllData`, `loadTableData`, `fetchComparisonTableData`
- Both `useEffect` hooks (data loading + realtime polling)
- `tokenHoldersTotal` computation and merged `data` object

The hook returns all state values and handler functions. `Overview.tsx` becomes a pure rendering component calling `const { ... } = useOverviewData()`.

## Task 5: Split api.ts into Domain Modules

Split the 1,866-line `src/lib/api.ts` into focused modules:

```text
src/lib/api/client.ts        -- getAuthToken, apiRequest, API_BASE_URL, ANALYTICS_API_URL
src/lib/api/websites.ts      -- Website types + CRUD + sharing + accessible
src/lib/api/analytics.ts     -- Scorecard, Table, Overview, Realtime, Filtering types + fetchers
src/lib/api/bots.ts           -- Bot analytics types + fetchBotAnalytics
src/lib/api/wallets.ts        -- Wallet types + fetchWallets, enrichWallets, fetchWalletBalances, journey types
src/lib/api/scans.ts          -- Scan types + CRUD + results
src/lib/api/audiences.ts      -- Audience types + CRUD
src/lib/api/costs.ts           -- CostSource types + CRUD + template download
src/lib/api/queries.ts         -- Query schema + execute
src/lib/api/index.ts           -- Barrel re-export of everything
```

The barrel `index.ts` re-exports all symbols so existing `import { ... } from '@/lib/api'` imports continue working. Zero changes needed in consuming files.

