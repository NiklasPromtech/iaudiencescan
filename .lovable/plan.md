

## Fix seeded queries not appearing on dashboard after navigation

### Problem
When `seedDefaultQueries()` clones the `is_system = true` templates, it copies `on_dashboard` from the template — but several templates have `on_dashboard = false`. Result: user lands on dashboard, sees the system templates rendered (via the `is_system.eq.true` OR-clause in `fetchDashboardQueries`), navigates to Queries and back, and the dashboard is now empty because their owned copies aren't pinned.

On top of that, the OR-clause itself causes the "ghost templates" effect — the dashboard is showing global templates, not the user's own seeded copies.

### Fix

**1. `src/hooks/use-queries.ts` — `seedDefaultQueries`**
- When cloning each template, force `on_dashboard: true` (override the template's value) so every seeded copy is immediately pinned to the new website's dashboard.
- Everything else stays the same: `is_system: false`, `starred: false`, fresh `user_id` + `website_id`.

**2. `src/hooks/use-queries.ts` — `fetchDashboardQueries`**
- Remove `is_system.eq.true` from the OR-clause. Dashboard tiles should be **only** the user's own queries for this website (`website_id.eq.${websiteId}`). System templates are pure templates — they should never render directly on a dashboard, only get cloned via the seeder or a future "Add from template" picker.
- This eliminates the "tiles appear then vanish" flicker and the cross-website leakage permanently.

**3. `src/hooks/use-queries.ts` — `fetchQueries` (list view)**
- Keep the OR-clause here so the Queries page still shows system templates as starting points the user can clone manually. (No change — leave as-is.)

### Resulting flow
- New website → seeder clones the 6 templates with `on_dashboard = true`, `is_system = false`, owned by the website.
- Dashboard query: `website_id = X` only → shows the 6 seeded copies.
- User edits/deletes one → it stays edited/deleted because they own it.
- Navigating away and back → same 6 owned copies render, no flicker, no disappearing tiles.

### Files to change
- `src/hooks/use-queries.ts` — two small edits: force `on_dashboard: true` in the seed clone payload; drop `is_system.eq.true` from `fetchDashboardQueries` OR-clause.

### Out of scope
- A "Start from template" picker in the dashboard (can be added later if you want users to re-pull templates after deleting copies).
- Touching the Queries list view behavior.

