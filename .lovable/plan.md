
# Save Queries to Supabase

## Overview

Right now queries are hardcoded mock data. We'll create a real `queries` table in Supabase so each user's saved queries persist, and wire `Queries.tsx` and `QueryEditor.tsx` to read/write from it. The UI reference image confirms the existing layout is correct — we're just swapping mock data for real data.

---

## 1. Database — `queries` table (migration)

```sql
CREATE TABLE public.queries (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text NOT NULL DEFAULT 'New query',
  sql         text NOT NULL DEFAULT '',
  starred     boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at on every save
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER queries_updated_at
  BEFORE UPDATE ON public.queries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own queries"
  ON public.queries FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

This is user-scoped: each user only ever sees and modifies their own queries. No shared/public queries for now.

---

## 2. `src/hooks/use-queries.ts` — new hook

A small Supabase-backed hook that encapsulates all query CRUD:

```typescript
// fetch all queries for the current user (ordered by updated_at desc)
useQueries() → { queries, loading, error, refetch }

// mutations
createQuery(name, sql) → Promise<query>
updateQuery(id, patch) → Promise<void>   // patch = { name?, sql?, starred? }
deleteQuery(id) → Promise<void>
```

Uses `supabase.from("queries")` directly — same pattern as the rest of the app (no new dependencies).

---

## 3. `src/pages/Queries.tsx` — replace mock data

- Remove `mockQueries` constant
- Import and call `useQueries()`
- Show a loading skeleton (3 rows) while fetching
- Show "No queries yet — click New Query to get started" empty state
- Starring now calls `updateQuery(id, { starred: !current })` — persisted to DB
- Clicking a row still navigates to `/queries/:id` (the real UUID now)
- Sort by "Updated date" works correctly because the DB returns rows ordered by `updated_at DESC`; sort by "Name" is done client-side (same as before)
- "New Query" button: calls `createQuery("New query", "")` first, then navigates to the returned UUID — so the row is created in DB immediately

---

## 4. `src/pages/QueryEditor.tsx` — load & auto-save

**On mount (existing query):**
- If `id !== "new"`, fetch the single query row from Supabase (`supabase.from("queries").select().eq("id", id).single()`)
- Populate `title` and `sql` from the DB row

**Auto-save (debounced):**
- Whenever `title` or `sql` changes (and the query already exists in DB), debounce 1.5s then call `updateQuery(id, { name: title, sql })`
- A small "Saved" / "Saving..." indicator appears near the title so users know their work is persisted

**If `id === "new"`:**
- `QueryEditor` is no longer reachable at `/queries/new` directly for creating — "New Query" in the list page creates the DB row first and redirects to `/queries/<uuid>`. This keeps the editor always working against a real ID.
- If someone navigates to `/queries/new` directly, we create the query on the fly and redirect.

---

## 5. `src/integrations/supabase/types.ts`

Will be updated automatically once the migration runs (Lovable regenerates types). No manual changes needed.

---

## Files to Create / Modify

| File | Action |
|---|---|
| `supabase/migrations/<timestamp>_create_queries_table.sql` | Create — schema + RLS |
| `src/hooks/use-queries.ts` | Create — Supabase CRUD hook |
| `src/pages/Queries.tsx` | Modify — replace mock data with real hook |
| `src/pages/QueryEditor.tsx` | Modify — load query by ID + auto-save on edit |

---

## Visual result

The list page will look identical to the reference image — same flat row layout, star toggle, search/sort toolbar — but everything is now real and persisted per user. The editor gains a subtle "Saving..." badge near the title confirming edits are stored automatically.
