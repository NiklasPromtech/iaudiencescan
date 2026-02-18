

# Make Wallet Addresses Clickable in Overview (Open Detail Dialog)

## What Changes

When you're in the Overview and click the wallet count to open the "Create New Audience" dialog, the wallet addresses shown (e.g. "0xdc35...5209") are currently plain text. This change makes them clickable -- clicking one opens the same wallet deep-dive dialog (balances, journey, enrichment history) that you see on the /wallets page.

## Technical Details

### File 1: `src/components/audiences/WalletTable.tsx`

- Add an `onWalletClick` optional callback prop to `WalletTableProps`
- Make the truncated wallet address a `<button>` (same styling as in `/wallets` page: `hover:text-primary hover:underline`) that calls `onWalletClick(wallet.wallet_id)` when clicked
- If `onWalletClick` is not provided, keep the address as plain text (backward-compatible)

### File 2: `src/components/audiences/WalletSelector.tsx`

- Add an `onWalletClick` optional callback prop to `WalletSelectorProps`
- Pass it through to `<WalletTable onWalletClick={onWalletClick} />`

### File 3: `src/components/audiences/AudienceDialog.tsx`

- Add an `onWalletClick` optional callback prop to `AudienceDialogProps`
- Pass it through to `<WalletSelector onWalletClick={onWalletClick} />`

### File 4: `src/pages/Overview.tsx`

- Import `WalletDetailDialog` from `@/components/wallets/WalletDetailDialog`
- Add state: `const [detailWalletAddress, setDetailWalletAddress] = useState<string | null>(null)`
- Pass `onWalletClick={setDetailWalletAddress}` to the `<AudienceDialog>` component
- Render `<WalletDetailDialog walletAddress={detailWalletAddress} websiteId={selectedWebsite.id} onOpenChange={() => setDetailWalletAddress(null)} />` alongside the AudienceDialog

This reuses the exact same `WalletDetailDialog` component, so any future updates to the detail view automatically apply everywhere.
