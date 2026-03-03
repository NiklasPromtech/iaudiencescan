

## Redesign "Add to Dashboard" Controls

### Problem
The current inline checkbox + grid picker in the editor header is visually cluttered and ugly. It needs a cleaner approach.

### Solution

**1. Query Editor — Replace checkbox/grid with a single toggle button**

Remove the entire `border border-border px-2 py-1.5` container (lines 916–1015) with the checkbox, dropdown, grid picker, and 2W/2H buttons. Replace with:

- A single **"Add to Dashboard"** button (small, outline style) that opens a **popover** when clicked
- If the query is already on the dashboard, the button shows a filled/active state (e.g. primary variant with a `LayoutGrid` icon) with text like "On Dashboard"
- The popover contains:
  - Display type selector (Table / Bar / Line / Pie) — as small radio-style buttons or a clean select
  - The 2×4 grid picker for placement
  - The 2W / 2H span toggles (hidden for pie)
  - A "Remove from dashboard" link/button at the bottom
- This keeps the header clean — just one button — with settings tucked away in a popover

**2. Queries list — Show dashboard indicator**

In `Queries.tsx`, for each query row, show a small `LayoutGrid` icon (or a badge) next to the name if `query.on_dashboard` is true. This gives visibility at a glance without adding clutter.

### Files to modify
- `src/pages/QueryEditor.tsx` — replace dashboard checkbox/grid section with a popover-based button
- `src/pages/Queries.tsx` — add dashboard indicator icon in query rows

