
# Add UTM Generator Tool

## Overview
Add a new "Tools" section in the sidebar under Strategy, with a UTM Generator as the first tool. The generator lets users paste a base URL, fill in UTM parameters, and copy the final tagged URL. Simple and clean for now, designed to grow over time.

## Changes

### 1. New page: `src/pages/Tools.tsx`
- Dashboard layout with a "UTM Generator" card
- Input fields:
  - **Website URL** (required) -- the base link
  - **utm_source** (e.g. twitter, telegram)
  - **utm_medium** (e.g. cpc, social, email)
  - **utm_campaign** (e.g. retargeting-q1)
  - **utm_content** (e.g. blue-ad-v2)
  - **utm_term** (optional)
- Live preview of the generated URL below the inputs
- "Copy URL" button that copies to clipboard with a toast confirmation
- "Reset" button to clear all fields
- Validation: disable copy if no base URL is entered

### 2. Sidebar update: `src/components/dashboard/DashboardSidebar.tsx`
- Add a `Wrench` icon import from lucide-react
- Add `{ title: "Tools", url: "/tools", icon: Wrench }` to the `strategyItems` array alongside Scans

### 3. Route + auth: `src/App.tsx`
- Import `Tools` page
- Add `<Route path="/tools" element={<RequireAuth><Tools /></RequireAuth>} />`

## Future extensibility (not built now, just noting)
- UTM naming/aliasing (e.g. `utm_content = 614243622634` labeled "Blue Twitter ad") could live under Enrichment as a "UTM Labels" feature, where saved labels appear in Overview tables alongside raw UTM values
- The Tools page can grow to include link shorteners, QR generators, etc.
