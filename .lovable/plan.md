

# Clean Up Results Header

## What changes

When analysis results are displayed, the top of the page currently shows the full "Measure Change" header (badge, title, description, Basic/Advanced toggle) plus a separate "Analysis Results" row and then the Copy/Export buttons inside the results component. It looks cluttered and redundant.

## The fix

1. **Hide the page header when results are showing** -- wrap the existing header block (Insights badge, "Measure Change" title, description, mode toggle) in a condition so it only renders when there are no results.

2. **Create a clean, polished results toolbar** -- replace the current "Analysis Results" heading + "New Analysis" button block and move the Copy Text / Export PDF buttons up into a single unified bar:
   - Left side: a clean "Analysis Results" title with the trophy icon
   - Right side: three buttons in a row -- Copy Text (outline), Export PDF (primary/purple), New Analysis (outline)
   - Styled as a subtle card/bar with proper spacing and alignment

3. **Remove the duplicate Copy Text / Export PDF buttons** from inside `IncrementalityResultsView` since they'll now live in the parent toolbar. This will be done by either passing a prop to hide them or removing the block from the component (with a check so other consumers still get them).

## Technical details

**File: `src/pages/Change.tsx`**
- Wrap the header `div` (lines 585-617) with `{!results && ( ... )}` so it hides when results are present
- Replace the results header block (lines 621-630) with a polished toolbar containing all three actions (New Analysis, Copy Text, Export PDF). The copy/export logic will be lifted from `IncrementalityResultsView` or triggered via a ref/callback.

**File: `src/components/touchpoints/IncrementalityResultsView.tsx`**
- Add an optional `hideActions?: boolean` prop
- When `hideActions` is true, skip rendering the export actions bar (lines 307-336)
- Pass `hideActions={true}` from `Change.tsx`
- Expose `handleCopyReport` and `handleExportPDF` via `React.forwardRef` + `useImperativeHandle` so the parent can trigger them from its toolbar buttons

