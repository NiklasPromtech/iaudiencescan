

# Landing Page V3: Fix Table Edge + Readability Overhaul

## Problem

1. **Table edge bug**: The scorecard grid uses `border-r` on every cell including the last one, but `last:border-r-0` only works on the last item overall — on a 2-col mobile grid, the 2nd and 4th items also show a right border cutting into the card edge.

2. **Wall of content**: 10 sections plus charts, tables, cards, news feed — it never breathes. Reads like a product spec, not a sales page. Need progressive disclosure so casual visitors get the pitch fast, detail-seekers can keep scrolling.

## Fixes

### 1. Table Edge Fix (Scorecard Row)

Change the scorecard grid from individual `border-r` cells to use `divide-x` on the parent, and remove the outer border on the last cell. Also wrap the whole scorecard in a proper container that clips cleanly.

### 2. Breathing Room + Progressive Disclosure

Restructure the page flow so it alternates between **punchy sell sections** (short, large text, one idea) and **proof sections** (data, charts, tables). Add visual breathing between dense sections.

**Specific changes:**

- **Remove duplicate captions**: Many mock components have both an inline caption AND a separate `<p>` caption below. Remove the redundant ones.

- **Collapse "8 Things" into 2 rows of 4**: Already done, but add a soft divider line between the capabilities grid and the cost table — they currently smash together.

- **Add section dividers**: Subtle `<hr>` or spacing between dense data sections so they don't bleed into each other.

- **Reduce chart section padding**: The Daily Metrics chart sits alone in its own section with `py-20` below the dashboard — feels disconnected. Merge it into the dashboard preview section so dashboard + chart read as one cohesive "this is what you'll see" block.

- **Tighten the News Feed**: Move it inside Section 6 (Audience Intelligence) as a sub-element rather than a standalone section. It's part of the same "scan results" story. This reduces the total section count.

- **Consolidate CTAs**: Currently 3 CTA sections (Alpha CTA, How It Works, Final CTA). Merge the Alpha CTA into the How It Works section as a button at the bottom. This cuts one full section.

- **Make How It Works anchor-friendly**: Add `id="how-it-works"` so the footer link works.

## Technical Changes

**File: `src/pages/LandingPageV3.tsx`**

1. **Lines 143-150 (scorecard grid)**: Replace `border-r border-border last:border-r-0` with a `divide-x divide-border` approach on the parent grid. This fixes the edge clipping.

2. **Lines 185-190 (Daily Chart section)**: Remove the standalone section wrapper. Move `<MockDailyChart />` inside the dashboard preview section (after line 182), still within the `max-w-5xl` container. Add a small `mt-6` gap.

3. **Lines 387-388 (News Feed)**: Move `<MockNewsFeed />` inside Section 6 (before the closing italic text on line 381), making it part of Audience Intelligence rather than a standalone section.

4. **Lines 406-427 (Alpha CTA section)**: Remove this entire section. Move the "We're in Alpha" badge + copy into the How It Works section as a CTA block at the bottom.

5. **Lines 429-445 (How It Works section)**: Add `id="how-it-works"` to the section tag. Add the merged Alpha CTA content below the steps grid.

6. **Remove duplicate captions** from MockDailyChart and MockHolderTrend (the bottom `<p>` tags that repeat the header).

7. **Add `mb-6`** between the capabilities grid and cost attribution table (line 283) for breathing room.

**File: `src/components/landing/MockDailyChart.tsx`**
- Remove the duplicate caption on line 37.

**File: `src/components/landing/MockHolderTrend.tsx`**  
- Remove the duplicate caption on the last line.

### Result

- **Before**: 10 sections, wall of data, table edge bug
- **After**: 8 sections, alternating sell/proof rhythm, clean table edges, same depth for scrollers but faster read for skimmers

