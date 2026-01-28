import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TableRow as ApiTableRow } from "@/lib/api";

export type Grade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';

export function calculateInvestmentGrade(row: ApiTableRow): Grade {
  const visitors = row.unique_visitors;
  if (visitors === 0) return 'F';
  
  const botRate = (row.bot_visitors ?? 0) / visitors;
  const engagementRate = (row.stayed_30s ?? 0) / visitors;
  const walletRate = (row.wallet_users ?? 0) / visitors;
  
  let score = 0;
  
  // Bot penalty (30 points max) - lower bot rate is better
  if (botRate < 0.05) score += 30;
  else if (botRate < 0.15) score += 20;
  else if (botRate < 0.30) score += 10;
  // >30% bots = 0 points
  
  // Engagement score (30 points max) - higher engagement is better
  if (engagementRate > 0.50) score += 30;
  else if (engagementRate > 0.30) score += 20;
  else if (engagementRate > 0.15) score += 10;
  // <15% engagement = 0 points
  
  // Wallet score (40 points max - most valuable)
  if (walletRate > 0.10) score += 40;
  else if (walletRate > 0.05) score += 30;
  else if (walletRate > 0.02) score += 20;
  else if (walletRate > 0) score += 10;
  // No wallets = 0 points
  
  if (score >= 90) return 'A+';
  if (score >= 75) return 'A';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C';
  if (score >= 20) return 'D';
  return 'F';
}

const gradeStyles: Record<Grade, string> = {
  'A+': 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
  'A': 'bg-emerald-500/15 text-emerald-400 border-emerald-400/30',
  'B': 'bg-blue-500/15 text-blue-400 border-blue-400/30',
  'C': 'bg-amber-500/15 text-amber-400 border-amber-400/30',
  'D': 'bg-orange-500/15 text-orange-400 border-orange-400/30',
  'F': 'bg-destructive/15 text-destructive border-destructive/30',
};

interface InvestmentGradeBadgeProps {
  grade: Grade;
  className?: string;
}

export function InvestmentGradeBadge({ grade, className }: InvestmentGradeBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "text-[10px] font-bold px-1.5 py-0 h-4 border",
        gradeStyles[grade],
        className
      )}
    >
      {grade}
    </Badge>
  );
}
