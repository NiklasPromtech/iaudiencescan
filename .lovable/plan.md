

## Dune-ify the Scan Results Page

Restyle the `/scans/[id]/results` page to match the platform's Dune-inspired aesthetic and the tab pattern from the Overview page.

### Changes

#### 1. ScanResults.tsx -- Page layout and tabs

- **Title**: Change from "Outreach Command Center" to the scan name (e.g., "US wallets"). Use `font-mono` for the subtitle metadata.
- **Tabs**: Replace the current `TabsList` (grid-based, rounded, muted bg) with the Overview-style tabs:
  - Wrap tabs in `border border-border`
  - `TabsList` uses `w-full justify-start border-b border-border bg-transparent p-0`
  - Each `TabsTrigger` uses `font-mono text-xs uppercase tracking-widest data-[state=active]:bg-muted/50 px-4 py-3`
  - Tab content inside the same border container with `p-4`
- **News count badge**: Style with `font-mono tabular-nums text-muted-foreground` inline (matching Overview pattern) instead of a colored pill.

#### 2. ScanResultsStats.tsx -- Already good

The stat row already uses `font-mono`, `divide-x`, and `border-b` -- this matches the Dune style. No changes needed.

#### 3. SummaryBadges.tsx -- Fix purple violation

The PR Outlets badge uses `bg-purple-500/10 text-purple-600` which violates the color palette (no purple). Change to `bg-stone-500/10 text-stone-600` or use primary orange. Also apply `font-mono text-xs` to badge text for consistency.

#### 4. CommunitiesTab.tsx -- Filter section typography

- "Filter Communities" heading: add `font-mono text-xs uppercase tracking-widest`
- Filter labels already use `text-xs text-muted-foreground` which is fine

#### 5. PlatformTargetingCard.tsx -- Remove Card wrapper, flatten

- Replace `Card` with a plain `div` using `border border-border` (no rounded corners)
- Remove the colored `bgColor` header backgrounds -- use a flat `border-b border-border` separator instead
- Token names: add `font-mono` to handles/metadata
- Market cap badges: use `font-mono tabular-nums`

#### 6. NewsFeedTab.tsx -- Remove Card wrappers

- Filter section: replace `Card className="p-4"` with `border border-border p-4`
- Empty state: replace `Card` with `border border-border`
- Section headers: add `font-mono text-xs uppercase tracking-widest`

#### 7. NewsArticleCard.tsx -- Flatten

- Replace `border border-border rounded-lg` with `border-b border-border` (row-based, no individual card wrappers)
- Add `font-mono text-xs` to source domain and timestamp

#### 8. WebsitesTab.tsx -- Remove Card wrapper from table

- Replace `Card className="overflow-hidden"` with `border border-border overflow-hidden`
- Table headers: add `font-mono text-xs uppercase tracking-widest`
- Data cells: add `font-mono tabular-nums` to numeric values

#### 9. PROutletsSection.tsx -- Remove rounded corners

- Already uses `border-t` which is good. Add `font-mono text-xs` to article count text.

#### 10. ExportCenterTab.tsx -- Section headers

- Section headers already use `uppercase tracking-wide` -- update to `font-mono text-xs uppercase tracking-widest` for consistency
- Export card grid items are already flat (`border-b`), which is correct

### Technical summary

- ~10 files touched, all in `src/components/scan-results/` and `src/pages/ScanResults.tsx`
- Primarily CSS class changes -- no logic or data changes
- Aligns with the Overview page tab pattern that's already working well
- Eliminates all `rounded-lg` / Card wrappers in favor of flat `border border-border` containers
- Enforces `font-mono` on all data-oriented text (handles, counts, metadata)
- Fixes the purple color violation in SummaryBadges
