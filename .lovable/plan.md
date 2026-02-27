

# Fix Hero Text Animation (Simple, Reliable)

## Problem
The hero carousel text is "flipping randomly" because `onTransitionEnd` is unreliable -- it can fire multiple times from bubbling events, causing the index to skip unpredictably.

## Solution
Replace the entire animation state machine with a single `useEffect` + `setTimeout` approach. No `onTransitionEnd`, no `animating` state. Just:

1. A `currentIndex` that increments every 3.5 seconds
2. A CSS `transition-opacity` crossfade between current and next message
3. A `setTimeout` inside the effect handles the two-phase fade: fade out current (0.5s), then swap index and fade in new text

### Changes to `src/pages/LandingPageV3.tsx` (lines 94-135)

**Remove**: `animating` state, `nextIndex` computation, `handleSlideOutEnd` callback, `onTransitionEnd` handler

**Replace with**:
- Single `useEffect` with `setInterval` that sets `phase` to `"out"`, then after 500ms sets `currentIndex` to next and `phase` back to `"in"`
- Two states: `currentIndex` (number) and `phase` (`"in"` | `"out"`)
- The rendered span simply shows `heroMessages[currentIndex]` with `opacity: phase === "in" ? 1 : 0` and `transition-opacity duration-500`
- Only ONE span needed (not two layered spans) -- simpler DOM, no overlap issues

This is the most minimal approach possible: one span, one index, one phase toggle. No animation events, no race conditions.

