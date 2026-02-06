
# Add Real Token Logos to Platform Cards

## What changes

Add a `logo` URL field to each token in the mock data, sourced from CoinGecko's public CDN (reliable, no API key needed). Then update the `TokenAvatar` component to show the actual logo image with a fallback to the current initials circle if the image fails to load.

## Tokens and their logos

| Token | Logo URL |
|-------|----------|
| LINK (Chainlink) | `https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png` |
| ONDO (Ondo Finance) | `https://assets.coingecko.com/coins/images/26580/small/ONDO.png` |
| XAUT (Tether Gold) | `https://assets.coingecko.com/coins/images/10481/small/Tether_Gold.png` |
| PAXG (Paxos Gold) | `https://assets.coingecko.com/coins/images/9519/small/paxg.PNG` |
| NUSD (Neutrl USD) | Uses initials fallback (no widely available logo) |
| RESOLV (Resolv) | Uses initials fallback |
| EUL (Euler Finance) | `https://assets.coingecko.com/coins/images/26149/small/YCvKDfl8_400x400.jpeg` |

## Technical details

**File: `src/components/landing/mock-data.ts`**
- Add an optional `logo` field to each token object in `mockPlatformTokens`
- Populate with CoinGecko CDN URLs for tokens that have them

**File: `src/components/landing/MockPlatformCards.tsx`**
- Update `TokenAvatar` to accept an optional `logo` prop
- Render an `<img>` tag when `logo` is provided, with `onError` fallback to the initials circle
- Pass `token.logo` from the map loop into the component
