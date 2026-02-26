

## Wallet Holdings: Icon-based Filter

### What changes

Add a simple toggle filter above the chain sub-tabs that lets users switch between:
- **"Verified tokens"** (default) -- only shows tokens that have a valid `logo_url`
- **"All tokens"** -- shows everything including tokens without icons

This defaults to showing only tokens with icons, since those tend to be more established/legitimate projects.

### Technical details

All changes in `src/components/overview/WalletHoldingsTable.tsx`:

- Add a `showAll` boolean state (default: `false`)
- Before the chain filtering step, filter items to only those where `logo_url` is a non-empty string (when `showAll` is false)
- Render a small toggle or segmented button group (using the existing `Tabs` pattern) with "Verified" and "All" options, placed inline next to the $50 filter info line
- Update counts on chain sub-tabs to reflect the current icon filter

