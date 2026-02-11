

## Phase 3: Kill Remaining Rounded Corners Everywhere

### Root Cause

The `Card` UI primitive in `src/components/ui/card.tsx` still has `rounded-lg` baked in. Every component using `<Card>` inherits rounded corners automatically. Combined with `rounded-full` icon circles and `rounded-lg` icon containers scattered throughout, the entire app still feels "pillowy" instead of flat like Dune.

### Nuclear Option: Fix the Source

**Change `card.tsx` from `rounded-lg` to `rounded-none`**. This single change eliminates rounded corners from every Card usage across the entire app in one stroke. No more hunting through 50+ files.

For the few places where rounding IS appropriate (e.g., avatar images, tiny badge pills), `rounded-full` on avatars is fine -- Dune does this too. But icon containers (the colored circles around Wallet/Twitter/etc icons) should become flat squares or be removed entirely.

### Changes

| File | What changes |
|------|-------------|
| `src/components/ui/card.tsx` | `rounded-lg` to `rounded-none` |
| `src/components/scan-results/ScanResultsStats.tsx` | Remove `Card` wrappers, use flat inline stats with `border-b`. Remove `rounded-full` icon circles. |
| `src/components/scan-results/PlatformTargetingCard.tsx` | Remove outer `Card` wrapper, use `border border-border` div instead. Keep token avatars as `rounded-full`. |
| `src/components/scan-results/ExportCard.tsx` | Remove `Card` wrapper, use `border-b` flat row. Remove `rounded-lg` icon container. |
| `src/components/scan-results/ExportCenterTab.tsx` | Remove `Card` wrapper from full export section. Remove `rounded-lg` icon container. |
| `src/components/scan-results/PROutletsSection.tsx` | Remove `Card` wrapper, use `border-t` section. Remove `rounded-lg` icon container. Fix `text-purple-600`/`bg-purple-500` to orange. |
| `src/components/scan-results/CommunitiesTab.tsx` | Remove `Card` wrapper from filter section. |
| `src/components/scan-results/XAdsIntegration.tsx` | Remove `rounded-full` icon circle. |
| `src/components/scan-results/NewsArticleCard.tsx` | Keep `rounded-lg` on article cards (these are content cards, acceptable). |
| `src/pages/ScanResults.tsx` | Remove `Card` from error state, use plain div. Remove `rounded-full` error icon circle. |
| `src/pages/ScanDetail.tsx` | Remove `rounded-lg` from stat grid items. |

### Summary

- 1 global primitive change (`card.tsx` rounded-lg to rounded-none)
- 8 scan-results component flattening passes (remove Card wrappers, remove icon circles)
- 2 page-level fixes (ScanResults.tsx, ScanDetail.tsx)
- Purple color fixes in PROutletsSection

This will make the scan results page and all other Card-using pages completely flat.

