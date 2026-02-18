import { Scan, ScanResultsResponse, ScanResultsTopToken, SUPPORTED_CHAINS } from "./api";

function getChainLabel(chain: string): string {
  return SUPPORTED_CHAINS.find((c) => c.value === chain)?.label || chain;
}

function formatMarketCap(value?: number | null): string {
  if (!value) return "—";
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getPlatformTokens(tokens: ScanResultsTopToken[], platform: "twitter" | "telegram" | "discord" | "reddit") {
  return tokens
    .filter((t) => t[platform])
    .map((t) => ({
      name: t.token_name,
      symbol: t.token_symbol,
      handle: t[platform]!,
      marketCap: t.market_cap_usd,
      wallets: t.unique_wallets,
    }))
    .sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0));
}

function buildTableRows(items: { name: string; symbol: string; handle: string; marketCap?: number | null; wallets: number }[]): string {
  return items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;font-weight:500;">${item.name} <span style="color:#888;font-weight:400;">(${item.symbol})</span></td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;font-family:monospace;font-size:13px;">${item.handle}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;text-align:right;font-family:monospace;font-size:13px;">${formatMarketCap(item.marketCap)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;text-align:right;font-family:monospace;font-size:13px;">${item.wallets}</td>
      </tr>`
    )
    .join("");
}

function buildPlatformSection(title: string, icon: string, items: ReturnType<typeof getPlatformTokens>): string {
  if (items.length === 0) return "";
  return `
    <div style="page-break-inside:avoid;margin-bottom:32px;">
      <h3 style="font-size:16px;font-weight:600;margin:0 0 12px 0;display:flex;align-items:center;gap:8px;">
        <span style="font-size:20px;">${icon}</span> ${title}
        <span style="font-size:12px;color:#888;font-weight:400;margin-left:4px;">${items.length} found</span>
      </h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="background:#fafafa;">
            <th style="padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#888;border-bottom:2px solid #F97316;">Token</th>
            <th style="padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#888;border-bottom:2px solid #F97316;">Handle</th>
            <th style="padding:8px 12px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#888;border-bottom:2px solid #F97316;">Market Cap</th>
            <th style="padding:8px 12px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#888;border-bottom:2px solid #F97316;">Wallets</th>
          </tr>
        </thead>
        <tbody>${buildTableRows(items)}</tbody>
      </table>
    </div>`;
}

function buildNewsSection(tokens: ScanResultsTopToken[]): string {
  const articles = tokens
    .flatMap((t) => (t.news_articles || []).map((a) => ({ ...a, tokenName: t.token_name })))
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, 30);

  if (articles.length === 0) return "";

  const rows = articles
    .map(
      (a) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;font-weight:500;max-width:350px;">
          <a href="${a.url}" style="color:#111;text-decoration:none;">${a.title}</a>
        </td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;color:#888;font-size:13px;">${a.source_name || a.source_domain}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;color:#888;font-size:13px;white-space:nowrap;">${formatDate(a.published_at)}</td>
      </tr>`
    )
    .join("");

  return `
    <div style="page-break-before:always;margin-bottom:32px;">
      <h2 style="font-size:20px;font-weight:700;margin:0 0 16px 0;padding-bottom:8px;border-bottom:3px solid #F97316;">📰 News Coverage</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="background:#fafafa;">
            <th style="padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#888;border-bottom:2px solid #F97316;">Title</th>
            <th style="padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#888;border-bottom:2px solid #F97316;">Source</th>
            <th style="padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#888;border-bottom:2px solid #F97316;">Date</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function buildWebsitesSection(tokens: ScanResultsTopToken[]): string {
  const websites = tokens
    .filter((t) => t.website)
    .map((t) => ({ name: t.token_name, symbol: t.token_symbol, url: t.website! }))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (websites.length === 0) return "";

  const rows = websites
    .map(
      (w) => `
      <tr>
        <td style="padding:6px 12px;border-bottom:1px solid #e5e5e5;font-weight:500;">${w.name} <span style="color:#888;font-weight:400;">(${w.symbol})</span></td>
        <td style="padding:6px 12px;border-bottom:1px solid #e5e5e5;font-family:monospace;font-size:13px;">
          <a href="${w.url}" style="color:#F97316;text-decoration:none;">${w.url}</a>
        </td>
      </tr>`
    )
    .join("");

  return `
    <div style="page-break-inside:avoid;margin-bottom:32px;">
      <h2 style="font-size:20px;font-weight:700;margin:0 0 16px 0;padding-bottom:8px;border-bottom:3px solid #F97316;">🌐 Project Websites</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="background:#fafafa;">
            <th style="padding:6px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#888;border-bottom:2px solid #F97316;">Token</th>
            <th style="padding:6px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#888;border-bottom:2px solid #F97316;">Website</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

