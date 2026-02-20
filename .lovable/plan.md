
# Fix: Sample Query Disappears Due to Stale Closure in Auto-Save

## Root Cause

There are two interacting bugs that together erase the sample query immediately after injection:

**Bug 1 — `createQuery` writes empty SQL to the database.**
When the user navigates to `/queries/new`, the code calls `createQuery("New query", "")` — which writes an empty string (`""`) to the `queries` table. This means when the new query loads (after the UUID redirect), `data.sql` is `""` (a valid string, not `null`), so the Supabase load sets `setSql("")`.

**Bug 2 — Stale closure in the auto-save `useEffect`.**
The auto-save effect has `[title, sql]` as its dependency array. When the sample injection effect calls `setSql(sampleSQL)`, React schedules a re-render. However, the auto-save effect fires synchronously in the same render cycle where `sql` is still `""` in the closure. This means:
1. Sample injection sets `sql` = sample → React re-renders
2. Auto-save fires with the *old* `sql = ""` in its closure
3. Auto-save debounces and then calls `updateQuery(id, { sql: "" })` — **overwriting the sample with empty**
4. The `isFirstLoad.current` guard doesn't reliably block this because it's consumed in the same tick that injection sets it

**The `isFirstLoad` approach is fundamentally fragile** — it's a single boolean ref shared between two effects that fire in unpredictable order.

---

## The Fix

### 1. Block auto-save during injection using a dedicated ref

Replace the single `isFirstLoad` ref with a `skipNextSave` ref that is explicitly set to `true` immediately before calling `setSql(sample)`. The auto-save effect checks this ref and clears it, guaranteeing exactly one skip regardless of render batching.

```typescript
const skipNextSave = useRef(true); // start true — block any save until first real edit
```

In the sample injection effect:
```typescript
skipNextSave.current = true;
setSql(sampleSQL);
```

In the auto-save effect:
```typescript
if (skipNextSave.current) {
  skipNextSave.current = false;
  return;
}
// ... proceed with save
```

### 2. Use a ref to always read the latest SQL in the auto-save closure

Add a `sqlRef` that mirrors the `sql` state value. The auto-save debounce callback reads from `sqlRef.current` instead of the closed-over `sql`, so it always saves the *current* value, not the stale one from when the effect was scheduled.

```typescript
const sqlRef = useRef(sql);
useEffect(() => { sqlRef.current = sql; }, [sql]);

// inside debounce:
await updateQuery(id, { name: titleRef.current, sql: sqlRef.current });
```

### 3. Remove the `isFirstLoad` ref entirely

It's no longer needed — `skipNextSave` handles the load-time suppression cleanly.

---

## Files to Modify

| File | Change |
|---|---|
| `src/pages/QueryEditor.tsx` | Replace `isFirstLoad` with `skipNextSave` + `sqlRef` + `titleRef`; update auto-save and injection effects |

---

## Technical Detail — Execution Order

```text
User visits /queries/new
  → createQuery("New query", "") called — DB row created with sql = ""
  → navigate to /queries/UUID

Query load effect fires (id = UUID, isNew = false)
  → fetches row from DB, data.sql = ""
  → setSql("") — no change (sql was already "")
  → setQueryLoading(false)

Sample injection effect fires (queryLoading=false, isNew=false, sql="", tag_id=available)
  → skipNextSave.current = true        ← guard is SET
  → setSql(sampleSQL)                  ← triggers re-render

Auto-save effect fires (sql changed)
  → sees skipNextSave.current = true
  → sets skipNextSave.current = false  ← guard CONSUMED
  → returns early — no DB write        ← SAMPLE IS SAFE ✓

User edits SQL later
  → auto-save fires normally, skipNextSave.current = false → saves correctly ✓
```
