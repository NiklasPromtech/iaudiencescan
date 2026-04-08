

## Add `is_system` Column & Lock System Queries

### Problem
1. The `queries` table doesn't have an `is_system` column yet — the UPDATE fails
2. The QueryEditor page needs to fully lock down system queries (disable editing SQL, prompt editing, title editing, delete, schedule, auto-save) while keeping clone and run available
3. Both QueryEditor and QueryDashboard need to treat system queries as website-agnostic — replacing `website_id` with the current website when executing

### Technical Changes

**1. Database migration — add `is_system` column**

Create a new migration file that adds the column:
```sql
ALTER TABLE public.queries ADD COLUMN IF NOT EXISTS is_system BOOLEAN DEFAULT false;
```

After this deploys, you can run the UPDATE to mark the 6 queries as system queries.

**2. Edit `src/pages/QueryEditor.tsx`**

When `isSystem` is true:
- Make the SQL editor textarea `readOnly` (line ~404-416 area — add `readOnly={isSystem}` to the textarea)
- Hide the "Edit SQL with prompt" input (line ~1298-1321 — wrap in `!isSystem &&`)
- Hide the "Pretty" format button (line ~1165-1173 — wrap in `!isSystem &&`)
- Hide the schedule button (line ~1102-1110 — add `&& !isSystem` to the condition)
- Disable auto-save entirely (line ~639 already has `|| isSystem` — confirmed working)
- Dashboard toggle, Clone, and Run buttons remain available (already correct)
- The existing delete guard (`!isSystem` on line 1136) and title lock (line 896-900) are already in place

**3. Edit `src/pages/QueryEditor.tsx` — website_id override for execution**

In `handleRun` (~line 859), when `isSystem` is true, use `selectedWebsite.id` instead of the query's stored `website_id`. This is already the case since `executeQuery` takes `selectedWebsite.id` directly.

**4. Edit `src/pages/QueryDashboard.tsx` — website_id override for system queries**

In `runTile` (~line 343), the code already uses `selectedWebsite!.id` for execution. The fetch query (`fetchDashboardQueries`) filters by `website_id` — system queries need to also appear regardless of website. Update `fetchDashboardQueries` in `src/hooks/use-queries.ts` to also fetch `is_system = true` queries (OR condition).

**5. Edit `src/hooks/use-queries.ts` — fetch system queries for dashboard**

Update `fetchDashboardQueries` to use an `.or()` filter so it returns both website-scoped dashboard queries AND system queries with `on_dashboard = true`:
```ts
.or(`website_id.eq.${websiteId},is_system.eq.true`)
```

Also update the main `fetchQueries` to include system queries in the list.

### Summary of files

| File | Change |
|------|--------|
| New migration | `ALTER TABLE` to add `is_system` column |
| `src/pages/QueryEditor.tsx` | Make editor read-only, hide edit prompt/format/schedule for system queries |
| `src/hooks/use-queries.ts` | Include system queries in fetch + dashboard queries |

