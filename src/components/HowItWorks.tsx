import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What Is AudienceScan?
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            AudienceScan helps Web3 teams understand and activate their holders. We analyze on-chain wallet data to uncover where your community overlaps, what tokens they hold, and how to use those insights in your go-to-market.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 items-center">
            {/* Step 1 */}
            <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Enter Token Address</h3>
                <p className="text-sm text-muted-foreground">Paste any contract address</p>
              </CardContent>
            </Card>
            
            <div className="hidden md:flex justify-center">
              <ArrowRight className="w-8 h-8 text-primary" />
            </div>
            
            {/* Step 2 */}
            <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">AI Analysis</h3>
                <p className="text-sm text-muted-foreground">We scan wallet behaviors</p>
              </CardContent>
            </Card>
            
            <div className="hidden md:flex justify-center">
              <ArrowRight className="w-8 h-8 text-primary" />
            </div>
            
            {/* Step 3 */}
            <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Get Insights</h3>
                <p className="text-sm text-muted-foreground">Actionable marketing data</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-16">
            <div className="bg-accent/50 backdrop-blur-sm rounded-2xl p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4 text-accent-foreground">
                Why It Matters
              </h3>
              <p className="text-lg text-accent-foreground/80 leading-relaxed">
                In Web2, you buy lookalike audiences. In Web3, your wallet data <em>is</em> the audience. 
                AudienceScan helps token teams go from blockchain noise to actionable signal.
              </p>
              <p className="text-sm text-accent-foreground/60 mt-4">
                We've helped projects on Base, Arbitrum, and Solana understand their true user base.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;