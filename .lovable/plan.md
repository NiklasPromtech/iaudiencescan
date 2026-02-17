
# Clean Up Session Display: Remove "Merged" Label + Add All Approved Changes

## Summary of all accumulated changes to apply

This plan rolls together all previously approved-but-not-yet-implemented changes plus the new request:

### 1. Remove "X sessions merged" label
Since we present merged sessions as a single session, showing "8 sessions merged" breaks the illusion and confuses the user. Remove this line entirely (lines 472-476).

### 2. Simplify session header to "Session on [date]"
Replace `entry_page -> exit_page` path display with a clean `Session on Feb 10, 15:36` label. Page paths belong inside the expanded detail, not the header.

### 3. Promote wallet names to top-level badges
Extract unique wallet names from all `wallet_detected` events and show them as badges in the badges row (alongside country, device). Filter `wallet_detected` events out of the nested feed and standalone items entirely.

### 4. Group nested events by page path
Inside expanded sessions, group remaining events into bordered blocks by page path. Each block has the path as a header and chronological events listed inside.

### 5. Add "Left" indicator at end of each session
After the page-grouped events, show a subtle row with the exit timestamp and "Left" label (LogOut icon), confirming the user was inactive for 30+ minutes after.

## Technical details

### File: `src/components/wallets/WalletJourneyTab.tsx`

**Imports:** Add `LogOut` from lucide-react.

**Wallet badges (lines 368-385):** Extract unique wallet names from `journey.events` where `event_type === "wallet_detected"`. Render as badges with Radio icon in the existing badges section.

**Filter wallet_detected from timeline (buildTimeline, lines 155-165):** Skip events where `event_type === "wallet_detected"` when pushing to `item.nested`. Also skip them from standalone items (lines 187-195).

**Session header (lines 417-453):** Replace the entry/exit page display with `Session on {formatted date}`. Keep the right-side stats (page count, duration, referrer, chevron).

**Remove "sessions merged" (lines 472-476):** Delete this block entirely.

**Page-grouped rendering (lines 479-486):** Replace the flat event list with:
1. Group nested items by `page_path` (fallback to session entry page for actions or events without a path)
2. Render each group as a bordered div with the page path as a mono header and events listed chronologically inside
3. After all page groups, render a "Left" row: subtle divider + `[exit time] Left` with LogOut icon in muted styling

**Exit time calculation:** `new Date(session.started_at).getTime() + session.duration_seconds * 1000`, formatted as `HH:mm`.
