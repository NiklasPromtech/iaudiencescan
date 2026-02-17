

# Fix Session Count and Show Referrer/UTM Per Entry Page

## 1. Session count in summary should match merged timeline sessions

The summary row currently shows `journey.total_sessions` (4, from the raw API data). But after merging, the timeline shows 1 session dropdown. The summary should reflect what the user actually sees.

**Change:** Replace `journey.total_sessions` with the count of session-type items in the built timeline. Similarly, recompute `total_events` from the timeline's nested items to stay consistent.

In the component, derive the merged session count from `timeline`:

```typescript
const mergedSessionCount = timeline.filter(t => t.type === "session").length;
```

Then render `mergedSessionCount` instead of `journey.total_sessions`.

## 2. Show referrer domain and UTM inline with the entry page path

Currently, the referrer and UTM info sits in the session metadata block at the top of the expanded session. The user wants it tied to the specific entry page so it's clear *how* the user arrived at that page.

**Change:** On the **first page group** of each session (which corresponds to the entry page), show the referrer domain and UTM source/medium/campaign as small badges right next to the page path. This makes attribution immediately clear in context.

The page group header will change from:

```
/en
```

To something like:

```
/en  via chatgpt.com  utm: chatgpt.com/referral
```

Shown as subtle inline badges after the path, only on the first page group of the session.

## Technical Details

### File: `src/components/wallets/WalletJourneyTab.tsx`

**Summary row (lines 400-404):**

Replace `journey.total_sessions` with a computed count from the timeline:

```typescript
const mergedSessionCount = useMemo(
  () => timeline.filter(t => t.type === "session").length,
  [timeline]
);
```

Render `mergedSessionCount` instead of `journey.total_sessions`.

**Page group header (lines 526-529):**

Pass session data and group index to the page group rendering. For the first group (`gi === 0`), append referrer and UTM badges after the page path:

```tsx
<div className="font-mono text-[10px] text-muted-foreground mb-1 flex items-center gap-2">
  {group.pagePath}
  {gi === 0 && s.referrer_domain && (
    <Badge variant="outline" className="text-[9px] py-0 px-1 font-sans">
      via {s.referrer_domain}
    </Badge>
  )}
  {gi === 0 && s.utm_source && (
    <Badge variant="outline" className="text-[9px] py-0 px-1 font-sans">
      utm: {s.utm_source}{s.utm_medium ? `/${s.utm_medium}` : ""}
      {s.utm_campaign ? ` (${s.utm_campaign})` : ""}
    </Badge>
  )}
</div>
```

The referrer/UTM info in the session metadata block (lines 513-519) can be kept as-is for completeness, or removed to avoid duplication -- keeping it is fine since it provides a consolidated view.

