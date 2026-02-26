

# Rotating Hero Text Carousel on LandingPageV3

## What changes

The hero heading currently swaps once (from "Stop paying for bot traffic." to "Start reaching real buyers."). We will turn it into a looping carousel that cycles through five messages, each sliding out to the right while the next slides in from the left.

## Messages in order

1. "Stop paying for bot traffic."
2. "Start reaching real buyers."
3. "Optimise to the wallets with the highest balance."
4. "Partner with the tokens your connected wallets hold."
5. "Optimise to the action that generated the most holders."

After the last message, it loops back to the first.

## Animation behavior

- Each message displays for ~3 seconds before transitioning
- The outgoing text slides out to the right (existing `hero-slide-out-right` animation)
- The incoming text slides in from the left (existing `hero-slide-in-left` animation)
- Continuous loop forever

## Technical details

### Update `src/pages/LandingPageV3.tsx`

1. Define a `heroMessages` array with the five phrases (each with optional color styling -- first line white/foreground, rest get accent colors like primary, emerald, amber, cyan).

2. Replace the current `heroPhase` state with:
   - `currentIndex` (number) -- which message is showing
   - `animating` (boolean) -- whether a swap is in progress

3. Use `useEffect` with `setInterval` (~3.5s) to trigger `animating = true`. On animation end, increment index (mod array length) and set `animating = false`.

4. Render logic:
   - Current message visible; when `animating`, apply `animate-hero-slide-out-right`
   - Next message (absolute positioned) enters with `animate-hero-slide-in-left` when `animating`
   - On animation end, update `currentIndex` to the next index

5. Increase `minHeight` to ~2.4em to accommodate the longer lines that may wrap on smaller screens.

### No changes to `tailwind.config.ts`
The existing `hero-slide-out-right` and `hero-slide-in-left` keyframes and animations are reused as-is.

