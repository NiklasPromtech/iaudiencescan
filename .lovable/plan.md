
# Add Basic / Advanced View Toggle to the Change Page

## What it does

When users visit `/change`, they will now see a **Basic** view by default -- a clean, empty canvas (black background card) where we will build a simplified setup later. A toggle button in the header lets them switch to the **Advanced** view, which contains all the current functionality (filters, breakdowns, date pickers, results, etc.) exactly as it is today.

## How it works

**File: `src/pages/Change.tsx`**

1. Add a `viewMode` state: `"basic" | "advanced"`, defaulting to `"basic"`
2. In the page header area, add a toggle button (e.g., a segmented control or simple button) to switch between "Basic" and "Advanced"
3. Wrap all existing form/config UI in a conditional that only renders when `viewMode === "advanced"`
4. When `viewMode === "basic"`, render a placeholder card with a dark/black background -- ready for future content
5. Results view remains shared between both modes (visible regardless of mode when results exist)

## Visual layout

```text
+------------------------------------------+
|  Measure Change                          |
|  [Basic]  [Advanced]    <-- toggle       |
+------------------------------------------+
|                                          |
|  (Basic mode: dark placeholder card)     |
|  or                                      |
|  (Advanced mode: all current controls)   |
|                                          |
+------------------------------------------+
|  Results (if any)                        |
+------------------------------------------+
```

## Technical details

- Single state variable `useState<"basic" | "advanced">("basic")` added to the `Change` component
- The toggle will use two `Button` components styled as a segmented control (one highlighted, one ghost)
- All existing JSX from the config section gets wrapped in `{viewMode === "advanced" && ( ... )}`
- Basic view renders a simple `Card` with `bg-black min-h-[400px]` as the empty canvas
- No other files need to change
