
## Three improvements to the Query Editor

### 1. New sample queries

Add these to the `SAMPLE_QUERIES` array (lines 427–466):

- **Clicks by UTM source today** — shows all outbound/internal clicks grouped by `utm_source` for today, useful for checking ad campaigns
- **Clicks from utm_source = "sample" today** — exact query the user asked for: filtered to a specific UTM source, showing the clicked `href`, `click_text`, and count
- **Top converting wallets this week** — joins `wallets` + `events` to show which wallet addresses triggered conversion events

---

### 2. CSV export for results

In the Results header bar (lines 1016–1024), add a **Download CSV** button next to the row count. When clicked it:
- Builds a CSV string from `results.columns` (header row) and `results.rows`
- Triggers a browser download via a temporary `<a>` element (same pattern as `downloadCSV` in `src/lib/export-utils.ts`)
- Shows a `Download` icon from lucide-react (already imported)

No new dependencies needed — the `downloadCSV` utility already exists in `src/lib/export-utils.ts`.

---

### 3. Draggable vertical split (resizable editor vs results)

Currently the editor area is fixed at `style={{ height: "55%" }}`. Replace this with a **drag-handle divider** so users can resize freely with their mouse.

Implementation approach — pure React state, no new library needed:

```text
State: editorHeightPx (number, default 300)

Editor div  → height = editorHeightPx px (instead of 55%)
Divider div → 6px tall, cursor: row-resize, bg-border
              onMouseDown → attach mousemove/mouseup listeners to document
              mousemove → clamp(newY, 120, containerHeight - 120)
              mouseup   → remove listeners
Results div → flex-1 (fills remaining space)
```

- Use a `containerRef` on the outer right panel (`flex-1 flex flex-col`) to know the total available height for clamping
- A `isDragging` ref (not state, to avoid re-renders) tracks whether a drag is in progress
- The divider gets `select-none` and shows a subtle grip indicator (two horizontal lines)
- Cursor changes to `row-resize` on hover and during drag (applied to `document.body` while dragging to prevent cursor flicker)

---

### Files changed

- **`src/pages/QueryEditor.tsx`** only — all three changes land here:
  - Lines 427–466: expand `SAMPLE_QUERIES` array with 3 new entries
  - Line 1: add `Download` to lucide-react imports; import `downloadCSV` from `@/lib/export-utils`
  - Lines 483–522 (state block): add `editorHeightPx` state (default `300`) and `containerRef` + `isDragging` refs
  - Lines 938–983 (right panel): replace fixed-height editor div with dynamic height, add drag handle divider below it
  - Lines 1016–1024 (results header): add CSV download button
