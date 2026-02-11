

## Phase 4: Total Rounded Corner Elimination

### Problem

Despite previous changes to card, button, input, tabs, badge, select, popover, and skeleton, there are still **401+ instances** of `rounded-*` classes across 36 UI primitive files and overview components. The screenshot clearly shows rounded corners on:

- The **dimension table** container (`rounded-md` in DimensionTable.tsx)
- **Checkboxes** (`rounded-sm` in checkbox.tsx)  
- **Dropdown menus** (`rounded-md` and `rounded-sm` in dropdown-menu.tsx)
- **Dialogs** (`sm:rounded-lg` in dialog.tsx)
- **Toasts** (`rounded-md` in toast.tsx)
- **Toggles** (`rounded-md` in toggle.tsx)
- **Hover cards** (`rounded-md` in hover-card.tsx)
- **Chart tooltips** (`rounded-lg` in chart.tsx)
- **Timeline metric pills** (`rounded-full` in TimelineRangeChart.tsx)
- **Tracking setup dialog** icon containers (`rounded-lg`)
- **Date range picker** preset buttons (`rounded-md`)
- **Scorecard filters** labels (`rounded-md`)
- **Touchpoint markers** color dots (`rounded-full` -- these are fine, they're dots)

### Solution: Two-Part Sweep

**Part 1 -- Flatten ALL remaining UI primitives** (fixes the entire app at once):

| File | Change |
|------|--------|
| `src/components/ui/dialog.tsx` | `sm:rounded-lg` to `sm:rounded-none`, `rounded-sm` to `rounded-none` |
| `src/components/ui/dropdown-menu.tsx` | All `rounded-md` and `rounded-sm` to `rounded-none` |
| `src/components/ui/toast.tsx` | All `rounded-md` to `rounded-none` |
| `src/components/ui/toggle.tsx` | `rounded-md` to `rounded-none` |
| `src/components/ui/hover-card.tsx` | `rounded-md` to `rounded-none` |
| `src/components/ui/checkbox.tsx` | `rounded-sm` to `rounded-none` |
| `src/components/ui/chart.tsx` | `rounded-lg` to `rounded-none` on tooltip container |
| `src/components/ui/tooltip.tsx` | `rounded-md` to `rounded-none` |
| `src/components/ui/command.tsx` | Any `rounded-*` to `rounded-none` |
| `src/components/ui/calendar.tsx` | Any `rounded-*` to `rounded-none` (day cells) |
| `src/components/ui/context-menu.tsx` | Any `rounded-*` to `rounded-none` |
| `src/components/ui/alert-dialog.tsx` | Any `rounded-*` to `rounded-none` |
| `src/components/ui/sheet.tsx` | Any `rounded-*` to `rounded-none` |
| `src/components/ui/drawer.tsx` | Any `rounded-*` to `rounded-none` |
| `src/components/ui/navigation-menu.tsx` | Any `rounded-*` to `rounded-none` |
| `src/components/ui/menubar.tsx` | Any `rounded-*` to `rounded-none` |

**Part 2 -- Flatten overview components:**

| File | Change |
|------|--------|
| `src/components/overview/DimensionTable.tsx` | `rounded-md` to `rounded-none` on table container |
| `src/components/overview/TimelineRangeChart.tsx` | `rounded-lg` to `rounded-none` on tooltip, `rounded-full` to `rounded-none` on metric pills |
| `src/components/overview/TrackingSetupDialog.tsx` | `rounded-lg` to `rounded-none` on code blocks and icon containers |
| `src/components/overview/DateRangePicker.tsx` | `rounded-md` to `rounded-none` on preset buttons |
| `src/components/overview/ScorecardFilters.tsx` | `rounded-md` to `rounded-none` on filter labels |
| `src/components/overview/PrimaryFilters.tsx` | `rounded` to `rounded-none` on filter options |

**Exceptions kept as `rounded-full`** (these are intentional dots/circles):
- Touchpoint color indicator dots (3x3px colored circles)
- Realtime pulse dot (1.5x1.5px animated dot)
- Chart legend color squares (`rounded-sm` on 3x3 swatches -- actually fine)
- Avatar images (user photos)

### Execution

All changes are simple find-and-replace within each file. All UI primitive changes can be done in parallel, then overview components in parallel.
