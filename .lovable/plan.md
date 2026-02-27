

# Queries: Website Scoping, Backend SQL Generation, and Delete from List

## Overview
Three changes to the Queries feature:
1. Scope queries to the selected website so each site has its own query list
2. Integrate the new backend `POST /query/generate` endpoint (replacing the edge function approach) and auto-name queries from the explanation
3. Add a delete button on each query row in the Queries list page

---

## 1. Scope Queries to Selected Website

**Database change**: Add a `website_id` column to the `queries` table via migration.

```sql
ALTER TABLE queries ADD COLUMN website_id TEXT;
CREATE INDEX idx_queries_website_id ON queries(website_id);
```

**Hook changes** (`src/hooks/use-queries.ts`):
- Accept `websiteId: string | null` parameter (or make the hook consume `useSelectedWebsite` internally)
- Filter all queries by `.eq("website_id", websiteId)` on fetch
- Include `website_id` in `createQuery` insert
- Re-fetch when `websiteId` changes

**Page changes**:
- `Queries.tsx`: Pass `selectedWebsite?.id` to the hook (or let the hook read it). Show empty state if no website selected.
- `QueryEditor.tsx`: Pass `website_id` when creating new queries. Already has `selectedWebsite` available.

---

## 2. Integrate Backend SQL Generator + Auto-Name

**New API function** (`src/lib/api/queries.ts`):
```typescript
export interface QueryGenerateResponse {
  sql: string;
  explanation: string;
}

export async function generateQuery(websiteId: string, prompt: string): Promise<QueryGenerateResponse> {
  return apiRequest<QueryGenerateResponse>("/query/generate", {
    method: "POST",
    body: JSON.stringify({ website_id: websiteId, prompt }),
  });
}
```

Re-export from `src/lib/api/index.ts`.

**QueryEditor.tsx changes** (`handleGenerate`, ~line 760):
- Replace the `supabase.functions.invoke("audiencescan-signal", ...)` call with `generateQuery(selectedWebsite.id, prompt)`
- After receiving the response, set `setSql(data.sql)` (already done) AND update the title: `setTitle(data.explanation)` — this auto-names the query based on what the AI returns
- The existing auto-save debounce will persist both the new SQL and the new name automatically

---

## 3. Delete Button on Query List

**Queries.tsx changes**:
- Import `Trash2` icon and `deleteQuery` from the hook (already exposed but not destructured)
- Add a trash icon button on each query row (next to the star button)
- On click, call `deleteQuery(query.id)` with a confirmation toast or inline confirm
- `e.stopPropagation()` to prevent row click navigation

---

## Technical Details

### File changes summary:
- **New migration**: Add `website_id` column to `queries` table
- **`src/hooks/use-queries.ts`**: Add `websiteId` param, filter fetch/create by it
- **`src/lib/api/queries.ts`**: Add `generateQuery` function + types
- **`src/lib/api/index.ts`**: Re-export new function
- **`src/pages/Queries.tsx`**: Pass website context to hook, add delete button per row
- **`src/pages/QueryEditor.tsx`**: Switch generate to backend API, auto-set title from explanation, pass `website_id` on create

### Edge cases:
- Existing queries without `website_id` will not appear when filtered — this is acceptable since it's a new feature and old queries were test data
- If no website is selected, the queries list shows a "select a website" prompt instead of loading

