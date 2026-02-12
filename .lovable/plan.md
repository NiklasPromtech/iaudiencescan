

## Fix Auth Page Logo (Line 11 was never updated)

### Problem
The previous logo fix didn't get saved. Line 11 of `src/pages/Auth.tsx` still imports the old combined logo image (`audiencescan-logo-dark.png`), and line 109-111 renders it as a single `<img>`.

### Fix (1 file: `src/pages/Auth.tsx`)

1. **Line 11** -- Change the import from `audiencescan-logo-dark.png` to `audiencescan-icon-large.png` (the high-res square icon used in the sidebar and header)

2. **Lines 109-111** -- Replace the single `<img>` with the icon + text pattern used throughout the app:
   ```text
   <div className="flex items-center gap-2 justify-center mb-2">
     <img src={icon} alt="AudienceScan" className="h-6 w-6" />
     <span className="font-semibold text-foreground text-sm tracking-tight">
       AudienceScan
     </span>
   </div>
   ```

This matches exactly how the logo appears in the dashboard sidebar and header.
