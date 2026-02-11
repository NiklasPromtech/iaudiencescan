import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BarChart3, Target } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                  <BarChart3 className="w-10 h-10 text-primary-foreground" />
                </div>
              </div>
              
              <h2 className="text-h2 font-bold mb-6 flex items-center justify-center gap-3">
Discover the communities that matter most.
              </h2>
              
              <p className="text-p1 text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
                Stop guessing which communities to target. Use real on-chain behavior to find where your next users are—and reach them with precision.
              </p>
              
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 text-lg">
                <Link to="/blog/guaranteed-results">Start Your Guaranteed Test</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;