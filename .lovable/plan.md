
## Update Query Name from AI Response + Add Query History Log

### Overview
Two changes: (1) use the `name` field from the AI response to set the query title, and (2) add an in-session "Query Log" so you can jump back to any previous AI-generated iteration without losing work.

---

### A) Use AI-returned `name` for query title

The API now returns a `name` field alongside `sql` and `explanation`. We'll update the response type and both handlers to use it.

**Changes:**
- **`src/lib/api/queries.ts`** -- Add `name` to `QueryGenerateResponse` interface
- **`src/pages/QueryEditor.tsx`** -- In `handleGenerate`, set title to `data.name` (falling back to the prompt). In `handleEditGenerate`, also update the title to `data.name` when present.

---

### B) Add Query Log panel

A lightweight, in-session history of every AI generation step, stored in component state (not persisted to database -- it resets when you leave the page).

**What gets logged (each entry):**
- The prompt you sent
- The AI-returned `name`
- The AI-returned `explanation`
- The generated SQL
- Timestamp

**UI placement:**
- Add a small "History" toggle/tab below the SQL editor (or as a collapsible section above the results area).
- When expanded, shows a compact reverse-chronological list of log entries.
- Each entry displays: the prompt (as the primary label), the AI name, and a timestamp.
- Clicking an entry restores that SQL + title into the editor (with the flash animation).

**Implementation in `src/pages/QueryEditor.tsx`:**
1. New state: `queryLog` array and a `History` icon import.
2. After each successful generate/edit, push an entry to the log.
3. Render a collapsible history strip between the editor and results:
   - Collapsed: just a small "History (N)" button.
   - Expanded: scrollable list of entries with click-to-restore.
4. Clicking an entry sets `sql`, `title`, and triggers `flashEditor()`.

---

### Technical details

```text
QueryGenerateResponse {
  sql: string
  explanation: string
  name: string          <-- new field
}

QueryLogEntry {
  id: string            // crypto.randomUUID()
  prompt: string        // what the user typed
  name: string          // AI-returned name
  explanation: string   // AI-returned explanation
  sql: string           // generated SQL
  timestamp: Date
  type: 'generate' | 'edit'
}
```

**Files to modify:**
- `src/lib/api/queries.ts` -- add `name` to response type
- `src/pages/QueryEditor.tsx` -- update handlers + add query log state + UI

**No new dependencies or database changes required.**
