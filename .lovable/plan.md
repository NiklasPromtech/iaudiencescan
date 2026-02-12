

## Add Logout + Redesign "Your Websites" Page

### What's changing

**1. Add a logout option** -- currently there is no way to sign out. We'll add a user/logout section to the sidebar footer and the Settings page.

**2. Redesign the Install (Your Websites) page** -- wrap it inside the `DashboardLayout` so it feels like part of the app (sidebar + top bar), and restyle the website list to match the flat, Dune-inspired aesthetic used throughout the dashboard.

---

### Design Details

**Logout**
- Add a user avatar/email row at the bottom of the `DashboardSidebar` with a "Sign out" option (dropdown or direct button)
- Also add a "Sign Out" button to the Settings page under Account
- On sign out: clear local storage, call `supabase.auth.signOut()`, redirect to `/auth`

**Websites page redesign**
- Wrap in `DashboardLayout` instead of the standalone full-screen layout
- Rename the page header to "Websites" (simpler, matches sidebar "Settings > Websites" flow)
- Restyle website cards: flat border-border containers, mono uppercase labels for status, inline stat-row style (matching the dashboard aesthetic)
- Each website row: clean layout with name, URL, status badge, and action buttons (Go to data, Share, Archive) -- all using `rounded-none` buttons
- The expanded installation instructions section keeps its current functionality but gets styled consistently
- The "Add new" create form becomes a dialog or inline card within the layout

---

### Technical Plan

**File: `src/components/dashboard/DashboardSidebar.tsx`**
- Import `supabase` and `LogOut` icon
- Add a `SidebarFooter` section showing the current user's email (fetched via `supabase.auth.getUser()`) with a sign-out button
- On click: `supabase.auth.signOut()`, clear localStorage (`selectedWebsiteId`, `selectedWebsite`), navigate to `/auth`

**File: `src/pages/Install.tsx`**
- Wrap the main return in `<DashboardLayout>` instead of the raw `div` with `bg-gradient-subtle`
- Simplify the header -- remove the centered hero layout, use a left-aligned "Websites" heading with subtitle
- Restyle `WebsiteListItemWithTag` to use the flat card aesthetic: `border-border`, mono text for labels, `rounded-none` on buttons
- Keep all existing functionality (create, verify, archive, share, copy snippets)

**File: `src/pages/Settings.tsx`**
- Add a working "Sign Out" action to the Account section (or add a dedicated sign-out card)

