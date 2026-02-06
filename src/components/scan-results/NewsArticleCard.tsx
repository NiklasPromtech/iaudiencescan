import { ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AggregatedNewsArticle } from "@/lib/export-utils";

interface NewsArticleCardProps {
  article: AggregatedNewsArticle;
}

export const NewsArticleCard = ({ article }: NewsArticleCardProps) => {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors group"
    >
      <div className="flex gap-4">
        {/* Token Logo */}
        <div className="shrink-0">
          {article.token_logo_url ? (
            <img
              src={article.token_logo_url}
              alt={article.token_symbol}
              className="h-10 w-10 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-medium text-muted-foreground">
                {article.token_symbol?.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-sm font-medium text-muted-foreground">
              {article.token_name}
            </span>
            <span className="text-xs text-muted-foreground shrink-0">
              {formatDistanceToNow(new Date(article.published_at), {
                addSuffix: true,
              })}
            </span>
          </div>

          <h4 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h4>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Source: {article.source_domain}</span>
            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {article.description && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {article.description}
            </p>
          )}
        </div>

        {/* Article Image */}
        {article.image_url && (
          <div className="hidden sm:block shrink-0">
            <img
              src={article.image_url}
              alt=""
              className="h-20 w-28 object-cover rounded-md"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </div>
    </a>
  );
};
