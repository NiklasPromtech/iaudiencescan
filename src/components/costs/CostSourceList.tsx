import { CostSource } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface CostSourceListProps {
  costSources: CostSource[];
  loading: boolean;
  onEdit: (costSource: CostSource) => void;
  onDelete: (costSource: CostSource) => void;
}

const DIMENSION_LABELS: Record<string, string> = {
  utm_source: "UTM Source",
  utm_medium: "UTM Medium",
  utm_campaign: "UTM Campaign",
  utm_content: "UTM Content",
  utm_term: "UTM Term",
  referrer_domain: "Referrer",
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function CostSourceList({
  costSources,
  loading,
  onEdit,
  onDelete,
}: CostSourceListProps) {
  if (loading) {
    return (
      <Card className="border border-border">
        <div className="p-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (costSources.length === 0) {
    return null;
  }

  return (
    <Card className="border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Dimension</TableHead>
            <TableHead>Date Range</TableHead>
            <TableHead className="text-right">Total Cost</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {costSources.map((source) => (
            <TableRow key={source.id}>
              <TableCell className="font-medium">{source.name}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {DIMENSION_LABELS[source.dimension] || source.dimension}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(source.date_from), "MMM d")} -{" "}
                {format(new Date(source.date_to), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(source.total_cost)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(source)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(source)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
