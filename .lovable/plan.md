
# Fix Report Logo + Add Proper Page Breaks

## Problem 1: Wrong Logo
The report currently references a hosted image (`16e32559-c9cc-4d02-95ce-484236936478.png`) which appears to be the DV360 logo (purple play button), not the AudienceScan icon. The rest of the app uses `audiencescan-icon-large.png` -- the correct square AudienceScan icon.

## Problem 2: Tables Split Across Pages
The current print CSS only has basic `page-break-inside:avoid` on `tr` elements. Large tables still get split mid-way across page boundaries, producing ugly half-tables.

## Solution

### File: `src/lib/report-export.ts`

**Fix 1 -- Correct logo URL**
Change the `logoUrl` from the wrong uploaded image to the correct AudienceScan icon hosted on the published site:
```
const logoUrl = "https://iaudiencescan.lovable.app/assets/audiencescan-icon-large-XXXX.png";
```
Since the asset is bundled by Vite with a hash, we'll instead use the favicon/public path. The file `public/favicon.png` or we can reference the `public/lovable-uploads/` directory for a known correct icon. Alternatively, we'll embed the icon as a base64 data URI by converting the small PNG inline -- this guarantees it always works regardless of hosting. But simplest: use the published site's favicon which is the correct icon.

Best approach: reference `/favicon.png` from the published domain since that's the AudienceScan icon.

**Fix 2 -- Improved page break CSS**
Update the `@media print` styles to:
- Add `page-break-inside: avoid` on each platform section wrapper div
- Add `page-break-before: always` on major sections (News, Websites) so they start on fresh pages
- Add `thead { display: table-header-group; }` so table headers repeat on each page
- Add `page-break-after: avoid` on section headings so they don't orphan at page bottoms

**Fix 3 -- Section wrapper page-break hints**
Update `buildPlatformSection` to include `page-break-inside:avoid` on each platform block, so a single platform's table won't split across pages. For very long tables (many rows), we'll chunk them or let rows break individually while keeping the header attached.

### Specific Changes

1. **Line 160**: Change `logoUrl` to `"https://iaudiencescan.lovable.app/favicon.png"`

2. **Lines 171-176**: Replace print CSS with enhanced version:
```css
@media print {
  body { padding: 20px; }
  .no-print { display: none !important; }
  h2, h3 { page-break-after: avoid; }
  thead { display: table-header-group; }
  tr { page-break-inside: avoid; }
  .section { page-break-inside: avoid; }
}
```

3. **`buildPlatformSection` function**: Wrap each platform section div with a CSS class `section` so print avoids splitting it. Already has `page-break-inside:avoid` inline -- we'll keep that and ensure it works with the print media query.

4. **`buildNewsSection` function**: Keep `page-break-before:always` (already present) so news starts on a new page. Add `thead { display:table-header-group }` so table headers repeat.

5. **`buildWebsitesSection` function**: Add `page-break-before:always` so websites also start on a fresh page.

6. **Communities parent heading**: Wrap the "Communities" h2 + all platform sections in a container, and add page-break-before to separate it from the stats section cleanly.
