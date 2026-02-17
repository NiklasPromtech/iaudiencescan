

# Redesign Session Activity Log for Readability

## Problems

1. **Confusing page flow**: When sessions merge, the pages array concatenates raw data, producing `/en/deposit -> /en/deposit` (same page repeated). This adds no value and is confusing.

2. **Nested events are hard to read**: The current layout dumps raw event types (`wallet_detected`, `click`) with badges and scattered details. It's not immediately clear what the user actually did.

## Changes

### 1. Deduplicate consecutive pages in the page flow

Remove consecutive duplicate pages from the flow display. If the user visited `/en/deposit` twice in a row (from merged sessions), only show it once. The flow becomes a unique path, e.g. `/en/deposit -> /en/swap -> /en/deposit` only if they actually navigated away and back.

### 2. Redesign nested events as a readable activity feed

Replace the current event/action rendering with a human-readable format. Each row tells you what happened in plain language:

```text
16:07   Landed on /en/deposit                    MetaMask, Rabby detected
16:10   Pageview /en/swap                         MetaMask, Rabby detected  
16:13   Clicked "Withdrawn"  /en/deposit          
16:15   Wallet connected                          
16:18   Clicked "Stake Now"  /stake               (outbound)
```

Each row has 3 columns:
- **Time** -- `HH:mm` timestamp
- **What happened** -- human-readable description based on event type:
  - `wallet_detected` -> "Wallet detected" (with wallet names shown inline)
  - `click` -> "Clicked [click_text]" + page path
  - `pageview` -> "Viewed [page_path]"  
  - `conversion` -> "Conversion: [detail]"
  - wallet action types -> "Wallet [type]" (e.g. "Wallet connected", "Wallet staked")
  - Other event types shown as-is with a label
- **Wallet indicator** -- if wallets were detected at that moment, show them as a subtle tag

### 3. Remove the separate page flow section

Since the activity feed now shows pageviews and clicks with their paths inline, the bottom page flow (`/en/deposit -> /en/deposit`) becomes redundant. Remove it entirely -- the chronological activity log already tells the full story.

## Technical details

### File: `src/components/wallets/WalletJourneyTab.tsx`

**Refactor `NestedItemRow`** to render human-readable descriptions:

- Map `event_type` to readable labels:
  - `"wallet_detected"` -> icon + "Wallet detected" + wallet names
  - `"click"` -> mouse icon + "Clicked" + `click_text` + page_path
  - `"pageview"` -> eye icon + "Viewed" + `page_path`  
  - `"conversion"` / custom events -> zap icon + event label + detail
- For wallet actions (`item.kind === "action"`): arrow icon + "Wallet " + action type (connected, staked, etc.)
- Each row: `[time mono] [icon] [description] [page if relevant] [wallet names if wallet_detected]`

**Remove the page flow section** (lines 450-460) from the collapsible content -- the nested activity feed replaces it.

**Deduplicate pages** (as fallback/safety): In `mergeSessions`, filter consecutive duplicate pages from the combined `pages` array. This ensures if the page flow is ever shown elsewhere, it won't repeat.

### No changes to:
- `src/lib/api.ts` -- types unchanged
- `src/components/wallets/WalletDetailDialog.tsx` -- unchanged
