import { Audience } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash2, Users, Search, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AudienceListProps {
  audiences: Audience[];
  loading: boolean;
  onView: (audience: Audience) => void;
  onEdit: (audience: Audience) => void;
  onDelete: (audience: Audience) => void;
}

export function AudienceList({
  audiences,
  loading,
  onView,
  onEdit,
  onDelete,
}: AudienceListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-9" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (audiences.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {audiences.map((audience) => (
        <Card
          key={audience.id}
          className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
          onClick={() => onView(audience)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{audience.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {audience.wallet_count} wallets · Created{" "}
                  {formatDistanceToNow(new Date(audience.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(audience);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(audience);
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
