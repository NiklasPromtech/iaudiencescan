
# Plan: Auto-redirect on Scan Completion + Platform Ad Campaign Buttons

## Overview
This plan addresses two enhancements to improve the user experience when navigating scan results:
1. Automatically redirect users to the results page when a scan completes
2. Add "Create Ad Campaign" buttons directly into each platform card (X, Telegram, Reddit)

---

## Part 1: Auto-Redirect When Scan Completes

**Location**: `src/pages/ScanDetail.tsx`

When the scan status changes to "COMPLETED", we'll automatically navigate the user to the results page instead of just showing a "View Results" button.

**How it works**:
- Add a `useEffect` that watches for `scan.status === "COMPLETED"`
- When completed, call `navigate(`/scans/${scanId}/results`)`
- This happens seamlessly during the auto-refresh polling that's already in place

---

## Part 2: Integrate Ad Campaign Buttons into Platform Cards

**Location**: `src/components/scan-results/PlatformTargetingCard.tsx`

Each platform card will get a dedicated "Create Ad Campaign" button that:
1. Copies all handles to clipboard (formatted appropriately)
2. Shows a toast explaining where to paste them
3. Redirects to the ad platform after a short delay

**Platform-specific details**:

| Platform | Button Text | Redirect URL | Paste Instructions |
|----------|------------|--------------|-------------------|
| X/Twitter | Create X Ads Campaign | ads.x.com | Paste under "Follower look-alikes" |
| Telegram | Create Telegram Ad | ads.telegram.org | Paste in channel targeting |
| Reddit | Create Reddit Ad | ads.reddit.com | Paste in subreddit targeting |
| Discord | *(no button)* | N/A | Discord doesn't have a self-serve ad platform |

---

## Part 3: Clean Up Duplicate X Ads Card

**Location**: `src/pages/ScanResults.tsx`

- Remove the standalone `XAdsIntegration` component since its functionality will now be built into the X/Twitter platform card
- This simplifies the page and puts all platform actions in a consistent location

---

## Technical Implementation Details

### Changes to `PlatformTargetingCard.tsx`:
- Add `adPlatformUrl` and `adPasteInstructions` to the `PLATFORM_CONFIGS` object
- Create a new `handleCreateCampaign` function similar to `XAdsIntegration`
- Add a prominent CTA button in the header section of each card (except Discord)
- Use the existing toast system to confirm clipboard copy

### Changes to `ScanDetail.tsx`:
- Add a `useEffect` that triggers navigation when `scan.status` transitions to "COMPLETED"

### Changes to `ScanResults.tsx`:
- Remove the `<XAdsIntegration />` component import and usage

---

## User Experience Flow

```text
1. User clicks into a scan (from /scans list)
   |
   v
2. ScanDetail page shows progress
   |
   v
3. When scan completes --> AUTO-REDIRECT to /scans/:id/results
   |
   v
4. Results page shows platform cards with integrated "Create Ad Campaign" buttons
   |
   v
5. User clicks button --> Handles copied + Toast shown + Redirect to ad platform
```

---

## Files to Modify

1. **`src/pages/ScanDetail.tsx`** - Add auto-redirect effect
2. **`src/components/scan-results/PlatformTargetingCard.tsx`** - Add ad campaign buttons
3. **`src/pages/ScanResults.tsx`** - Remove standalone XAdsIntegration component
