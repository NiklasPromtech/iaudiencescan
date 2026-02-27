
I tracked both issues in `src/pages/QueryEditor.tsx` and confirmed they’re related to layout containment rather than query logic.

## What’s happening now

1. Top action buttons drifting/disappearing when results are very wide
- The results table is correctly horizontally scrollable, but some parent flex containers are still allowed to grow with wide content.
- In flex layouts, missing `min-w-0`/overflow constraints can make sibling regions appear pushed or clipped.
- The top bar currently has one long, single-line row with mixed flexible + fixed elements, which makes it fragile under pressure.

2. No minimize control for Data Explorer
- Left panel is hardcoded at `w-64` and always open.
- There is no collapse state and no persisted user preference for this panel.

## Implementation approach

### A) Stabilize header/top actions when results are wide

Files:
- `src/components/dashboard/DashboardLayout.tsx`
- `src/pages/QueryEditor.tsx`

Changes:
1. Add hard width containment on dashboard main content
- In `DashboardLayout`, ensure the main/content wrappers can shrink:
  - `main`: add `min-w-0 overflow-hidden`
  - children wrapper (`<div className="flex-1">`): add `min-w-0 overflow-hidden`
- This prevents wide page children from stretching the whole layout horizontally.

2. Harden QueryEditor top bar structure
- Refactor top bar into explicit left and right zones:
  - Left zone: back button + title + tag_id, with `min-w-0` and truncation where needed.
  - Right zone: actions (`delete`, `pretty`, `run`) with `shrink-0`.
- Keep buttons visible by preventing them from shrinking away.
- Add truncation on long text elements (title/tag) so controls remain accessible.

3. Constrain horizontal overflow to results table only
- Keep table scrolling local to results pane (`overflow-x-auto`).
- Ensure parent wrappers remain `overflow-hidden`/`min-w-0` so they do not inherit table width.

Expected result:
- Even with very wide result sets, top controls stay anchored and visible.
- Horizontal scrolling happens only inside the table region, not the entire page content lane.

---

### B) Add Data Explorer minimize + remembered preference

File:
- `src/pages/QueryEditor.tsx`

Changes:
1. Add collapse state + persistence
- New state: `isExplorerCollapsed`.
- Persist in `localStorage` with a dedicated key (e.g. `query-editor-explorer-collapsed`).
- Initialize from storage on first render and update on toggle.

2. Add explicit collapse/expand control
- Add a button in the Data Explorer header to collapse/expand.
- Use clear icon + tooltip/title + `aria-label` for accessibility.
- When collapsed, render a slim rail (icon-only) that can be expanded with one click.

3. Conditional panel rendering
- Expanded: current full explorer (`w-64`) with search + tables.
- Collapsed: narrow strip (`w-10`/`w-12`) with vertical affordance and expand button.
- Keep right editor/results area as `flex-1 min-w-0` so it automatically gains space.

4. Optional polish (low-risk)
- Add subtle divider/visual cue on collapsed rail so state is obvious.
- Keep schema refresh in expanded mode only (or in tooltip icon for collapsed if desired).

Expected result:
- Users can minimize Data Explorer to focus on SQL/results.
- Their preference is remembered between visits and reloads.

## Validation checklist

1. Wide table stress test
- Run a query returning many columns / long cell values.
- Confirm top buttons (Pretty/Run/Delete) remain visible.
- Confirm only results table scrolls horizontally.

2. Top bar resilience
- Test long query title + visible tag_id + narrow viewport.
- Confirm text truncates before controls disappear.

3. Explorer collapse behavior
- Collapse explorer, verify editor/results expand immediately.
- Refresh page; confirm collapsed/expanded preference persists.
- Expand again and verify search/schema still works.

4. Regression checks
- Sidebar open/close persistence still works.
- Existing loading indicators and run/generate/edit flows remain unchanged.

## Technical notes

- This fix is primarily about flexbox constraints:
  - `min-w-0` on flex children prevents unintended width growth from deep content.
  - `shrink-0` on critical action clusters preserves button visibility.
  - Localizing `overflow-x-auto` to the table prevents global horizontal drift.
- Data Explorer preference persistence follows the same localStorage pattern already used for dashboard sidebar behavior.
