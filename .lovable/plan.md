
# SQL Editor: Syntax Highlighting + Tab-to-Complete Autocomplete

Two improvements to `src/pages/QueryEditor.tsx` only — no new packages needed.

---

## 1. Syntax Highlighting (Dune-style)

Looking at the Dune reference screenshot, the colour scheme is:

| Token | Colour | Examples |
|---|---|---|
| SQL keywords | **Purple / violet** (`#a78bfa` → `text-violet-400`) | SELECT, FROM, WHERE, JOIN, AS, AND, GROUP BY, ORDER BY, LIMIT, DISTINCT, ON, INNER, COUNT, SUM, DATE, WITH, CASE, WHEN, THEN, ELSE, END |
| String literals | **Orange** (`text-orange-400`) | `'connected'`, `'eth-mainnet'` |
| Numbers / booleans | **Orange** (`text-orange-400`) | `20`, `true`, `false`, `1e18` |
| Comments | **Muted grey italic** | `-- Transaction activity...` |
| Table & column names (schema identifiers) | **Default foreground** | `pageviews`, `wallets`, `visitor_hash` |
| Everything else (aliases, operators) | **Default foreground** | `wallet_stats`, `*`, `,`, `=`, `>=` |

This matches Dune exactly: keywords pop in violet, strings/numbers in orange, comments dimmed, identifiers stay neutral.

### Implementation — highlight-behind-textarea pattern

```
┌─────────────────────────────────┐
│ Gutter  │  <pre> (coloured)     │  ← position: absolute, pointer-events: none
│         │  <textarea> (transp.) │  ← position: absolute, caret visible
└─────────────────────────────────┘
```

- A `<pre>` layer sits absolutely behind the `<textarea>`.
- The `<textarea>` uses `color: transparent; caret-color: currentColor` (via inline style) so the caret is visible but the text itself is hidden, revealing the coloured `<pre>` beneath.
- Both share the exact same `font-mono text-xs leading-5 p-3` Tailwind classes.
- Scroll sync already exists for the gutter — it will be extended to also sync the `<pre>` layer.

### Tokenizer

A sequential regex tokenizer (no library needed) processes the SQL string and emits typed token objects:

```typescript
type Token = { type: "keyword" | "string" | "number" | "comment" | "other"; text: string };

function tokenizeSql(sql: string): Token[] { ... }
```

Regex order (important — first match wins):
1. `--[^\n]*` → comment
2. `'[^']*'` or `"[^"]*"` → string
3. `\b\d+(\.\d+)?(e\d+)?\b` → number
4. `\b(SELECT|FROM|WHERE|...)` (case-insensitive) → keyword
5. Everything else → other

The tokens are rendered as `<span>` elements inside the `<pre>`.

---

## 2. Tab-to-Complete Autocomplete

When the user is typing in the SQL textarea, pressing **Tab** (or seeing a dropdown) auto-completes to schema identifiers. This is the "schema-aware" part the user wants.

### Trigger conditions

A completion popup appears when:
- The user has typed **≥ 2 characters** of a word at the cursor position
- That partial word matches the start of at least one schema item (table name or column name)

### Completion candidates

Built from the `schema` state already available in the component:
- All table names (e.g. `pageviews`, `wallets`, `events`)
- All column names deduplicated (e.g. `visitor_hash`, `created_at`, `wallet_id`)
- Common SQL keywords (as a fallback)

### UX

A small dropdown list appears just below the cursor line (positioned absolutely using `selectionStart` → line/column calculation). It shows up to 6 matches. Navigation:
- **Tab** or **Enter** → accepts the top suggestion and replaces the current partial word
- **Arrow keys** → move selection up/down
- **Escape** → dismiss
- **Clicking outside** → dismiss

The popup is styled in `font-mono text-xs` matching the rest of the editor, with a dark `bg-popover border border-border` card look.

### Cursor position approximation

Since `<textarea>` doesn't expose pixel cursor coordinates, we'll calculate the row/column from `selectionStart` and apply a vertical offset using `lineHeight × lineNumber` within the editor's scrollable area. This is reliable for fixed-width mono fonts.

---

## Files to modify

Only `src/pages/QueryEditor.tsx`:

1. **Add** `tokenizeSql()` function (returns `Token[]`)
2. **Update** `SqlEditor` component to:
   - Accept `schema: QuerySchemaTable[]` prop
   - Add `preRef` alongside existing `gutterRef`
   - Render `<pre>` layer with tokenised spans
   - Extend `syncScroll` to also set `preRef.current.scrollTop`
   - Style `<textarea>` with `color: transparent; caretColor: 'white'` (or `currentColor` based on theme)
3. **Add** autocomplete state inside `QueryEditor` (not inside `SqlEditor` to keep schema accessible):
   - `autocomplete: { show: boolean; partial: string; matches: string[]; selected: number; top: number; left: number }`
   - `onKeyDown` handler on the textarea that intercepts Tab/Enter/Arrow/Escape
   - `onChange` wrapper that computes the current partial word and triggers suggestions
   - A positioned `<div>` dropdown rendered over the editor area
4. **Pass** `schema` down to `SqlEditor` from the parent where it's already held in state

No new npm packages. Pure CSS + React state.
