

# Improve Wallet Tier Filter Dropdown Readability

## Problem

The Wallet Tier dropdown looks identical to every other text filter (Source, Campaign, etc.), but tiers are hierarchical financial ranges that benefit from visual context. The raw "$1 - $100" text with a count feels flat and hard to scan.

## Solution

Add a subtle horizontal bar behind each tier row that represents its relative proportion of the total count. This gives immediate visual weight to each tier without adding clutter. Additionally, add a small muted label describing the tier (e.g., "Micro", "Small", "Mid", "Large", "Whale") in a secondary text style.

The approach:
- Introduce a `renderOption` callback prop on `FilterButton` (optional) so wallet tiers can have a custom row layout while all other filters stay unchanged.
- For the Wallet Tier section specifically, each row renders:
  - A background proportional bar (very subtle, using `primary/5` opacity) spanning the percentage of that tier relative to the total
  - The tier value label (e.g., "$1 - $100")
  - A small muted descriptor word (e.g., "Micro") right-aligned before the count
  - The count, same as other filters

### Visual layout per row (Wallet Tier only)

```text
[x] $1 - $100          Micro      135
    |====== 42% bar ===============|
```

The bar sits behind the text as an absolutely-positioned element. The descriptor labels are:

| Tier | Descriptor |
|---|---|
| $0 | Zero balance |
| $1 - $100 | Micro |
| $100 - $1K | Small |
| $1K - $10K | Mid |
| $10K - $100K | Large |
| $100K+ | Whale |
| Not enriched | Unknown |

## Technical Details

### Files modified

**`src/components/overview/FilterDialog.tsx`**

1. Add a `WALLET_TIER_LABELS` map with the descriptor words above
2. Add an optional `renderCustomLabel` prop to `FilterButton` -- a function `(option: FilterOptionItem, allOptions: FilterOptionItem[]) => ReactNode`
3. In the Wallet Tier section of `FILTER_SECTIONS`, wire up a custom renderer
4. The custom renderer:
   - Calculates `percentage = option.count / totalCount * 100`
   - Renders a `<div className="absolute inset-y-0 left-0 bg-primary/5">` with `width: ${percentage}%`
   - Renders the tier descriptor in `text-[10px] font-mono uppercase text-muted-foreground/60`
   - Keeps checkbox, value label, and count in the same layout

5. For all other filter sections, nothing changes -- `renderCustomLabel` is simply not provided

No other files are modified. This is purely a visual enhancement inside the filter dropdown.
