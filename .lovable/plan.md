

## Fix: Ensure All Filter Dropdowns Show Counts

### Problem

The filter bar on the Overview page has 10 filter buttons (Source, UTM Source, Medium, Campaign, Content, Term, Country, Conversion, Wallet Action, Wallet Tier). Currently only some of them (like UTM Source and Medium) display counts next to each option. The others either show no count or may not handle the data format correctly.

### Root Cause

The `FilterOptionsResponse` type expects every filter key to return `FilterOptionItem[]` (objects with `value` and `count`). However, the API may return some filter keys as plain `string[]` (without counts). The current code doesn't handle this mismatch — it just passes the raw data through, so plain strings fail to render counts.

### Solution

Add a normalizer in `FilterDialog.tsx` that converts any filter option data into the expected `FilterOptionItem[]` format. If the API returns plain strings (e.g., `["google", "twitter"]`), wrap them as `[{value: "google", count: 0}, {value: "twitter", count: 0}]`. If it already returns objects with `value` and `count`, use them as-is.

### Technical Details

**File: `src/components/overview/FilterDialog.tsx`**

In the `sectionOptions` memo (around line 370), add a normalization step:

```text
For each section key, read filterOptions[key].
If the value is an array of strings, convert each to { value: string, count: 0 }.
If the value is an array of objects with value/count, use as-is.
```

This ensures every filter dropdown renders consistently with counts shown when available, and gracefully shows "0" or omits the count display when the API doesn't provide it.

Optionally, hide the count column entirely if all items in a section have `count: 0` (meaning the API didn't provide counts for that dimension), so it doesn't look broken showing all zeros.

**File: `src/lib/api.ts`**

Update `FilterOptionsResponse` to allow both formats using a union type, so TypeScript doesn't complain:

```typescript
// Each filter key can be either FilterOptionItem[] or string[]
sources?: FilterOptionItem[] | string[];
utm_source?: FilterOptionItem[] | string[];
// ... etc for all keys
```

This is a defensive change — the normalizer in FilterDialog handles the conversion regardless.
