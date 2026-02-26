

## Part 1: Fix the FAQ Page

Rewrite the FAQ content to reflect AudienceScan's new positioning as an analytics-first platform (like GA, but for Web3) that merged with the blockchain scan tool. Key changes:

**"About AudienceScan" section -- rewritten:**

1. **What is AudienceScan?** -- AudienceScan is a Web3 analytics platform. Think of it as Google Analytics built for crypto -- it tracks your website visitors, detects wallet extensions, identifies bot traffic, and connects on-chain holder data with real user behavior. It started as a blockchain scanning tool for marketing strategies, but we realized raw wallet data is useless without enrichment. So we merged our analytics engine with our scan tool into one platform.

2. **How much does it cost?** -- It's free. We're building up our user base and the platform will remain free until we reach 1,000 users. No credit card required, no trial period, no feature gates.

3. **Do I need to connect a wallet?** -- No. Just add the tracking tag to your site and enter your contract address for scans. Everything is permissionless.

4. **What chains are supported?** -- (keep existing chain grid)

5. **Can I export the data?** -- Yes. Export audience segments, wallet lists, and analytics data in CSV format for use in ad platforms or other tools.

**"Why AudienceScan?" section -- rewritten:**

6. **Why not just use Google Analytics?** -- GA tracks page views and sessions but has zero wallet awareness. It can't tell you which visitors hold your token, which wallet extensions they use, or which on-chain communities they belong to. AudienceScan gives you everything GA does for Web3 sites, plus wallet-level intelligence, bot detection, and audience scans that connect holders to targetable communities.

7. **Why not just use Dune?** -- Dune is great for querying raw blockchain data, but it requires SQL knowledge and doesn't connect on-chain activity to your website traffic or marketing channels. AudienceScan is like having Dune for your own data -- with a built-in SQL workspace, plus automatic bridging between wallet behavior and real user sessions.

8. **How is this different from a blockchain explorer?** -- Explorers show individual transactions. AudienceScan aggregates thousands of wallets into behavioral segments, detects bots, maps community overlaps, and turns all of that into marketing actions.

9. **Can I use it without running paid ads?** -- Absolutely. Most teams use AudienceScan purely for analytics and community intelligence -- understanding who their holders are, spotting bots, and tracking how their audience evolves over time.

10. **Is my data private and secure?** -- Yes. We never ask users to connect wallets. All analysis uses publicly available on-chain data and aggregated browser signals. No PII is collected. Your dashboard is private to your team.

---

## Part 2: Full Page Inventory for Purge Decision

Here is every non-dashboard, non-blog route. I've marked my recommendation but you make the call:

| Route | Page | Recommendation |
|---|---|---|
| `/` | Landing page V3 | KEEP |
| `/auth` | Login / Sign up | KEEP |
| `/how-it-works` | How It Works | KEEP |
| `/resources` | Resources | KEEP |
| `/faq` | FAQ | KEEP (fixing now) |
| `/case-studies` | Case Studies | KEEP |
| `/pricing` | Pricing | REMOVE (it's free now) |
| `/old-home` | Old homepage | REMOVE |
| `/v2/landingPage` | Landing V2 | REMOVE |
| `/v3/landingpage` | Duplicate of `/` | REMOVE |
| `/sample1` | Sample page | REMOVE |
| `/video` | Video page | REVIEW -- still useful? |
| `/video1` | Video page alt | REMOVE |
| `/video/white` | White-label video | REMOVE |
| `/sales-pitch` | Sales pitch | REMOVE |
| `/dm-assistant` | DM assistant tool | REMOVE |
| `/managed-service` | Managed service | REMOVE |
| `/create-scan` | Old scan creation | REMOVE (replaced by dashboard) |
| `/strategy-playbook` | Strategy playbook | REMOVE |
| `/sdterms` | SD terms | REVIEW -- legal page? |
| `/creation` | Creation page | REMOVE |
| `/proposed-features` | Feature proposals | REMOVE |
| `/artifact/:studyId` | Artifact viewer | REMOVE |
| `/network/:studyId` | Network view | REMOVE |
| `/network/agency/:studyId` | Agency network | REMOVE |
| `/merge/:studyId` | Merge page | REMOVE |
| `/x-data/:studyId` | X data view | REMOVE |
| `/xads/agency` | X Ads agency | REMOVE |
| `/ads` | LinkedIn ads | REMOVE |
| `/wizard` | Wizard flow | REMOVE |
| `/wizard/mobile` | Mobile wizard | REMOVE |
| `/wizard/v2` | Wizard V2 | REMOVE |
| `/no-niche` | No Niche page | REMOVE |
| `/no-niche/v2` | No Niche V2 | REMOVE |
| `/no-niche/v3` | No Niche V3 | REMOVE |
| `/GADune` | GA vs Dune | REMOVE |
| `/GADune2` | GA vs Dune 2 | REMOVE |
| `/ai` | AI page | REMOVE |
| `/confidence/:studyId` | Confidence view | REMOVE |
| `/placeholder/confidence` | Placeholder | REMOVE |
| `/placeholder/ai` | Placeholder | REMOVE |
| `/sitemap.xml` | Sitemap | KEEP |

**Blog posts** (all under `/blog/*`) -- keeping all for now unless you want to trim specific ones.

---

### Technical approach

**Step 1: Update `src/components/FAQ.tsx`**
- Rewrite all question/answer content as described above
- Update pricing answer to "free until 1,000 users"
- Reframe "About" section around analytics-first positioning

**Step 2: Purge old routes from `src/App.tsx`**
- Remove route entries and imports for all pages marked REMOVE above
- This is purely removing `<Route>` lines and their corresponding `import` statements
- The page files themselves can stay (they won't be reachable) or be deleted -- your call

Waiting for your go-ahead on which pages to keep/remove before executing.
