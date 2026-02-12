

## Clean Up the Events / Wallets / Extensions Section

### Problem

The three tables (Conversion Events, Wallet Actions, Wallet Extensions) sit side-by-side in a 3-column grid. Each has its own icon, heading, count badge, full table headers, and expand button -- creating visual clutter. The columns are cramped (5 columns squeezed into 1/3 width for Events), dates wrap awkwardly, and the section feels disjointed.

### Solution

Replace the 3-column grid with a **tabbed layout** inside a single bordered container. One tab per data type, clean and focused.

```text
+----------------------------------------------------------+
| [Conversion Events]  [Wallet Actions]  [Wallet Extensions]|
|                                                          |
|  EVENT          TOTAL    UNIQUE    FIRST SEEN  LAST SEEN |
|  click            458      161    Feb 6       Feb 9      |
|  wallet_detected  212       96    Feb 6       Feb 9      |
|                                                          |
|  2 event types                     [View all 5 more v]   |
+----------------------------------------------------------+
```

### Changes

**1. `src/pages/Overview.tsx`** (lines 584-601)

Replace the `grid md:grid-cols-3` wrapper with a single `Tabs` component containing three `TabsTrigger` items and three `TabsContent` panels, one for each table. Each trigger shows the section name plus a count badge (e.g. "Conversion Events (2)").

Remove the per-table icon + heading chrome since the tab itself serves as the label.

**2. `src/components/overview/EventsTable.tsx`**

- Remove the outer `py-4` wrapper, icon + heading row, and "X event types" count badge (these move to the tab trigger)
- Keep only the table + expand button
- Add a `compact` or `embedded` mode: no icon/title header, just the table content

**3. `src/components/overview/WalletsOverviewTable.tsx`**

Same treatment -- strip the icon/heading/count chrome; keep table + expand.

**4. `src/components/overview/WalletExtensionsTable.tsx`**

Same treatment -- strip the icon/heading/count chrome; keep table + expand.

### Approach: Add `hideHeader` prop

Rather than restructuring each component heavily, add an optional `hideHeader?: boolean` prop to all three table components. When `true`, the icon + title + count row is hidden, rendering only the table and expand button. This keeps the components reusable if needed standalone elsewhere.

### Technical Details

| File | Change |
|------|--------|
| `src/pages/Overview.tsx` | Import `Tabs, TabsContent, TabsList, TabsTrigger` from `@/components/ui/tabs`. Replace lines 584-601 grid with a `Tabs` defaultValue="events" containing 3 triggers and 3 content panels. Each trigger shows label + count badge. Pass `hideHeader={true}` to each table. |
| `src/components/overview/EventsTable.tsx` | Add `hideHeader?: boolean` prop. When true, skip the icon/title/count row. |
| `src/components/overview/WalletsOverviewTable.tsx` | Add `hideHeader?: boolean` prop. When true, skip the icon/title/count row. |
| `src/components/overview/WalletExtensionsTable.tsx` | Add `hideHeader?: boolean` prop. When true, skip the icon/title/count row. |

The tab triggers will use `font-mono text-xs uppercase tracking-widest` to match the established dashboard typography. Each trigger badge shows the count in `font-mono tabular-nums`.

