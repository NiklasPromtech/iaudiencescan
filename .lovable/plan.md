

## Move HowItWorks and Resources to Separate Pages

Remove both sections from the landing page and give each its own dedicated route. Update the header nav links to point to the new pages instead of anchor scrolls.

---

### Changes

**1. New file: `src/pages/HowItWorksPage.tsx`**
- A standalone page wrapping the existing `<HowItWorks />` component with `<Header />` and `<Footer />`.
- Route: `/how-it-works`

**2. New file: `src/pages/ResourcesPage.tsx`**
- A standalone page wrapping the existing `<Resources />` component with `<Header />` and `<Footer />`.
- Since the current Resource card links are outdated, the cards will become informational (no "Read more" links) until you decide what they should link to.
- Route: `/resources`

**3. Modified: `src/pages/LandingPageV3.tsx`**
- Remove the `<HowItWorks />` and `<Resources />` imports and usage (lines 19-20, 399-400).

**4. Modified: `src/components/Header.tsx`**
- Change "How It Works" link from `/#how-it-works` to `/how-it-works`.
- Change "Resources" link from `/#resources` to `/resources`.
- Remove the `ChevronDown` icons from these links (they're no longer in-page anchors).

**5. Modified: `src/App.tsx`**
- Add routes for `/how-it-works` and `/resources` pointing to the new page components.

**6. Modified: `src/components/Resources.tsx`**
- Remove the card links and "Read more" arrows since the destinations are outdated. Cards become static informational tiles for now.

