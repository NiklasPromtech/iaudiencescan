

# Merge Sessions + Visual Timeline Connector

## What changes

Two improvements to the Journey tab:

### 1. Merge nearby sessions into single groups
Sessions within 30 minutes of each other get consolidated into one expandable row. This eliminates the wall of "bounce" rows and nested `wallet_detected` spam.

**Before:** 8 separate bounce rows + 8 standalone wallet_detected rows = 16 lines of noise

**After:** 2-3 merged session groups with everything nested inside

### 2. Visual timeline connector
A vertical line runs down the left edge connecting all timeline items, with dots/nodes at each item -- giving a clear sense of chronological flow.

```text
    o  Feb 10, 15:36  / -> /en/swap  4 events  3 pg  7m
    |    15:36  wallet_detected  MetaMask, Rabby
    |    15:36  click "Swap" on /en/swap
    |    15:43  click "Connect" on /
    |    Pages: / -> /en/swap -> / -> /en/swap
    |
    o  Feb 10, 15:56  /en/deposit  2 events  2 pg  0s
    |    15:56  wallet_detected  MetaMask, Rabby
    |    Pages: /en/deposit -> /en/
    |
    o  Feb 14, 18:22  /stake  4 events  5 pg  4m 5s
         18:23  click "Stake Now"
         18:24  connected
         18:26  staked
         Pages: /stake -> /docs -> /faq -> /stake -> /dashboard

    --- Transactions (unchanged) ---
```

## Technical details

### File: `src/components/wallets/WalletJourneyTab.tsx`

**Session merging step** (new function `mergeSessions`, called before `buildTimeline`):

1. Sort all sessions by `started_at` ascending
2. Walk through sessions: if the next session starts within 30 minutes of the current group's latest end time, merge it in
3. Merged group properties:
   - `ts` = earliest session's `started_at`
   - `pages` = concatenated from all constituent sessions
   - `page_count` = sum of all page counts
   - `duration_seconds` = span from first `started_at` to last session's end
   - `is_bounce` = false if more than one session merged
   - `entry_page` from the first session
   - Metadata (`referrer_domain`, UTMs, geo, device) from the first session that has them
   - `session_id` = first session's ID (used as the collapsible key)

**Nest wallet_detected inside merged groups**:

Remove the blanket exclusion of `wallet_detected` from session matching. After merging, all events (including `wallet_detected`) that fall within a merged group's time window get nested inside it. Only truly orphaned events stay standalone.

**Visual timeline connector** (CSS/JSX changes):

- Wrap the timeline list in a `relative` container
- Each timeline item gets a `relative pl-6` wrapper
- A continuous vertical line: `absolute left-[7px] top-0 bottom-0 w-px bg-border` on the container
- Each item gets a dot node: `absolute left-[4px] top-3 w-[7px] h-[7px] rounded-full bg-primary border-2 border-background`
- Session items use a filled primary dot; standalone items use an outline dot
- The last item's vertical line is clipped so it doesn't extend past the final dot

**Updated session header display**:

For merged sessions with multiple entry pages, show `first_entry -> last_entry` in the trigger row. Single-session groups show the entry page as before.

### No changes to:
- `src/lib/api.ts`
- `src/components/wallets/WalletDetailDialog.tsx`

