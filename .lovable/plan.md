
## What's Wrong

The `QueryEditor.tsx` file has broken JSX structure between lines ~966 and ~1003. During the last edit (removing the AI prompt bar and adding the "Copy Schema" bar), the code was left in an invalid state:

1. The "Copy Schema" bar and `PROMPT_CHIPS` section are inside the editor container div (`style={{ height: "55%" }}`), but that div is never closed properly.
2. A stray orphaned ternary fragment `) : isRunning ? (` appears as literal rendered text in the browser — which is exactly what the screenshot shows.
3. The `SqlEditor` component is completely missing from the JSX — it was accidentally deleted.
4. The results `<div>` block starting at line 1002 is attached at the wrong nesting level.

## The Fix

Rewrite lines 940–1097 (the right-hand panel: editor + results) with the correct JSX structure:

```text
Right panel (flex column)
├── Editor section (55% height, flex col, gap-2)
│   ├── Sample chips row (when website selected)
│   ├── Copy Schema bar
│   └── SqlEditor component  ← currently MISSING
└── Results area (flex-1, overflow-y-auto)
    ├── Empty state (!hasRun)
    ├── Running state (isRunning)
    ├── Error state (runError)
    └── Results table (results)
```

## Files to Change

- **`src/pages/QueryEditor.tsx`** — Fix lines 940–1097: restore the `SqlEditor` component inside the editor section, close the editor section div correctly, and restructure the results area as a separate sibling `div` with proper ternary logic.

## No other files need changes.
