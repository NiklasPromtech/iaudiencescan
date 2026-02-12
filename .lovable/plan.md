

## Fix: Auto-select website on login

### Root Cause

In `src/hooks/use-selected-website.tsx`, when the user signs in and localStorage is empty, the provider:
1. Finds `last_selected_website_id` from the profile (e.g. qLabs)
2. But does **nothing** with it -- just a comment saying "Install pages will handle sync"
3. `selectedWebsite` stays `null`, so Overview shows `NoWebsiteState`

### Fix

Update `SelectedWebsiteProvider` in `src/hooks/use-selected-website.tsx` to:
1. When `last_selected_website_id` exists but localStorage has no match, fetch the websites list from the API
2. Find the matching website and auto-select it (set state + localStorage)
3. If no `last_selected_website_id` but websites exist, auto-select the first one

### Technical Details

**File: `src/hooks/use-selected-website.tsx`**

- Import `listWebsites` from `@/lib/api`
- In the `loadSelectedWebsite` effect, after finding `profile.last_selected_website_id` with no localStorage match:
  - Call `listWebsites()` to get the user's websites
  - Find the website matching `last_selected_website_id`
  - If found, call the internal setter (set state + localStorage) to select it
  - If not found but websites exist, select the first one
- If no profile `last_selected_website_id` exists and no localStorage, also fetch websites and auto-select the first one

This ensures any signed-in user with websites never sees the empty state unnecessarily.
