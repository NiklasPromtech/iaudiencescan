

# Footer: Replace Dead Links With Real Actions

## What Changes

Replace the "Product" and "Company" columns with links that actually work and match the current offering.

### Product Column (updated links)
- **Get Started Free** -- links to `/auth` (signup/login)
- **Blog** -- links to `/blog` (exists)
- **Book a Demo** -- links to Calendly or mailto

### Resources Column (renamed from Company)
- **How It Works** -- anchor link to `/#how-it-works` section on landing page
- **DM Assistant** -- links to `/dm-assistant` (exists)
- **Strategy Playbook** -- links to `/strategy-playbook` (exists)

This removes all dead links (Proposed Features, API docs, Integrations, Case Studies, Pricing) and replaces them with pages/sections that actually exist.

### Also
- Update copyright year from 2024 to 2025

## Technical Details

**File**: `src/components/Footer.tsx`

- Replace lines 26-43 (Product + Company columns) with the two new columns described above
- Update copyright year on line 80

