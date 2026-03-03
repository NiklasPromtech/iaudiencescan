

## Query Dashboard Feature

### Overview
Add a "Query Dashboard" page where users can pin queries and see their results rendered as tables, charts, or pie charts — all auto-executed on page load. This involves three pieces: a new DB column to mark queries as dashboard-ready, a toggle in the Query Editor, a new dashboard page, and a sidebar entry.

### A) Database: Add dashboard fields to `queries` table

Add two columns to the `queries` table via Supabase migration:
- `on_dashboard` (boolean, default false) — whether the query appears on the dashboard
- `display_type` (text, default 'table') — one of `'table'`, `'bar_chart'`, `'line_chart'`, `'pie_chart'`

### B) Update `use-queries.ts` hook

- Add `on_dashboard` and `display_type` to the `SavedQuery` interface and `QueryPatch` type
- Add a `fetchDashboardQueries()` method that fetches only queries where `on_dashboard = true`

### C) Query Editor — "Add to Dashboard" controls

In the header area of `QueryEditor.tsx` (near the Pretty/Run/Delete buttons), add:
- A checkbox/toggle: "Add to dash" — sets `on_dashboard` on the saved query
- When checked, show a small dropdown to pick display type: Table, Bar Chart, Line Chart, Pie Chart
- Both persist immediately via `updateQuery()`

### D) New page: `QueryDashboard.tsx`

- Route: `/query-dashboard`
- Fetches all queries where `on_dashboard = true`
- On mount, executes each query's SQL against the API in parallel
- Renders each in a card/tile with the query name as title
- Display type determines rendering:
  - **Table** — reuse the existing results table component
  - **Bar Chart** — Recharts `BarChart` (first column = X axis, remaining = bars)
  - **Line Chart** — Recharts `LineChart` (same convention)
  - **Pie Chart** — Recharts `PieChart` (first column = name, second = value)
- Cards arranged in a responsive grid (2 columns on desktop)
- Each card has a small link icon to jump to the query editor

### E) Sidebar update

In `DashboardSidebar.tsx`, add "Query Dashboard" above "Queries" in the Insights group:
```text
Insights
  Overview
  Change
  Wallet Data
  Query Dashboard  ← new (LayoutGrid icon)
  Queries
```

### F) Route

Add lazy import + route for `/query-dashboard` in `App.tsx`.

### Files to create
- `src/pages/QueryDashboard.tsx`
- `supabase/migrations/add_query_dashboard_fields.sql`

### Files to modify
- `src/hooks/use-queries.ts` — extend types + add dashboard fetch
- `src/pages/QueryEditor.tsx` — add dashboard toggle + display type picker in header
- `src/components/dashboard/DashboardSidebar.tsx` — add nav item
- `src/App.tsx` — add route

