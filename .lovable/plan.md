

## Wallet Holdings: Chain Sub-tabs and $50 Filter

### What changes

1. **Filter out small holdings** -- Only show tokens where `total_quote_usd > 50`. Add a small info badge above the table: "Showing tokens with holdings over $50 USD".

2. **Add chain sub-tabs** -- Inside the Wallet Holdings tab, add a secondary row of tabs:
   - **"All Chains"** tab (default) showing everything
   - One tab per unique chain found in the data (e.g. "Ethereum Mainnet", "BNB Smart Chain")
   - Each tab shows a count of tokens in that chain

3. **Remove the Chain column when filtered** -- When a specific chain tab is selected, hide the Chain column since it's redundant.

### Technical details

All changes are in `src/components/overview/WalletHoldingsTable.tsx`:

- Filter incoming `data` to items with `total_quote_usd > 50` before rendering
- Extract unique `chain_display_name` values from filtered data
- Add local state for `selectedChain` (default: `"all"`)
- Render a secondary `Tabs` component with pill-style triggers for "All" + each chain
- When a specific chain is selected, further filter the data and hide the Chain column
- Display a muted info line: "Filtered to tokens with holdings over $50 USD"
- Sort results by `total_quote_usd` descending for better readability

