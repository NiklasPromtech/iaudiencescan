

## Query-First Dashboard: Architecture Plan

### Summary

Replace the Overview as the default logged-in view with a redesigned Query Dashboard. Add a "Data Explorer" for browsing raw table contents. Introduce template variables (`{{name, "default"}}`) in queries for dynamic parameterization.

---

### 1. Query Dashboard becomes the home view

- Change the default authenticated route from `/overview` to `/query-dashboard`
- In sidebar, move "Query Dashboard" to the top of the Insights group (rename to just "Dashboard")
- Remove "Overview" and "Change" from the sidebar entirely (keep the page files for now, just hide navigation)

### 2. Default tiles for new users

When a user has no pinned dashboard queries yet, instead of the empty state, show a set of **seed queries** auto-created on first website setup:

- "Pageviews (last 14 days)" — bar chart
- "Top Referrers" — table
- "Wallet Connections by Day" — line chart
- "Top Events" — table

Implementation: A helper function checks if the user has any queries for the website. If zero, it inserts the seed queries (with `on_dashboard: true` and sensible grid positions) into the `queries` table automatically. These are real saved queries the user can edit or remove.

### 3. Data Explorer page (`/data-explorer`)

A new page that lists all available tables (from the existing `/query/schema` endpoint). For each table:

- Show table name, column names + types
- Expandable: runs `SELECT * FROM {table} ORDER BY created_at DESC LIMIT 10` and displays results in a table
- Lazy-load — only fetch rows when the user expands a table

Add "Data Explorer" to the sidebar under the Insights group (with a `Database` icon).

### 4. Template variables in queries

Syntax: `{{variable_name, "default_value"}}` or `{{variable_name}}` (no default = required).

**How it works:**

- **Parser**: A utility function scans the SQL string for `{{...}}` patterns, extracts variable name and optional default
- **Query Editor UI**: When variables are detected, a parameter bar appears above the results area showing labeled inputs pre-filled with defaults. User can change values before running.
- **Execution**: Before sending SQL to the API, all `{{var}}` tokens are replaced with the user-supplied values (properly escaped)
- **Dashboard tiles**: Variables with defaults auto-resolve to their defaults. If a tile has required variables (no default), show a small input form on the tile card instead of auto-running.

Example:
```sql
SELECT DATE(created_at) as day, COUNT(*) as views
FROM pageviews
WHERE DATE(created_at) >= DATE_SUB(CURRENT_DATE(), INTERVAL {{days_back, "14"}} DAY)
GROUP BY day ORDER BY day
```

The dashboard tile auto-runs with `days_back = 14`. In the editor, the user sees an input labeled "days_back" with "14" pre-filled and can change it.

---

### Technical details

**Files to create:**
- `src/pages/DataExplorer.tsx` — table browser page
- `src/lib/query-variables.ts` — parse/substitute `{{var}}` template tokens

**Files to modify:**
- `src/App.tsx` — add DataExplorer route, change default redirect
- `src/components/dashboard/DashboardSidebar.tsx` — reorder nav, add Data Explorer, hide Overview/Change
- `src/pages/QueryDashboard.tsx` — seed query logic for empty state
- `src/pages/QueryEditor.tsx` — variable detection UI, parameter bar, substitution before execute
- `src/pages/QueryDashboard.tsx` — handle variables in dashboard tiles (auto-resolve defaults, input for required)
- `src/hooks/use-queries.ts` — add `seedDefaultQueries()` helper

**No schema changes needed** — variables are purely a client-side SQL preprocessing feature.

