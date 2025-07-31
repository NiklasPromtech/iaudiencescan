import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Target } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                  <BarChart3 className="w-10 h-10 text-primary-foreground" />
                </div>
              </div>
              
              <h2 className="text-h2 font-bold mb-6 flex items-center justify-center gap-3">
                <span>📊</span> Turn blockchain data into your unfair advantage.
              </h2>
              
              <p className="text-p1 text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
                Stop wasting budget on broad "crypto enthusiast" targeting. Reach real wallets, with guaranteed results or your money back.
              </p>
              
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 text-lg">
                Start Your Guaranteed Test
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;