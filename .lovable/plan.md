

## Fix dashboard tile collision when resizing

### Problem
On `/query-dashboard`, the "Add to dashboard" picker correctly grays out tiles already pinned, but the **resize controls (2W / 2H / 2W2H)** on an existing tile don't check whether the expanded footprint would overlap a neighbor. Result: two tiles end up occupying the same grid cell and stack on top of each other.

### Approach
Treat the dashboard grid as a 2D occupancy map. Before applying any resize, compute the cells the tile *would* occupy at the new width/height and reject the resize if any of those cells (other than the tile's own current cells) are taken.

### Behavior changes
1. **Disable resize buttons that would collide.** Each size button (1×1, 2×1, 1×2, 2×2) on a tile is greyed-out and non-clickable when expanding to that size would overlap another pinned tile or run off the grid's right edge.
2. **Tooltip on disabled buttons**: `"Not enough space"` so the user understands why.
3. **Defensive guard in the update handler**: even if a click slips through (race condition, stale state), the resize mutation re-checks collision and silently no-ops with a toast `"Tile would overlap another"`.
4. No change to the "Add to dashboard" picker — it already correctly excludes pinned queries.

### Files to change
- `src/pages/QueryDashboard.tsx` — add a `computeOccupancy(queries, excludeId)` helper, a `canFit(col, row, w, h, occupancy)` check, and pass per-tile `availableSizes` into the tile component.
- `src/components/queries/DashboardTile.tsx` (or wherever the 2W / 2H / 2W2H buttons live — to be confirmed when implementing) — accept `availableSizes` prop and disable buttons accordingly with tooltip.

### Out of scope (per your direction)
- Seed templates / `is_system` cleanup — you'll rebuild defaults yourself later.
- Auto-reflow / auto-compact when a tile is removed.

