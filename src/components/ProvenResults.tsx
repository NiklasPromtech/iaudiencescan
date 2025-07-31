import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Lightbulb } from "lucide-react";

const ProvenResults = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-h2 font-bold mb-6">
            Proven Results (Case Studies)
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Testimonial */}
          <Card className="border-2 border-primary/20 bg-gradient-subtle mb-8">
            <CardContent className="p-12 text-center">
              <Quote className="w-12 h-12 text-primary mx-auto mb-6" />
              <blockquote className="text-p1 text-foreground leading-relaxed mb-6">
                "Every single test campaign we've run with AudienceScan delivered 50%+ lower cost-per-engagement compared to guessing or letting ad platforms auto-optimize."
              </blockquote>
            </CardContent>
          </Card>
          
          {/* Cost Savings Highlight */}
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Lightbulb className="w-8 h-8 text-primary" />
                <span className="text-h3 font-semibold text-foreground">Pro Tip</span>
              </div>
              <p className="text-p1 text-foreground mb-6">
                If you spend $400/month or more on ads, AudienceScan pays for itself in saved costs.
              </p>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                See Case Studies
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProvenResults;