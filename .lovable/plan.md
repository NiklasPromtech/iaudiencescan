

# Fix: "Do This Later" Empty State Experience

## The Problem

When a new user signs up and clicks **"Do this later"** on the Install page (skipping website creation), they get sent to `/overview` with no website selected. The Overview page then:

1. Fires 8+ parallel API calls (scorecard, daily chart, dimension table, events, wallets, extensions, holders, realtime, filter options, cost sources) — all of which fail because there's no website ID
2. Shows a flash of loading spinners
3. Detects `selectedWebsite` is null and redirects back to `/install`
4. Install detects no websites exist and shows the create form again — a frustrating loop

The same issue affects every other dashboard page (Costs, Audiences, Contracts, Wallets, Bots, etc.) — they all redirect to `/install` when no website is selected.

## The Fix

Instead of redirecting to `/install`, **show a clean empty/onboarding state** inside the dashboard layout when no website is selected. This way the user can still explore the sidebar, see the dashboard shell, and understand what the product does — with a clear CTA to add their first website.

### Changes

#### 1. Create a shared `NoWebsiteState` component
**New file: `src/components/dashboard/NoWebsiteState.tsx`**

A reusable empty state card shown inside `DashboardLayout` when no website is selected. Contains:
- An icon and friendly headline ("Add your first website to get started")
- A brief description of what they'll see once data flows in
- A primary CTA button linking to `/install`
- A secondary "Explore with sample data" link (optional, for later)

#### 2. Update `Overview.tsx` — Replace redirect with empty state
- Remove the `useEffect` that redirects to `/install` (lines 90-94)
- Guard all data-fetching `useEffect`s so they only run when `selectedWebsite` exists (most already do via `if (!selectedWebsite) return`)
- When `!websiteLoading && !selectedWebsite`, render the `DashboardLayout` with the `NoWebsiteState` component instead of the full dashboard
- This prevents all 8+ API calls from firing, eliminates the redirect loop, and shows a clean onboarding screen

#### 3. Update other dashboard pages with the same pattern
Apply the same fix to these pages that currently redirect to `/install`:
- **`src/pages/Costs.tsx`** — Replace the `navigate("/install")` block (lines 50-53) with `NoWebsiteState`
- **`src/pages/Audiences.tsx`** — Already has a decent empty state card but still redirects; wrap it with `NoWebsiteState` instead
- **`src/pages/Contracts.tsx`** — Same pattern, replace redirect with `NoWebsiteState`
- **`src/pages/Bots.tsx`** — Uses localStorage directly instead of the hook; update to use `useSelectedWebsite` hook and show `NoWebsiteState`
- **`src/pages/Wallets.tsx`**, **`src/pages/Touchpoints.tsx`**, **`src/pages/Scans.tsx`**, **`src/pages/Change.tsx`** — Check and apply same fix if they redirect

#### 4. Update `Install.tsx` — Don't redirect on "Do this later" to Overview
- Change the "Do this later" handler (line 269-271) to navigate to `/overview` (keep as-is, since overview will now handle the empty state gracefully)
- No change needed here, the fix is in the receiving pages

### What the user will see after the fix

1. Signs up, lands on Install page
2. Clicks "Do this later"
3. Arrives at Overview inside the full dashboard layout (sidebar, header, etc.)
4. Sees a clean card: "Add your first website to start tracking" with a button to go to Install
5. Can click any sidebar item — each page shows the same friendly empty state
6. No redirect loops, no broken loading states, no failed API calls

## Files to Create/Modify

| File | Change |
|------|--------|
| `src/components/dashboard/NoWebsiteState.tsx` | **NEW** — Shared empty state component |
| `src/pages/Overview.tsx` | Remove redirect, show `NoWebsiteState` when no website |
| `src/pages/Costs.tsx` | Replace redirect with `NoWebsiteState` |
| `src/pages/Audiences.tsx` | Replace redirect with `NoWebsiteState` |
| `src/pages/Contracts.tsx` | Replace redirect with `NoWebsiteState` |
| `src/pages/Bots.tsx` | Switch to `useSelectedWebsite` hook, show `NoWebsiteState` |
| `src/pages/Wallets.tsx` | Check and apply same fix |
| `src/pages/Touchpoints.tsx` | Check and apply same fix |
| `src/pages/Scans.tsx` | Check and apply same fix |
| `src/pages/Change.tsx` | Check and apply same fix |

