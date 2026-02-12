import { Badge } from "@/components/ui/badge";
import { Twitter, MessageCircle, Globe, Newspaper, Megaphone } from "lucide-react";

interface SummaryBadgesProps {
  counts: {
    twitter: number;
    telegram: number;
    reddit: number;
    discord: number;
    websites: number;
    news: number;
    prOutlets?: number;
  };
  onBadgeClick?: (type: string) => void;
}

export const SummaryBadges = ({ counts, onBadgeClick }: SummaryBadgesProps) => {
  const badges = [
    {
      key: "twitter",
      label: "X handles",
      count: counts.twitter,
      icon: <Twitter className="h-3 w-3" />,
      color: "bg-sky-500/10 text-sky-600 hover:bg-sky-500/20",
    },
    {
      key: "telegram",
      label: "Telegram",
      count: counts.telegram,
      icon: <MessageCircle className="h-3 w-3" />,
      color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
    },
    {
      key: "reddit",
      label: "Reddit",
      count: counts.reddit,
      icon: <Globe className="h-3 w-3" />,
      color: "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20",
    },
    {
      key: "discord",
      label: "Discord",
      count: counts.discord,
      icon: <MessageCircle className="h-3 w-3" />,
      color: "bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20",
    },
    {
      key: "news",
      label: "News Articles",
      count: counts.news,
      icon: <Newspaper className="h-3 w-3" />,
      color: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20",
    },
    {
      key: "prOutlets",
      label: "PR Outlets",
      count: counts.prOutlets || 0,
      icon: <Megaphone className="h-3 w-3" />,
      color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20",
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {badges
        .filter((b) => b.count > 0)
        .map((badge) => (
          <Badge
            key={badge.key}
            variant="secondary"
            className={`gap-1.5 cursor-pointer transition-colors ${badge.color}`}
            onClick={() => onBadgeClick?.(badge.key)}
          >
            {badge.icon}
            <span className="font-mono tabular-nums">{badge.count}</span> {badge.label}
          </Badge>
        ))}
    </div>
  );
};
