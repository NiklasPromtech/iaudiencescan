
# Fix Code Snippet Styling on /install Page

## Problem
The main tracking script (Step 1) has inconsistent styling compared to Steps 2 and 3:
1. The `// Main tracking tag` comment has a grey/muted color, while other code blocks have consistent green-ish primary foreground colors for comments
2. The script tag text is still getting cut off behind the copy button
3. The copy button positioning is inconsistent across steps

## Solution
Unify the styling approach by embedding the comment directly in the snippet string (like Steps 2 and 3) and fixing the padding/positioning.

---

## Technical Changes

### File: `src/pages/Install.tsx`

**1. Update the tracking snippet to include the comment inline**

Change the `trackingSnippet` state to include the comment:
```tsx
setTrackingSnippet(
  `// Main tracking tag\n<script src="https://cdn.audiencescan.io/track.js?id=${website.id}" defer></script>`
);
```

**2. Fix the Step 1 code block styling to match Steps 2 and 3**

Remove the separate comment `<code>` block and use the same structure as other steps:
```tsx
<div className="relative">
  <pre className="bg-foreground text-primary-foreground p-3 pr-12 rounded-lg text-p4 overflow-x-auto whitespace-pre-wrap">
    <code>{trackingSnippet}</code>
  </pre>
  <Button
    size="sm"
    variant="secondary"
    className="absolute top-2 right-2"
    onClick={(e) => { e.stopPropagation(); onCopy(trackingSnippet); }}
  >
    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
  </Button>
</div>
```

This ensures:
- Comments render in the same color as Steps 2 and 3
- Consistent padding (`p-3 pr-12`)
- Consistent copy button positioning (`top-2 right-2`)
- `whitespace-pre-wrap` to handle the multi-line snippet properly
- The `pr-12` padding ensures the script text doesn't go behind the copy button
