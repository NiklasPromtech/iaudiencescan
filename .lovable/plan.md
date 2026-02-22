

## Fix: Replace DM Serif Display with Bai Jamjuree on the Landing Page

### The Issue

The hero and section headings on `LandingPageV3.tsx` use `font-serif` (DM Serif Display) — a decorative serif typeface that clashes with the flat, Dune-inspired aesthetic. The rest of the platform uses **Bai Jamjuree** (clean geometric sans-serif) for all text and **Space Mono** for data/labels. The serif font makes the landing page feel like a different product.

### The Fix

Replace every `font-serif` class in `src/pages/LandingPageV3.tsx` with the default `font-bai` (or simply remove it, since `font-bai` is already the body default). Headings should use `font-bold` or `font-semibold` at their current sizes — the weight and size do the heavy lifting, not a different typeface.

### File: `src/pages/LandingPageV3.tsx`

Find and replace all instances of `font-serif` with `font-bold` (or remove if `font-bold` is already present). Affected lines:

- **Line 94** (hero h1): `font-serif text-5xl` → `font-bold text-5xl`
- **Line 121** (bot section h2): `font-serif text-2xl` → `font-bold text-2xl`
- **Line 172** (outcome grid h2): `font-serif text-3xl` → `font-bold text-3xl`
- **Line 237** (audience section h2): `font-serif text-3xl` → `font-bold text-3xl`
- **Line 254** (SQL section h2): `font-serif text-2xl` → `font-bold text-2xl`
- **Line 277** (testimonial h2): `font-serif text-3xl` → `font-bold text-3xl`
- **Line 298** (without/with h2): `font-serif text-3xl` → `font-bold text-3xl`
- **Line 333** (final CTA h2): `font-serif text-3xl` → `font-bold text-3xl`

This is a simple find-and-replace across one file. No component or layout changes needed.

