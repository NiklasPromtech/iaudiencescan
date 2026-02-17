

# Unified Chronological Timeline with Session Grouping

## What changes

The Journey tab currently shows Sessions, Events, and Wallet Actions as three separate sections. This refactor merges them into a **single chronological timeline** (oldest first), where events and wallet actions are nested under the session they belong to.

### Session matching logic
- Each session has `started_at` and `duration_seconds` -- events/actions whose `created_at` falls within that window are nested under it
- **30-minute gap rule**: If a session's explicit duration is 0 (bounce) or missing, we use a 30-minute window from `started_at` as the session boundary. This is the standard analytics convention (Google Analytics uses 30 min inactivity to define session boundaries)
- `wallet_detected` events are **always standalone** (script-triggered, not tied to user browsing)
- Any other events/actions that don't fall within a session window also appear as standalone entries

### Visual structure (oldest first)

```text
[Jan 5, 10:30] Session -- /stake -- 4m 5s -- twitter.com
   10:31  click "Stake Now" on /stake
   10:32  wallet action: connected
   10:34  wallet action: staked
   Pages: /stake -> /docs -> /faq

[Jan 8, 14:00] wallet_detected -- MetaMask (standalone)

[Feb 14, 18:22] Session -- /stake -- 4m 5s -- twitter.com
   18:23  click "Stake Now"
   18:24  wallet action: connected
   18:26  wallet action: staked
   Pages: /stake -> /docs -> /faq -> /stake -> /dashboard

--- Transactions (separate section, unchanged) ---
```

### Transactions stay separate
On-chain transaction data remains in its own section at the bottom -- it's blockchain data, not website session activity.

## Technical details

### File: `src/components/wallets/WalletJourneyTab.tsx`

**New timeline-building logic** (runs via `useMemo`):

1. For each session, compute its time window: `started_at` to `started_at + max(duration_seconds, 1800)` seconds (30 min minimum)
2. For each event (non-`wallet_detected`) and wallet action, find the first session whose window contains it
3. Build timeline items:
   - `{ type: "session", session, nestedEvents, nestedActions }` -- sorted internally by timestamp
   - `{ type: "standalone", event }` -- for `wallet_detected` + unmatched items
4. Sort all timeline items chronologically (oldest first)

**Updated rendering**:
- Remove the separate "Events" and "Wallet Actions" sections entirely
- Replace "Sessions" heading with "Timeline"
- Each session collapsible now shows nested events/actions as a mini chronological list (timestamp + type badge + detail) between the metadata row and the page flow
- Standalone `wallet_detected` entries render as simple rows with a "script" badge
- Summary row and quick badges remain unchanged
- Transactions section remains unchanged at the bottom

### No changes to:
- `src/lib/api.ts` -- types stay the same
- `src/components/wallets/WalletDetailDialog.tsx` -- no changes needed

