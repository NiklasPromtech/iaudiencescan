

# Fix Page Grouping to Preserve Chronological Order

## Problem

The current `groupByPage` function uses a Map to collect all events by page path. This means if a user navigates `/` then `/en/swap` then back to `/`, all the `/` events get merged into one group and all `/en/swap` events into another. The chronological story is completely lost.

## Solution

Replace the Map-based grouping with **sequential grouping**: walk through events in timestamp order and start a new page group every time the page path changes from the previous event. If the user visits the same page twice at different points, it appears as two separate groups.

**Before (broken):**
```
/                          <- all / events merged
  15:36 Clicked "Launch App"
  15:43 Clicked "Launch App"
  15:58 Clicked "Launch App"

/en/swap                   <- all /en/swap events merged
  15:42 Clicked "Swap"
  15:58 Clicked "Earn"
```

**After (chronological):**
```
/
  15:36 Clicked "Launch App"

/en/swap
  15:42 Clicked "Swap"
  15:42 Clicked "BOB"

/en/
  15:42 Clicked "Swap now"

/en/swap
  15:43 Clicked "Stake"

/
  15:43 Clicked "Launch App"

...and so on in exact order
```

## Technical details

### File: `src/components/wallets/WalletJourneyTab.tsx`

**Rewrite `groupByPage` function (lines 229-243):**

Replace the Map-based approach with sequential grouping:

```typescript
function groupByPage(nested: NestedItem[], fallbackPage: string): PageGroup[] {
  const groups: PageGroup[] = [];
  let current: PageGroup | null = null;

  for (const item of nested) {
    const path = getItemPagePath(item, fallbackPage);
    if (!current || current.pagePath !== path) {
      current = { pagePath: path, items: [] };
      groups.push(current);
    }
    current.items.push(item);
  }

  return groups;
}
```

This relies on the fact that `nested` is already sorted chronologically (which it is -- `buildTimeline` sorts by timestamp at line 178). Each time the page path differs from the previous event, a new group starts. Same page visited later gets its own separate group.

No other files or functions need to change -- the rendering code already iterates over the groups array in order.

