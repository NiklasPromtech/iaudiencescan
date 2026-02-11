

## Dune-Style UI Overhaul: Flat, Tight, Data-Dense

### What Dune Gets Right (from the reference image)

The Dune "Discover" page is aggressively flat and data-dense:

1. **No card wrappers around list items** -- rows are separated only by a thin `border-b`, no card backgrounds, no shadows, no rounded containers wrapping each item
2. **Zero border-radius on data rows** -- items are flat horizontal bands
3. **Tight vertical spacing** -- rows are compact (~56-64px height), no extra padding bloat
4. **No decorative shadows** -- the entire page is flat, shadow-free
5. **Minimal chrome** -- the header/tabs are simple inline text, no pill-shaped wrappers with backgrounds
6. **Monospace numbers** -- data values are right-aligned in tabular style
7. **Tags as tiny rounded-full pills** -- the only rounded elements are small hashtag badges

### What Needs to Change

Currently, the platform pages (Overview, Wallets, Scans, Audiences, Touchpoints, Contracts, Costs) use:
- `Card` wrappers (`rounded-lg`, `shadow-sm`, `border`, `p-6`) around every section
- `rounded-xl` on scorecard metric pills and chart containers
- Gradient backgrounds on the realtime pill (`bg-gradient-to-br`)
- Decorative shadows throughout
- Generous padding/spacing (mb-8, p-6)

The landing page (Index.tsx) uses large rounded containers and generous spacing that should also be tightened.

### Design Targets

| Element | Current | Target (Dune-style) |
|---------|---------|---------------------|
| Data tables | Wrapped in `Card` with `p-6`, `rounded-lg`, `shadow-sm` | Borderless, just a thin top border separator. Table rows with `border-b` only |
| Scorecard chips | `rounded-xl`, gradient bg, icon circles | Flat inline text values, no card wrappers, separator borders between metrics |
| Chart container | `Card` with `p-6` | Thin `border-b` separator above/below, no wrapper card |
| List items (Scans, Touchpoints, etc.) | Individual `Card` per item with rounded corners + shadows | Flat rows with `border-b`, hover `bg-muted/50`, no card wrapping |
| Section headers | Inside card padding | Standalone with `border-b` below |
| Filter buttons | Current pills are fine | Keep as-is, they match Dune's tab pattern |
| Sidebar | Already clean | No changes needed |
| Dimension table inner border | `rounded-md border` wrapper | Keep thin border wrapper but remove card padding bloat |
| Remaining `rounded-2xl`/`rounded-3xl` | 102 instances in 8 files | Replace with `rounded-lg` or `rounded-none` |

### Files to Modify

**Platform pages (list/data views -- highest priority):**
1. `src/pages/Overview.tsx` -- Remove `Card` wrappers from major sections, reduce spacing from `mb-8` to `mb-6`, flatten cohort suggestions section
2. `src/components/overview/ScorecardChips.tsx` -- Replace pill cards with flat inline stat rows separated by borders, remove `rounded-xl`, remove gradient on realtime pill, use simpler layout
3. `src/components/overview/DailyChart.tsx` -- Remove `Card` wrapper, use `border-b` separator instead
4. `src/components/overview/DimensionTable.tsx` -- Remove outer `Card` wrapper, keep inner table structure, fix `text-purple-500` (still needs purple purge)
5. `src/components/overview/EventsTable.tsx` -- Remove `Card` wrapper, use section with `border-t` separator
6. `src/components/overview/WalletsOverviewTable.tsx` -- Same treatment as EventsTable
7. `src/components/overview/WalletExtensionsTable.tsx` -- Same treatment
8. `src/pages/Scans.tsx` -- Flatten scan list items from individual Cards to `border-b` rows
9. `src/pages/Audiences.tsx` + `src/components/audiences/AudienceList.tsx` -- Flatten audience items
10. `src/pages/Touchpoints.tsx` -- Flatten touchpoint items to rows
11. `src/pages/Contracts.tsx` -- Already uses a table, reduce card chrome
12. `src/pages/Costs.tsx` + `src/components/costs/CostSourceList.tsx` -- Flatten cost items
13. `src/pages/Wallets.tsx` -- Reduce card chrome around table, tighten spacing

**Landing page:**
14. `src/pages/Index.tsx` -- Tighten spacing, reduce rounded corners, flatten stat cards

**Remaining rounded-2xl/3xl files (8 files):**
15. `src/pages/Video.tsx` -- Replace `rounded-2xl`/`rounded-3xl` with `rounded-lg`
16. `src/pages/Video1.tsx` -- Same
17. `src/pages/AI.tsx` -- Replace `rounded-2xl` with `rounded-lg`
18. `src/pages/PlaceholderAI.tsx` -- Same
19. `src/pages/PlaceholderConfidence.tsx` -- Same
20. `src/pages/Wizard.tsx` -- Same
21. `src/pages/ManagedService.tsx` -- Check and fix (from earlier audit)
22. `src/pages/CaseStudies.tsx` -- Check and fix

**UI Primitive (optional, low-risk):**
23. `src/components/ui/card.tsx` -- Remove `shadow-sm` from default Card class (makes every card flatter globally)

### Approach

The core change is **removing the `Card` wrapper pattern from data-display components** and replacing it with section separators (`border-t` or `border-b` + spacing). This follows Dune's pattern where data sections flow vertically with only thin horizontal rules between them.

For list pages (Scans, Audiences, Touchpoints), each item becomes a simple `div` row with `border-b border-border` and `hover:bg-muted/30` instead of a standalone Card.

The Card component's default `shadow-sm` will be removed so any remaining Card usage is flatter.

### Execution Order

1. First: Update `card.tsx` to remove `shadow-sm` (global improvement)
2. Then: Flatten all platform dashboard components (Overview scorecard, chart, tables) in parallel
3. Then: Flatten all list pages (Scans, Audiences, Touchpoints, Costs) in parallel
4. Then: Fix remaining `rounded-2xl`/`rounded-3xl` across all 8 files
5. Finally: Tighten landing page spacing

