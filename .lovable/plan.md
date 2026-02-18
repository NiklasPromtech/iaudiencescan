

# Fix Platform Card Header Wrapping

## Problem
In the Scan Results Communities tab, the platform card headers (e.g. "X / Twitter / 11 communities found") wrap to 2 rows when the action buttons ("Copy All" + "Create X Ads Campaign") take too much horizontal space. This pushes the content below out of alignment across the grid.

## Solution
Allow the header to wrap gracefully by changing the layout to `flex-wrap` so the buttons drop below the title on narrow cards instead of squeezing the title text.

## Technical Details

### File: `src/components/scan-results/PlatformTargetingCard.tsx`

**Line 181** -- Change the header flex container:
- From: `flex items-center justify-between gap-3`
- To: `flex items-center justify-between gap-3 flex-wrap`

This lets the button group wrap to a second line cleanly when space is tight, keeping the title + subtitle on one consistent row and the buttons on the next, rather than the title text itself breaking across lines.

