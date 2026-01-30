

# LandingPageV2 Refinements: Tighter UI & Scroll-Based Motion

## Overview

Make the landing page feel more refined and polished by reducing visual heaviness (smaller buttons, text, and stat cards), restructuring the audience steps to fit on a single row, and adding a scroll-triggered slide effect for that row.

---

## Changes Summary

### 1. Smaller Buttons (Across All CTAs)

**Current Issue**: Buttons with `text-lg px-10 py-6` and `text-lg px-12 py-6` are too large and dominating

**Solution**: Reduce to more compact sizing:
- Hero CTA: `text-base px-8 py-4` (was `text-lg px-10 py-6`)
- Alpha CTA: `text-base px-10 py-4` (was `text-lg px-12 py-6`)
- Final CTA: `text-base px-8 py-4` (was `text-lg px-10 py-6`)
- Header CTA: Keep current size (already reasonable)

---

### 2. Smaller Text (Typography Adjustments)

**Current Issue**: Headlines and body text feel oversized for the premium dark aesthetic

**Solution**: Reduce heading and body text sizes:

**Hero Section:**
- Main headline: `text-3xl md:text-4xl lg:text-5xl` (was `text-4xl md:text-5xl lg:text-7xl`)
- Subtext: `text-lg` (was `text-xl`)

**Section Headlines:**
- Use `text-2xl md:text-3xl` instead of `text-h2` (35px) for section titles
- Use `text-base` instead of `text-p1` (18px) for descriptions

**Alpha CTA Section:**
- Headline: `text-3xl md:text-4xl lg:text-5xl` (was `text-4xl md:text-5xl lg:text-6xl`)

---

### 3. Smaller Stat Cards

**Current Issue**: Stat cards in hero with `text-2xl md:text-3xl` numbers feel too prominent

**Solution**: 
- Numbers: `text-xl md:text-2xl` (was `text-2xl md:text-3xl`)
- Labels: `text-xs` (was `text-sm`)
- Card padding: `p-3` (was `p-4`)

---

### 4. Audience Steps: Single Row + Scroll Slide Animation

**Current Layout**: 5 cards in `flex-wrap` creating 2 rows on desktop

**New Layout**: 
- Single horizontal row using `grid grid-cols-5 gap-3` on desktop
- Each card is more compact with reduced padding
- Cards have shorter descriptions (trim text if needed)

**Scroll-Based Slide Animation**:
- Implement scroll listener using `useRef` and `useEffect`
- Track section's position relative to viewport
- Calculate `translateX` value based on scroll progress
- As user scrolls down, the row slides left (subtle, maybe 50-100px total movement)
- Use `transform: translateX(-${scrollProgress * 60}px)` style
- Apply `transition: transform 0.1s ease-out` for smooth updates

**Implementation Pattern** (from WizardV2):
```typescript
const audienceRowRef = useRef<HTMLDivElement>(null);
const [audienceSlideProgress, setAudienceSlideProgress] = useState(0);

useEffect(() => {
  const handleScroll = () => {
    if (!audienceRowRef.current) return;
    const rect = audienceRowRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    // Progress from 0 to 1 as element moves from bottom to top of viewport
    const progress = Math.max(0, Math.min(1, 1 - (rect.top / windowHeight)));
    setAudienceSlideProgress(progress);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

**Compact Card Design**:
- Reduce icon size: `h-4 w-4` (was `h-5 w-5`)
- Reduce icon container: `p-2` (was `p-3`)
- Card padding: `p-3` (was `p-4`)
- Card min-width: Remove (let grid handle sizing)
- Description: `text-[11px]` and truncate to 1-2 lines
- Arrow between cards: `h-4 w-4` (was `h-5 w-5`)

---

## Technical Details

### File Modified:
- `src/pages/LandingPageV2.tsx`

### New State/Refs:
```typescript
const audienceRowRef = useRef<HTMLDivElement>(null);
const [audienceSlideProgress, setAudienceSlideProgress] = useState(0);
```

### Updated Scroll Effect:
Add to existing component the scroll listener that calculates progress for the audience row section.

### Updated Audience Steps Section:
```tsx
<div 
  ref={audienceRowRef}
  className="grid grid-cols-5 gap-3"
  style={{
    transform: `translateX(-${audienceSlideProgress * 60}px)`,
    transition: 'transform 0.1s ease-out'
  }}
>
  {audienceSteps.map((step, index) => (
    <div key={index} className="relative flex items-center">
      <div className="flex flex-col items-center p-3 bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-lg hover:border-purple-500/40 transition-all duration-300">
        <div className="p-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-2">
          <step.icon className="h-4 w-4 text-purple-400" />
        </div>
        <h3 className="font-semibold text-white text-sm">{step.title}</h3>
        <p className="text-[11px] text-white/50 text-center mt-1 line-clamp-2">{step.description}</p>
      </div>
      {index < audienceSteps.length - 1 && (
        <ArrowRight className="h-4 w-4 text-purple-500/60 mx-1 absolute -right-3 top-1/2 -translate-y-1/2" />
      )}
    </div>
  ))}
</div>
```

### Mobile Considerations:
- On mobile (`md:` breakpoint), use `grid grid-cols-2` or `grid-cols-3` with smaller gap
- Disable slide animation on mobile (only apply transform on `lg:` and up)
- Use responsive classes: `lg:grid-cols-5 md:grid-cols-3 grid-cols-2`

---

## Summary of Size Reductions

| Element | Before | After |
|---------|--------|-------|
| Hero headline | `text-4xl md:text-5xl lg:text-7xl` | `text-3xl md:text-4xl lg:text-5xl` |
| Hero subtext | `text-xl` | `text-lg` |
| CTA buttons | `text-lg px-10 py-6` | `text-base px-8 py-4` |
| Stat numbers | `text-2xl md:text-3xl` | `text-xl md:text-2xl` |
| Stat labels | `text-sm` | `text-xs` |
| Stat card padding | `p-4` | `p-3` |
| Section headlines | `text-h2` (35px) | `text-2xl md:text-3xl` |
| Alpha CTA headline | `text-4xl md:text-5xl lg:text-6xl` | `text-3xl md:text-4xl lg:text-5xl` |
| Audience card padding | `p-4` | `p-3` |
| Audience icon | `h-5 w-5` | `h-4 w-4` |
| Audience description | `text-p4` | `text-[11px]` |

