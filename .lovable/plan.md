

## Fix `seedDefaultQueries` to clone real templates instead of hardcoded SQL

### Problem
`src/hooks/use-queries.ts` contains a hardcoded `SEED_QUERIES` array (7 entries with broken SQL like `wallet_connections`, `event_name`, `visit_count`). When a website has zero queries, `seedDefaultQueries()` inserts these hardcoded rows — NOT the 6 real `is_system = true` templates you authored in the database. That's why new websites get tiles with SQL you never wrote.

### Fix
Replace the hardcoded seed list with a runtime clone of the actual `is_system = true` templates from the `queries` table.

### New behavior of `seedDefaultQueries(websiteId)`
1. Check the website has zero queries (existing guard, unchanged).
2. `SELECT * FROM queries WHERE is_system = true AND website_id IS NULL` to fetch the canonical templates.
3. For each template, build an insert payload that:
   - Copies: `name`, `sql`, `display_type`, `dash_col`, `dash_row`, `dash_w`, `dash_h`, `on_dashboard`
   - Overrides: `user_id` = current user, `website_id` = current website, `is_system` = **false**, `starred` = false
   - Drops: `id`, `created_at`, `updated_at` (let DB regenerate)
4. Bulk-insert and return the new rows.
5. If no templates exist (`is_system = true` set is empty), seed nothing and return `[]` — empty dashboard with empty state.

### Side effects
- Going forward, every new website gets exact copies of YOUR 6 working templates, owned by that website, editable/deletable like normal queries.
- No more cross-website leakage via the `is_system.eq.true` OR-clause for seeded content (because the copies have `is_system = false`).
- The existing `fetchDashboardQueries` OR-clause (`website_id.eq.X OR is_system.eq.true`) keeps working — but consider whether system templates should appear directly on every dashboard or only as templates to clone. **Recommendation:** keep the OR-clause as-is for now; you can decide later if templates should be picker-only.

### Database cleanup (one migration)
Delete the 14 contradictory rows created today (rows that are both `is_system = true` AND have a `website_id`):

```sql
DELETE FROM queries
WHERE is_system = true
  AND website_id IS NOT NULL;
```

This preserves your 6 real templates (`is_system = true`, `website_id IS NULL`) and removes the bad clones.

### Files to change
- `src/hooks/use-queries.ts` — delete `SEED_QUERIES` constant; rewrite `seedDefaultQueries` to fetch + clone `is_system = true` rows.
- `supabase/migrations/<new>.sql` — cleanup delete above.

### Out of scope
- Changing how `is_system` templates are surfaced in the UI (picker vs auto-show on dashboard).
- Editing the templates themselves — you own those.

