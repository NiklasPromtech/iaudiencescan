
# Display Existing Tags on Install Page

## Overview
Add a "Your Websites" section to the Install page that shows all previously created tags with their verification status. This prevents users from accidentally creating duplicate tags when they return to the page and see their unverified sites aren't visible.

## Current Behavior
- Page fetches all websites via `GET /websites` API
- If websites exist, it auto-selects the first one and shows installation instructions
- Users only see a small note saying "Tracking: {name}" when multiple sites exist
- No visibility into other created tags or their status

## Proposed Changes

### 1. Add "Your Websites" Section (above installation card)
When the user has existing websites, display them in a list/card format:

```text
+--------------------------------------------------+
|  Your Websites                    [+ Add new]    |
+--------------------------------------------------+
|  [Selected] My DeFi App                          |
|  https://mydefiapp.com                           |
|  Status: [Pending verification]    [Select]      |
+--------------------------------------------------+
|  Token Site                                      |
|  https://tokensite.io                            |
|  Status: [Verified]                [Select]      |
+--------------------------------------------------+
```

Each website card shows:
- Website name
- Base URL (truncated if long)
- Status badge (Pending / Verified / Failed)
- "Select" button (or visual indicator if currently selected)

### 2. UI Components to Add
- `WebsiteListCard` component for each website entry
- Status badge helper (reuse existing `getStatusBadge` logic)
- "Add new website" button in the header

### 3. Selection Behavior
- Clicking a website card selects it
- Updates `selectedWebsite` state
- Updates `trackingSnippet` for the selected site
- Updates `status` badge at top of page
- Highlights the selected card visually

### 4. "Add New" Button Flow
- Clicking "+ Add new" sets `showCreateForm = true`
- Shows the existing create form
- Cancel button returns to list view

---

## Technical Details

### File Changes: `src/pages/Install.tsx`

**New helper component:**
```tsx
interface WebsiteListItemProps {
  website: Website;
  isSelected: boolean;
  onSelect: (website: Website) => void;
}

const WebsiteListItem = ({ website, isSelected, onSelect }: WebsiteListItemProps) => {
  // Render card with name, url, status badge, select button
};
```

**New section in main return (before Installation Card):**
```tsx
{/* Your Websites Section */}
{websites.length > 0 && (
  <Card className="mb-6">
    <div className="p-4 border-b flex justify-between items-center">
      <h2>Your Websites</h2>
      <Button size="sm" onClick={() => setShowCreateForm(true)}>
        <Plus /> Add new
      </Button>
    </div>
    <div className="divide-y">
      {websites.map(website => (
        <WebsiteListItem
          key={website.id}
          website={website}
          isSelected={selectedWebsite?.id === website.id}
          onSelect={handleSelectWebsite}
        />
      ))}
    </div>
  </Card>
)}
```

**New handler:**
```tsx
const handleSelectWebsite = (website: Website) => {
  setSelectedWebsite(website);
  setStatus(website.status);
  setTrackingSnippet(
    `<script src="https://cdn.audiencescan.io/track.js" data-site-id="${website.id}" defer></script>`
  );
};
```

### Visual Design
- Use subtle border/background for selected state
- Compact cards to avoid too much scrolling
- Status badges consistent with existing design (muted for pending, primary for verified, destructive for failed)
- Globe icon for each website entry

---

## Summary of Changes
| File | Change |
|------|--------|
| `src/pages/Install.tsx` | Add `WebsiteListItem` component, "Your Websites" section, `handleSelectWebsite` handler, and "+ Add new" button |

This ensures users can see all their existing tags at a glance, select the one they want to work with, and understand which ones still need verification, reducing confusion and duplicate tag creation.
