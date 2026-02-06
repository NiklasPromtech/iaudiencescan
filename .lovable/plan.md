

# Make LandingPageV3 the Homepage + Header Update + Mock Dashboard Previews

## Changes Overview

Three things need to happen:
1. Make V3 the default landing page at `/`
2. Update the Header to remove dead links and align the CTA
3. Add mock dashboard previews with dummy data to the landing page sections so visitors can see the actual product

---

## 1. Route Change (`src/App.tsx`)

- Change `path="/"` from `<WizardV2 />` to `<LandingPageV3 />`
- Move WizardV2 to `/wizard/v2` (already exists there as a duplicate, so just update the `/` route)
- Keep `/v3/landingpage` route as well for now (or remove it -- either way)

## 2. Header Update (`src/components/Header.tsx`)

- **Remove** the Case Studies and Pricing nav links (they don't exist yet)
- **Change CTA** from "Book a demo" (Calendly link) to "Get Started Free" linking to `/auth` -- matching the landing page CTAs
- Keep the purple gradient button style but align the text
- Optionally add a secondary "Book a Demo" text link (not button) for those who prefer a call

Updated header will have:
- Logo (left)
- "Get Started Free" button (right) -- links to `/auth`, same style as landing page CTAs

## 3. Mock Dashboard Previews on Landing Page (`src/pages/LandingPageV3.tsx`)

Add inline mock UI components using dummy data to illustrate the product visually. These are **not** imported from the real dashboard -- they are lightweight, self-contained mock-ups built with the same UI primitives (Card, Table, Badge).

### Mock 1: Analytics Dashboard Preview (after Hero section)
A styled card showing a mini scorecard row with dummy data:
- 12,847 Visitors | 4,231 With Wallet Extension | 892 Wallets Connected | $2,400 Median Balance | 23% Bot Rate
- Below: A mini dimension table showing 4-5 rows of dummy referrer data with columns: Source, Visitors, Extensions, Wallets, Avg Balance, Bot %

### Mock 2: Bot Signal Card (in Section 3)
Already exists as the signal table -- keep as-is. It's already a good mock.

### Mock 3: Cost Attribution Preview (in Section 4, near capability #7)
A small inline table showing:
- utm_source | Spend | Wallets | CPA | Cost per $1K Balance
- "twitter_ads" | $2,500 | 34 | $73.52 | $12.40
- "kol_campaign" | $1,000 | 8 | $125.00 | $45.20
- "telegram_promo" | $500 | 22 | $22.72 | $8.10

### Mock 4: Scan Results Preview (in Section 6, replace the simple number cards)
Expand the current "42 X handles / 28 Telegram communities / 12 PR outlets" into a richer mock showing sample results:
- A mini card with tabs: "X Handles" | "Telegram" | "PR Outlets"
- Under X Handles: 3-4 sample rows like "@whale_trader (142K followers)", "@defi_degen (89K)"
- Under Telegram: "DeFi Alpha Chat (12.4K members)", "Whale Alerts (8.2K)"
- Under PR Outlets: "CoinDesk", "The Block", "Decrypt"

---

## Technical Details

### Files to Modify

1. **`src/App.tsx`** -- Change route `/` to use `LandingPageV3`
2. **`src/components/Header.tsx`** -- Remove Case Studies/Pricing links, change CTA to "Get Started Free" linking to `/auth`
3. **`src/pages/LandingPageV3.tsx`** -- Add 3 mock dashboard preview sections with hardcoded dummy data

### No New Dependencies

All mocks use existing UI components: `Card`, `Table`, `Badge`, and basic HTML/Tailwind.

### Mock Data (Hardcoded Arrays)

All dummy data lives inline in `LandingPageV3.tsx` as simple arrays -- no API calls, no imports from the real dashboard.

### What Stays the Same

- Footer (unchanged)
- All 10 existing sections (content stays, mocks get added within them)
- All other routes (blog, auth, dashboard, etc.)
