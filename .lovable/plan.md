
# Update Brand Assets and Network Chart Colors

The new branding has a distinct look: an **orange half-circle** behind **dark navy bar-chart bars**, with "Audience" in dark navy and "Scan" in orange. The network graph visuals use **orange** (core wallets), **navy/indigo** (overlapping holders), and **gray** (noise) — no more purple.

## What Needs to Change

### 1. Copy New Logo Assets into the Project
Copy the uploaded images to replace the existing logo files:
- **Icon (square)**: Copy `user-uploads://5DEB7A01-2E21-43B8-B7C5-9ED4271E3E28.jpeg` to `src/assets/audiencescan-icon.png` (replaces old icon)
- **Logo with wordmark (dark)**: Copy `user-uploads://5DEB7A01-2E21-43B8-B7C5-9ED4271E3E28-2.jpeg` to `src/assets/audiencescan-logo-dark.png` (replaces old dark logo)
- **Network hero image**: Copy `user-uploads://81883F2F-CB6B-43D5-B3B1-A3B8E786D461.png` to `public/og-network-preview.png` (replaces OG share image for scan network pages)

### 2. Update Footer Logo
The Footer (`src/components/Footer.tsx`) uses an old logo from `lovable-uploads/7badbb3e...`. Replace it with the new `audiencescan-icon.png` asset imported properly via ES6 module.

### 3. Network Chart — Purple to Orange/Navy
The Network page (`src/pages/Network.tsx`) currently uses **purple** (`#a855f7`, `purple-500`, `purple-600`) for everything: edges, node rings, ambient glow, hover panel borders, stats badge, and tags. Per the new brand imagery, these should be updated to:
- **Edges/connections**: Orange (`hsl(28, 100%, 54%)` / `#f97316`) — matching the "core wallet cluster" lines in the brand images
- **Node rings**: Orange for high-score nodes, navy (`#334155` / `slate-700`) for lower-score
- **Ambient glow**: Warm orange glow instead of purple
- **Hover panel**: Border and accents switch from purple to orange/navy
- **Score dots**: Orange instead of purple
- **Tags**: Navy/indigo pills instead of purple
- **Stats badge**: Orange dot + orange text instead of purple

This affects ~30 instances of purple in `Network.tsx`.

### 4. LandingPageV2 Footer Logo
`src/pages/LandingPageV2.tsx` also references the old `lovable-uploads/7badbb3e...` logo — update to use the imported icon asset.

## Files to Modify

| File | Change |
|------|--------|
| `src/assets/audiencescan-icon.png` | Replace with new icon (orange half-circle + navy bars) |
| `src/assets/audiencescan-logo-dark.png` | Replace with new wordmark logo |
| `public/og-network-preview.png` | Replace with new network hero image |
| `src/components/Footer.tsx` | Import `audiencescan-icon.png` instead of hardcoded lovable-uploads path |
| `src/pages/Network.tsx` | Replace all purple colors with orange/navy to match new brand palette |
| `src/pages/LandingPageV2.tsx` | Update logo reference to use imported asset |

## What Stays the Same
- Header.tsx already imports `audiencescan-icon.png` — will automatically pick up new file
- DashboardSidebar.tsx already imports both `audiencescan-icon.png` and `audiencescan-logo-dark.png` — will automatically pick up new files
- All other pages importing `audiencescan-logo-white.png` (Wizard, Video, etc.) are unaffected unless a new white version is provided
- Chart colors on landing page mock components (already orange/teal) stay as-is
- CSS theme variables stay the same
