

## Align Border Radius to Dune Aesthetic

### The Problem
Dune.com uses tight, subtle border-radius on cards and containers (~8px / `rounded-lg`), while the AudienceScan codebase is littered with `rounded-2xl` (16px) and `rounded-3xl` (24px), giving everything an overly bubbly, app-like feel that clashes with the sharp data-dashboard aesthetic.

### Dune's Radius Rules (from screenshots)
- **Cards / containers**: `rounded-lg` (8px) -- subtle, almost flat
- **Tags / pills / avatars**: `rounded-full` -- stays pill-shaped (no change needed)
- **Buttons**: `rounded-md` (6px) -- already correct in the `Button` component
- **Tables**: No rounding or very subtle (`rounded-lg` on outer container)
- **Dialogs / modals**: `rounded-lg`
- **Icon containers**: `rounded-lg` (not `rounded-xl` or `rounded-2xl`)
- **Charts inside cards**: Card gets `rounded-lg`, chart itself has no extra rounding

### What Changes

**Global mapping:**
- `rounded-3xl` --> `rounded-xl` (max rounding for hero/CTA accent cards)
- `rounded-2xl` --> `rounded-lg` (standard cards, containers, frames)
- `rounded-xl` on icon boxes --> `rounded-lg`
- Keep `rounded-full` on pills, avatars, social icons, nav bar
- Keep `rounded-md` on buttons, small inputs

### Files to Update (22 files, ~451 occurrences)

**Landing / marketing components (7 files):**
1. `src/components/landing/DashboardFrame.tsx` -- `rounded-2xl` to `rounded-lg`
2. `src/components/landing/MockBotSummary.tsx` -- `rounded-2xl` to `rounded-lg`
3. `src/components/landing/MockHolderTrend.tsx` -- `rounded-2xl` to `rounded-lg`
4. `src/components/Features.tsx` -- icon boxes from `rounded-2xl` to `rounded-lg`
5. `src/components/MoneyBackGuarantee.tsx` -- icon box `rounded-2xl` to `rounded-lg`
6. `src/components/FinalCTA.tsx` -- icon box `rounded-2xl` to `rounded-lg`
7. `src/components/PlaybookFloatingCTA.tsx` -- `rounded-2xl` to `rounded-lg`

**Landing pages (4 files):**
8. `src/pages/LandingPageV3.tsx` -- all bento cards, testimonial, step cards
9. `src/pages/Index.tsx` -- `rounded-xl` to `rounded-lg`
10. `src/pages/Sample1.tsx` -- stat cards
11. `src/pages/Pricing.tsx` -- if applicable

**Blog posts (6 files):**
12. `src/pages/BlogPostAddressableAudiences.tsx`
13. `src/pages/BlogPostAgencyDifferentiation.tsx`
14. `src/pages/BlogPostAudienceScanAds.tsx`
15. `src/pages/BlogPostROI.tsx`
16. `src/pages/BlogPostGuarantee.tsx`
17. `src/pages/BlogPostTracking.tsx`

**Standalone / video pages (5 files):**
18. `src/pages/Video1.tsx`
19. `src/pages/VideoWhite.tsx`
20. `src/pages/Confidence.tsx`
21. `src/pages/PlaceholderAI.tsx`
22. `src/pages/Creation.tsx`

**No changes needed:**
- `src/components/ui/card.tsx` -- already uses `rounded-lg` (correct)
- `src/components/ui/button.tsx` -- already uses `rounded-md` (correct)
- All dashboard/platform components (Overview, Bots, Audiences, etc.) -- no `rounded-2xl` or `rounded-3xl` found
- `rounded-full` on pills, avatars, social icons -- stays as-is

### Technical Detail
This is a straightforward find-and-replace across 22 files:
- Replace `rounded-3xl` with `rounded-xl`
- Replace `rounded-2xl` with `rounded-lg`
- Replace `rounded-xl` (on icon containers only, not pills) with `rounded-lg`
- Leave `rounded-full`, `rounded-md`, and `rounded-sm` untouched

