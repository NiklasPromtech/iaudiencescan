
## The Bug

The custom SQL tokenizer in `tokenizeSql()` (lines 120–152) processes SQL by slicing off one matched token at a time. After each slice, `remaining` starts at position 0 — so the regex has no memory of what character came before. This means the keyword boundary check `\b` at the *start* of the keyword regex always fires if the next character is a word character, even if we're mid-identifier.

Example trace for `referrer_domain,\n`:
- The tokenizer accumulates `referrer_do` as "other"
- `remaining` becomes `main,...`
- Then `ain,...` → `in,...`
- At `in,` → the keyword regex `^\b(IN)\b` fires: `\b` matches at position 0 (string start = non-word boundary), `in` matches `IN` (case-insensitive), `\b` matches after `n` because `,` is non-word
- `in` becomes a keyword token → coloured purple/violet

Other identifiers at risk from the same bug:
- Identifiers ending in `on` → matches `ON` (e.g. `session`, `conversion`)
- Identifiers ending in `or` → matches `OR` (e.g. `color`, `referrer`)
- Identifiers ending in `as` → matches `AS`
- Identifiers ending in `is` → matches `IS`
- Identifiers ending in `by` → matches `BY`
- Identifiers ending in `if` → matches `IF`
- Identifiers ending in `all` → matches `ALL`

## The Fix

Track the last consumed character in the tokenizer loop. Before attempting keyword matching, check if the previous character was a word character (`[a-zA-Z0-9_]`). If it was, skip the keyword pattern — we're mid-identifier.

```text
tokenizeSql():
  add:  let prevChar = "";
  add:  const isWordChar = (c: string) => /\w/.test(c);

  inside the for loop, before the keyword pattern:
  add:  if (type === "keyword" && prevChar !== "" && isWordChar(prevChar)) continue;

  after matching any token:
  add:  prevChar = text[text.length - 1];
```

This is a 4-line change — no structural rewrites needed. It correctly prevents `IN`, `OR`, `ON`, `AS`, `IS`, `BY`, `IF`, `ALL`, and all other keywords from matching mid-word.

## Files Changed

- **`src/pages/QueryEditor.tsx`** lines 120–152 only — the `tokenizeSql` function.
