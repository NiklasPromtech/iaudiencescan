

# Animated Hero Text Swap on LandingPageV3

## What changes

The hero heading currently shows both lines statically:
```
Stop paying for bot traffic.
Start reaching real buyers.
```

We will animate this so:
1. On load, "Stop paying for bot traffic." is visible
2. After ~2.5 seconds, it slides out to the right while "Start reaching real buyers." slides in from the left
3. The second line stays permanently after the animation completes

## Visual effect
- "Stop paying for bot traffic." exits by accelerating to the right (slide-out-right)
- "Start reaching real buyers." enters from the left (slide-in-left), appearing as the first line disappears
- Both animations happen simultaneously for a smooth swap feel

## Technical details

### 1. Add keyframes to `tailwind.config.ts`
- Add `slide-out-right` keyframe (translateX(0) -> translateX(120%)) with slight ease-in
- Add `slide-in-left` keyframe (translateX(-120%) -> translateX(0)) with ease-out

### 2. Update `src/pages/LandingPageV3.tsx`
- Add `useState` and `useEffect` to manage animation state (`idle` -> `swapping` -> `done`)
- After ~2.5s delay, trigger the swap
- Render both lines in a container with `overflow-hidden` and `relative` positioning
- Line 1 ("Stop paying..."): starts visible, gets `animate-slide-out-right` class on swap, then hidden
- Line 2 ("Start reaching..."): starts off-screen left, gets `animate-slide-in-left` class on swap, then stays visible
- The `<br/>` between lines is removed; instead both lines occupy the same space using absolute/relative positioning during the transition

The animation runs once on page load and settles on the final "Start reaching real buyers." message.

