import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, ArrowRight } from "lucide-react";

const Audiences = () => {
  return (
    <DashboardLayout>
      <div className="container max-w-5xl py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h2 text-foreground mb-2">Audiences</h1>
          <p className="text-p1 text-muted-foreground">
            Create and manage audience segments based on visitor behavior.
          </p>
        </div>

        {/* Empty State */}
        <Card className="p-12 border border-dashed border-border text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-h3 text-foreground mb-2">No audiences yet</h3>
          <p className="text-p2 text-muted-foreground mb-6 max-w-md mx-auto">
            Create audience segments from your visitors based on engagement, wallet activity, conversions, and more.
          </p>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create your first audience
          </Button>
        </Card>

        {/* Coming Soon Features */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Card className="p-4 border border-border bg-muted/20">
            <h4 className="text-p2 font-medium text-foreground mb-1">Behavioral segments</h4>
            <p className="text-p4 text-muted-foreground">
              Filter by time on site, page views, bounce rate
            </p>
          </Card>
          <Card className="p-4 border border-border bg-muted/20">
            <h4 className="text-p2 font-medium text-foreground mb-1">Wallet segments</h4>
            <p className="text-p4 text-muted-foreground">
              Target by wallet activity, token holdings, transaction history
            </p>
          </Card>
          <Card className="p-4 border border-border bg-muted/20">
            <h4 className="text-p2 font-medium text-foreground mb-1">Conversion segments</h4>
            <p className="text-p4 text-muted-foreground">
              Build lookalikes from your best converting visitors
            </p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Audiences;
