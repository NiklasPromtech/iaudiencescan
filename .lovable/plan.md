

## Remove Wallet Data page, introduce "System Queries"

### Concept

Replace the dedicated Wallet Data page with query-based equivalents. Introduce a concept of **system queries** — pre-built, non-deletable queries marked `is_system: true` that ship with every website. Users can duplicate them but not delete or edit the originals.

### Changes

**1. Expand seed queries to cover Wallet Data use cases**

Add system queries to `SEED_QUERIES` in `use-queries.ts`:
- "Wallet Connections by Day" (already exists)
- "Wallet List" — `SELECT wallet_id, type, first_seen, last_seen, visit_count FROM wallets ORDER BY last_seen DESC LIMIT {{limit, "50"}}`
- "Top Wallet Balances" — `SELECT wallet_id, total_balance_usd, chains FROM wallet_balances WHERE total_balance_usd > 0 ORDER BY total_balance_usd DESC LIMIT {{limit, "20"}}`
- "Wallets by Chain" — `SELECT chain, COUNT(*) as wallets FROM wallet_balances GROUP BY chain ORDER BY wallets DESC`

Mark all seed queries with `is_system: true`.

**2. Add `is_system` flag to queries**

- Add `is_system` boolean column to the `queries` table (migration)
- Seed queries get `is_system: true` when auto-created
- System queries: cannot be deleted or renamed, but can be duplicated and toggled on/off dashboard
- UI: show a lock icon or "System" badge on these queries in the list
- Delete button hidden for system queries; clone button always visible

**3. Remove Wallet Data from sidebar**

- Remove the "Wallet Data" entry from `DashboardSidebar.tsx` (keep `src/pages/Wallets.tsx` file intact)
- Remove the route isn't necessary — keep it accessible via URL for now, just hidden from nav

**4. UI indicators**

- In `/queries` list: system queries show a small "Default" badge, no delete icon
- In query editor: system queries show a banner "This is a system query. Duplicate it to make changes."
- On dashboard tiles: no visual difference (they behave like normal pinned queries)

### Technical details

**Migration**: `ALTER TABLE queries ADD COLUMN is_system boolean DEFAULT false;`

**Files to modify**:
- `src/hooks/use-queries.ts` — expand `SEED_QUERIES`, set `is_system: true`, prevent delete on system queries
- `src/components/dashboard/DashboardSidebar.tsx` — remove Wallet Data nav item
- `src/pages/Queries.tsx` — show "Default" badge, hide delete for system queries
- `src/pages/QueryEditor.tsx` — read-only banner + disable save for system queries, show "Duplicate" CTA

**Files to create**:
- Supabase migration for `is_system` column

