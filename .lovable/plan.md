

# Add Manual Wallet Upload to Audiences

## Overview
Add a textarea-based "paste your own wallets" option to the Audience creation/edit dialog, so users can paste a list of addresses (one per line) alongside or instead of selecting from tracked visitors.

## How It Works
- A new "Manual Entry" tab/section appears in the `AudienceDialog` above (or beside) the wallet selector
- Users paste wallet addresses, one per line
- Addresses are validated (must start with `0x`, be 42 chars) and deduplicated
- Valid addresses merge into the same `selectedWallets` array used by the existing wallet picker
- The API already accepts `wallets: string[]` so no backend changes are needed
- Scans will work fine since they operate on addresses directly
- Editing also works -- the pasted wallets are just wallet IDs like any others

## Enrichment Note
Manually entered wallets won't show enrichment data (balance, chains, etc.) in the wallet table since they weren't tracked visitors. This is expected -- they'll appear as addresses only. The scan will still process them normally.

## Technical Details

### File 1: `src/components/audiences/AudienceDialog.tsx`
- Add a `Tabs` component with two tabs: **"From Visitors"** (existing WalletSelector) and **"Paste Wallets"** (new textarea)
- The "Paste Wallets" tab contains:
  - A `Textarea` with placeholder showing the one-per-line format
  - A "Add Wallets" button that parses, validates, deduplicates, and merges into `selectedWallets`
  - A count showing how many valid/invalid addresses were found
  - Invalid addresses shown with error feedback
- Both tabs share the same `selectedWallets` state, so you can combine tracked + manual wallets
- When editing an existing audience, wallets that aren't in the tracked list will simply appear as selected IDs

### File 2: No other files need changes
- `createAudience` and `updateAudience` already accept `wallets: string[]`
- `createScan` already accepts audience wallet lists
- The `WalletSelector`, `WalletTable`, and `AudienceDetailDialog` don't need changes

### Validation Rules
- Must start with `0x`
- Must be exactly 42 characters
- Duplicate addresses (including duplicates already selected from visitors) are silently deduplicated
- Empty lines and whitespace are trimmed and ignored
- A summary line shows: "X valid addresses added, Y duplicates skipped, Z invalid"

