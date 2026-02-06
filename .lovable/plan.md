

# Landing Page V3: White Theme, Outcome-First Rewrite

## Overview

Create a new page at `/v3/landingpage` with the **white/light platform theme** (not dark like V2). Uses the existing `Header` and `Footer` components. All the agreed positioning and content from previous discussions, adapted for the light aesthetic.

---

## New File: `src/pages/LandingPageV3.tsx`

A single new page component (~700-800 lines) structured as follows:

### Section 1: Hero

- **Headline**: "Web3 Analytics That Actually Understand Wallets"
- **Subtitle**: "Track visitors. Detect wallets. Enrich balances. Remove bots. Attribute real revenue."
- **CTA**: "See What Google Analytics Can't" (links to /auth)
- Badge: "FREE ALPHA ACCESS"
- Trust signals: No credit card, 5-minute setup
- 3 micro-steps below CTA: "Add one tag" / "See visitors + wallets" / "Find more like them"
- Light purple gradient accents instead of dark glows

### Section 2: "Google Analytics Can't See This"

Two-column contrast table with X/Check icons:

| Google Analytics (gray, faded) | AudienceScan (purple accented) |
|---|---|
| Tracks pageviews | Tracks wallets |
| Sees sessions | Sees token holders |
| Cookie-based | Wallet-based |
| Blind to balance | Knows wallet value |
| No bot clarity | Explicit bot detection |
| Guesses attribution | Measures incrementality |
| No outreach data | PR, X, Telegram, Reddit lists |

### Section 3: Bot Detection

- Same signal table mock-up, adapted for light theme (light card backgrounds, subtle borders)
- Updated testimonial: "Our bot detection data is currently the foundation of a $25K+ legal claim against a fraudulent marketing provider. Analytics you can defend in court."

### Section 4: "8 Things You Can Do Today"

Numbered 2x4 grid with icons:

1. Track Every Visit
2. Detect Wallet Extensions
3. Capture Wallet IDs
4. Enrich Wallet Balances
5. Filter Out Bots
6. Get Daily Change Reports
7. Attribute Costs to Campaigns
8. Measure Touchpoint Impact

### Section 5: CPB "Aha" Moment

With vs Without comparison cards. Light theme adaptation: "Without" card gets a gray/muted background, "With" card gets a purple-accented border and subtle purple shadow.

### Section 6: "Find More of Your Best Users"

3-step pipeline:
- Step 1: "Group" -- Segment your best wallets
- Step 2: "Scan" -- Analyze on-chain activity to find communities
- Step 3: "Act" -- Get targeting lists for X, Telegram, Reddit, PR outlets

Results preview showing sample outputs (42 X handles, 28 Telegram communities, 12 PR outlets).

Callout: "From analytics to action. We don't just show you data -- we give you the outreach lists to act on it."

### Section 7: Social Proof

Logo marquee (same client logos). Light gradient fade masks instead of black. Testimonial card with subtle border.

### Section 8: Alpha CTA

"We're in Alpha. Everything is Free." -- light background with a subtle purple gradient behind CTA.

### Section 9: How It Works (4 Steps)

1. Install the Tag
2. See Everything
3. Group Your Best Users
4. Find More Like Them

### Section 10: Final CTA

"Stop Optimizing for Clicks. Start Optimizing for Wallets."

---

## Theme Adaptation Details

All styling shifts from V2's dark theme to the platform's light theme:

| V2 (Dark) | V3 (Light) |
|---|---|
| `bg-black text-white` | `bg-background text-foreground` |
| `bg-white/[0.02]` glass cards | `bg-card border-border` cards |
| `text-white/60` | `text-muted-foreground` |
| `border-white/[0.08]` | `border-border` |
| Purple glow shadows | Subtle `shadow-elegant` and purple borders |
| Black gradient fade masks (marquee) | White/background gradient fades |
| Dark header/footer | Existing `Header` and `Footer` components |

Purple accents (gradients, badges, CTA buttons) remain consistent with the design system.

---

## Files to Create/Modify

1. **Create** `src/pages/LandingPageV3.tsx` -- New page with all 10 sections
2. **Modify** `src/App.tsx` -- Add route: `<Route path="/v3/landingpage" element={<LandingPageV3 />} />`

No new dependencies. Reuses existing `Header`, `Footer`, `Button`, `Badge` components and existing client logo assets.
