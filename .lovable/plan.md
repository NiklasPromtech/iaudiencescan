

# Fix: Loading Spinner Not Showing Properly When Running Queries

## Problem
The loading spinner ("Running...") doesn't display correctly because the conditional rendering checks `!hasRun` first. When a query hasn't been run yet (or after generating new SQL which resets `hasRun` to false), the "Get started" section shows instead of the running state -- causing a visual jump rather than a smooth spinner.

## Fix in `src/pages/QueryEditor.tsx`

Reorder the conditional chain in the results area (around line 1026) so `isRunning` is checked **first**, before `!hasRun`:

**Current order:**
```
!hasRun -> Get Started
isRunning -> Running spinner
runError -> Error
results -> Table
```

**Fixed order:**
```
isRunning -> Running spinner
!hasRun -> Get Started
runError -> Error
results -> Table
```

This is a single change to the ternary chain in the results area. The running spinner will always show when a query is executing, regardless of whether it's the first run or not.

## File changed
- `src/pages/QueryEditor.tsx` -- reorder the conditional branches in the results area

