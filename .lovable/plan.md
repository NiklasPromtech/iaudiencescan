

## Fix Missing Logo Marquee on Landing Page

### Problem
The client logos below the "Trusted by 50+ token teams..." text are invisible. The marquee animation container (`div.relative`) is missing `overflow-hidden`, and the inner flex container has no explicit width control, so the logos either collapse or render outside the visible area.

### Fix

**File: `src/pages/LandingPageV3.tsx`** (lines 180-188)

1. Add `overflow-hidden` to the outer `div.relative` wrapper (line 180)
2. Wrap the marquee flex div in a container that ensures proper width — add `whitespace-nowrap` and `w-max` to the inner flex div so the duplicated logos stretch to their natural width, allowing the `-50%` translateX animation to loop seamlessly

Current:
```
<div className="relative">
  ...gradient divs...
  <div className="flex gap-16 items-center animate-marquee">
```

After fix:
```
<div className="relative overflow-hidden">
  ...gradient divs...
  <div className="flex gap-16 items-center animate-marquee w-max">
```

This is a two-class addition — `overflow-hidden` on the parent and `w-max` on the marquee track — no other changes needed.