export function generateReport(scan: Scan, results: ScanResultsResponse): string {
  const scanName = scan.name || `Scan ${scan.id.slice(0, 8)}`;
  const chainLabel = getChainLabel(scan.chain);
  const completedDate = scan.completed_at ? formatDate(scan.completed_at) : "In progress";
  const tokens = results.top_tokens;

  const tokensWithSocials = tokens.filter(
    (t) => t.twitter || t.telegram || t.discord || t.reddit
  ).length;

  const twitterTokens = getPlatformTokens(tokens, "twitter");
  const telegramTokens = getPlatformTokens(tokens, "telegram");
  const redditTokens = getPlatformTokens(tokens, "reddit");
  const discordTokens = getPlatformTokens(tokens, "discord");

  // Use the hosted logo URL from the live site
  const logoUrl = "https://iaudiencescan.lovable.app/lovable-uploads/16e32559-c9cc-4d02-95ce-484236936478.png";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${scanName} — AudienceScan Report</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; color:#111; background:#fff; padding:40px; max-width:1100px; margin:0 auto; line-height:1.5; }
    @media print {
      body { padding:20px; }
      .no-print { display:none !important; }
      table { page-break-inside:auto; }
      tr { page-break-inside:avoid; }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div style="display:flex;align-items:center;justify-content:space-between;padding-bottom:24px;border-bottom:3px solid #F97316;margin-bottom:32px;">
    <div style="display:flex;align-items:center;gap:12px;">
      <img src="${logoUrl}" alt="AudienceScan" style="height:36px;width:36px;border-radius:8px;" />
      <span style="font-size:22px;font-weight:700;letter-spacing:-0.02em;">AudienceScan</span>
    </div>
    <div style="text-align:right;font-size:13px;color:#888;">
      <div>Report generated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
    </div>
  </div>

  <!-- Scan Title -->
  <div style="margin-bottom:32px;">
    <h1 style="font-size:28px;font-weight:800;margin-bottom:6px;letter-spacing:-0.02em;">${scanName}</h1>
    <p style="font-size:14px;color:#888;">${chainLabel} • ${scan.wallet_count} wallets analyzed • ${completedDate}</p>
  </div>

  <!-- Stats -->
  <div style="display:flex;gap:0;margin-bottom:40px;border:1px solid #e5e5e5;">
    <div style="flex:1;padding:20px;text-align:center;border-right:1px solid #e5e5e5;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#888;margin-bottom:4px;">Wallets</div>
      <div style="font-size:28px;font-weight:800;font-family:monospace;">${results.wallets_processed}</div>
    </div>
    <div style="flex:1;padding:20px;text-align:center;border-right:1px solid #e5e5e5;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#888;margin-bottom:4px;">Tokens Found</div>
      <div style="font-size:28px;font-weight:800;font-family:monospace;">${results.tokens_found}</div>
    </div>
    <div style="flex:1;padding:20px;text-align:center;border-right:1px solid #e5e5e5;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#888;margin-bottom:4px;">Enriched</div>
      <div style="font-size:28px;font-weight:800;font-family:monospace;">${results.tokens_enriched}</div>
    </div>
    <div style="flex:1;padding:20px;text-align:center;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#888;margin-bottom:4px;">Social Signals</div>
      <div style="font-size:28px;font-weight:800;font-family:monospace;">${tokensWithSocials}</div>
    </div>
  </div>

  <!-- Communities -->
  <h2 style="font-size:20px;font-weight:700;margin:0 0 20px 0;padding-bottom:8px;border-bottom:3px solid #F97316;">👥 Communities</h2>
  ${buildPlatformSection("X / Twitter", "𝕏", twitterTokens)}
  ${buildPlatformSection("Telegram", "✈️", telegramTokens)}
  ${buildPlatformSection("Reddit", "🔴", redditTokens)}
  ${buildPlatformSection("Discord", "💬", discordTokens)}

  <!-- News -->
  ${buildNewsSection(tokens)}

  <!-- Websites -->
  ${buildWebsitesSection(tokens)}

  <!-- Footer -->
  <div style="margin-top:48px;padding-top:20px;border-top:2px solid #F97316;display:flex;align-items:center;justify-content:space-between;">
    <div style="display:flex;align-items:center;gap:8px;">
      <img src="${logoUrl}" alt="" style="height:20px;width:20px;border-radius:4px;" />
      <span style="font-size:12px;color:#888;">Generated by AudienceScan</span>
    </div>
    <span style="font-size:12px;color:#888;">audiencescan.com</span>
  </div>
</body>
</html>`;
}

export function openReport(scan: Scan, results: ScanResultsResponse): void {
  const html = generateReport(scan, results);
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  // Small delay to let images load before print dialog
  setTimeout(() => win.print(), 600);
}
