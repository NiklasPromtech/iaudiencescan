

# Fix: Website selector not reloading data

## The Problem

`useSelectedWebsite()` uses local `useState` inside each component. When the `WebsiteSelector` calls `selectWebsite(...)`, it updates **its own** state and localStorage, but the `Overview` page has a **separate** state instance that never gets the update. React Router's `navigate("/overview")` also does nothing because you're already on `/overview`.

## The Fix

Convert `useSelectedWebsite` from a standalone hook into a **React Context** so every component shares the same state. When the selector updates the website, Overview (and every other page) immediately sees the change and reloads data.

## Technical Details

### File: `src/hooks/use-selected-website.ts`

- Export a `SelectedWebsiteProvider` context provider component
- Export a `useSelectedWebsite()` hook that reads from context
- The provider holds the single source of truth for `selectedWebsite` state
- When `selectWebsite()` is called anywhere, all consumers re-render

### File: `src/App.tsx`

- Wrap the router with `<SelectedWebsiteProvider>` so the context is available to all pages

### File: `src/components/dashboard/WebsiteSelector.tsx`

- Remove `navigate("/overview")` since the data reload now happens automatically via context
- Optionally keep it for cases where user is on a non-overview page

### No other files need changes
All existing `useSelectedWebsite()` calls continue to work -- they just read from context instead of local state now.

