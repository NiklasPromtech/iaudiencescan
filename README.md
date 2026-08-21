# AudienceScan

A web-analytics tool that connects marketing sources to the *financial value* of the audience they bring in — not just how many visitors, but how much on-chain capital those visitors actually hold.

**Live app:** https://audiencescan.io

## The idea

Standard analytics tells you *how many* people a campaign brought in. It can't tell you *who's worth it*. For products where the audience holds on-chain assets, that's the more valuable question — a thousand visitors with empty wallets are worth less than fifty who can actually transact.

AudienceScan closes that gap: it ties marketing source to measured wallet value, so you can optimise toward the audience that matters instead of raw volume.

## How it works

- **Capture:** when a visitor shares their wallet address, the tool records it against their session
- **Enrich:** it scans that wallet for transaction history and current holdings — turning an address into a value signal
- **Attribute:** UTM parameters connect each wallet back to the exact marketing source that brought that visitor in
- **Query, in plain language:** the data lands in BigQuery, and an AI layer that knows the full schema generates the SQL for you — so you can ask a question in plain language ("which channel brought the highest-value wallets last month?") and get the answer, without writing SQL or knowing the table structure
- **Result:** a view of how much real capital each campaign, channel, or creative is actually reaching — value-based attribution instead of vanity metrics

## How it's built

- **Frontend:** TypeScript / React (built with [Lovable](https://lovable.dev))
- **Backend:** Supabase — session capture, enrichment, and attribution storage
- **Data warehouse:** BigQuery, with a schema-aware AI layer that translates plain-language questions into correct SQL — natural-language querying over the full dataset
- On-chain data enrichment to turn wallet addresses into transaction and balance signals
- UTM-based source attribution linking value back to marketing effort

## The thinking behind it

This came out of 15 years in data-driven marketing: the recurring frustration that attribution optimises for *reach* when what actually matters is *value*. It's an attempt to measure the thing that counts — and the same instinct (find where the real signal is, build the thing that measures it) runs through most of what I build.

---

*One of a number of things I've built — mostly AI-powered tools, data systems, and small apps that solve a real problem. Built solo, shipped live.*
