

## Grid Placement for Query Dashboard Tiles

### What changes

**1. Database: add grid position columns**

Add `dash_col`, `dash_row`, `dash_w`, `dash_h` (all integers) to `queries` table:
- `dash_col` (1–2) — starting column
- `dash_row` (1–4) — starting row
- `dash_w` (1–2) — width in grid cells
- `dash_h` (1–2) — height in grid cells
- Pie charts enforce 1×1 max

**2. Query Editor: grid placement picker**

When "Add to dash" is checked, show below the display type dropdown:
- A small interactive 2×4 grid of clickable cells
- User clicks a cell to set position (col, row)
- Width/height controls: small +/- or a "span 2 wide" toggle (disabled for pie charts)
- All persisted immediately via `updateQuery()`

**3. Fix checkbox top margin**

The "Add to dash" checkbox container currently has `py-1` — increase top padding or add `mt-1` so the checkbox isn't pushed up against the border edge.

**4. Dashboard: CSS Grid placement**

Replace the current simple 2-column grid with an explicit `grid-template-columns: repeat(2, 1fr)` and `grid-template-rows: repeat(4, minmax(280px, auto))` layout. Each tile card uses `grid-column` and `grid-row` based on its stored position/span values. Tiles without a position get auto-placed into empty cells.

### Constraints
- Pie charts: `dash_w` and `dash_h` locked to 1
- Tables/bar/line charts: can span up to 2 wide × 2 tall
- Grid is 2 columns × 4 rows = 8 slots max

### Files to modify
- `src/hooks/use-queries.ts` — add `dash_col`, `dash_row`, `dash_w`, `dash_h` to `SavedQuery` and `QueryPatch`
- `src/pages/QueryEditor.tsx` — add grid placement picker UI below display type; fix checkbox margin
- `src/pages/QueryDashboard.tsx` — switch to explicit CSS grid placement using tile position data

### Migration SQL (run manually)
```sql
ALTER TABLE queries
  ADD COLUMN IF NOT EXISTS dash_col integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS dash_row integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS dash_w integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS dash_h integer NOT NULL DEFAULT 1;
```

