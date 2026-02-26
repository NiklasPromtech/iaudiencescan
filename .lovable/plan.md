

## Create a Dedicated FAQ Page

Restyle the existing FAQ component to match the V3 aesthetic, expand the questions to address competitive positioning (vs GA, vs Dune, etc.), create a dedicated page at `/faq`, and update the Resources link.

---

### New & Updated Questions

The existing 5 questions will be kept (with minor copy tweaks) and grouped alongside new competitive/objection-handling questions. Organized into two groups:

**About AudienceScan**
1. What does the scan include?
2. Do I need to connect a wallet?
3. How much does it cost?
4. What chains are supported? (with chain icons grid)
5. Can I export the data?

**Why AudienceScan?**
6. **Why not just use Google Analytics?** -- GA tracks page views and sessions but has zero wallet awareness. It can't tell you which visitors hold your token, which wallet extensions they use, or which on-chain communities they belong to. AudienceScan starts where GA stops -- connecting web traffic to wallet behavior and giving you crypto-native audience segments you can actually target.
7. **Why not just use Dune?** -- Dune is great for querying raw blockchain data, but it requires SQL knowledge and doesn't connect on-chain activity to off-chain marketing channels. AudienceScan does that bridge automatically -- linking holder wallets to X communities, Telegram groups, and ad platforms so you get actionable targeting, not just dashboards.
8. **Can I use AudienceScan without running paid ads?** -- Absolutely. The tracking tag and audience scans work independently of any ad spend. Many teams use AudienceScan purely for community intelligence -- understanding who their holders are, where they came from, and how the audience is shifting over time.
9. **Is my data private and secure?** -- Yes. We never ask users to connect wallets. All analysis is based on publicly available on-chain data and aggregated browser signals. No PII is collected or stored. Your dashboard data is private to your team.
10. **How is this different from a blockchain explorer?** -- Explorers show individual transactions. AudienceScan aggregates thousands of wallets into behavioral segments, detects bots, maps community overlaps, and turns all of that into marketing actions -- things no explorer does.

---

### Files

**1. New file: `src/pages/FAQPage.tsx`**
- Standalone page wrapping `<Header />`, `<FAQ />`, `<Footer />`.
- Route: `/faq`

**2. Modified: `src/components/FAQ.tsx`**
- Restyle to V3 aesthetic (font-mono label, border cards, no rounded corners on accordion items).
- Add the 5 new questions above.
- Group into two sections with subheadings: "About AudienceScan" and "Why AudienceScan?"

**3. Modified: `src/App.tsx`**
- Add route: `<Route path="/faq" element={<FAQPage />} />`
- Import `FAQPage`.

**4. Modified: `src/components/Resources.tsx`**
- Update the FAQ callout link from `/pricing` to `/faq`.

