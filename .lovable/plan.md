
# Wire Up Real Query Execution + Schema-Driven Data Explorer

## What we're connecting

You have two live endpoints on the same base API:

- `POST /query` — executes SQL, returns columns + rows + row_count
- `GET /query/schema` — returns real table names, column names, types, and descriptions

We'll use these to:
1. Replace the hardcoded Data Explorer tree with **real tables from `/query/schema`**
2. Make the **Run button actually execute** via `POST /query` using the selected website's `website_id`
3. Render a **proper results table** (columns as headers, rows as data) instead of the placeholder "0 rows" message
4. Show a **loading state** while the query runs and a clear **error state** if it fails

---

## Changes

### 1. `src/lib/api.ts` — add two new functions

```typescript
// Types
export interface QuerySchemaColumn {
  name: string;
  type: string;
  description: string;
}
export interface QuerySchemaTable {
  name: string;
  description: string;
  columns: QuerySchemaColumn[];
}
export interface QuerySchemaResponse {
  tables: QuerySchemaTable[];
}
export interface QueryExecuteResponse {
  columns: string[];
  rows: (string | number | null)[][];
  row_count: number;
}

// Functions
export async function fetchQuerySchema(): Promise<QuerySchemaResponse>
export async function executeQuery(websiteId: string, sql: string): Promise<QueryExecuteResponse>
```

Both use the existing `apiRequest` helper (`API_BASE_URL`) with Bearer auth — same pattern as every other call.

---

### 2. `src/pages/QueryEditor.tsx` — full wiring

**Data Explorer — schema-driven**
- On mount, call `fetchQuerySchema()` and store the result in state
- Replace the hardcoded `explorerSections` array with the real table list from the API response
- Each table becomes a collapsible section showing its `description` as a sub-label and its columns as clickable rows (clicking a column name inserts `table.column` into the editor at cursor)
- While loading: show a subtle skeleton / "Loading schema..." text
- On error: show "Could not load schema" with a retry button

**Run button — live execution**
- Read `selectedWebsite` from `useSelectedWebsite()` to get the `website_id`
- On click: set `isRunning = true`, call `executeQuery(websiteId, sql)`
- Success: store `{ columns, rows, rowCount }` in state, set `hasRun = true`
- Error: store the error message, surface it in the results area with the exact error text from the API
- The Run button shows a `Loader2` spinner (animated) while running and is disabled during execution

**Results table**
- When results arrive, render a proper table:
  - Header row: one `<th>` per column name
  - Body rows: one `<td>` per cell value, `null` rendered as `—`
  - Row count shown in the results bar: `Results — 47 rows`
  - If `row_count === 0`: show "Query executed successfully. No rows returned."
- The table is scrollable horizontally if there are many columns

**Error state** — shown in the results area instead of the table:
```
Query error
ERROR: column "wallet_address" does not exist
```

---

### 3. No changes needed to `Queries.tsx`, `DashboardSidebar.tsx`, or routing

The existing structure is already correct. This is purely a data-wiring change to `QueryEditor.tsx` and adding the two API functions.

---

## Technical notes

- The `API_BASE_URL` in `api.ts` is already `https://api-wldojy4riq-uc.a.run.app` — both `/query` and `/query/schema` will be called on that same base
- `website_id` comes from `useSelectedWebsite()` which is already available app-wide
- Schema is fetched once on mount (not on every run) — a "Refresh schema" button can be added later
- No new dependencies needed — standard fetch + existing UI components (Table from `ui/table.tsx`, Loader2 from lucide-react)
