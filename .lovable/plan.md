
# Add "Queries" to Insights Section

## Overview

Inspired by Dune Analytics, we're adding a **Queries** feature under the **Insights** section of the sidebar. This gives users a SQL-like query workspace to explore their AudienceScan data, styled to match the flat Dune-inspired aesthetic already in place.

This is a **frontend-only, UI scaffold** — no live SQL execution backend yet, but everything is wired up visually and structurally so it's ready to connect to a real query engine later.

---

## What We're Building

### 1. Sidebar — add "Queries" to Insights

Add a `Terminal` icon item to `insightsItems` in `DashboardSidebar.tsx`:

```typescript
{ title: "Queries", url: "/queries", icon: Terminal }
```

This places it alongside Overview, Change, and Wallet Data under the Insights group.

---

### 2. Queries List Page — `src/pages/Queries.tsx`

A Dune-style queries index page:

- **Header**: "Queries" title
- **Toolbar row**:
  - Search input ("Search queries...")
  - `Sort by: Updated date` dropdown
  - `Sort by: Descending` dropdown
  - `New query` button (navigates to `/queries/new`)
- **Query list**: flat rows (no cards, no shadows — border-bottom separated), each row showing:
  - Terminal/code icon on the left
  - Query name (bold) + `@audiencescan • modified X ago` in muted mono text
  - Star icon on the right (toggle favourite)
- Mock data for 3–4 starter queries (e.g. "People that deposited into CEX", "All Known EVM CEX Addresses")

---

### 3. Query Editor Page — `src/pages/QueryEditor.tsx`

A split-pane layout:

**Left panel — Data Explorer (fixed ~280px width)**
- "Data Explorer" header
- Search input ("Search by dataset name, contract address...")
- Collapsible sections using the existing Collapsible component:
  - **AudienceScan data** (label): Prices & metadata, DEX trading, Transfers & balances, Labels & identity, Gas & fees, More curated data
  - **My data**: Uploads, Materialized views
  - **Blockchain data**: Decoded projects, Raw blockchain data

**Right panel — Query editor area**
- Query title (editable inline, e.g. "New query")
- `@audiencescan` avatar + username label
- **Query editor** box: monospaced textarea with line numbers (simple implementation — a `<textarea>` styled with `font-mono`, with a line-number gutter column alongside it)
- **Run** button (top-right of the editor pane, orange primary colour)
- **Results area** below: initially shows a "Get started" panel with:
  - "Generate with a prompt" text input
  - 3 example prompt chips (e.g. "Find all wallets that interacted with Uniswap in the last 7 days")

---

### 4. Routing — `src/App.tsx`

Add two protected routes:
```typescript
<Route path="/queries" element={<RequireAuth><Queries /></RequireAuth>} />
<Route path="/queries/:id" element={<RequireAuth><QueryEditor /></RequireAuth>} />
```

`/queries/new` will also resolve to QueryEditor via the `:id` param being "new".

---

## Style Notes (matching existing platform aesthetic)

- `rounded-none` throughout — no rounded corners on cards, buttons, inputs
- `font-mono text-[10px] uppercase tracking-widest` for section labels
- Border-separated rows instead of cards with shadows
- Orange (`text-orange-500` / `bg-orange-500`) for the Run button and active states
- Teal for any "Unknown" states if needed
- The Data Explorer left panel uses the same collapsible pattern already in the sidebar

---

## Files to Create/Modify

| File | Action |
|---|---|
| `src/components/dashboard/DashboardSidebar.tsx` | Add `Terminal` icon + Queries to `insightsItems` |
| `src/pages/Queries.tsx` | Create — queries list page |
| `src/pages/QueryEditor.tsx` | Create — split-pane editor page |
| `src/App.tsx` | Register two new routes |
