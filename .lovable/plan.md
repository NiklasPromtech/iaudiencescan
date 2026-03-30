

## Add a Privacy Policy page

Create a simple `/privacy` page matching the SD Terms design, covering the basics for a Web3 analytics SaaS. Add a link in the Footer.

### What the page will cover

1. **Who we are** — SD Marketing Ltd trading as AudienceScan
2. **What we collect** — email (via Supabase auth), website analytics (via vtag-ai-js), wallet addresses (public on-chain data), cookies
3. **Why we collect it** — to provide the analytics service
4. **Third-party services** — Supabase (auth/DB), hosting provider
5. **Data retention** — kept while account is active, deleted on request
6. **Your rights** — access, correction, deletion via support@audiencescan.io
7. **Contact** — support@audiencescan.io

### Technical changes

**Create**: `src/pages/Privacy.tsx` — mirrors SDTerms layout (Header, Footer, card with prose sections)

**Edit**: `src/App.tsx` — add `/privacy` route

**Edit**: `src/components/Footer.tsx` — add "Privacy Policy" link under Company section

