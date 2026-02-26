
Goal: remove the hero heading “bounce” during slide transitions and enforce a strict black/orange color scheme in the rotating messages.

What I found
- The bounce is caused by a layout mismatch between animation states:
  - Outgoing/current text is in normal inline flow.
  - Incoming text is absolutely positioned and vertically centered.
  - When animation completes, the incoming text switches from centered absolute positioning to normal inline flow, which creates the visible vertical jump.
- Current hero messages still include non-black/orange colors (`text-destructive` and teal hex class), which conflicts with your request.

Implementation approach

1) Lock both animated lines to the exact same vertical anchor
- In `src/pages/LandingPageV3.tsx`, keep the hero text container as a fixed “stage”:
  - `relative`
  - fixed height equal to exactly two lines (not auto-growing)
  - `overflow-hidden`
- Render both outgoing and incoming message layers with the same positioning rules:
  - `absolute left-0 right-0 top-1/2 -translate-y-1/2`
  - `text-center`
- This removes the position change between “entering” and “settled” states, eliminating the bounce.

2) Prevent 3-line wraps
- Keep a controlled heading size on smaller breakpoints (already reduced).
- Add a stable width rule for the animated text layer so lines wrap predictably (instead of reflowing mid-animation).
- Enforce max two lines visually in the hero stage (clip overflow if needed) so the component never expands to a third row and never shifts surrounding layout.

3) Restrict hero message colors to black and orange only
- Update `heroMessages` classes to only use:
  - `text-foreground` (black)
  - `text-primary` (orange)
- Remove all hero uses of:
  - `text-destructive`
  - `text-[#2db19b]`
- Keep message copy as your short versions:
  - Stop paying for bot traffic.
  - Start reaching real buyers.
  - Optimise to wallet balance.
  - Partner with the right tokens.
  - Optimise to token holders.

4) Keep animation behavior unchanged
- Continue using existing `animate-hero-slide-out-right` and `animate-hero-slide-in-left`.
- Keep the existing interval cadence.
- No tailwind config changes required.

Technical notes
- The key fix is structural, not timing-related: both messages must always share the same absolute positioning model before, during, and after the transition.
- Fixed two-line stage + overflow control prevents the “one row then jump” effect and avoids multi-row layout bounce.
- This keeps the UI aligned with your existing Dune-style palette while respecting your black/orange direction.

Validation checklist after implementation
- On mobile and desktop, each transition slides smoothly with no vertical jump.
- Hero text never causes 3-line layout expansion.
- Only black/orange colors appear in the rotating hero messages.
- Looping still cycles continuously through all 5 messages.
