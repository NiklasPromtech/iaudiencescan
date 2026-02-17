

# Fix "Left" Timestamp and Absorb Late Events into Sessions

## Problem

Two bugs visible in the timeline:

1. **"Left" shows 01:00** even though events continue until 01:07+. The exit time is calculated from `started_at + duration_seconds` (raw session data), which doesn't account for events that extend beyond the session window.

2. **Standalone click items at 01:07, 01:09, 01:10** leak out of the session as bare "click" entries. These events fall just outside the session's 30-minute window but clearly belong to the same session.

## Solution

### 1. Extend session windows after initial event matching

After the first pass of matching events/actions to sessions, do a second pass:
- For each session that has nested events, extend its `_endMs` to `max(_endMs, lastNestedTs + 5 minutes)`
- Re-scan unclaimed events and actions against the extended windows
- Re-sort nested items after the second pass

### 2. Calculate "Left" from actual last activity

Replace the static `started_at + duration_seconds` exit time with:
```
max(started_at + duration_seconds, last nested event timestamp)
```

This ensures "Left" always shows a time at or after the last visible event.

## Technical Details

### File: `src/components/wallets/WalletJourneyTab.tsx`

**In `buildTimeline` (after line 178, before standalone items):**

Add a session window extension + second-pass claiming loop:
- Extend each session's `_endMs` to `max(_endMs, lastNestedTs + 300000)` (5 min buffer)
- Re-run unclaimed events and actions against extended windows
- Re-sort nested items

**Exit time calculation (line 418):**

Replace:
```typescript
const exitTimeMs = new Date(s.started_at).getTime() + s.duration_seconds * 1000;
```

With:
```typescript
const rawEndMs = new Date(s.started_at).getTime() + s.duration_seconds * 1000;
const lastEventMs = item.nested.length > 0 ? item.nested[item.nested.length - 1].ts : 0;
const exitTimeMs = Math.max(rawEndMs, lastEventMs);
```

