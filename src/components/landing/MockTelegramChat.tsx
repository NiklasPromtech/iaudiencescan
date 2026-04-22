interface Props {
  compact?: boolean;
}

const messages = [
  { from: "user", text: "/ask wallets connected today" },
  { from: "bot", text: "📊 Today: 47 wallets connected\nMedian balance: $2,400\n+18% vs yesterday" },
  { from: "user", text: "/ask top source this week" },
  { from: "bot", text: "🏆 twitter_ads — 312 wallets\n2nd: organic — 245\n3rd: telegram — 198" },
];

export const MockTelegramChat = ({ compact = false }: Props) => {
  const visible = compact ? messages.slice(0, 2) : messages;

  return (
    <div className="border border-border bg-card overflow-hidden">
      {/* Telegram header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-foreground/[0.03] border-b border-border">
        <div className="w-6 h-6 bg-primary flex items-center justify-center font-mono text-[10px] font-bold text-primary-foreground">
          AS
        </div>
        <div>
          <p className="text-xs font-medium text-foreground leading-tight">AudienceScan Bot</p>
          <p className="font-mono text-[9px] text-muted-foreground">online</p>
        </div>
      </div>

      {/* Chat */}
      <div className="p-3 space-y-2 bg-background min-h-[180px]">
        {visible.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-2.5 py-1.5 text-xs whitespace-pre-line ${
                m.from === "user"
                  ? "bg-primary text-primary-foreground font-mono"
                  : "bg-muted text-foreground"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
