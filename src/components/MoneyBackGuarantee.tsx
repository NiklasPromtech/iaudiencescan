import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, CheckCircle } from "lucide-react";

const MoneyBackGuarantee = () => {
  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                  <Shield className="w-10 h-10 text-primary-foreground" />
                </div>
              </div>
              
              <h2 className="text-h2 font-bold mb-6">
                Money-Back Guarantee (Risk-Free)
              </h2>
              
              <p className="text-p1 text-muted-foreground mb-6 leading-relaxed">
                We're confident because the data keeps proving itself.
              </p>
              
              <div className="bg-primary/10 rounded-xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <p className="text-p1 text-foreground leading-relaxed text-left">
                    If your AudienceScan campaign doesn't cut costs by at least 50% under fair test conditions, we'll refund your Pro subscription.
                  </p>
                </div>
              </div>
              
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold px-8 py-4">
                Learn About the Guarantee
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MoneyBackGuarantee;