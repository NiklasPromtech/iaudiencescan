import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-h2 font-bold mb-6">
            How It Works (3 Steps)
          </h2>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm w-full">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="text-tag font-semibold mb-2">Scan Any Token</h3>
                  <p className="text-p3 text-muted-foreground">Analyze real wallet transactions, not interests or keywords</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm w-full">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="text-tag font-semibold mb-2">Find Audience Overlap</h3>
                  <p className="text-p3 text-muted-foreground">Discover communities that actually buy and trade similar tokens</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm w-full">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="text-tag font-semibold mb-2">Target With Precision</h3>
                  <p className="text-p3 text-muted-foreground">Use ready-made audiences to run high-performance ad campaigns</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;