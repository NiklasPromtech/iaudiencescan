

# Phase 1: Landing Page Redesign — Dune.com Style

## Overview
Redesign the landing page (LandingPageV3) and shared components (Header, Footer) to match Dune.com's visual identity: warm orange/yellow gradient hero, monospace typography accents, clean white background, and a polished data-platform aesthetic.

## Visual Changes

### 1. Theme & Color Palette Update (`src/index.css`)
- Replace the current purple primary (`258 100%`) with Dune's warm palette:
  - Primary: warm orange (~30-35 hue)
  - Hero gradient: orange-to-yellow warm gradient (matching Dune's hero)
  - Keep foreground dark, backgrounds white
- Remove purple glow/shimmer keyframes
- Add a warm gradient background for the hero section

### 2. Typography (`tailwind.config.ts` + `index.html`)
- Add a monospace/mono font (e.g., "Space Mono" or "JetBrains Mono") for stats, labels, and CTAs — matching Dune's uppercase monospace button style
- Keep "Bai Jamjuree" or swap to a serif for headings (Dune uses a serif-style for their main heading)
- Add a serif font option (e.g., "DM Serif Display" or similar) for hero headlines

### 3. Header Redesign (`src/components/Header.tsx`)
- Rounded pill-shaped nav bar matching Dune's capsule navigation
- Black "Dune"-style logo button on the left, nav links in the center, LOG IN / SIGN UP on the right
- Monospace uppercase styling for nav buttons (LOG IN, SIGN UP)
- Replace current simple header with Dune's nav structure (Products, Data, Use Cases, Resources, Pricing dropdowns — adapted for AudienceScan's sections)

### 4. Hero Section (in `LandingPageV3.tsx`)
- Full-width warm orange/yellow gradient background (like Dune's peach-to-amber gradient)
- Large serif headline
- Two CTA buttons: one filled, one outlined — both using monospace uppercase text
- Stats bar below hero: "100+ Chains" style counters adapted to AudienceScan metrics (e.g., "10+ Chains", "50+ Clients", "1M+ Wallets Scanned")

### 5. Content Sections (in `LandingPageV3.tsx`)
- Simplify to match Dune's bento-card layout with large rounded cards and minimal borders
- Feature cards: large rounded rectangles with titles and short descriptions
- Customer stories section with logo + quote cards
- Keep the mock dashboard preview but restyle tables and charts to use the new warm color palette
- "Enriched by Dune" badge/label where applicable

### 6. Footer Redesign (`src/components/Footer.tsx`)
- Clean multi-column footer matching Dune's style
- Monospace section headers, simple link lists

### 7. Cleanup
- Remove unused landing page variants (LandingPageV2, Index) — or leave for now and just update V3
- Remove purple shimmer/glow animations from `index.css`

## Files to Modify
| File | Change |
|------|--------|
| `src/index.css` | New color palette, remove purple glows, add warm gradient |
| `tailwind.config.ts` | Add serif + monospace font families |
| `index.html` | Add Google Fonts links for new fonts |
| `src/components/Header.tsx` | Pill-shaped nav, monospace buttons, Dune-style layout |
| `src/pages/LandingPageV3.tsx` | Full hero + sections redesign |
| `src/components/Footer.tsx` | Multi-column Dune-style footer |
| `src/components/landing/MockDailyChart.tsx` | Warm palette for chart colors |
| `src/components/landing/MockHolderTrend.tsx` | Warm palette for chart colors |
| `src/components/landing/MockBotSummary.tsx` | Updated card styling |
| `src/components/landing/mock-data.ts` | No changes needed |

## What Stays the Same (for now)
- Dashboard pages (Overview, Bots, Scans, etc.) — Phase 2
- Auth page — Phase 2
- Dune API integration — handled separately on the backend
- Blog pages — later phase

