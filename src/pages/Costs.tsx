import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Plus, Upload } from "lucide-react";

const Costs = () => {
  return (
    <DashboardLayout>
      <div className="container max-w-5xl py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h2 text-foreground mb-2">Cost Sources</h1>
          <p className="text-p1 text-muted-foreground">
            Add cost data to calculate ROI for your campaigns by UTM parameters.
          </p>
        </div>

        {/* Empty State */}
        <Card className="p-12 border border-dashed border-border text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-h3 text-foreground mb-2">No cost sources yet</h3>
          <p className="text-p2 text-muted-foreground mb-6 max-w-md mx-auto">
            Upload or enter cost data to see ROI metrics alongside your traffic data. Match costs to UTM campaigns.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload CSV
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add manually
            </Button>
          </div>
        </Card>

        {/* How it works */}
        <Card className="mt-8 p-6 border border-border">
          <h3 className="text-h3 text-foreground mb-4">How cost attribution works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-h2 text-primary mb-2">1</div>
              <h4 className="text-p2 font-medium text-foreground mb-1">Add cost data</h4>
              <p className="text-p4 text-muted-foreground">
                Upload a CSV or manually enter costs with UTM parameters
              </p>
            </div>
            <div>
              <div className="text-h2 text-primary mb-2">2</div>
              <h4 className="text-p2 font-medium text-foreground mb-1">Match to traffic</h4>
              <p className="text-p4 text-muted-foreground">
                We automatically match costs to visitors by utm_source, utm_medium, utm_campaign
              </p>
            </div>
            <div>
              <div className="text-h2 text-primary mb-2">3</div>
              <h4 className="text-p2 font-medium text-foreground mb-1">See ROI</h4>
              <p className="text-p4 text-muted-foreground">
                View cost per visitor, cost per conversion, and ROAS in your overview
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Costs;
