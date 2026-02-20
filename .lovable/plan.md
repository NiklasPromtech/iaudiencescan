
# Wire the AI "Generate" Button to Produce Real SQL

## What's currently there

The QueryEditor already has a polished prompt UI — a text input, three example chips ("Find all wallets that interacted with Uniswap…", etc.), and a "Generate" button. But the button is entirely disconnected. No edge function exists for SQL generation. Clicking it does nothing.

## What we're building

A new Supabase edge function (`sql-generate`) that takes a natural language prompt + the current schema, calls the Lovable AI gateway, and returns a ready-to-paste SQL query. The QueryEditor "Generate" button will call it, stream or await the response, and drop the result directly into the SQL editor.

---

## 1. New edge function — `supabase/functions/sql-generate/index.ts`

This follows the exact same pattern as the existing `audiencescan-signal` function (already in the project):

- Validates the JWT from the `Authorization` header
- Reads `{ prompt, schema }` from the request body
- Sends a system prompt + user message to `https://ai.gateway.lovable.dev/v1/chat/completions`
- Model: `google/gemini-3-flash-preview`
- Returns the SQL string in a simple JSON response `{ sql: "SELECT ..." }`
- Handles 429 and 402 errors with friendly messages

**System prompt** (kept server-side, never exposed to client):
```
You are a SQL query generator for the AudienceScan analytics platform.
You receive a natural language request and a database schema, and you return 
ONLY valid SQL — no explanation, no markdown fences, no preamble.
The SQL must be compatible with BigQuery syntax.
Only reference tables and columns that exist in the provided schema.
If the request cannot be answered from the schema, return a SQL comment explaining why.
```

The schema from the frontend (already fetched and stored in state) is passed in the request body so the AI knows exactly which tables and columns exist.

---

## 2. `supabase/config.toml` — register the new function

Add an entry for `sql-generate` with `verify_jwt = true` (only authenticated users can generate queries).

---

## 3. `src/pages/QueryEditor.tsx` — wire the Generate button

**State additions:**
- `isGenerating: boolean` — shows a spinner on the button while waiting

**`handleGenerate` function:**
```typescript
const handleGenerate = async () => {
  if (!prompt.trim() || isGenerating) return;
  setIsGenerating(true);
  try {
    const { data, error } = await supabase.functions.invoke("sql-generate", {
      body: { prompt, schema }  // schema is already in state from fetchQuerySchema()
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    setSql(data.sql);           // drops the generated SQL into the editor
    setHasRun(false);           // resets results area so user sees the editor
  } catch (err) {
    toast({ title: "Couldn't generate query", description: err.message, variant: "destructive" });
  } finally {
    setIsGenerating(false);
  }
};
```

**Button update:**
```tsx
<Button
  onClick={handleGenerate}
  disabled={!prompt.trim() || isGenerating}
>
  {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
  {isGenerating ? "Generating..." : "Generate"}
</Button>
```

**After generation:** The prompt input is cleared, the generated SQL appears in the editor, and the user can immediately click Run or tweak the query. The auto-save debounce will persist the new SQL automatically.

**Chip behaviour:** Clicking a chip fills the prompt input (already works) — then the user clicks Generate (or hits Enter in the prompt field).

---

## 4. Add Toaster to QueryEditor

The QueryEditor doesn't currently have a `<Toaster />` or `useToast()` — we'll add both so the error toast from failed generation is visible.

---

## Files to Create / Modify

| File | Action |
|---|---|
| `supabase/functions/sql-generate/index.ts` | Create — new AI edge function |
| `supabase/config.toml` | Modify — register the new function |
| `src/pages/QueryEditor.tsx` | Modify — wire Generate button + add toast |

---

## Technical notes

- Uses `supabase.functions.invoke` (non-streaming) since we want the full SQL before inserting it into the editor — partial SQL mid-stream would be unusable
- The schema passed to the AI is already available in `schema` state (fetched from `/query/schema` on mount) — no extra API call needed
- The `LOVABLE_API_KEY` secret is auto-provisioned in the Supabase environment — no user action required
- 429 / 402 errors from the AI gateway are surfaced as descriptive toasts, consistent with the `audiencescan-signal` function pattern
