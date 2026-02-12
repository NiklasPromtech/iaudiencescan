

## Fix: "Data" button on /install not updating the selected website

### Problem
When you click the "Data" button for a website (e.g., Rubic) on the `/install` page, it only writes to `localStorage` but does **not** update the global `SelectedWebsiteProvider` context. The `/overview` page reads from that context, so it continues showing data for the previously selected website (e.g., qLabs).

### Root Cause
The `onGoToData` handler (line 303-307 in `Install.tsx`) bypasses the shared `selectWebsite()` function from the context:

```text
onGoToData={(w) => {
  localStorage.setItem("selectedWebsiteId", w.id);
  localStorage.setItem("selectedWebsite", JSON.stringify(w));
  navigate("/overview");
}}
```

It should instead call `selectWebsite()` from the `useSelectedWebsite()` hook, which updates both localStorage **and** the React context state that all dashboard pages depend on.

### Fix (1 file)

**`src/pages/Install.tsx`**
1. Import and use `useSelectedWebsite` hook
2. Update the `onGoToData` callback to call `selectWebsite()` before navigating
3. Also update `handleSelectWebsite` to use the shared context function instead of manually writing to localStorage (fixing a secondary inconsistency)

### Technical Detail

The updated `onGoToData` will look like:

```text
onGoToData={async (w) => {
  await selectWebsite({
    id: w.id,
    name: w.name,
    base_url: w.base_url,
    tag_id: w.tag_id,
    status: w.status,
  });
  navigate("/overview");
}}
```

This ensures the context is updated before navigation, so `/overview` immediately loads data for the correct website.

